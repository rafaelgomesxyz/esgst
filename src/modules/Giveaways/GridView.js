import dateFns_formatDistanceStrict from 'date-fns/formatDistanceStrict';
import 'jquery-ui/ui/widgets/slider';
import { Module } from '../../class/Module';
import { Popout } from '../../class/Popout';
import { common } from '../Common';

const
  createElements = common.createElements.bind(common),
  createHeadingButton = common.createHeadingButton.bind(common),
  setSetting = common.setSetting.bind(common)
  ;

class GiveawaysGridView extends Module {
  constructor() {
    super();
    this.info = {
      description: [
        [`ul`, [
          [`li`, `Turns each giveaway in the main page and some popups([id=gb], [id=ged] and[id=ge]) into a small box where only the game's image is shown. Overlaying the image you will find the start/end times, type and level of the giveaway. To get the other details of the giveaway (such as the game name, the number of points it costs to enter, the number of entries/comments and the creator's username), you can hover over the box and a popout will appear containing them.This allows multiple giveaways to be shown per line, which reduces the size of the page and allows you to view all of the giveaways in the page at a single glance.`],
          [`li`, [
            `Also adds a button (`,
            [`i`, { class: `fa fa-th-large` }],
            `) to the main page heading of the same page that allows you to set the size of the space between each box.`
          ]]
        ]]
      ],
      features: {
        gv_gb: {
          name: `Extend to Giveaway Bookmarks.`,
          sg: true
        },
        gv_ged: {
          name: `Extend to Giveaway Encrypter / Decrypter.`,
          sg: true
        },
        gv_ge: {
          name: `Extend to Giveaway Extractor.`,
          sg: true
        }
      },
      id: `gv`,
      load: this.gv,
      name: `Grid View`,
      sg: true,
      type: `giveaways`
    };
  }

  gv() {
    if (this.esgst.giveawaysPath || this.esgst.gv_gb || this.esgst.gv_ged || this.esgst.gv_ge) {
      this.esgst.giveawayFeatures.push(this.gv_setContainer.bind(this));
      this.esgst.style.insertAdjacentText("beforeend", `
        .esgst-gv-creator {
          margin: ${this.esgst.ib ? 10 : 5}px 5px 5px;
        }

        .esgst-gv-popout .giveaway__links {
          display: block;
          height: auto;
          margin: 5px 5px ${this.esgst.ib ? 10 : 5}px;
          text-align: center;
        }
      `);
      if (this.esgst.giveawaysPath) {
        let button, display, element, elements, i, n, popout, spacing, slider;
        button = createHeadingButton({ id: `gv`, icons: [`fa-th-large`], title: `Set Grid View spacing` });
        popout = new Popout(`esgst-gv-spacing`, button, 0, true);
        spacing = this.esgst.gv_spacing;
        element = createElements(popout.popout, `beforeEnd`, [{
          type: `div`,
          children: [{
            type: `div`
          }, {
            text: `${spacing}px`,
            type: `div`
          }]
        }]);
        slider = element.firstElementChild;
        display = slider.nextElementSibling;
        window.$(slider).slider({
          slide: (event, ui) => {
            spacing = ui.value;
            elements = document.getElementsByClassName(`esgst-gv-container`);
            for (i = 0, n = elements.length; i < n; ++i) {
              elements[i].style.margin = `${spacing}px`;
            }
            popout.reposition();
            display.textContent = `${spacing}px`;
            setSetting(`gv_spacing`, spacing);
            this.esgst.gv_spacing = spacing;
          },
          max: 10,
          value: spacing
        });
      }
    }
  }

  gv_setContainer(giveaways, main, source) {
    if ((!main || !this.esgst.giveawaysPath) && (main || ((source !== `gb` || !this.esgst.gv_gb) && (source !== `ged` || !this.esgst.gv_ged) && (source !== `ge` || !this.esgst.gv_ge)))) return;
    giveaways.forEach(giveaway => {
      giveaway.grid = true;
      let popup = giveaway.outerWrap.closest(`.esgst-popup-scrollable`) || (this.esgst.accountPath && this.esgst.parameters.esgst && this.esgst.parameters.esgst !== `guide`);
      if (popup) {
        giveaway.outerWrap.parentElement.parentElement.classList.add(`esgst-gv-view`);
        giveaway.outerWrap.parentElement.style.display = `inline-block`;
        giveaway.outerWrap.classList.add(`esgst-gv-container`);
        giveaway.outerWrap.style.margin = `${this.esgst.gv_spacing}px`;
      } else {
        giveaway.outerWrap.parentElement.classList.add(`esgst-gv-view`);
        giveaway.outerWrap.classList.add(`esgst-gv-container`);
        giveaway.outerWrap.style.margin = `${this.esgst.gv_spacing}px`;
      }
      giveaway.innerWrap.classList.add(`esgst-gv-box`);
      const now = Date.now();
      giveaway.gvIcons = createElements(giveaway.innerWrap, `afterBegin`, [{
        attributes: {
          class: `esgst-gv-icons giveaway__columns`
        },
        type: `div`,
        children: [{
          attributes: {
            class: `esgst-gv-time`,
            [`data-draggable-id`]: `time`,
            draggable: true
          },
          type: `div`,
          children: [{
            attributes: {
              title: `${giveaway.started ? `Ends` : `Starts`} ${giveaway.endTimeColumn.lastElementChild.textContent}`
            },
            text: dateFns_formatDistanceStrict(giveaway.endTime, now, { locale: this.esgst.formatDistanceLocale }),
            type: `span`
          }, {
            attributes: {
              class: `fa fa-clock-o`
            },
            type: `i`
          }, {
            attributes: {
              title: `Created ${giveaway.startTimeColumn.lastElementChild.previousElementSibling.textContent}`
            },
            text: dateFns_formatDistanceStrict(giveaway.startTime, now, { locale: this.esgst.formatDistanceLocale }),
            type: `span`
          }]
        }]
      }]);
      giveaway.endTimeColumn_gv = giveaway.gvIcons.firstElementChild.firstElementChild;
      if (giveaway.inviteOnly) {
        giveaway.gvIcons.appendChild(giveaway.inviteOnly);
      }
      if (giveaway.regionRestricted) {
        giveaway.gvIcons.appendChild(giveaway.regionRestricted);
      }
      if (giveaway.group) {
        giveaway.gvIcons.appendChild(giveaway.group);
      }
      if (giveaway.whitelist) {
        giveaway.gvIcons.appendChild(giveaway.whitelist);
      }
      if (giveaway.levelColumn) {
        giveaway.levelColumn.textContent = giveaway.levelColumn.textContent.replace(/Level\s/, ``);
        giveaway.gvIcons.appendChild(giveaway.levelColumn);
      }
      giveaway.innerWrap.insertBefore(giveaway.image, giveaway.gvIcons);
      giveaway.summary.classList.add(`esgst-gv-popout`, `global__image-outer-wrap`);
      const temp = common.createElements_v2(giveaway.links, `beforeBegin`, [
        [`div`, { style: `align-items: center; display: flex; justify-content: space-between;` }, [
          [`div`, { style: `display: flex; flex: 1; flex-direction: column;` }, [
            [`div`, { class: `esgst-gv-creator` }, [
              `by `
            ]]
          ]]
        ]]
      ]);
      temp.firstElementChild.firstElementChild.appendChild(giveaway.creatorContainer);
      temp.firstElementChild.appendChild(giveaway.links);
      temp.appendChild(giveaway.avatar);
      giveaway.endTimeColumn.classList.add(`esgst-hidden`);
      giveaway.startTimeColumn.classList.add(`esgst-hidden`);
      giveaway.entriesLink.lastElementChild.textContent = giveaway.entriesLink.textContent.replace(/[^\d,]+/g, ``);
      giveaway.commentsLink.lastElementChild.textContent = giveaway.commentsLink.textContent.replace(/[^\d,]+/g, ``);
      new Popout(``, giveaway.outerWrap, 100, false, giveaway.summary);
    });
  }
}

const giveawaysGridView = new GiveawaysGridView();

export { giveawaysGridView };