import {utils} from '../../lib/jsUtils'
import Module from '../../class/Module';

class TradesTradeBumper extends Module {
info = ({
  description: `
    <ul>
      <li>Adds a button (<i class="fa fa-chevron-circle-up"></i>) to the main page heading of your <a href="https://www.steamtrades.com/trades/search?user=your-steam-id">created trades</a> page that allows you to bump all of your open trades this.esgst.modules.generalAccurateTimestamp.at once.</li>
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
  load: this.tb,
  name: `Trade Bumper`,
  sg: true,
  st: true,
  type: `trades`
});

tb() {
  if (location.href.match(new RegExp(`\\/trades\\/search\\?user=${this.esgst.steamId}`))) {
    const button = this.esgst.modules.common.createHeadingButton({
      id: `tb`,
      icons: [`fa-chevron-circle-up`],
      title: `Bump trades`
    });
    button.addEventListener(`click`, this.tb_getTrades.bind(null, button, document));
    if (this.esgst.tb_a) {
      this.tb_setAutoBump(button);
    }
  } else if (this.esgst.tb_a) {
    this.tb_setAutoBump();
  }
}

async tb_getTrades(button, context) {
  if (button) {
    this.esgst.modules.common.createElements(button, `inner`, [{
      attributes: {
        class: `fa fa-circle-o-notch fa-spin`
      },
      type: `i`
    }]);
  }
  const elements = context.querySelectorAll(`.row_inner_wrap:not(.is_faded)`);
  for (const element of elements) {
    await this.esgst.modules.common.request({
      data: `xsrf_token=${this.esgst.xsrfToken}&do=trade_bump&code=${element.querySelector(`[href*="/trade/"]`).getAttribute(`href`).match(/\/trade\/(.+?)\//)[1]}`,
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

async tb_setAutoBump(button) {
  const currentTime = Date.now();
  const diff = currentTime - (await getValue(`lastBump`, 0));
  if (diff > 3600000) {
    await setValue(`lastBump`, currentTime);
    this.tb_autoBumpTrades(button);
  } else {
    setTimeout(tb_setAutoBump, 3600000 - diff, button);
  }
}

async tb_autoBumpTrades(button) {
  if (location.href.match(new RegExp(`\\/trades\\/search\\?user=${this.esgst.steamId}`))) {
    this.tb_getTrades(button, document);
  } else {
    this.tb_getTrades(null, utils.parseHtml((await this.esgst.modules.common.request({
      method: `GET`,
      queue: true,
      url: `https://www.steamtrades.com/trades/search?user=${this.esgst.steamId}`
    })).responseText));
  }
}
}

export default TradesTradeBumper;