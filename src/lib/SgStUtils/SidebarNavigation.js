export default function SidebarNavigation(context, options) {
  const heading = $(`
    <h3 class="sidebar__heading"></h3>
  `);
  heading.text(options.name);
  const list = $(`
    <ul class="sidebar__navigation"></ul>
  `);
  const items = [];
  for (const item of options.items) {
    const itemElement = $(`
      <li class="sidebar__navigation__item">
        <a class="sidebar__navigation__item__link">
          <div class="sidebar__navigation__item__name"></div>
          <div class="sidebar__navigation__item__underline"></div>
          ${item.count ? `
            <div class="sidebar__navigation__item__count"></div>
          ` : ``}
        </a>
      </li>
    `);
    itemElement.attr(`id`, item.id);
    itemElement.find(`a.sidebar__navigation__item__link`).attr(`href`, item.url);
    itemElement.find(`.sidebar__navigation__item__name`).text(item.name);
    if (item.count) {
      itemElement.find(`.sidebar__navigation__item__count`).text(item.count);
    }
    items.push(itemElement);
  }
  list.append(items);
  $(context).append(heading, list);
};