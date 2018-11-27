import dateFns_formatDistanceStrict from 'date-fns/formatDistanceStrict';

export default function FormNotification(context, options) {
  $(`
    <div class="notification notification--${options.loading ? `default` : (options.success ? `success` : `warning`)}">
      <i class="fa ${options.loading ? `fa-circle-o-notch fa-spin` : (options.success ? `fa-check-circle` : `fa-times-circle`)}"></i> ${options.loading ? `Syncing <span class="name"></span>...` : (options.success ? `Synced <span class="name"></span> <span class="date"></span> ago.` : `Never synced <span class="name"></span>.`)}
    </div>
  `).appendTo(context)
    .find(`.name`)
      .text(options.name)
      .end()
    .find(`.date`)
      .data(`timestamp`, options.date)
      .text(dateFns_formatDistanceStrict(options.date, new Date()));
}