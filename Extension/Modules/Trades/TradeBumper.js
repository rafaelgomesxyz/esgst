_MODULES.push({
    description: `
      <ul>
        <li>Adds a button (<i class="fa fa-chevron-circle-up"></i>) to the main page heading of your <a href="https://www.steamtrades.com/trades/search?user=your-steam-id">created trades</a> page that allows you to bump all of your open trades at once.</li>
      </ul>
    `,
    features: {
      tb_a: {
        description: `
          <ul>
            <li>Automatically bumps all of your trades every hour.</li>
            <li>Requires either SteamGifts or SteamTrades to be open, depending on where you have this option enabled.</li>
          </ul>
        `,
        name: `Auto bump every hour.`,
        sg: true,
        st: true
      }
    },
    id: `tb`,
    load: tb,
    name: `Trade Bumper`,
    sg: true,
    st: true,
    type: `trades`
  });

  function tb() {
    if (location.href.match(new RegExp(`\\/trades\\/search\\?user=${esgst.steamId}`))) {
      let button = createHeadingButton({id: `tb`, icons: [`fa-chevron-circle-up`], title: `Bump trades`});
      button.addEventListener(`click`, tb_getTrades.bind(null, button, document));
      if (esgst.tb_a) {
        tb_setAutoBump(button);
      }
    } else if (esgst.tb_a) {
      tb_setAutoBump();
    }
  }

  function tb_getTrades(button, context, callback) {
    let elements, n;
    if (button) {
      createElements(button, `inner`, [{
        attributes: {
          class: `fa fa-circle-o-notch fa-spin`
        },
        type: `i`
      }]);
    }
    elements = context.querySelectorAll(`.row_inner_wrap:not(.is_faded)`);
    n = elements.length;
    if (n > 0) {
      tb_bumpTrades(button, elements, 0, n, callback);
    } else if (button) {
      createElements(button, `inner`, [{
        attributes: {
          class: `fa fa-chevron-circle-up`
        },
        type: `i`
      }]);
    }
  }

  async function tb_bumpTrades(button, elements, i, n, callback) {
    if (i < n) {
      await request({data: `xsrf_token=${esgst.xsrfToken}&do=trade_bump&code=${elements[i].querySelector(`[href*="/trade/"]`).getAttribute(`href`).match(/\/trade\/(.+?)\//)[1]}`, method: `POST`, url: `https://www.steamtrades.com/ajax.php`});
      tb_bumpTrades(button, elements, ++i, n, callback);
    } else {
      if (button) {
        createElements(button, `inner`, [{
          attributes: {
            class: `fa fa-chevron-circle-up`
          },
          type: `i`
        }]);
      }
      if (callback) {
        callback();
      } else {
        location.reload();
      }
    }
  }

  async function tb_setAutoBump(button) {
    let currentTime = Date.now();
    let dif = currentTime - (await getValue(`lastBump`, 0));
    if (dif > 3600000) {
      await setValue(`lastBump`, currentTime);
      tb_autoBumpTrades(button);
    } else {
      setTimeout(() => tb_setAutoBump(button), 3600000 - dif);
    }
  }

  async function tb_autoBumpTrades(button) {
    if (location.href.match(new RegExp(`\\/trades\\/search\\?user=${esgst.steamId}`))) {
      tb_getTrades(button, document);
    } else {
      tb_getTrades(null, parseHtml((await request({method: `GET`, queue: true, url: `https://www.steamtrades.com/trades/search?user=${esgst.steamId}`})).responseText), setTimeout.bind(null, tb_setAutoBump, 3900000, button));
    }
  }

