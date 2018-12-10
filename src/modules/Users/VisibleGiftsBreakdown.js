import Module from '../../class/Module';
import { common } from '../Common';

class UsersVisibleGiftsBreakdown extends Module {
  constructor() {
    super();
    this.info = {
      description: [
        [`ul`, [
          [`li`, [
            `Shows the gifts breakdown of a user in their profile page, with the following initials:`
          ]],
          [`ul`, [
            [`li`, `FCV - Full CV`],
            [`li`, `RCV - Reduced CV`],
            [`li`, `NCV - No CV`],
            [`li`, `A - Awaiting Feedback`],
            [`li`, `NR - Not Received`]
          ]]
        ]]
      ],
      id: `vgb`,
      inputItems: [
        {
          id: `vgb_wonFormat`,
          prefix: `Won Format: `,
          tooltip: `[FCV], [RCV], [NCV] and [NR] will be replaced with their respective values.`
        },
        {
          id: `vgb_sentFormat`,
          prefix: `Sent Format: `,
          tooltip: `[FCV], [RCV], [NCV], [A] and [NR] will be replaced with their respective values.`
        }
      ],
      name: `Visible Gifts Breakdown`,
      options: {
        title: `Position: `,
        values: [`Left`, `Right`]
      },
      sg: true,
      type: `users`
    };
  }

  init() {
    this.esgst.profileFeatures.push(this.vgb_add.bind(this));
  }

  vgb_add(profile) {
    const position = this.esgst.vgb_index === 0 ? `afterBegin` : `beforeEnd`;
    common.createElements_v2(profile.wonRowRight.firstElementChild.firstElementChild, position, [
      ` ${
        this.esgst.vgb_wonFormat
          .replace(/\[FCV]/, profile.wonFull)
          .replace(/\[RCV]/, profile.wonReduced)
          .replace(/\[NCV]/, profile.wonZero)
          .replace(/\[NR]/, profile.wonNotReceived)
      } `
    ]);
    common.createElements_v2(profile.sentRowRight.firstElementChild.firstElementChild, position, [
      ` ${
        this.esgst.vgb_sentFormat
          .replace(/\[FCV]/, profile.sentFull)
          .replace(/\[RCV]/, profile.sentReduced)
          .replace(/\[NCV]/, profile.sentZero)
          .replace(/\[A]/, profile.sentAwaiting)
          .replace(/\[NR]/, profile.sentNotReceived)
      } `
    ]);
  }
}

export default UsersVisibleGiftsBreakdown;