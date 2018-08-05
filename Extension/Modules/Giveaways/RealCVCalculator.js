_MODULES.push({
    decription: `
      <ul>
        <li>Adds a "Real CV" row containing how much real CV you should get for a giveaway to the table of the review giveaway page (the page where you can confirm the creation of a giveaway).</li>
      </ul>
    `,
    id: `rcvc`,
    load: rcvc,
    name: `Real CV Calculator`,
    sg: true,
    sync: `Giveaways, Reduced CV Games and No CV Games`,
    type: `giveaways`
  });

  async function rcvc() {
    if (esgst.newGiveawayPath) {
      let table = document.getElementsByClassName(`table--summary`)[0], button;
      if (table) {
        let game = await getValue(`rcvcGame`);
        if (game) {
          let type = game.type;
          let id = game.id;
          let i, n;
          let headings = document.getElementsByClassName(`featured__heading__small`);
          let copies = headings.length > 1 ? parseInt(headings[0].textContent.match(/\d+/)[0]) : 1;
          try {
            let responseJson = JSON.parse((await request({method: `GET`, url: `http://store.steampowered.com/api/${type === `apps` ? `appdetails?appids` : `packagedetails?packageids`}=${id}&cc=us&filters=price,price_overview`})).responseText)[id].data;
            let value = Math.ceil((responseJson.price_overview || responseJson.price).initial / 100);
            let games, user;
            games = JSON.parse(await getValue(`games`));
            if (games[type][id]) {
              if (games[type][id].noCV) {
                value = 0;
              } else if (games[type][id].reducedCV) {
                value *= 0.15;
              }
            }
            user = {
              Username: esgst.username,
              SteamID64: esgst.steamId
            };
            let users = JSON.parse(await getValue(`users`));
            let savedUser = users.users[user.SteamID64];
            let sent = 0;
            let currentDate = Date.now();
            if (savedUser && savedUser.giveaways && savedUser.giveaways.sent && savedUser.giveaways.sent[type][id]) {
              let giveaways = savedUser.giveaways.sent[type][id];
              for (i = 0, n = giveaways.length; i < n; ++i) {
                let giveaway = esgst.giveaways[giveaways[i]];
                if (giveaway) {
                  if (giveaway.entries >= 5 || (!giveaway.inviteOnly && !giveaway.group && !giveaway.whitelist)) {
                    if (Array.isArray(giveaway.winners)) {
                      if (giveaway.winners.length > 0) {
                        giveaway.winners.forEach(winner => {
                          if (winner.status === `Received`) {
                            sent += 1;
                          }
                        });
                      } else if (currentDate < giveaway.endTime) {
                        sent += giveaway.copies;
                      }
                    } else if (giveaway.winners > 0) {
                      sent += Math.min(giveaway.entries, giveaway.winners);
                    }
                  } else if (currentDate < giveaway.endTime) {
                    sent += giveaway.copies;
                  }
                }
              }
              if (sent > 5) {
                for (i = 0, n = sent - 5; i < n; ++i) {
                  value *= 0.90;
                }
              }
            }
            let cv;
            if (copies > 1) {
              let total = copies + sent;
              if (total > 5) {
                n = total - 5;
                cv = (copies - n) * value;
                for (i = 0; i < n; ++i) {
                  value *= 0.90;
                  cv += value;
                }
              } else {
                cv = value * copies;
              }
            } else if ((sent + 1) > 5) {
              cv = value * 0.90;
            } else {
              cv = value;
            }
            cv = Math.round(cv * 100) / 100;
            createElements(table, `beforeEnd`, [{
              attributes: {
                class: `table__row-outer-wrap`
              },
              type: `div`,
              children: [{
                attributes: {
                  class: `table__row-inner-wrap`
                },
                type: `div`,
                children: [{
                  attributes: {
                    class: `table__column--width-medium table__column--align-top`
                  },
                  type: `div`,
                  children: [{
                    attributes: {
                      class: `esgst-bold`
                    },
                    text: `Real CV`,
                    type: `span`
                  }]
                }, {
                  attributes: {
                    class: `table__column--width-fill`
                  },
                  text: `You should get ~$${cv} real CV for this giveaway.`,
                  type: `div`
                }]
              }]
            }]);
          } catch (e) {
            console.log(e);
          }
          button = document.getElementsByClassName(`js__submit-form`)[0];
          button.addEventListener(`click`, () => {
            delValue(`rcvcGame`);
          });
        }
      } else {
        button = document.getElementsByClassName(`js__submit-form`)[0];
        let input = document.querySelector(`[name="game_id"]`);
        button.addEventListener(`click`, () => {
          let selectedId = input.value;
          let selected = document.querySelector(`[data-autocomplete-id="${selectedId}"]`);
          let info = games_getInfo(selected);
          setValue(`rcvcGame`, {
            type: info.type,
            id: info.id
          });
        });
      }
    }
  }

