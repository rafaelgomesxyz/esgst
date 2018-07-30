_MODULES.push({
    description: `
      <ul>
        <li>Adds an icon (<i class="fa fa-star"></i> if the giveaway is open, <i class="fa fa-star esgst-green"></i> if it is open and new, <i class="fa fa-star esgst-yellow"></i> if it is not open yet and <i class="fa fa-star esgst-red"></i> if it has already ended) next to a comment's "Permalink" (in any page) for each encrypted giveaway that the comment has (if it has any). The icon links to the giveaway.</li>
        <li>Encrypted giveaways are basically invite only giveaway codes that ESGST encrypts using various encryption methods and hides in your comments so that they can only be visible through the source code of the page. Other ESGST users are able to easily see these giveaways if they have this feature enabled, but since the codes are visible through the source code of the page, anyone who finds them and manages to decrypt them can access the giveaways. So it is more like a puzzle that ESGST users can solve instantly and non-ESGST users can solve if they give it some effort, though it is doubtful that someone will check the source code of every page they open on SteamGifts looking for the codes.</li>
        <li>To add encrypted giveaways to your comments, check [id=cfh_g].</li>
        <li>Adds a button (<i class="fa fa-star"></i>) next to the ESGST button at the header of any page that allows you to view all of the currently open decrypted giveaways that you have unlocked (they are unlocked whenever you visit a page that contains them).</li>
      </ul>
    `,
    features: {
      ged_b: {
        description: `
          <ul>
            <li>With this option enabled, the header button will always appear if there are decrypted giveaways in the page, even if they have already ended (but they will not be listed in the popup).</li>
          </ul>
        `,
        name: `Always show the header button if there are decrypted giveaways in the page.`,
        sg: true
      },
      ged_t: {
        name: `Open the list of decrypted giveaways in a new tab.`,
        sg: true
      }
    },
    id: `ged`,
    load: ged,
    name: `Giveaway Encrypter/Decrypter`,
    sg: true,
    type: `giveaways`
  });

  function ged() {
    if (!esgst.sg) return;
    let ged = {
      newGiveaways: []
    };
    if (esgst.gedPath) {
      ged_openPopup(ged);
    } else {
      ged.button = createElements(esgst.headerNavigationLeft, `beforeEnd`, [{
        attributes: {
          class: `nav__button-container esgst-hidden`,
          title: getFeatureTooltip(`ged`, `View your decrypted giveaways`)
        },
        type: `div`,
        children: [{
          attributes: {
            class: `nav__button`
          },
          type: `div`,
          children: [{
            attributes: {
              class: `fa fa-star`
            },
            type: `i`
          }]
        }]
      }]);
      ged.button.addEventListener(`mousedown`, ged_openPopup.bind(null, ged));
      ged_getGiveaways(ged, true);
    }
    esgst.ged_addIcons = ged_addIcons.bind(null, ged);
  }

  async function ged_openPopup(ged, event) {
    if (event) {
      if (event.button === 2) return;
      event.preventDefault();
    }
    if (esgst.gedPath) {
      ged.container = ged.context = esgst.mainContext;
    } else if (esgst.ged_t || (event && event.button === 1)) {
      open(`/esgst/decrypted-giveaways`);
    } else {
      ged.popup = new Popup(`fa-star`, `Decrypted Giveaways`, true);
      ged.container = ged.popup.description;
      ged.context = ged.popup.scrollable;
      ged.popup.open();
    }
    createElements(ged.context, `inner`, [{
      attributes: {
        class: `fa fa-circle-o-notch fa-spin`
      },
      type: `i`
    }, {
      text: `Loading...`,
      type: `node`
    }]);
    await ged_getGiveaways(ged);
    ged.context.innerHTML = ``;
    if (esgst.gas || (esgst.gf && esgst.gf_m) || esgst.mm) {
      let heading = createElements(ged.context, `afterBegin`, [{
        attributes: {
          class: `page__heading`
        },
        type: `div`
      }]);
      if (esgst.gas) {
        gas(heading);
      }
      if (esgst.gf && esgst.gf_m) {
        heading.appendChild(filters_addContainer(`gf`, heading, `Ged`));
      }
      if (esgst.mm) {
        mm(heading);
      }
    }
    ged.results = createElements(ged.context, `beforeEnd`, [{
      attributes: {
        class: `esgst-text-left`
      },
      type: `div`
    }]);
    ged.set = new ButtonSet_v2({color1: `green`, color2: `grey`, icon1: `fa-plus`, icon2: `fa-circle-o-notch fa-spin`, title1: `Load More`, title2: `Loading more...`, callback1: ged_loadGiveaways.bind(null, ged)});
    ged.container.appendChild(ged.set.set);
    ged.set.trigger();
    if (esgst.es_ged) {
      ged.context.addEventListener(`scroll`, ged_checkEndless.bind(null, ged));
    }
  }

  async function ged_getGiveaways(ged, firstRun) {
    ged.giveaways = [];
    ged.i = 0;
    let currentGiveaways = {};
    let currentTime = Date.now();
    let deleteLock;
    if (!firstRun) {
      deleteLock = await createLock(`gedLock`, 300);
      esgst.decryptedGiveaways = JSON.parse(await getValue(`decryptedGiveaways`));
    }
    delete esgst.edited.decryptedGiveaways;
    for (let code in esgst.decryptedGiveaways) {
      if (esgst.decryptedGiveaways[code].html) {
        delete esgst.decryptedGiveaways[code].html;
        esgst.edited.decryptedGiveaways = true;
      }
      let isEnded = esgst.decryptedGiveaways[code].timestamp <= currentTime;
      let filtered = true;
      let giveaway = esgst.giveaways[code];
      if (giveaway) {
        let game = null;
        if (giveaway.gameType && giveaway.gameSteamId) {
          game = esgst.games[giveaway.gameType][giveaway.gameSteamId];
        }
        const name = esgst.gf_presetGed;
        if (name) {
          let i;
          for (i = esgst.gf_presets.length - 1; i > -1 && esgst.gf_presets[i].name !== name; i--);
          if (i > -1) {
            const preset = esgst.gf_presets[i];
            filtered = filters_filterItem(`gf`, gf_getFilters(true), giveaway, preset.rules);
          }
        }
        if (filtered && isEnded && !giveaway.started) {
          await ged_getGiveaway(code, currentGiveaways, true);
          isEnded = esgst.decryptedGiveaways[code].timestamp <= currentTime;
        }
      }
      if (filtered && !isEnded) {
        ged.giveaways.push({
          code: code,
          source: esgst.decryptedGiveaways[code].source,
          timestamp: esgst.decryptedGiveaways[code].timestamp
        });
      }
    }
    await lockAndSaveGiveaways(currentGiveaways, firstRun);
    if (esgst.edited.decryptedGiveaways && !firstRun) {
      await setValue(`decryptedGiveaways`, JSON.stringify(esgst.decryptedGiveaways));
    }
    if (deleteLock) {
      deleteLock();
    }
    ged.n = ged.giveaways.length;
    if (ged.n > 0) {
      if (ged.button) {
        ged.button.classList.remove(`esgst-hidden`);
      }
      ged.giveaways = sortArray(ged.giveaways, false, `timestamp`);
    }
  }

  async function ged_getGiveaway(code, currentGiveaways, isEnded, source) {
    let response = await request({method: `GET`, url: `/giveaway/${code}/`});
    let giveaway = (await giveaways_get(parseHtml(response.responseText), false, response.finalUrl, false, null, true))[0];
    if (giveaway) {
      currentGiveaways[code] = giveaway;
      if (giveaway.started && isEnded) {
        esgst.decryptedGiveaways[code].timestamp = giveaway.endTime;
        esgst.edited.decryptedGiveaways = true;
      }
    }
    if (source) {
      esgst.decryptedGiveaways[code] = {
        source: source,
        timestamp: (giveaway && giveaway.endTime) || 0
      };
      esgst.edited.decryptedGiveaways = true;
    }
    return giveaway;
  }

  async function ged_loadGiveaways(ged) {
    let i = 0;
    while ((i < 5 || (esgst.es_ged && ged.context.scrollHeight <= ged.context.offsetHeight) || ((ged.results.children.length - ((esgst.gfPopup && parseInt(esgst.gfPopup.filteredCount.textContent)) || 0)) % 5 !== 0)) && ged.i < ged.n) {
      i += 1;
      let giveaway = ged.giveaways[ged.i];
      ged.i += 1;
      let response = await request({method: `GET`, url: `/giveaway/${giveaway.code}/`});
      let builtGiveaway = buildGiveaway(parseHtml(response.responseText), response.finalUrl);
      if (!builtGiveaway || !builtGiveaway.started) {
        continue;
      }
      let context = createElements(ged.results, `beforeEnd`, builtGiveaway.html);
      if (giveaway.source) {
        createElements(context.getElementsByClassName(`giveaway__columns`)[0], `afterBegin`, [{
          attributes: {
            class: `esgst-ged-source`,
            href: `${giveaway.source.match(/\/discussion\//) ? giveaway.source : `/go/comment/${giveaway.source}`}`
          },
          text: `Source`,
          type: `a`
        }]);
      }
      await endless_load(context, false, `ged`);
      if (ged.newGiveaways.indexOf(giveaway.code) > -1) {
        context.getElementsByClassName(`giveaway__heading__name`)[0].insertAdjacentText(`afterBegin`, `[NEW] `);
      }
    }
    if (ged.i >= ged.n) {
      ged.set.set.remove();
    }
  }

  function ged_checkEndless(ged) {
    if ((ged.context.scrollTop + ged.context.offsetHeight) >= ged.context.scrollHeight && !ged.set.busy) {
      ged.set.trigger();
    }
  }

  async function ged_addIcons(ged, comments) {
    let currentGiveaways = {};
    let currentTime = Date.now();
    let deleteLock = null;
    let hasEnded = false;
    let hasNew = false;
    for (let i = comments.length - 1; i > -1; i--) {
      let comment = comments[i];
      let icons = comment.actions.getElementsByClassName(`esgst-ged-icon`);
      for (let j = icons.length - 1; j > -1; j--) {
        icons[0].remove();
      }
      if (!comment.displayState) continue;
      let links = comment.displayState.querySelectorAll(`[href^="ESGST-"]`);
      for (let j = links.length - 1; j > -1; j--) {
        let code = links[j].getAttribute(`href`).match(/ESGST-(.+)/)[1];
        if (code.match(/currentVersion/)) {
          continue;
        }
        if (!deleteLock) {
          deleteLock = await createLock(`gedLock`, 300);
          esgst.decryptedGiveaways = JSON.parse(await getValue(`decryptedGiveaways`));
        }
        code = ged_decryptCode(code);
        let isEnded = esgst.decryptedGiveaways[code] && currentTime > esgst.decryptedGiveaways[code].timestamp;
        let isNew = false;
        let isStarted = esgst.giveaways[code] && esgst.giveaways[code].started;
        if (!esgst.decryptedGiveaways[code] || (isEnded && !isStarted)) {
          let giveaway = await ged_getGiveaway(code, currentGiveaways, false, comment.id || location.href);
          ged.newGiveaways.push(code);
          if (giveaway) {
            isEnded = giveaway.ended;
            isStarted = giveaway.started;
          }
        }
        if (isEnded) {
          if (esgst.ged_b) {
            hasEnded = true;
          }
        } else {
          hasNew = isNew = true;
        }
        createElements(comment.actions, `beforeEnd`, [{
          attributes: {
            class: `esgst-ged-icon${isEnded ? ` esgst-red` : (isStarted ? (isNew ? ` esgst-green` : ``) : ` esgst-yellow`)}`,
            href: `/giveaway/${code}/`,
            title: getFeatureTooltip(`ged`, `ESGST Decrypted Giveaway`)
          },
          type: `a`,
          children: [{
            attributes: {
              class: `fa fa-star`
            },
            type: `i`
          }]
        }]);
      }
    }
    if (deleteLock) {
      await lockAndSaveGiveaways(currentGiveaways);
      deleteLock();
    }
    if (esgst.edited.decryptedGiveaways) {
      await setValue(`decryptedGiveaways`, JSON.stringify(esgst.decryptedGiveaways));
    }
    if (ged.button && (hasEnded || hasNew)) {
      ged.button.classList.remove(`esgst-hidden`);
      if (hasNew) {
        ged.button.firstElementChild.firstElementChild.classList.add(`esgst-positive`);
      }
    }
  }

  function ged_encryptCode(code) {
    let alphabet, encrypted, i, n, rotated, rotation;
    alphabet = `NOPQRSTUVWXYZABCDEFGHIJKLM`;
    switch (Math.floor(Math.random() * 4)) {
      case 0:
        rotated = rot(code, 13);
        encrypted = ``;
        for (i = 0, n = rotated.length; i < n; ++i) {
          encrypted += rotated.charCodeAt(i).toString(16);
        }
        return encrypted;
      case 1:
        rotated = rot(code, 13);
        encrypted = ``;
        for (i = 0, n = rotated.length; i < n; ++i) {
          encrypted += rotated.charCodeAt(i).toString(16);
        }
        encrypted = encrypted.replace(/\d/g, n => {
          return alphabet[parseInt(n)];
        });
        return encrypted;
      case 2:
        rotation = Math.ceil(Math.random() * 25);
        rotated = rot(code, rotation);
        encrypted = ``;
        for (i = 0, n = rotated.length; i < n; ++i) {
          encrypted += rotated.charCodeAt(i).toString(16);
        }
        encrypted += rotation.toString(16);
        return encrypted;
      case 3:
        rotation = Math.ceil(Math.random() * 25);
        rotated = rot(code, rotation);
        encrypted = ``;
        for (i = 0, n = rotated.length; i < n; ++i) {
          encrypted += rotated.charCodeAt(i).toString(16);
        }
        encrypted += rotation.toString(16);
        encrypted = encrypted.replace(/\d/g, n => {
          return alphabet[parseInt(n)];
        });
        return encrypted;
    }
  }

  function ged_decryptCode(encrypted) {
    let alphabet, code, rotation;
    alphabet = `NOPQRSTUVWXYZABCDEFGHIJKLM`;
    encrypted = encrypted.replace(/-/g, ``).replace(/[A-Z]/g, n => {
      return alphabet.indexOf(n);
    });
    rotation = encrypted.slice(10);
    if (rotation) {
      rotation = parseInt(rotation, 16);
    } else {
      rotation = 13;
    }
    code = ``;
    encrypted.slice(0, 10).match(/../g).forEach(n => {
      code += String.fromCharCode(parseInt(n, 16));
    });
    return rot(code, 26 - rotation);
  }

  async function ged_saveGiveaways(context, source) {
    let codes = [];
    let elements = context.querySelectorAll(`[href^="ESGST-"]`);
    for (let i = 0, n = elements.length; i < n; i++) {
      let encryptedCode = elements[i].getAttribute(`href`).match(/ESGST-(.+)/)[1];
      if (!encryptedCode.match(/currentVersion/)) {
        codes.push(ged_decryptCode(encryptedCode));
      }
    }
    if (!codes.length) {
      return;
    }
    let ged = {
      giveaways: {}
    };
    esgst.decryptedGiveaways = JSON.parse(await getValue(`decryptedGiveaways`));
    let promises = [];
    codes.forEach(code => {
      if (esgst.decryptedGiveaways[code]) {
        return;
      }
      let giveaway = esgst.giveaways[code];
      if (giveaway && giveaway.endTime) {
        esgst.decryptedGiveaways[code] = {
          source: source,
          timestamp: giveaway.endTime
        };
        return;
      }
      promises.push(ged_getGiveaway(code, ged.giveaways, false, source));
    });
    await Promise.all(promises);
    await setValue(`decryptedGiveaways`, JSON.stringify(esgst.decryptedGiveaways));
    await lockAndSaveGiveaways(ged.giveaways);
  }

