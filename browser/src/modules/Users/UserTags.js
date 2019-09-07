import { Tags } from '../Tags';
import { shared } from '../../class/Shared';

class UsersUserTags extends Tags {
  constructor() {
    super('ut');
    this.info = {
      description: [
        ['ul', [
          ['li', [
            `Adds a button (`,
            ['i', { class: `fa fa-tag` }],
            `) next a user's username (in any page) that allows you to save tags for the user (only visible to you).`
          ]],
          ['li', `You can press Enter to save the tags.`],
          ['li', `Each tag can be colored individually.`],
          ['li', [
            `There is a button (`,
            ['i', { class: `fa fa-list` }],
            `) in the tags popup that allows you to view a list with all of the tags that you have used ordered from most used to least used.`
          ]],
          ['li', [
            `Adds a button (`,
            ['i', { class: `fa fa-user` }],
            ` `,
            ['i', { class: `fa fa-tags` }],
            `) to the page heading of this menu that allows you to manage all of the tags that have been saved.`
          ]],
          ['li', `This feature is recommended for cases where you want to associate a short text with a user, since the tags are displayed next to their username.For a long text, check [id=un].`]
        ]]
      ],
      features: {
        ut_s: {
          name: `Show tag suggestions while typing.`,
          sg: true,
          st: true
        }
      },
      id: 'ut',
      name: `User Tags`,
      sg: true,
      st: true,
      type: 'users'
    };
  }

  init() {
    shared.esgst.userFeatures.push(this.tags_addButtons.bind(this));
    // noinspection JSIgnoredPromiseFromCall
    this.tags_getTags();
  }
}

const usersUserTags = new UsersUserTags();

export { usersUserTags };