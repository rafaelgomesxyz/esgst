import Module from '../../class/Module';

class GamesGameTags extends Module {
  constructor() {
    super();
    this.info = {
      description: `
      <ul>
        <li>Adds a button (<i class="fa fa-tag"></i>) next to a game's name (in any page) that allows you to save tags for the game (only visible to you).</li>
        <li>You can press Enter to save the tags.</li>
        <li>Each tag can be colored individually.</li>
        <li>There is a button (<i class="fa fa-list"></i>) in the tags popup that allows you to view a list with all of the tags that you have used ordered from most used to least used.</li>
        <li>Adds a button (<i class="fa fa-gamepad"></i> <i class="fa fa-tags"></i>) to the page heading of this menu that allows you to manage all of the tags that have been saved.</li>
      </ul>
    `,
      features: {
        gt_s: {
          name: `Show tag suggestions while typing.`,
          sg: true,
          st: true
        }
      },
      id: `gt`,
      load: this.gt,
      name: `Game Tags`,
      sg: true,
      type: `games`
    };
  }

  gt() {
    this.esgst.gameFeatures.push(this.esgst.modules.tags.tags_addButtons.bind(this.esgst.modules.tags, `gt`));
    // noinspection JSIgnoredPromiseFromCall
    this.esgst.modules.tags.tags_getTags(`gt`);
  }
}

export default GamesGameTags;