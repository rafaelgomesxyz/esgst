import {utils} from '../../lib/jsUtils'
import Module from '../../class/Module';

class GiveawaysGiveawayRecreator extends Module {
  info = ({
    description: `
      <ul>
        <li>Adds an icon (<i class="fa fa-rotate-left"></i>) next to the game name of a giveaway created by yourself that ended with 0 entries (in any page) that opens the <a href="https://www.steamgifts.com/giveaways/new">new giveaway</a> page with all of the details of the giveaway prefilled so that you can quickly recreate the giveaway.</li>
      </ul>
    `,
    features: {
      gr_a: {
        name: `Show the icon for all created giveaways.`,
        sg: true
      },
      gr_r: {
        name: `Remove the button for giveaways that have been recreated.`,
        sg: true
      }
    },
    id: `gr`,
    load: this.gr,
    name: `Giveaway Recreator`,
    sg: true,
    type: `giveaways`
  });

  async gr() {
    if (!this.esgst.newGiveawayPath) return;
    let template = await getValue(`grTemplate`);
    if (template) {
      await delValue(`grTemplate`);
      template = JSON.parse(template);
      this.esgst.modules.giveawaysGiveawayTemplates.gts_applyTemplate(template);
    }
  }

  async gr_recreateGiveaway(button, giveaway) {
    this.esgst.modules.common.createElements(button, `inner`, [{
      attributes: {
        class: `fa fa-circle-o-notch fa-spin`
      },
      type: `i`
    }]);
    if (this.esgst.createdPath) {
      let response = await this.esgst.modules.common.request({method: `GET`, url: giveaway.url});
      this.gr_saveTemplate(button, (await this.esgst.modules.giveaways.giveaways_get(utils.parseHtml(response.responseText), false, response.finalUrl, false, `giveaway`))[0] || giveaway);
    } else {
      this.gr_saveTemplate(button, giveaway);
    }
  }

  async gr_saveTemplate(button, giveaway) {
    let context, elements, giveaways, i, keys, n,
      template = {
        delay: 0,
        description: ``,
        duration: giveaway.endTime - giveaway.startTime,
        gameName: giveaway.name,
        groups: ``,
        level: giveaway.level,
        region: `0`
      };
    if (giveaway.group || giveaway.whitelist) {
      template.whoCanEnter = `groups`;
      if (giveaway.whitelist) {
        template.whitelist = `1`;
      }
    } else if (giveaway.inviteOnly) {
      template.whoCanEnter = `invite_only`;
    } else {
      template.whoCanEnter = `everyone`;
    }
    elements = utils.parseHtml(JSON.parse((await this.esgst.modules.common.request({data: `do=autocomplete_giveaway_game&page_number=1&search_query=${encodeURIComponent(giveaway.name)}`, method: `POST`, url: `/ajax.php`})).responseText).html).getElementsByClassName(`table__row-outer-wrap`);
    for (i = 0, n = elements.length; i < n && elements[i].getAttribute(`data-autocomplete-name`) !== giveaway.name; ++i);
    if (i < n) {
      template.gameId = elements[i].getAttribute(`data-autocomplete-id`);
    }
    keys = [];
    if (giveaway.entries === 0 || giveaway.entries < giveaway.copies) {
      context = utils.parseHtml(JSON.parse((await this.esgst.modules.common.request({data: `xsrf_token=${this.esgst.xsrfToken}&do=popup_keys&code=${giveaway.code}`, method: `POST`, url: `/ajax.php`})).responseText).html).getElementsByClassName(`popup__keys__heading`);
      if (context) {
        context = context[context.length - 1];
        elements = context.nextElementSibling.nextElementSibling.children;
        for (i = 0, n = elements.length; i < n; ++i) {
          keys.push(elements[i].textContent);
        }
      }
    }
    if (keys.length > 0) {
      template.gameType = `key`;
      template.keys = keys.join(`\n`);
    } else {
      template.gameType = `gift`;
      template.copies = giveaway.copies;
    }
    await setValue(`grTemplate`, JSON.stringify(template));
    giveaways = JSON.parse(await getValue(`giveaways`));
    if (!giveaways[giveaway.code]) {
      giveaways[giveaway.code] = {};
    }
    giveaways[giveaway.code].recreated = true;
    await setValue(`giveaways`, JSON.stringify(giveaways));
    button.remove();
    open(`/giveaways/new`);
  }
}

export default GiveawaysGiveawayRecreator;