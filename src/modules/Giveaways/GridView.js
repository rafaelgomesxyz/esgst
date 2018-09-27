import Module from '../../class/Module';
import Popout from '../../class/Popout';
import {common} from '../Common';

const
  createElements = common.createElements.bind(common),
  createHeadingButton = common.createHeadingButton.bind(common),
  draggable_enter = common.draggable_enter.bind(common),
  getRemainingTime = common.getRemainingTime.bind(common),
  setSetting = common.setSetting.bind(common)
;

class GiveawaysGridView extends Module {
  constructor() {
    super();
    this.info = {
      description: `
      <ul>
        <li>Turns each giveaway in the main page and some popups ([id=gb], [id=ged] and [id=ge]) into a small box where only the game's image is shown. Overlaying the image you will find the start/end times, type and level of the giveaway. To get the other details of the giveaway (such as the game name, the number of points it costs to enter, the number of entries/comments and the creator's username), you can hover over the box and a popout will appear containing them. This allows multiple giveaways to be shown per line, which reduces the size of the page and allows you to view all of the giveaways in the page at a single glance.</li>
        <li>Also adds a button (<i class="fa fa-th-large"></i>) to the main page heading of the same page that allows you to set the size of the space between each box.</li>
      </ul>
    `,
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
      this.esgst.giveawayFeatures.push(this.gv_setContainer);
      this.esgst.style.insertAdjacentText("beforeend", `
        .esgst-gv-creator {
          margin: ${this.esgst.ib ? 10 : 5}px 5px 5px;
          width: ${this.esgst.ib ? 127 : 132}px;
        }

        .esgst-gv-popout .giveaway__links {
          display: block;
          height: auto;
          margin: 5px 5px ${this.esgst.ib ? 10 : 5}px;
          text-align: center;
          width: ${this.esgst.ib ? 127 : 132}px;
        }
      `);
      if (this.esgst.giveawaysPath) {
        let button, display, element, elements, i, n, popout, spacing, slider;
        button = createHeadingButton({id: `gv`, icons: [`fa-th-large`], title: `Set Grid View spacing`});
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
        $(slider).slider({
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
      let popup = giveaway.outerWrap.closest(`.esgst-popup-scrollable`) || this.esgst.menuPath;
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
            text: getRemainingTime(giveaway.endTime),
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
            text: getRemainingTime(giveaway.startTime),
            type: `span`
          }]
        }]
      }]);
      giveaway.endTimeColumn_gv = giveaway.gvIcons.firstElementChild.firstElementChild;
      if (!this.esgst.lockGiveawayColumns) {
        giveaway.gvIcons.addEventListener(`dragenter`, draggable_enter.bind(null, {
          context: giveaway.gvIcons,
          item: giveaway
        }));
      }
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
      giveaway.summary.insertBefore(giveaway.avatar, giveaway.links);
      createElements(giveaway.avatar, `afterEnd`, [{
        attributes: {
          style: `clear: both;`
        },
        type: `div`
      }]);
      createElements(giveaway.headingName, `afterEnd`, [{
        type: `br`
      }]);
      createElements(giveaway.pointsContainer, `afterEnd`, [{
        type: `br`
      }]);
      giveaway.endTimeColumn.classList.add(`esgst-hidden`);
      giveaway.startTimeColumn.classList.add(`esgst-hidden`);
      giveaway.entriesLink.lastElementChild.textContent = giveaway.entriesLink.textContent.replace(/[^\d,]+/g, ``);
      giveaway.commentsLink.lastElementChild.textContent = giveaway.commentsLink.textContent.replace(/[^\d,]+/g, ``);
      let creator = createElements(giveaway.links, `beforeBegin`, [{
        attributes: {
          class: `esgst-gv-creator`
        },
        type: `div`,
        children: [{
          text: `by `,
          type: `span`
        }]
      }]);
      creator.appendChild(giveaway.creatorContainer);
      new Popout(``, giveaway.outerWrap, 100, false, giveaway.summary);
    });
  }
}

export default GiveawaysGridView;