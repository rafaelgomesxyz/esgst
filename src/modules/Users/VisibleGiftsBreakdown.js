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
      name: `Visible Gifts Breakdown`,
      sg: true,
      type: `users`
    };
  }

  init() {
    this.esgst.profileFeatures.push(this.vgb_add.bind(this));
  }

  vgb_add(profile) {
    common.createElements_v2(profile.wonRowRight.firstElementChild.firstElementChild, `beforeEnd`, [
      ` (${profile.wonFull} FCV / ${profile.wonReduced} RCV / ${profile.wonZero} NCV / ${profile.wonNotReceived} NR)`
    ]);
    common.createElements_v2(profile.sentRowRight.firstElementChild.firstElementChild, `beforeEnd`, [
      ` (${profile.sentFull} FCV / ${profile.sentReduced} RCV / ${profile.sentZero} NCV / ${profile.sentAwaiting} A / ${profile.sentNotReceived} NR)`
    ]);
  }
}

export default UsersVisibleGiftsBreakdown;