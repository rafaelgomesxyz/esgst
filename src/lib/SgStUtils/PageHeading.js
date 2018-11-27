export default function PageHeading(context, options) {
  const heading = $(`
    <div class="page__heading">
      <div class="page__heading__breadcrumbs"></div>
    </div>
  `);
  const items = [];
  for (const item of options.items) {
    const itemElement = $(`
      <a></a>
    `);
    itemElement.attr(`href`, item.url).text(item.name);
    items.push(itemElement, `<i class="fa fa-angle-right"></i>`);
  }
  heading.find(`div.page__heading__breadcrumbs`).append(items.slice(0, -1));
  $(context).append(heading);
}