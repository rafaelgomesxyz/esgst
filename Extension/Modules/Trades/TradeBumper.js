_MODULES.push({
  description: `
    <ul>
      <li>Adds a button (<i class="fa fa-chevron-circle-up"></i>) to the main page heading of your <a href="https://www.steamtrades.com/trades/search?user=your-steam-id">created trades</a> page that allows you to bump all of your open trades at once.</li>
    </ul>
  `,
  features: {
    tb_a: {
      description: `
        <ul>
          <li>Automatically bumps all of your trades every hour.</li>
          <li>Requires either SteamGifts or SteamTrades to be open, depending on where you have this option enabled.</li>
        </ul>
      `,
      name: `Auto bump every hour.`,
      sg: true,
      st: true
    }
  },
  id: `tb`,
  load: tb,
  name: `Trade Bumper`,
  sg: true,
  st: true,
  type: `trades`
});

function tb() {
  if (location.href.match(new RegExp(`\\/trades\\/search\\?user=${esgst.steamId}`))) {
    const button = createHeadingButton({
      id: `tb`,
      icons: [`fa-chevron-circle-up`],
      title: `Bump trades`
    });
    button.addEventListener(`click`, tb_getTrades.bind(null, button, document));
    if (esgst.tb_a) {
      tb_setAutoBump(button);
    }
  } else if (esgst.tb_a) {
    tb_setAutoBump();
  }
}

async function tb_getTrades(button, context) {
  if (button) {
    createElements(button, `inner`, [{
      attributes: {
        class: `fa fa-circle-o-notch fa-spin`
      },
      type: `i`
    }]);
  }
  const elements = context.querySelectorAll(`.row_inner_wrap:not(.is_faded)`);
  for (const element of elements) {
    await request({
      data: `xsrf_token=${esgst.xsrfToken}&do=trade_bump&code=${element.querySelector(`[href*="/trade/"]`).getAttribute(`href`).match(/\/trade\/(.+?)\//)[1]}`,
      method: `POST`,
      url: `https://www.steamtrades.com/ajax.php`
    });
  }
  if (button) {
    location.reload();
  } else {
    setTimeout(tb_setAutoBump, 3900000, button);
  }
}

async function tb_setAutoBump(button) {
  const currentTime = Date.now();
  const diff = currentTime - (await getValue(`lastBump`, 0));
  if (diff > 3600000) {
    await setValue(`lastBump`, currentTime);
    tb_autoBumpTrades(button);
  } else {
    setTimeout(tb_setAutoBump, 3600000 - diff, button);
  }
}

async function tb_autoBumpTrades(button) {
  if (location.href.match(new RegExp(`\\/trades\\/search\\?user=${esgst.steamId}`))) {
    tb_getTrades(button, document);
  } else {
    tb_getTrades(null, parseHtml((await request({
      method: `GET`,
      queue: true,
      url: `https://www.steamtrades.com/trades/search?user=${esgst.steamId}`
    })).responseText));
  }
}