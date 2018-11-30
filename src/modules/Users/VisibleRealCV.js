import Module from '../../class/Module';

class UsersVisibleRealCV extends Module {
  constructor() {
    super();
    this.info = {
      description: [
        [`ul`, [
          [`li`, [
            `Displays the real sent/won CV next to the raw value in a user's `,
            [`a`, { href: `https://www.steamgifts.com/user/cg` }, `profile`],
            ` page.`
          ]],
          [`li`, `This also extends to [id = swr], if you have that feature enabled.`],
          [`li`, `With this feature disabled, you can still view the real CV, as provided by SteamGifts, by hovering over the raw value.`]
        ]]
      ],
      id: `vrcv`,
      load: this.vrcv,
      name: `Visible Real CV`,
      sg: true,
      type: `users`
    };
  }

  vrcv() {
    this.esgst.profileFeatures.push(this.vrcv_add.bind(this));
  }

  vrcv_add(profile) {
    /**
     * @property realSentCV.toLocaleString
     * @property realWonCV.toLocaleString
     */
    profile.sentCvContainer.insertAdjacentText("beforeend", ` / $${profile.realSentCV.toLocaleString(`en`)}`);
    profile.wonCvContainer.insertAdjacentText("beforeend", ` / $${profile.realWonCV.toLocaleString(`en`)}`);
  }
}

export default UsersVisibleRealCV;