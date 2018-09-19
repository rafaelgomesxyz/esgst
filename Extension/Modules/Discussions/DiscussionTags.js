_MODULES.push({
  description: `
    <ul>
      <li>Adds a button (<i class="fa fa-tag"></i>) next a discussion's title (in any page) that allows you to save tags for the discussion (only visible to you).</li>
      <li>You can press Enter to save the tags.</li>
      <li>Each tag can be colored individually.</li>
      <li>There is a button (<i class="fa fa-list"></i>) in the tags popup that allows you to view a list with all of the tags that you have used ordered from most used to least used.</li>
      <li>Adds a button (<i class="fa fa-comments"></i> <i class="fa fa-tags"></i>) to the page heading of this menu that allows you to manage all of the tags that have been saved.</li>
    </ul>
  `,
  features: {
    dt_s: {
      name: `Show tag suggestions while typing.`,
      sg: true
    }
  },
  id: `dt`,
  load: dt,
  name: `Discussion Tags`,
  sg: true,
  type: `discussions`
});

function dt() {
  esgst.discussionFeatures.push(tags_addButtons.bind(null, `dt`));
  tags_getTags(`dt`);
}