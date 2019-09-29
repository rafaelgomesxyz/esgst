import { Module } from '../../class/Module';
import { Popout } from '../../class/Popout';
import { common } from '../Common';
import { gSettings } from '../../class/Globals';
import { DOM } from '../../class/DOM';

const
  createElements = common.createElements.bind(common),
  endless_load = common.endless_load.bind(common),
  request = common.request.bind(common)
  ;

class GeneralQuickInboxView extends Module {
  constructor() {
    super();
    this.info = {
      description: [
        ['ul', [
          ['li', [
            `If you hover over the inbox icon (`,
            ['i', { class: 'fa fa-envelope' }],
            `) at the header, it shows a popout with your messages so that you do not need to access your inbox page to read them.`
          ]],
          ['li', `You can also mark the messages as read from the popout and reply to them if [id=rfi] is enabled.`]
        ]]
      ],
      features: {
        qiv_p: {
          description: [
            ['ul', [
              ['li', `Preloads the first page so that you do not have to wait for it to load after hovering over the inbox icon (this can slow down the page load though).`]
            ]]
          ],
          name: 'Preload the first page.',
          sg: true,
          st: true
        }
      },
      id: 'qiv',
      name: 'Quick Inbox View',
      sg: true,
      st: true,
      type: 'general'
    };
  }

  init() {
    this.qiv(true);
  }

  qiv(first) {
    if (!this.esgst.inboxButton) return;

    if (typeof this.esgst.qiv !== 'object') {
      this.esgst.qiv = {
        nextPage: 1
      };
    }

    if (first && gSettings.qiv_p) {
      this.esgst.qiv.popout = new Popout('esgst-qiv-popout', null, 1000);
      this.esgst.qiv.popout.onClose = this.qiv_removeNew.bind(this);
      if (this.esgst.messageCount > 0) {
        this.qiv_addMarkReadButton();
      }
      this.esgst.qiv.comments = createElements(this.esgst.qiv.popout.popout, 'beforeEnd', [{
        attributes: {
          class: 'esgst-qiv-comments'
        },
        type: 'div'
      }]);
      this.esgst.qiv.comments.addEventListener('scroll', this.qiv_scroll.bind(this, false, false));
      // noinspection JSIgnoredPromiseFromCall
      this.qiv_scroll(true);
    }
    this.esgst.inboxButton.addEventListener('mouseenter', this.qiv_openPopout.bind(this));
    this.esgst.inboxButton.addEventListener('mouseleave', event => {
      if (this.esgst.qiv.timeout) {
        window.clearTimeout(this.esgst.qiv.timeout);
        this.esgst.qiv.timeout = null;
      }
      this.esgst.qiv.exitTimeout = window.setTimeout(() => {
        if (this.esgst.qiv.popout && !this.esgst.qiv.popout.popout.contains(event.relatedTarget)) {
          this.esgst.qiv.popout.close();
        }
      }, 1000);
    });
  }

  qiv_openPopout() {
    this.esgst.qiv.timeout = window.setTimeout(() => {
      if (this.esgst.qiv.popout) {
        this.esgst.qiv.popout.open(this.esgst.inboxButton);
      } else {
        this.esgst.qiv.popout = new Popout('esgst-qiv-popout', null, 1000);
        this.esgst.qiv.popout.onClose = this.qiv_removeNew.bind(this);
        if (this.esgst.messageCount > 0) {
          this.qiv_addMarkReadButton();
        }
        this.esgst.qiv.comments = createElements(this.esgst.qiv.popout.popout, 'beforeEnd', [{
          attributes: {
            class: 'esgst-qiv-comments'
          },
          type: 'div'
        }]);
        this.esgst.qiv.popout.open(this.esgst.inboxButton);
        this.esgst.qiv.comments.addEventListener('scroll', this.qiv_scroll.bind(this, false, false));
        // noinspection JSIgnoredPromiseFromCall
        this.qiv_scroll(true);
      }
      this.esgst.qiv.popout.popout.onmouseenter = () => {
        if (this.esgst.qiv.exitTimeout) {
          window.clearTimeout(this.esgst.qiv.exitTimeout);
          this.esgst.qiv.exitTimeout = null;
        }
      };
    }, 1000);
  }

  qiv_removeNew() {
    const elements = this.esgst.qiv.popout.popout.getElementsByClassName('esgst-qiv-new');
    for (let i = elements.length - 1; i > -1; i--) {
      elements[i].remove();
    }
  }

  async qiv_scroll(first, preload) {
    if ((first || preload || this.esgst.qiv.comments.scrollTop + this.esgst.qiv.comments.offsetHeight >= this.esgst.qiv.comments.scrollHeight) && !this.esgst.qiv.busy) {
      this.esgst.qiv.busy = true;
      const firstPage = this.esgst.qiv.comments.firstElementChild;
      let doContinue = false;
      do {
        const loading = createElements(
          this.esgst.qiv.popout.popout,
          first || preload ? 'afterBegin' : 'beforeEnd', [{
            type: 'span',
            children: [{
              attributes: {
                class: 'fa fa-circle-o-notch fa-spin'
              },
              type: 'i'
            }, {
              text: ' Loading...',
              type: 'node'
            }]
          }]
        );
        this.esgst.qiv.popout.reposition(this.esgst.inboxButton);
        const context = DOM.parse((await request({
          method: 'GET',
          url: `/messages/search?page=${this.esgst.qiv.nextPage}`
        })).responseText).querySelector(`.page__heading, .page_heading`).nextElementSibling;
        loading.remove();

        if (preload) {
          const currentId = this.esgst.qiv.comments.querySelector(`[href*="/go/comment/"]`)
            .getAttribute('href').match(/\/go\/comment\/(.+)/)[1],
            comments = context.querySelectorAll(`.comment, .comment_outer`);
          let i = comments.length - 1;
          while (i > -1 && comments[i].querySelector(`[href*="/go/comment/"]`).getAttribute('href').match(/\/go\/comment\/(.+)/)[1] !== currentId) i--;
          if (i > -1) {
            doContinue = false;
            i--;
            for (let j = comments.length - 1; j > i; j--) {
              const container = comments[j].parentElement;
              comments[j].remove();
              if (!container.children.length) {
                container.previousElementSibling.remove();
                container.remove();
              }
            }
          } else {
            doContinue = true;
          }
          if (context.children.length) {
            for (const element of comments) {
              createElements(element, 'afterBegin', [{
                attributes: {
                  class: 'esgst-qiv-new esgst-warning'
                },
                text: `[NEW]`,
                type: 'div'
              }]);
            }
            this.esgst.qiv.comments.insertBefore(context, firstPage);
          }
        } else {
          const comments = context.querySelectorAll(`.comment, .comment_outer`);
          let i = comments.length - 1;
          while (i > -1 && !this.esgst.qiv.comments.querySelector(`[href*="/go/comment/${comments[i].querySelector(`[href*="/go/comment/"]`).getAttribute('href').match(/\/go\/comment\/(.+)/)[1]}"]`)) i--;
          if (i > -1) {
            while (i > -1) {
              const container = comments[i].parentElement;
              comments[i].remove();
              if (!container.children.length) {
                container.previousElementSibling.remove();
                container.remove();
              }
              i--;
            }
            doContinue = !context.children.length;
          } else {
            doContinue = false;
          }
          if (context.children.length) {
            this.esgst.qiv.comments.appendChild(context);
          }
        }
        if (context.children.length) {
          context.setAttribute('data-esgst-qiv', 'true');
          await endless_load(context);
        }
        if (this.esgst.qiv.popout.isOpen) {
          this.esgst.qiv.popout.reposition(this.esgst.inboxButton);
        }
        this.esgst.qiv.nextPage += 1;
      } while (doContinue);
      this.esgst.qiv.busy = false;
    }
  }

  qiv_addMarkReadButton() {
    let key, url;
    if (this.esgst.qiv.markReadButton) return;
    if (this.esgst.sg) {
      this.esgst.qiv.markReadButton = createElements(this.esgst.qiv.popout.popout, 'afterBegin', [{
        attributes: {
          class: 'sidebar__action-button'
        },
        type: 'div',
        children: [{
          attributes: {
            class: 'fa fa-check-circle'
          },
          type: 'i'
        }, {
          text: ' Mark as Read',
          type: 'node'
        }]
      }]);
      key = 'read_messages';
      url = '/messages';
    } else {
      this.esgst.qiv.markReadButton = createElements(this.esgst.qiv.popout.popout, 'afterBegin', [{
        attributes: {
          class: 'page_heading_btn green'
        },
        type: 'a',
        children: [{
          attributes: {
            class: 'fa fa-check-square-o'
          },
          type: 'i'
        }, {
          text: 'Mark as Read',
          type: 'span'
        }]
      }]);
      key = 'mark_as_read';
      url = '/ajax.php';
    }
    this.esgst.qiv.markReadButton.addEventListener('click', async () => {
      await request({ data: `xsrf_token=${this.esgst.xsrfToken}&do=${key}`, method: 'POST', url });
      this.esgst.qiv.markReadButton.remove();
      this.esgst.qiv.markReadButton = null;
      let elements = this.esgst.qiv.comments.querySelectorAll('.comment__envelope');
      for (let i = elements.length - 1; i > -1; i--) {
        elements[i].remove();
      }
      this.esgst.inboxButton.classList.remove('nav__button-container--active');
      this.esgst.messageCountContainer.remove();
      this.esgst.messageCount = 0;
      if (gSettings.hr) {
        this.esgst.modules.generalHeaderRefresher.hr_notifyChange(this.esgst.hr);
      }
    });
  }
}

const generalQuickInboxView = new GeneralQuickInboxView();

export { generalQuickInboxView };