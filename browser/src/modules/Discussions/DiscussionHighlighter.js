import { Module } from '../../class/Module';
import { shared } from '../../class/Shared';
import { Popup } from '../../class/Popup';
import { FetchRequest } from '../../class/FetchRequest';

class DiscussionsDiscussionHighlighter extends Module {
  constructor() {
    super();
    this.info = {
      id: 'dh',
      name: 'Discussion Highlighter',
      sg: true,
      type: 'discussions'
    };
  }

  init() {
    if (!shared.esgst.sg) {
      return;
    }

    const highlightedDiscussions = {};

    for (const code in shared.esgst.discussions) {
      const discussion = shared.esgst.discussions[code];

      if (discussion.highlighted) {
        highlightedDiscussions[code] = {
          highlighted: null
        };
      }
    }

    const numHighlightedDiscussions = Object.keys(highlightedDiscussions).length;

    if (numHighlightedDiscussions > 0) {
      const popup = new Popup({
        addScrollable: true,
        icon: 'fa-exchange',
        isTemp: true,
        title: 'Discussion Highlighter has been removed because the ability to bookmark discussions has been added to SteamGifts. Would you like to transfer the discussions you had previously highlighted to the SteamGifts bookmark list?',
        buttons: [
          {
            color1: 'green',
            color2: 'grey',
            icon1: 'fa-check',
            icon2: 'fa-circle-o-notch fa-spin',
            title1: 'Transfer',
            title2: 'Transfering...',
            callback1: async () => {
              let current = 1;

              for (const code in highlightedDiscussions) {
                await FetchRequest.post(`/discussion/${code}/`, {
                  data: `xsrf_token=${shared.esgst.xsrfToken}&do=bookmark_insert`
                });

                popup.setProgress(`${current++} of ${numHighlightedDiscussions} discussions transferred...`);
              }

              popup.close();
            }
          }
        ]
      });
      popup.onClose = async () => await shared.common.lockAndSaveDiscussions(highlightedDiscussions);
      popup.open();
    }
  }
}

const discussionsDiscussionHighlighter = new DiscussionsDiscussionHighlighter();

export { discussionsDiscussionHighlighter };