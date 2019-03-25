import { Module } from '../../class/Module';
import { common } from '../Common';

const
  createElements = common.createElements.bind(common),
  getFeatureTooltip = common.getFeatureTooltip.bind(common)
  ;

class UsersSentWonRatio extends Module {
  constructor() {
    super();
    this.info = {
      description: [
        [`ul`, [
          [`li`, [
            `Adds a "Ratio" row containing a user's sent/won ratio (which is their number of gifts sent divided by their number of gifts won) below the "Gifts Sent" row of their `,
            [`a`, { href: `https://www.steamgifts.com/user/cg` }, `profile`],
            ` page.`
          ]]
        ]]
      ],
      id: `swr`,
      load: this.swr,
      name: `Sent/Won Ratio`,
      sg: true,
      type: `users`
    };
  }

  swr() {
    this.esgst.profileFeatures.push(this.swr_add.bind(this));
  }

  swr_add(profile) {
    let ratio, fullRatio, reducedRatio, zeroRatio, cvRatio, realCVRatio;
    ratio = profile.wonCount > 0 ? Math.round(profile.sentCount / profile.wonCount * 100) / 100 : 0;
    fullRatio = profile.wonFull > 0 ? Math.round(profile.sentFull / profile.wonFull * 100) / 100 : 0;
    reducedRatio = profile.wonReduced > 0 ? Math.round(profile.sentReduced / profile.wonReduced * 100) / 100 : 0;
    zeroRatio = profile.wonZero > 0 ? Math.round(profile.sentZero / profile.wonZero * 100) / 100 : 0;
    cvRatio = profile.wonCV > 0 ? Math.round(profile.sentCV / profile.wonCV * 100) / 100 : 0;
    realCVRatio = profile.realWonCV > 0 ? Math.round(profile.realSentCV / profile.realWonCV * 100) / 100 : 0;
    let ratioTooltip = {
      rows: [
        {
          columns: [
            {
              name: `Ratio`
            },
            {
              color: `#8f96a6`,
              name: ratio
            }
          ],
          icon: [
            {
              class: `fa-pie-chart`,
              color: `#77899a`
            }
          ]
        },
        {
          columns: [
            {
              color: `#8f96a6`,
              name: `Full Value`
            },
            {
              color: `#8f96a6`,
              name: fullRatio
            }
          ],
          indent: `80px`
        },
        {
          columns: [
            {
              color: `#8f96a6`,
              name: `Reduced Value`
            },
            {
              color: `#8f96a6`,
              name: reducedRatio
            }
          ],
          indent: `80px`
        },
        {
          columns: [
            {
              color: `#8f96a6`,
              name: `No Value`
            },
            {
              color: `#8f96a6`,
              name: zeroRatio
            }
          ],
          indent: `80px;`
        }
      ]
    };
    let cvTooltip = {
      rows: [
        {
          columns: [
            {
              name: `Real Value`
            },
            {
              color: `#8f96a6`,
              name: `${realCVRatio}`
            }
          ],
          icon: [
            {
              class: `fa-dollar`,
              color: `#84cfda`
            }
          ]
        }
      ]
    };
    createElements(profile.sentRow, `afterEnd`, [{
      attributes: {
        class: `esgst-swr-ratio featured__table__row`,
        title: getFeatureTooltip(`swr`)
      },
      type: `div`,
      children: [{
        attributes: {
          class: `featured__table__row__left`
        },
        text: `Ratio`,
        type: `div`
      }, {
        attributes: {
          class: `featured__table__row__right`
        },
        type: `div`,
        children: [{
          attributes: {
            [`data-ui-tooltip`]: JSON.stringify(ratioTooltip)
          },
          text: ratio,
          type: `span`
        }, {
          text: ` (`,
          type: `node`
        }, {
          attributes: {
            [`data-ui-tooltip`]: JSON.stringify(cvTooltip)
          },
          text: this.esgst.vrcv ? `${cvRatio} / ${realCVRatio.toLocaleString(`en`)}` : cvRatio,
          type: `span`
        }, {
          text: `)`,
          type: `node`
        }]
      }]
    }]);
  }
}

const usersSentWonRatio = new UsersSentWonRatio();

export { usersSentWonRatio };