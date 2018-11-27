export default function FormRows(context, options) {
  const rows = $(`
    <div class="form__rows"></div>
  `);
  const items = [];
  let i = 1;
  for (const item of options.items) {
    if (!item.check) {
      continue;
    }
    const itemElement = $(`
      <div class="form__row">
        <div class="form__heading">
          <div class="form__heading__number"></div>
          <div class="form__heading__text"></div>
        </div>
        <div class="form__row__indent"></div>
      </div>
    `);
    itemElement.find(`.form__heading__number`).text(i++);
    itemElement.find(`.form__heading__text`).text(item.name);    
    item.context = itemElement.find(`.form__row__indent`);
    items.push(itemElement);
  }
  rows.append(items);
  $(context).append(rows);
};