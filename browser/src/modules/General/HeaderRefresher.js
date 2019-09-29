import { Module } from '../../class/Module';
import { common } from '../Common';
import { browser } from '../../browser';
import { shared } from '../../class/Shared';
import { gSettings } from '../../class/Globals';
import { logger } from '../../class/Logger';
import { DOM } from '../class/DOM';

const
  createElements = common.createElements.bind(common),
  getLocalValue = common.getLocalValue.bind(common),
  request = common.request.bind(common),
  setLocalValue = common.setLocalValue.bind(common)
  ;

class GeneralHeaderRefresher extends Module {
  constructor() {
    super();
    this.info = {
      description: [
        ['ul', [
          ['li', `Refreshes the header icons (created/won/inbox for SteamGIFTS and inbox for SteamTrades) and the points on SteamGifts (in any page) every specified number of minutes.`],
          ['li', `There are also options to notify you when there are new wishlist giveaways open, when the key for a game you won is delivered, when you reach 400P and when you receive a new message.`],
          ['li', 'You can upload a custom sound for the browser notifications.'],
          ['li', `If you enable the options to show browser notifications, you will be asked to give the permission to ESGST by your browser.`]
        ]]
      ],
      features: {
        hr_w: {
          features: {
            hr_w_n: {
              features: {
                hr_w_n_s: {
                  name: 'Play a sound with this notification.',
                  inputItems: true,
                  sg: true
                }
              },
              name: 'Also show as a browser notification.',
              sg: true
            },
            hr_w_h: {
              name: 'Only indicate for giveaways ending in a specified number of hours.',
              inputItems: [
                {
                  id: 'hr_w_hours',
                  prefix: `Hours: `
                }
              ],
              sg: true
            }
          },
          inputItems: [
            {
              id: 'hr_w_format',
              prefix: `Format: `,
              tooltip: `Use # to represent a number. For example, '(#❤)' would show '(8❤)' if there are 8 unentered wishlist giveaways open.`
            }
          ],
          name: 'Indicate if there are unentered wishlist giveaways open in the tab\'s title.',
          sg: true
        },
        hr_g: {
          features: {
            hr_g_n: {
              features: {
                hr_g_n_s: {
                  name: 'Play a sound with this notification.',
                  inputItems: true,
                  sg: true
                }
              },
              name: 'Also show as a browser notification.',
              sg: true
            }
          },
          inputItems: [
            {
              id: 'hr_g_format',
              prefix: `Format: `
            }
          ],
          name: 'Indicate if there are unviewed keys for won gifts in the tab\'s title.',
          sg: true
        },
        hr_b: {
          name: 'Keep refreshing in the background when you go to another tab or minimize the browser.',
          sg: true,
          st: true
        },
        hr_c: {
          description: [
            ['ul', [
              ['li', `With this option disabled, notifications will automatically close after a few seconds.`]
            ]]
          ],
          name: 'Only close notifications manually.',
          sg: true,
          st: true
        },
        hr_fp: {
          features: {
            hr_fp_s: {
              name: 'Play a sound with this notification.',
              inputItems: true,
              sg: true
            }
          },
          name: 'Show a browser notification if there are 400P or more.',
          sg: true
        },
        hr_p: {
          inputItems: [
            {
              id: 'hr_p_format',
              prefix: `Format: `,
              tooltip: `Use # to represent a number. For example, '(#P)' would show '(100P)' if you have 100 points.`
            }
          ],
          name: 'Show the number of points in the tab\'s title.',
          sg: true
        },
        hr_m: {
          features: {
            hr_m_n: {
              features: {
                hr_m_n_s: {
                  name: 'Play a sound with this notification.',
                  inputItems: true,
                  sg: true,
                  st: true
                }
              },
              name: 'Also show as a browser notification.',
              sg: true,
              st: true
            }
          },
          name: 'Show the number of unread messages in the tab\'s icon.',
          sg: true,
          st: true
        },
        hr_a: {
          description: [
            ['ul', [
              ['li', `With this option disabled, clicking on a notification will always open a new tab.`]
            ]]
          ],
          features: {
            hr_a_r: {
              name: 'Refresh the page after setting it as active.',
              sg: true,
              st: true
            },
            hr_a_a: {
              name: `If the page is not open, set any SteamGifts/SteamTrades tab as active.`,
              sg: true,
              st: true
            }
          },
          extensionOnly: true,
          name: `When clicking on a browser notification, check if the related page is open and set it as active.`,
          sg: true,
          st: true
        }
      },
      inputItems: [
        {
          id: 'hr_minutes',
          prefix: 'Refresh every ',
          suffix: ' minutes'
        }
      ],
      id: 'hr',
      name: 'Header Refresher',
      sg: true,
      st: true,
      type: 'general'
    };
  }

  init() {
    let hr = {
      messages: 0,
      points: this.esgst.points,
      wins: 0
    };
    this.esgst.hr = hr;
    this.hr_notifyChange(hr);
    setLocalValue('hrCache', JSON.stringify(this.hr_getCache()));
    // noinspection JSIgnoredPromiseFromCall
    this.hr_startRefresher(hr);
    if (!gSettings.hr_b) {
      window.addEventListener('focus', this.hr_startRefresher.bind(this, hr));
      window.addEventListener('blur', () => window.clearTimeout(hr.refresher));
    }
  }

  hr_getDefaultSound() {
    // noinspection SpellCheckingInspection
    return '$1';
  }

  async hr_createPlayer(string) {
    let binary = window.atob(string);
    let buffer = new ArrayBuffer(binary.length);
    let bytes = new Uint8Array(buffer);
    for (let i = buffer.byteLength - 1; i > -1; i--) {
      bytes[i] = binary.charCodeAt(i) & 0xFF;
    }
    if (!this.esgst.audioContext) {
      try {
        this.esgst.audioContext = new AudioContext();
      } catch (e) {
        return null;
      }
    }
    return {
      play: this.hr_playSound.bind(this, await this.esgst.audioContext.decodeAudioData(buffer))
    }
  }

  hr_playSound(buffer) {
    let source = this.esgst.audioContext.createBufferSource();
    source.buffer = buffer;
    source.loop = false;
    source.connect(this.esgst.audioContext.destination);
    source.start(0);
  }

  hr_getCache() {
    let cache = {
      mainButton: this.esgst.mainButton.outerHTML,
      inboxButton: this.esgst.inboxButton.outerHTML,
      timestamp: Date.now(),
      username: gSettings.username
    };
    if (this.esgst.sg) {
      cache.createdButton = this.esgst.createdButton.outerHTML;
      cache.wonButton = this.esgst.wonButton.outerHTML;
      cache.wishlist = this.esgst.wishlist;
    }
    return cache;
  }

  async hr_startRefresher(hr) {
    await this.hr_refreshHeaderElements(DOM.parse((await request({
      method: 'GET',
      url: this.esgst.sg ? `/giveaways/search?type=wishlist` : '/'
    })).responseText));
    let cache = this.hr_getCache();
    setLocalValue('hrCache', JSON.stringify(cache));
    await this.hr_refreshHeader(cache, hr);
    hr.refresher = window.setTimeout(() => this.hr_continueRefresher(hr), gSettings.hr_minutes * 60000);
  }

  async hr_continueRefresher(hr) {
    let cache = JSON.parse(getLocalValue('hrCache'));
    if (cache.username !== gSettings.username || Date.now() - cache.timestamp > gSettings.hr_minutes * 60000) {
      cache.timestamp = Date.now();
      setLocalValue('hrCache', JSON.stringify(cache));
      await this.hr_refreshHeaderElements(DOM.parse((await request({
        method: 'GET',
        url: this.esgst.sg ? `/giveaways/search?type=wishlist` : '/'
      })).responseText));
      cache = this.hr_getCache();
      setLocalValue('hrCache', JSON.stringify(cache));
      await this.hr_refreshHeader(cache, hr, true);
      hr.refresher = window.setTimeout(() => this.hr_continueRefresher(hr), gSettings.hr_minutes * 60000);
    } else {
      this.esgst.wishlist = cache.wishlist;
      await this.hr_refreshHeader(cache, hr);
      window.setTimeout(() => this.hr_continueRefresher(hr), gSettings.hr_minutes * 60000);
    }
  }

  async hr_refreshHeader(cache, hr, notify) {
    await this.hr_refreshHeaderElements(document);
    createElements(this.esgst.mainButton, 'outer', [{
      context: DOM.parse(cache.mainButton).body.firstElementChild
    }]);
    if (this.esgst.sg) {
      createElements(this.esgst.createdButton, 'outer', [{
        context: DOM.parse(cache.createdButton).body.firstElementChild
      }]);
      createElements(this.esgst.wonButton, 'outer', [{
        context: DOM.parse(cache.wonButton).body.firstElementChild
      }]);
    }
    createElements(this.esgst.inboxButton, 'outer', [{
      context: DOM.parse(cache.inboxButton).body.firstElementChild
    }]);
    if (gSettings.nm) {
      // refresh notification merger
      // noinspection JSIgnoredPromiseFromCall
      this.esgst.modules.generalNotificationMerger.nm_getNotifications();
    }
    await this.hr_refreshHeaderElements(document);
    if (gSettings.qiv) {
      this.esgst.modules.generalQuickInboxView.qiv();
      if (this.esgst.qiv.popout && this.esgst.messageCount > 0 && gSettings.qiv_p) {
        this.esgst.qiv.nextPage = 1;
        this.esgst.modules.generalQuickInboxView.qiv_addMarkReadButton();
        // noinspection JSIgnoredPromiseFromCall
        this.esgst.modules.generalQuickInboxView.qiv_scroll(false, true);
      }
    }
    if (gSettings.hr) {
      this.hr_notifyChange(hr, notify);
    }
    if (gSettings.lpv) {
      await this.esgst.modules.generalLevelProgressVisualizer.lpv_setStyle();
    }
    if (gSettings.pv) {
      this.esgst.modules.generalPointsVisualizer.pv_setStyle();
    }
    this.esgst.modules.generalLevelProgressVisualizer.joinStyles();
  }

  async hr_refreshHeaderElements(context) {
    let navigation = context.querySelector(`.nav__right-container, .header_inner_wrap nav`);
    this.esgst.mainButton = navigation.querySelector(`.nav__button--is-dropdown, .nav_btn[href^="/user/"]`);
    if (this.esgst.sg) {
      this.esgst.pointsContainer = this.esgst.mainButton.firstElementChild;
      this.esgst.points = parseInt(this.esgst.pointsContainer.textContent.replace(/,/g, '').match(/\d+/)[0]);
      this.esgst.levelContainer = this.esgst.mainButton.lastElementChild;
      await this.esgst.onLevelContainerUpdated();
      this.esgst.fullLevel = parseFloat(this.esgst.levelContainer.getAttribute('title').match(/\d+(\.\d*)?/)[0]);
      this.esgst.level = parseInt(this.esgst.fullLevel);
      this.esgst.createdButton = navigation.getElementsByClassName('fa-gift')[0];
      if (this.esgst.createdButton) {
        this.esgst.createdButton = this.esgst.createdButton.closest('.nav__button-container');
      }
      this.esgst.wonButton = navigation.getElementsByClassName('fa-trophy')[0];
      if (this.esgst.wonButton) {
        this.esgst.wonButton = this.esgst.wonButton.closest('.nav__button-container');
      }
      if (gSettings.hr_w && context !== document) {
        this.esgst.wishlist = 0;
        this.esgst.wishlistNew = 0;
        let cache = JSON.parse(getLocalValue('hrWishlistCache', '[]'));
        let codes = [];
        let currentTime = Date.now();
        let giveaways = await this.esgst.modules.giveaways.giveaways_get(context, false, null, true);
        for (let i = giveaways.length - 1; i > -1; i--) {
          let giveaway = giveaways[i];
          codes.push(giveaway.code);
          if (giveaway && giveaway.level <= this.esgst.level && !giveaway.pinned && !giveaway.entered && (!this.esgst.giveaways[giveaway.code] || (!this.esgst.giveaways[giveaway.code].visited && !this.esgst.giveaways[giveaway.code].hidden)) && (!gSettings.hr_w_h || giveaway.endTime - currentTime < gSettings.hr_w_hours * 3600000)) {
            this.esgst.wishlist += 1;
            if (cache.indexOf(giveaway.code) < 0) {
              cache.push(giveaway.code);
              this.esgst.wishlistNew += 1;
            }
          }
        }
        for (let i = cache.length - 1; i > -1; i--) {
          if (codes.indexOf(cache[i]) < 0) {
            cache.splice(i, 1);
          }
        }
        setLocalValue('hrWishlistCache', JSON.stringify(cache));
      }
    }
    this.esgst.inboxButton = navigation.getElementsByClassName('fa-envelope')[0];
    if (this.esgst.inboxButton) {
      this.esgst.inboxButton = this.esgst.inboxButton.closest(`.nav__button-container, .nav_btn_container`);
      this.esgst.messageCountContainer = this.esgst.inboxButton.querySelector(`.nav__notification, .message_count`);
    }
    this.esgst.messageCount = this.esgst.messageCountContainer ? this.esgst.messageCountContainer.textContent : '';
  }

  hr_notifyChange(hr, notify) {
    let canvas, context, deliveredNotification, image, messageNotification, messageCount, notification,
      pointsNotification, title;
    messageCount = this.esgst.messageCount;
    if (messageCount !== hr.messageCount) {
      messageNotification = messageCount - hr.messageCount;
      if (messageNotification < 0) {
        messageNotification = 0;
      }
      hr.messageCount = messageCount;
    } else {
      messageNotification = 0;
    }
    if (messageCount > 0 && gSettings.hr_m) {
      canvas = document.createElement('canvas');
      image = new Image();
      canvas.width = 16;
      canvas.height = 16;
      context = canvas.getContext('2d');
      image.crossOrigin = 'esgst';
      image.onload = () => {
        context.drawImage(image, 0, 0);
        context.fillStyle = '#e9202a';
        context.fillRect(8, 6, 8, 10);
        context.fillStyle = '#fff';
        context.font = 'bold 10px Arial';
        context.textAlign = 'left';
        if (messageCount > 9) {
          messageCount = '+';
        }
        context.fillText(messageCount, 9, 14);
        this.esgst.favicon.href = canvas.toDataURL('image/png');
      };
      image.src = this.esgst[`${this.esgst.name}Icon`];
    } else {
      this.esgst.favicon.href = this.esgst[`${this.esgst.name}Icon`];
    }
    if (this.esgst.sg) {
      if (hr.points !== this.esgst.points) {
        hr.points = this.esgst.points;
        this.esgst.modules.giveawaysEnterLeaveGiveawayButton.elgb_updateButtons();
        if (this.esgst.points >= 400) {
          pointsNotification = true;
        }
      }
      title = '';
      let delivered = this.esgst.wonButton.getElementsByClassName('fade_infinite')[0];
      if (delivered) {
        if (!hr.delivered) {
          deliveredNotification = true;
          hr.delivered = true;
        } else {
          deliveredNotification = false;
        }
      } else {
        hr.delivered = deliveredNotification = false;
      }
      if (gSettings.hr_g && delivered) {
        title += `${gSettings.hr_g_format} `;
      }
      if (gSettings.hr_w && this.esgst.wishlist) {
        title += `${gSettings.hr_w_format.replace(/#/, this.esgst.wishlist)} `;
      }
      if (gSettings.hr_p) {
        title += `${gSettings.hr_p_format.replace(/#/, this.esgst.points)} `;
      }
      title += this.esgst.originalTitle;
      if (document.title !== title) {
        document.title = title;
      }
    }
    logger.info(notify, this.esgst.wishlist, this.esgst.wishlistNew);
    if (notify) {
      notification = {
        msg: '',
        inbox: false,
        wishlist: false,
        won: false,
        points: false,
      };
      if (pointsNotification && gSettings.hr_fp) {
        notification.msg += `You have ${this.esgst.points}P.\n\n`;
        notification.points = true;
      }
      if (messageNotification && gSettings.hr_m && gSettings.hr_m_n) {
        notification.msg += `You have ${messageNotification} new messages.\n\n`;
        notification.inbox = true;
      }
      if (deliveredNotification && gSettings.hr_g && gSettings.hr_g_n) {
        notification.msg += 'You have new gifts delivered.\n\n';
        notification.won = true;
      }
      if (this.esgst.wishlistNew && gSettings.hr_w && gSettings.hr_w_n) {
        if (gSettings.hr_w_h) {
          notification.msg += `You have ${this.esgst.wishlistNew} new wishlist giveaways ending in ${gSettings.hr_w_hours} hours.`;
        } else {
          notification.msg += `You have ${this.esgst.wishlistNew} new wishlist giveaways.`;
        }
        notification.wishlist = true;
      }
      if (notification.msg) {
        // noinspection JSIgnoredPromiseFromCall
        this.hr_showNotification(notification);
      }
    }
  }

  async hr_showNotification(details) {
    logger.info(details);
    let result = await window.Notification.requestPermission();
    if (result !== 'granted') {
      return;
    }
    if ((details.points && gSettings.hr_fp_s) || (details.inbox && gSettings.hr_m_n_s) || (details.wishlist && gSettings.hr_w_n_s) || (details.won && gSettings.hr_g_n_s)) {
      try {
        if (!this.esgst.audioContext) {
          this.esgst.audioContext = new AudioContext();
          let promises = [];
          ['hr_fp_s', 'hr_g_n_s', 'hr_m_n_s', 'hr_w_n_s'].forEach(id => {
            if (!gSettings.id) {
              promises.push(null);
              return;
            }
            promises.push(this.hr_createPlayer(gSettings[`${id}_sound`] || this.hr_getDefaultSound()));
          });
          [this.esgst.hr.pointsPlayer, this.esgst.hr.wonPlayer, this.esgst.hr.inboxPlayer, this.esgst.hr.wishlistPlayer] = await Promise.all(promises);
        }
        if (details.points && this.esgst.hr.pointsPlayer) {
          this.esgst.hr.pointsPlayer.play();
        }
        if (details.inbox && this.esgst.hr.inboxPlayer) {
          this.esgst.hr.inboxPlayer.play();
        }
        if (details.wishlist && this.esgst.hr.wishlistPlayer) {
          this.esgst.hr.wishlistPlayer.play();
        }
        if (details.won && this.esgst.hr.wonPlayer) {
          this.esgst.hr.wonPlayer.play();
        }
      } catch (e) {
        logger.warning(e.stack);
        details.msg += '\n\nAn error happened when trying to play the sound.';
      }
    }
    let notification = new Notification('ESGST Notification', {
      body: details.msg,
      icon: `https://dl.dropboxusercontent.com/s/lr3t3bxrxfxylqe/esgstIcon.ico?raw=1`,
      requireInteraction: gSettings.hr_c,
      tag: details.msg
    });
    notification.onclick = () => {
      if (gSettings.hr_a) {
        browser.runtime.sendMessage({
          action: 'tabs',
          any: gSettings.hr_a_a,
          inbox_sg: this.esgst.sg && details.inbox,
          inbox_st: this.esgst.st && details.inbox,
          refresh: gSettings.hr_a_r,
          wishlist: details.wishlist,
          won: details.won
        });
      } else {
        if (details.inbox) {
          window.open('/messages');
        }
        if (details.wishlist) {
          window.open(`/giveaways/search?type=wishlist`);
        }
        if (details.won) {
          window.open('/giveaways/won');
        }
      }
      notification.close();
    };
  }
}

const generalHeaderRefresher = new GeneralHeaderRefresher();

export { generalHeaderRefresher };