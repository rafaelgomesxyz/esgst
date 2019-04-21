import dateFns_format from 'date-fns/format';
import 'jquery-ui/ui/widgets/progressbar';
import { ButtonSet } from '../../class/ButtonSet';
import { Module } from '../../class/Module';
import { Popup } from '../../class/Popup';
import { ToggleSwitch } from '../../class/ToggleSwitch';
import { utils } from '../../lib/jsUtils';
import { common } from '../Common';
import { shared } from '../../class/Shared';
import { gSettings } from '../../class/Globals';

const
  parseHtml = utils.parseHtml.bind(utils),
  buildGiveaway = common.buildGiveaway.bind(common),
  copyValue = common.copyValue.bind(common),
  createAlert = common.createAlert.bind(common),
  createElements = common.createElements.bind(common),
  createTooltip = common.createTooltip.bind(common),
  delLocalValue = common.delLocalValue.bind(common),
  downloadFile = common.downloadFile.bind(common),
  getFeatureNumber = common.getFeatureNumber.bind(common),
  getFeatureTooltip = common.getFeatureTooltip.bind(common),
  getLocalValue = common.getLocalValue.bind(common),
  getUser = common.getUser.bind(common),
  lockAndSaveGiveaways = common.lockAndSaveGiveaways.bind(common),
  parseMarkdown = common.parseMarkdown.bind(common),
  request = common.request.bind(common),
  saveUser = common.saveUser.bind(common),
  setCountdown = common.setCountdown.bind(common),
  setLocalValue = common.setLocalValue.bind(common)
  ;

class GiveawaysMultipleGiveawayCreator extends Module {
  constructor() {
    super();
    this.info = {
      description: [
        [`ul`, [
          [`li`, [
            `Adds a section 0 to the `,
            [`a`, { href: `https://www.steamgifts.com/giveaways/new` }, `new giveaway`],
            ` page that allows you to create multiple giveaways at once.`
          ]],
          [`li`, `There is also a special tool to create a train (multiple giveaways linked to each other), which has the option to automatically create a discussion for the train.`],
          [`li`, [
            `The icon `,
            [`i`, { class: `fa fa-question-circle` }],
            `  next to "Create Multiple Giveaways" in the section contains all of the steps that you have to follow to use the feature correctly.`
          ]],
          [`li`, `When you add a giveaway to the queue, a small numbered box appears at the panel below the buttons to represent that giveaway. If you hover over the box it shows the details of the giveaway.`],
          [`li`, `You can re-order/remove a giveaway by dragging and dropping the box.`],
          [`li`, `The giveaways will be created without reviewing or validating, so make sure that all of the fields were filled correctly or the creation will fail (if a train is being created, the failed giveaway will be disconnected and the previous giveaway will be connected to the next one instead).`]
        ]]
      ],
      id: `mgc`,
      name: `Multiple Giveaway Creator`,
      sg: true,
      type: `giveaways`
    };
  }

  async init() {
    if (this.esgst.newGiveawayPath) {
      this.mgc_addSection();
    }
    if (this.esgst.newDiscussionPath) {
      if ((getLocalValue(`mgcAttach_step1`) || getLocalValue(`mgcAttach_step2`))) {
        delLocalValue(`mgcAttach_step1`);
        delLocalValue(`mgcAttach_step2`);
        this.mgc_addCreateAndAttachButton();
      }
    } else if (this.esgst.editDiscussionPath) {
      if (getLocalValue(`mgcAttach_step4`)) {
        this.mgc_editDiscussion();
      }
    } else if (this.esgst.discussionPath) {
      if (getLocalValue(`mgcAttach_step2`)) {
        delLocalValue(`mgcAttach_step2`);
        setLocalValue(`mgcAttach_step3`, window.location.pathname.match(/\/discussion\/(.+?)\//)[1]);
        await request({
          data: `xsrf_token=${this.esgst.xsrfToken}&do=close_discussion`,
          method: `POST`,
          url: shared.esgst.locationHref
        });
        window.close();
      } else if (getLocalValue(`mgcAttach_step4`)) {
        document.querySelector(`form[action="/discussions/edit"]`).submit();
      } else if (getLocalValue(`mgcAttach_step5`)) {
        delLocalValue(`mgcAttach_step5`);
        await request({
          data: `xsrf_token=${this.esgst.xsrfToken}&do=reopen_discussion`,
          method: `POST`,
          url: shared.esgst.locationHref
        });
        setLocalValue(`mgcAttach_step6`, true);
        window.location.reload();
      } else if (getLocalValue(`mgcAttach_step6`)) {
        delLocalValue(`mgcAttach_step6`);
        new Popup({
          addScrollable: true,
          icon: `fa-check`,
          isTemp: true,
          title: `Train created with success! You can close this now.`
        }).open();
      }
    }
  }

  mgc_addSection() {
    let addButton, attachButton, createButton, createTrainDescription, createTrainOption, detach, emptyButton,
      exportButton, importButton, mgc, removeIcon, rows, section, shuffleButton, viewButton;
    rows = document.getElementsByClassName(`form__rows`)[0];
    if (rows) {
      mgc = {
        countries: document.querySelector(`[name="country_item_string"]`),
        gameId: document.querySelector(`[name="game_id"]`),
        gameType: document.querySelector(`[name="type"]`),
        copies: document.querySelector(`[name="copies"]`),
        keys: document.querySelector(`[name="key_string"]`),
        startTime: document.querySelector(`[name="start_time"]`),
        endTime: document.querySelector(`[name="end_time"]`),
        region: document.querySelector(`[name="region_restricted"]`),
        whoCanEnter: document.querySelector(`[name="who_can_enter"]`),
        whitelist: document.querySelector(`.form__row--who-can-enter [name="whitelist"]`),
        groups: document.querySelector(`[name="group_item_string"]`),
        level: document.querySelector(`[name="contributor_level"]`),
        description: document.querySelector(`[name="description"]`),
        timezone: new Date().getTimezoneOffset(),
        datas: [],
        values: [],
        created: [],
        countryNames: {},
        groupNames: {},
        gameName: undefined,
        editButton: undefined,
        discussionPanel: undefined,
        discussionLink: undefined,
        giveaways: undefined
      };
      let elements = document.querySelector(`[data-input="country_item_string"]`).querySelectorAll(`[data-item-id]`);
      for (let i = 0, n = elements.length; i < n; i++) {
        let element = elements[i];
        mgc.countryNames[element.getAttribute(`data-item-id`)] = element.getAttribute(`data-name`);
      }
      elements = document.querySelector(`[data-input="group_item_string"]`).querySelectorAll(`[data-item-id]`);
      for (let i = 0, n = elements.length; i < n; i++) {
        let element = elements[i];
        mgc.groupNames[element.getAttribute(`data-item-id`)] = element.getAttribute(`data-name`);
      }
      mgc.gameName = mgc.gameId.nextElementSibling;
      let context = createElements(rows, `afterBegin`, [{
        attributes: {
          class: `esgst-form-row`,
          title: getFeatureTooltip(`mgc`)
        },
        type: `div`,
        children: [{
          attributes: {
            class: `esgst-form-heading`
          },
          type: `div`,
          children: [{
            attributes: {
              class: `esgst-form-heading-number`
            },
            text: `0.`,
            type: `div`
          }, {
            attributes: {
              class: `esgst-form-heading-text`
            },
            type: `div`,
            children: [{
              text: `Create Multiple Giveaways `,
              type: `node`
            }, {
              attributes: {
                class: `fa fa-question-circle esgst-clickable`
              },
              type: `i`
            }]
          }]
        }, {
          attributes: {
            class: `esgst-gm-section esgst-form-row-indent`
          },
          type: `div`,
          children: [{
            type: `div`,
            children: [{
              type: `div`
            }, {
              attributes: {
                class: `esgst-hidden`
              },
              type: `div`,
              children: [{
                type: `div`
              }]
            }]
          }]
        }]
      }]);
      section = context.lastElementChild;
      createTooltip(context.firstElementChild.lastElementChild.lastElementChild, `
        <div class="esgst-bold">How To Use</div>
        <ol>
          <li>If you want to create a train, enable 'Create train', otherwise go to step 3.</li>
          <li>If you want to attach a discussion to the train, click 'Attach' and follow the steps.</li>
          <li>Fill the details of the giveaway (you can use Giveaway Templates for this).</li>
          <li>If you are creating a train, you must generate next/previous links by clicking 'Generate' and following the steps, otherwise go to the next step.</li>
          <li>If you want to add a counter to the giveaways, click 'Generate' and follow the steps.</li>
          <li>You can either add each giveaway at a time, by typing the game name, filling the copies/keys fields and clicking 'Add', or all giveaways at the same time, by clicking 'Import' and following the steps.</li>
          <li>If you want to play with the order of the giveaways you can use 'Shuffle' to change their order.</li>
          <li>When you have added all the giveaways and are ready to create them, click 'Create' and wait until the process is done.</li>
        </ol>
        <div>You can add certain variables to the description of the giveaways (before clicking 'Add') that will be replaced with certain details for each giveaway:</div>
        <ul>
          <li>[esgst-level] - The level of the giveaway.</li>
          <li>[esgst-name] - The name of the game being given away.</li>
          <li>[esgst-steam-id] - The Steam app/sub id of the game being given away.</li>
          <li>[esgst-steam-type] - The Steam type of the game being given away ("app" or "sub").</li>
          <li>[esgst-steam-url] - The Steam store URL of the game being given away (https://store.steampowered.com/type/id).</li>
        </ul>
      `);
      createTrainOption = section.firstElementChild;
      createTrainDescription = createTrainOption.lastElementChild;
      if (gSettings.mgc_createTrain) {
        createTrainDescription.classList.remove(`esgst-hidden`);
      }
      this.esgst.mgc_createTrainSwitch = new ToggleSwitch(createTrainOption.firstElementChild, `mgc_createTrain`, false, `Create train.`, false, false, null, gSettings.mgc_createTrain);
      this.esgst.mgc_createTrainSwitch.dependencies.push(createTrainDescription);
      this.esgst.mgc_removeLinksSwitch = new ToggleSwitch(createTrainDescription.firstElementChild, `mgc_removeLinks`, false, `Remove previous/next links from the first/last wagons.`, false, false, `Disabling this keeps the links as plain text.`, gSettings.mgc_removeLinks);
      let generateButton = new ButtonSet({
        color1: `green`,
        color2: `grey`,
        icon1: `fa-gear`,
        icon2: `fa-circle-o-notch fa-spin`,
        title1: `Generate`,
        title2: `Generating...`,
        callback1: this.mgc_generateFormat
      });
      mgc.editButton = new ButtonSet({
        color1: `green`,
        color2: `grey`,
        icon1: `fa-edit`,
        icon2: `fa-circle-o-notch fa-spin`,
        title1: `Edit`,
        title2: `Editing...`,
        callback1: this.mgc_getValues.bind(this, true, mgc)
      });
      mgc.editButton.set.classList.add(`esgst-hidden`);
      addButton = new ButtonSet({
        color1: `green`,
        color2: `grey`,
        icon1: `fa-plus-circle`,
        icon2: `fa-circle-o-notch fa-spin`,
        title1: `Add`,
        title2: `Adding...`,
        callback1: this.mgc_getValues.bind(this, false, mgc)
      });
      importButton = new ButtonSet({
        color1: `green`,
        color2: `grey`,
        icon1: `fa-arrow-circle-up`,
        icon2: `fa-circle-o-notch fa-spin`,
        title1: `Import`,
        title2: `Importing...`,
        callback1: this.mgc_importGiveaways.bind(this, mgc)
      });
      exportButton = new ButtonSet({
        color1: `green`,
        color2: `grey`,
        icon1: `fa-arrow-circle-down`,
        icon2: `fa-circle-o-notch fa-spin`,
        title1: `Export`,
        title2: `Exporting...`,
        callback1: this.mgc_exportGiveaways.bind(this, mgc)
      });
      shuffleButton = new ButtonSet({
        color1: `green`,
        color2: `grey`,
        icon1: `fa-random`,
        icon2: `fa-circle-o-notch fa-spin`,
        title1: `Shuffle`,
        title2: `Shuffling...`,
        callback1: this.mgc_shuffleGiveaways.bind(this, mgc)
      });
      emptyButton = new ButtonSet({
        color1: `green`,
        color2: `grey`,
        icon1: `fa-trash`,
        icon2: `fa-circle-o-notch fa-spin`,
        title1: `Empty`,
        title2: `Emptying...`,
        callback1: this.mgc_emptyGiveaways.bind(this, mgc)
      });
      attachButton = new ButtonSet({
        color1: `green`,
        color2: `grey`,
        icon1: `fa-paperclip`,
        icon2: `fa-circle-o-notch fa-spin`,
        title1: `Attach`,
        title2: `Attaching...`,
        callback1: this.mgc_attachDiscussion.bind(this, mgc)
      });
      this.esgst.mgc_createTrainSwitch.dependencies.push(attachButton.set);
      if (!gSettings.mgc_createTrain) {
        attachButton.set.classList.add(`esgst-hidden`);
      }
      viewButton = new ButtonSet({
        color1: `green`,
        color2: `grey`,
        icon1: `fa-eye`,
        icon2: `fa-circle-o-notch fa-spin`,
        title1: `View Results`,
        title2: `Opening...`,
        callback1: this.mgc_viewResults.bind(this, mgc)
      });
      createButton = new ButtonSet({
        color1: `green`,
        color2: `grey`,
        icon1: `fa-arrow-circle-right`,
        icon2: `fa-circle-o-notch fa-spin`,
        title1: `Create`,
        title2: `Creating...`,
        callback1: () => {
          return new Promise(resolve => this.mgc_createGiveaways(mgc, viewButton, resolve));
        }
      });
      viewButton.set.classList.add(`esgst-hidden`);
      section.appendChild(generateButton.set);
      section.appendChild(mgc.editButton.set);
      section.appendChild(addButton.set);
      section.appendChild(importButton.set);
      section.appendChild(exportButton.set);
      section.appendChild(shuffleButton.set);
      section.appendChild(emptyButton.set);
      section.appendChild(attachButton.set);
      section.appendChild(createButton.set);
      section.appendChild(viewButton.set);
      mgc.discussionPanel = createElements(section, `beforeEnd`, [{
        attributes: {
          class: `esgst-hidden`
        },
        type: `div`,
        children: [{
          attributes: {
            class: `esgst-bold`
          },
          text: `Discussion Attached:`,
          type: `span`
        }, {
          type: `a`
        }, {
          attributes: {
            class: `esgst-clickable fa fa-times`,
            title: `Detach discussion`
          },
          type: `i`
        }]
      }]);
      detach = mgc.discussionPanel.lastElementChild;
      detach.addEventListener(`click`, this.mgc_detachDiscussion.bind(this, mgc));
      mgc.discussionLink = detach.previousElementSibling;
      new ToggleSwitch(mgc.discussionPanel, `mgc_bumpLast`, false, `Only insert the bump link in the last wagon.`, false, false, `If disabled, the bump link will appear on all wagons.`, gSettings.mgc_bumpLast);
      mgc.giveaways = createElements(section, `beforeEnd`, [{
        attributes: {
          class: `pinned-giveaways__outer-wrap`
        },
        type: `div`,
        children: [{
          attributes: {
            class: `pinned-giveaways__inner-wrap`
          },
          type: `div`
        }, {
          attributes: {
            class: `fa fa-trash`,
            title: `Drag a giveaway here to remove it`
          },
          type: `i`
        }, {
          attributes: {
            class: `esgst-description`
          },
          text: `To edit a giveaway, click on it and a "Edit" button will appear. Then make your alterations and click "Edit".`,
          type: `div`
        }, {
          attributes: {
            class: `esgst-description`
          },
          text: `Giveaways successfully created will turn green, giveaways successfully connected will be strikethrough (for train creations) and giveaways that were not successfully created will turn red.`,
          type: `div`
        }]
      }]).firstElementChild;
      removeIcon = mgc.giveaways.nextElementSibling;
      removeIcon.addEventListener(`dragenter`, this.mgc_removeGiveaway.bind(this, mgc));
      JSON.parse(getLocalValue(`mgcCache`, `[]`)).forEach(values => {
        this.mgc_addGiveaway(false, mgc, values);
      });
    }
  }

  mgc_generateFormat() {
    let popup = new Popup({ addScrollable: true, icon: `fa-gear`, title: `Generate formats:` });
    createElements(popup.description, `afterBegin`, [{
      attributes: {
        class: `esgst-description`
      },
      type: `div`,
      children: [{
        text: `1. Generate the format you want by editing the input fields (the text outside of the blue box is what the result will look like).`,
        type: `p`
      }, {
        type: `br`
      }, {
        text: `2. Copy the text inside of the blue box (you can use the copy icon for that).`,
        type: `p`
      }, {
        type: `br`
      }, {
        text: `3. Paste it in the giveaway description (section 8 in this page), wherever you want it to appear.`,
        type: `p`
      }]
    }]);
    let inputs = {};
    createElements(popup.scrollable, `beforeEnd`, [{
      attributes: {
        class: `esgst-bold`
      },
      text: `Next/previous links`,
      type: `div`
    }]);
    inputs.previousPrefix = createElements(popup.scrollable, `beforeEnd`, [{
      attributes: {
        class: `esgst-mgc-input`,
        placeholder: `← `,
        type: `text`
      },
      type: `input`
    }]);
    inputs.previous = createElements(popup.scrollable, `beforeEnd`, [{
      attributes: {
        class: `esgst-mgc-input`,
        placeholder: `Previous`,
        type: `text`
      },
      type: `input`
    }]);
    inputs.previousSuffix = createElements(popup.scrollable, `beforeEnd`, [{
      attributes: {
        class: `esgst-mgc-input`,
        placeholder: ` ←`,
        type: `text`
      },
      type: `input`
    }]);
    inputs.separator = createElements(popup.scrollable, `beforeEnd`, [{
      attributes: {
        class: `esgst-mgc-input`,
        placeholder: ` | `,
        type: `text`
      },
      type: `input`
    }]);
    inputs.nextPrefix = createElements(popup.scrollable, `beforeEnd`, [{
      attributes: {
        class: `esgst-mgc-input`,
        placeholder: `→ `,
        type: `text`
      },
      type: `input`
    }]);
    inputs.next = createElements(popup.scrollable, `beforeEnd`, [{
      attributes: {
        class: `esgst-mgc-input`,
        placeholder: `Next`,
        type: `text`
      },
      type: `input`
    }]);
    inputs.nextSuffix = createElements(popup.scrollable, `beforeEnd`, [{
      attributes: {
        class: `esgst-mgc-input`,
        placeholder: ` →`,
        type: `text`
      },
      type: `input`
    }]);
    let output = createElements(popup.scrollable, `beforeEnd`, [{
      attributes: {
        class: `esgst-mgc-preview esgst-text-left markdown`
      },
      type: `div`,
      children: [{
        type: `div`,
        children: [{
          type: `p`,
          children: [{
            text: `← `,
            type: `node`
          }, {
            attributes: {
              href: `#`
            },
            text: `Previous`,
            type: `a`
          }, {
            text: ` ← | → `,
            type: `node`
          }, {
            attributes: {
              href: `#`
            },
            text: `Next`,
            type: `a`
          }, {
            text: ` →`,
            type: `node`
          }]
        }]
      }, {
        type: `br`
      }, {
        type: `pre`,
        children: [{
          text: `[ESGST-P]← [P]Previous[/P] ←[/ESGST-P] | [ESGST-N]→ [N]Next[/N] →[/ESGST-N]`,
          type: `code`
        }]
      }, {
        attributes: {
          class: `esgst-clickable fa fa-copy`
        },
        type: `i`
      }]
    }]);
    let outputPreview = output.firstElementChild;
    let outputCopy = output.lastElementChild;
    let outputCode = outputCopy.previousElementSibling.firstElementChild;
    outputCopy.addEventListener(`click`, () => {
      copyValue(outputCopy, outputCode.textContent);
    });
    createElements(popup.scrollable, `beforeEnd`, [{
      attributes: {
        class: `esgst-bold`
      },
      text: `Counter`,
      type: `div`
    }]);
    inputs.counter = createElements(popup.scrollable, `beforeEnd`, [{
      attributes: {
        class: `esgst-mgc-input`,
        placeholder: ` of `,
        type: `text`
      },
      type: `input`
    }]);
    let counterOutput = createElements(popup.scrollable, `beforeEnd`, [{
      attributes: {
        class: `esgst-mgc-preview esgst-text-left markdown`
      },
      type: `div`,
      children: [{
        type: `div`,
        children: [{
          text: `1 of 10`,
          type: `p`
        }]
      }, {
        type: `br`
      }, {
        type: `pre`,
        children: [{
          text: `[ESGST-C] of [/ESGST-C]`,
          type: `code`
        }]
      }, {
        attributes: {
          class: `esgst-clickable fa fa-copy`
        },
        type: `i`
      }]
    }]);
    let counterOutputPreview = counterOutput.firstElementChild;
    let counterOutputCopy = counterOutput.lastElementChild;
    let counterOutputCode = counterOutputCopy.previousElementSibling.firstElementChild;
    counterOutputCopy.addEventListener(`click`, () => {
      copyValue(counterOutputCopy, counterOutputCode.textContent);
    });
    createElements(popup.scrollable, `beforeEnd`, [{
      attributes: {
        class: `esgst-bold`
      },
      text: `Bump link (for attached discussions)`,
      type: `div`
    }]);
    inputs.bump = createElements(popup.scrollable, `beforeEnd`, [{
      attributes: {
        class: `esgst-mgc-input`,
        placeholder: `Bump`,
        type: `text`
      },
      type: `input`
    }]);
    let bumpOutput = createElements(popup.scrollable, `beforeEnd`, [{
      attributes: {
        class: `esgst-mgc-preview esgst-text-left markdown`
      },
      type: `div`,
      children: [{
        type: `div`,
        children: [{
          type: `p`,
          children: [{
            attributes: {
              href: `#`
            },
            text: `Bump`,
            type: `a`
          }]
        }]
      }, {
        type: `br`
      }, {
        type: `pre`,
        children: [{
          text: `[ESGST-B]Bump[/ESGST-B]`,
          type: `code`
        }]
      }, {
        attributes: {
          class: `esgst-clickable fa fa-copy`
        },
        type: `i`
      }]
    }]);
    let bumpOutputPreview = bumpOutput.firstElementChild;
    let bumpOutputCopy = bumpOutput.lastElementChild;
    let bumpOutputCode = bumpOutputCopy.previousElementSibling.firstElementChild;
    createElements(popup.scrollable, `beforeEnd`, [{
      attributes: {
        class: `esgst-bold`
      },
      text: `First train wagon link (for attached discussions)`,
      type: `div`
    }]);
    inputs.train = createElements(popup.scrollable, `beforeEnd`, [{
      attributes: {
        class: `esgst-mgc-input`,
        placeholder: `Choo choo!`,
        type: `text`
      },
      type: `input`
    }]);
    let trainOutput = createElements(popup.scrollable, `beforeEnd`, [{
      attributes: {
        class: `esgst-mgc-preview esgst-text-left markdown`
      },
      type: `div`,
      children: [{
        type: `div`,
        children: [{
          type: `p`,
          children: [{
            attributes: {
              href: `#`
            },
            text: `Choo choo!`,
            type: `a`
          }]
        }]
      }, {
        type: `br`
      }, {
        type: `pre`,
        children: [{
          text: `[ESGST-T]Choo choo![/ESGST-T]`,
          type: `code`
        }]
      }, {
        attributes: {
          class: `esgst-clickable fa fa-copy`
        },
        type: `i`
      }]
    }]);
    let trainOutputPreview = trainOutput.firstElementChild;
    let trainOutputCopy = trainOutput.lastElementChild;
    let trainOutputCode = trainOutputCopy.previousElementSibling.firstElementChild;
    trainOutputCopy.addEventListener(`click`, () => {
      copyValue(trainOutputCopy, trainOutputCode.textContent);
    });
    for (let key in inputs) {
      if (inputs.hasOwnProperty(key)) {
        let input = inputs[key];
        input.addEventListener(`input`, async () => {
          if (key === `counter`) {
            counterOutputCode.textContent = `[ESGST-C]${input.value}[/ESGST-C]`;
            createElements(counterOutputPreview, `inner`, await parseMarkdown(null, `1${input.value}10`));
          } else if (key === `bump`) {
            bumpOutputCode.textContent = `[ESGST-B]${input.value}[/ESGST-B]`;
            createElements(bumpOutputPreview, `inner`, await parseMarkdown(null, `[${input.value}](#)`));
          } else if (key === `train`) {
            trainOutputCode.textContent = `[ESGST-B]${input.value}[/ESGST-B]`;
            createElements(trainOutputPreview, `inner`, await parseMarkdown(null, `[${input.value}](#)`));
          } else {
            let markdown = ``;
            let text = ``;
            if (inputs.previousPrefix.value || inputs.previousSuffix.value) {
              text += `[ESGST-P]${inputs.previousPrefix.value}[P]${inputs.previous.value}[/P]${inputs.previousSuffix.value}[/ESGST-P]`;
              markdown += `${inputs.previousPrefix.value}[${inputs.previous.value}](#)${inputs.previousSuffix.value}`;
            } else {
              text += `[ESGST-P]${inputs.previous.value}[/ESGST-P]`;
              markdown += `[${inputs.previous.value}](#)`;
            }
            if (inputs.separator.value) {
              text += inputs.separator.value;
              markdown += inputs.separator.value;
            }
            if (inputs.nextPrefix.value || inputs.nextSuffix.value) {
              text += `[ESGST-N]${inputs.nextPrefix.value}[N]${inputs.next.value}[/N]${inputs.nextSuffix.value}[/ESGST-N]`;
              markdown += `${inputs.nextPrefix.value}[${inputs.next.value}](#)${inputs.nextSuffix.value}`;
            } else {
              text += `[ESGST-N]${inputs.next.value}[/ESGST-N]`;
              markdown += `[${inputs.next.value}](#)`;
            }
            outputCode.textContent = text;
            createElements(outputPreview, `inner`, await parseMarkdown(null, markdown));
          }
          input.style.width = `${input.value.length + 75}px`;
        });
      }
    }
    popup.open();
  }

  async mgc_getValues(edit, mgc) {
    let values = {
      gameId: mgc.gameId.value,
      gameType: mgc.gameType.value,
      copies: mgc.copies.value,
      keys: mgc.keys.value
    };
    if (values.gameId && ((values.gameType === `gift` && parseInt(values.copies) > 0) || (values.gameType === `key` && values.keys))) {
      this.esgst.busy = true;
      values.countries = mgc.countries.value.trim();
      values.gameName = mgc.gameName.value;
      values.startTime = mgc.startTime.value;
      values.endTime = mgc.endTime.value;
      values.region = mgc.region.value;
      values.whoCanEnter = mgc.whoCanEnter.value;
      values.whitelist = mgc.whitelist.value;
      values.groups = mgc.groups.value.trim();
      values.level = mgc.level.value;
      values.description = mgc.description.value;
      const context = document.querySelector(`[data-autocomplete-id="${values.gameId}"]`);
      if (context) {
        values.steam = await this.esgst.modules.games.games_getInfo(context);
      }
      if (!values.steam) {
        values.steam = mgc.values[mgc.editPos] && mgc.values[mgc.editPos].steam;
      }
      if ((gSettings.mgc_createTrain && mgc.description.value.match(/\[ESGST-P|\[ESGST-N/)) || !gSettings.mgc_createTrain) {
        if ((mgc.discussion && mgc.description.value.match(/\[ESGST-B]/)) || !mgc.discussion) {
          this.mgc_addGiveaway(edit, mgc, values);
          this.mgc_updateCache(mgc);
          mgc.copies.value = `1`;
          mgc.keys.value = ``;
        } else {
          createAlert(`The bump link format is missing from the description.`);
        }
      } else {
        createAlert(`The next/previous links format is missing from the description.`);
      }
    } else {
      createAlert(`You must first fill the details of the giveaway.`);
    }
  }

  mgc_addGiveaway(edit, mgc, values) {
    let data, details;
    details = `${values.gameName.replace(/"/g, `&quot;`)}\n`;
    if (values.gameType === `gift`) {
      details += `Gift\n${values.copies} Copies\n`;
    } else {
      details += `Keys\n${values.keys}\n`;
    }
    details += `\n${values.startTime} - ${values.endTime}\n`;
    if (values.region === `1`) {
      details += `Region Restricted\n`;
    }
    if (values.whoCanEnter === `everyone`) {
      details += `Public\n`;
    } else if (values.whoCanEnter === `invite_only`) {
      details += `Invite Only\n`;
    } else {
      if (values.whitelist === `1`) {
        details += `Whitelist\n`;
      }
      if (values.groups.trim()) {
        details += `Groups\n`;
      }
    }
    values.description = values.description
      .replace(/\[ESGST-LEVEL]/ig, values.level)
      .replace(/\[ESGST-NAME]/ig, values.gameName)
      .replace(/\[ESGST-STEAM-ID]/ig, values.steam ? values.steam.id : `$0`)
      .replace(/\[ESGST-STEAM-TYPE]/ig, values.steam ? values.steam.type.slice(0, -1) : `$0`)
      .replace(/\[ESGST-STEAM-URL]/ig, values.steam ? `http://store.steampowered.com/${values.steam.type.slice(0, -1)}/${values.steam.id}` : `$0`);
    details += `Level ${values.level}\n\n${values.description}`;
    data = `xsrf_token=${this.esgst.xsrfToken}&next_step=3&game_id=${values.gameId}&type=${values.gameType}&copies=${values.copies}&key_string=${encodeURIComponent(values.keys)}&timezone=${mgc.timezone}&start_time=${encodeURIComponent(values.startTime)}&end_time=${encodeURIComponent(values.endTime)}&region_restricted=${values.region}&country_item_string=${encodeURIComponent(values.countries)}&who_can_enter=${values.whoCanEnter}&whitelist=${values.whitelist}&group_item_string=${encodeURIComponent(values.groups)}&contributor_level=${values.level}&description=${encodeURIComponent(values.description)}`;
    if (edit) {
      mgc.datas[mgc.editPos] = data;
      mgc.values[mgc.editPos] = values;
      mgc.giveaways.children[mgc.editPos].title = details;
      mgc.editButton.set.classList.add(`esgst-hidden`);
    } else {
      mgc.datas.push(data);
      mgc.values.push(values);
      this.mgc_setGiveaway(createElements(mgc.giveaways, `beforeEnd`, [{
        attributes: {
          class: `esgst-gm-giveaway`,
          draggable: true,
          title: details
        },
        text: mgc.datas.length,
        type: `div`
      }]), mgc);
    }
  }

  mgc_setGiveaway(giveaway, mgc) {
    giveaway.addEventListener(`click`, this.mgc_setValues.bind(this, giveaway, mgc));
    giveaway.addEventListener(`dragstart`, this.mgc_setSource.bind(this, giveaway, mgc));
    giveaway.addEventListener(`dragenter`, this.mgc_getSource.bind(this, giveaway, mgc));
  }

  mgc_setValues(giveaway, mgc) {
    let pos, values;
    pos = parseInt(giveaway.textContent) - 1;
    values = mgc.values[pos];
    mgc.countries.value = values.countries;
    mgc.gameId.value = values.gameId;
    mgc.gameType.value = values.gameType;
    mgc.copies.value = values.copies;
    mgc.keys.value = values.keys || ``;
    mgc.gameName.value = values.gameName;
    mgc.startTime.value = values.startTime;
    mgc.endTime.value = values.endTime;
    mgc.region.value = values.region;
    mgc.whoCanEnter.value = values.whoCanEnter;
    mgc.whitelist.value = values.whitelist;
    mgc.groups.value = values.groups;
    mgc.level.value = values.level;
    mgc.description.value = values.description;
    values.edit = true;
    this.esgst.modules.giveawaysGiveawayTemplates.gts_applyTemplate(values);
    mgc.editPos = pos;
    mgc.editButton.set.classList.remove(`esgst-hidden`);
  }

  mgc_setSource(giveaway, mgc, event) {
    mgc.source = giveaway;
    event.dataTransfer.setData(`text/plain`, ``);
  }

  mgc_getSource(giveaway, mgc) {
    let current;
    current = mgc.source;
    do {
      current = current.previousElementSibling;
      if (current && current === giveaway) {
        mgc.giveaways.insertBefore(mgc.source, giveaway);
        this.mgc_updateCache(mgc);
        return;
      }
    } while (current);
    mgc.giveaways.insertBefore(mgc.source, giveaway.nextElementSibling);
    this.mgc_updateCache(mgc);
  }

  mgc_importGiveaways(mgc) {
    let counter, popup, progress, progressPanel, textArea;
    popup = new Popup({ addScrollable: true, icon: `fa-arrow-up`, isTemp: true, title: `Import Giveaways` });
    popup.popup.classList.add(`esgst-popup-large`);
    createElements(popup.description, `afterBegin`, [{
      attributes: {
        class: `esgst-description`
      },
      type: `div`,
      children: [{
        text: `Insert the keys below. `,
        type: `node`
      }, {
        attributes: {
          class: `fa fa-question-circle`
        },
        type: `i`
      }]
    }]);
    createTooltip(popup.description.firstElementChild.lastElementChild, `
      <div>Before importing, make sure you have filled the details of the giveaway (start/end times, regions, who can enter, whitelist, groups, level and description) or applied a template (with ${getFeatureNumber(`gts`).number} Giveaway Templates). You can also specify separate details for each giveaway using the parameters below:</div>
      <ul>
        <li><span class="esgst-bold">[countries="..."]</span> (Replace the 3 dots with the ids of the countries that the giveaway must be restricted to, separated by a comma followed by a space. The ids must be exactly how they appear in the country selection list. For example, "BR, US". If you do not want the giveaway to be region restricted, use the id "*", for example, [countries="*"].)</li>
        <li><span class="esgst-bold">[startTime="..."]</span> (Replace the 3 dots with the date that the giveaway must start, in the format "Mon D, YYYY H:MM xm". For example, "Jan 15, 2018 12:00 am". For the names of the months, use "Jan", "Feb", "Mar", "Apr", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov" and "Dec". For single-digit days/hours, do not put a 0 at the beginning. For example, use "Jan 1" instead of "Jan 01" and "9:00 am" instead of "09:00 am".)</li>
        <li><span class="esgst-bold">[endTime="..."]</span> (Replace the 3 dots with the date that the giveaway must end, in the same format as the start time.)</li>
        <li><span class="esgst-bold">[whoCanEnter="..."]</span> (Replace the 3 dots with either: "everyone", if the giveaway must be public; "invite_only", if the giveaway must be private; or "groups", if the giveaway must be restricted to groups/whitelist.)</li>
        <li><span class="esgst-bold">[groups="..."]</span> (Replace the 3 dots with the names of the groups that the giveaway must be restricted to, separated by a comma followed by a space. The names must be exactly how they appear on the group selection list. Use "My Whitelist" to include your whitelist in the groups. For example, "My Whitelist, Playing Appreciated, S.Gifts" or "My Whitelist".)</li>
        <li><span class="esgst-bold">[level="..."]</span> (Replace the 3 dots with the level that the giveaway must be restricted to. For example, "5".)</li>
        <li><span class="esgst-bold">[description="..."]</span> (Replace the 3 dots with the description that the giveaway must have. Use "\\n" to represent a new line. You can use all of the variables explained in the "How To Use" tooltip from section 0 here. For example, "The winner will be added on Steam for the delivery.\\n\\nPlease be patient.".)</li>
      </ul>
      <div>Put each giveaway in a separate line, using one of the formats below:</div>
      <ul>
        <li>Gift giveaways for 1 copy.</li>
        <ul>
          <li><span class="esgst-bold">Game Name</span></li>
          <li><span class="esgst-bold">Game Name https://store.steampowered.com/xxx/XXXXX</span></li>
          <li><span class="esgst-bold">https://store.steampowered.com/xxx/XXXXX</span></li>
        </ul>
        <li>Gift giveaways for more than 1 copy. Replace the X with the number of copies.</li>
        <ul>
          <li><span class="esgst-bold">Game Name (X Copies)</span></li>
          <li><span class="esgst-bold">Game Name https://store.steampowered.com/xxx/XXXXX (X Copies)</span></li>
          <li><span class="esgst-bold">https://store.steampowered.com/xxx/XXXXX (X Copies)</span></li>
        </ul>
        <li>Key giveaways. Gift links are also acceptable, so instead of "XXXXX-XXXXX-XXXXX" you can have "https://www.humblebundle.com/?gift=XxXXxxXXxXxxxXxx". For a link to be recognized it must start with either "http" or "https".</li>
        <ul>
          <li><span class="esgst-bold">Game Name XXXXX-XXXXX-XXXXX</span></li>
          <li><span class="esgst-bold">Game Name https://store.steampowered.com/xxx/XXXXX XXXXX-XXXXX-XXXXX</span></li>
          <li><span class="esgst-bold">https://store.steampowered.com/xxx/XXXXX XXXXX-XXXXX-XXXXX</span></li>
          <li><span class="esgst-bold">XXXXX-XXXXX-XXXXX Game Name</span></li>
          <li><span class="esgst-bold">XXXXX-XXXXX-XXXXX Game Name https://store.steampowered.com/xxx/XXXXX</span></li>
          <li><span class="esgst-bold">XXXXX-XXXXX-XXXXX https://store.steampowered.com/xxx/XXXXX</span></li>
        </ul>
      </ul>
      <div>By using the format that includes the link to the Steam store page of the game (https://store.steampowered.com/xxx/XXXXX), you make sure that if there are multiple games with the same name there will be a 100% match. If you do not use that format and there are multiple games with the same name, a popup will appear for you to decide which game should be used.</div>
      <br>
      <div>Here's an example:</div>
      <br>
      <div class="esgst-bold">Portal</div>
      <div class="esgst-bold">Portal XXXXX-XXXXX-XXXXX</div>
      <div class="esgst-bold">YYYYY-YYYYY-YYYYY Portal</div>
      <div class="esgst-bold">Portal https://store.steampowered.com/app/400 (2 Copies)</div>
      <div class="esgst-bold">https://store.steampowered.com/app/400 ZZZZZ-ZZZZZ-ZZZZZ</div>
      <br>
      <div>This example will create the 5 following giveaways if the options "Group adjacent keys for the same game." and "Group all keys for the same game." are disabled:</div>
      <br>
      <div>1 Portal giveaway for 1 gift copy.</div>
      <div>1 Portal giveaway for 1 key (XXXXX-XXXXX-XXXXX).</div>
      <div>1 Portal giveaway for 1 key (YYYYY-YYYYY-YYYYY).</div>
      <div>1 Portal giveaway for 2 gift copies.</div>
      <div>1 Portal giveaway for 1 key (ZZZZZ-ZZZZZ-ZZZZZ).</div>
      <br>
      <div>If the option "Group adjacent keys for the same game." is enabled, however, only 4 giveaways will be created, because the keys in the 2nd and 3rd giveaways are for the same game (Portal) and are adjacent (next to each other), so they will be grouped together in the same giveaway. Note that the key in the 5th giveaway is not adjacent, because the 4th giveaway is separating it from the others. So with this option enabled the 4 following giveaways will be created:</div>
      <br>
      <div>1 Portal giveaway for 1 gift copy.</div>
      <div>1 Portal giveaway for 2 keys (XXXXX-XXXXX-XXXXX and YYYYY-YYYYY-YYYYY).</div>
      <div>1 Portal giveaway for 2 gift copies.</div>
      <div>1 Portal giveaway for 1 key (ZZZZZ-ZZZZZ-ZZZZZ).</div>
      <br>
      <div>But if the option "Group all keys for the same game." is enabled, then only 3 giveaways will be created, because every single key found for the same game will be grouped together in a single giveaway, regardless of whether or not they are next to each other. So with this option enabled the 3 following giveaways will be created:</div>
      <br>
      <div>1 Portal giveaway for 1 gift copy.</div>
      <div>1 Portal giveaway for 3 keys (XXXXX-XXXXX-XXXXX, YYYYY-YYYYY-YYYYY and ZZZZZ-ZZZZZ-ZZZZZ).</div>
      <div>1 Portal giveaway for 2 gift copies.</div>
      <br>
      <div>And here's an example using separate details for each giveaway:</div>
      <br>
      <div class="esgst-bold">Portal [countries="BR, US"] [level="5"]</div>
      <div class="esgst-bold">Portal XXXXX-XXXXX-XXXXX [whoCanEnter="groups"] [groups="Playing Appreciated"]</div>
      <div class="esgst-bold">YYYYY-YYYYY-YYYYY Portal [whoCanEnter="groups"] [groups="My Whitelist"]</div>
      <div class="esgst-bold">Portal (2 Copies) [startTime="Apr 1, 2018 9:00 am"] [endTime="Apr 11, 2018 15:00 pm"] [whoCanEnter="invite_only"]</div>
      <div class="esgst-bold">Portal ZZZZZ-ZZZZZ-ZZZZZ [level="8"] [description="Appreciation for high level users.\\n\\nEnjoy!"]</div>
      <br>
      <div>Note that any missing parameters will be copied from the details that you have filled for the giveaway in the SteamGifts page. So, for example, if you have selected Everyone for Who Can Enter, the 1st and 5th giveaways will be public, because [whoCanEnter="..."] was not specified for them, so that detail will be copied over from the SteamGifts page.</div>
      <br>
      <div>Imported giveaways will not be automatically created, you still have to review them by clicking on the 'Create' button.</div>
      <br>
    `);
    let groupKeys = new ToggleSwitch(popup.description, `mgc_groupKeys`, false, `Group adjacent keys for the same game.`, false, false, ``, gSettings.mgc_groupKeys);
    let groupAllKeys = new ToggleSwitch(popup.description, `mgc_groupAllKeys`, false, `Group all keys for the same game.`, false, false, ``, gSettings.mgc_groupAllKeys);
    groupKeys.exclusions.push(groupAllKeys.container);
    groupAllKeys.exclusions.push(groupKeys.container);
    if (gSettings.mgc_groupKeys) {
      groupAllKeys.container.classList.add(`esgst-hidden`);
    } else if (gSettings.mgc_groupAllKeys) {
      groupKeys.container.classList.add(`esgst-hidden`);
    }
    textArea = createElements(popup.scrollable, `beforeEnd`, [{
      type: `textarea`
    }]);
    progressPanel = createElements(popup.description, `beforeEnd`, [{
      type: `div`,
      children: [{
        attributes: {
          class: `esgst-progress-bar`
        },
        type: `div`
      }, {
        type: `div`,
        children: [{
          text: `0`,
          type: `span`
        }, {
          text: ` of `,
          type: `node`
        }, {
          text: `0`,
          type: `span`
        }, {
          text: ` giveaways imported.`,
          type: `node`
        }]
      }]
    }]);
    progress = {
      bar: progressPanel.firstElementChild,
      current: undefined,
      total: undefined
    };
    counter = progressPanel.lastElementChild;
    progress.current = counter.firstElementChild;
    progress.total = progress.current.nextElementSibling;
    popup.description.appendChild(new ButtonSet({
      color1: `green`,
      color2: `grey`,
      icon1: `fa-arrow-circle-up`,
      icon2: `fa-circle-o-notch fa-spin`,
      title1: `Import`,
      title2: `Importing...`,
      callback1: () => {
        return new Promise(resolve => this.mgc_getGiveaways(mgc, popup, progress, textArea, resolve));
      }
    }).set);
    popup.open(this.mgc_focusTextArea.bind(this, textArea));
    textArea.style.height = `${window.innerHeight * 0.9 - (popup.popup.offsetHeight - popup.scrollable.offsetHeight) - 25}px`;
    textArea.style.overflow = `auto`;
    textArea.addEventListener(`paste`, this.mgc_resizeTextArea.bind(this, popup, textArea));
  }

  mgc_resizeTextArea(popup, textArea) {
    let interval, value;
    value = textArea.value;
    interval = window.setInterval(() => {
      if (value !== textArea.value) {
        window.clearInterval(interval);
        textArea.style.height = `${window.innerHeight * 0.9 - (popup.popup.offsetHeight - popup.scrollable.offsetHeight) - 25}px`;
        textArea.style.overflow = `auto`;
      }
    }, 250);
  }

  mgc_getGiveaways(mgc, popup, progress, textArea, callback) {
    let giveaways, lines, max, n, value;
    this.esgst.busy = true;
    giveaways = [];
    lines = textArea.value.trim().split(/\n/);
    for (let i = 0, n = lines.length; i < n; ++i) {
      const line = lines[i].trim();
      if (line) {
        giveaways.push(line);
      }
    }
    textArea.value = `${giveaways.join(`\n`)}\n`;
    n = giveaways.length;
    if (window.$(progress.bar).progressbar(`instance`)) {
      max = window.$(progress.bar).progressbar(`option`, `max`);
      value = window.$(progress.bar).progressbar(`option`, `value`);
      if (value + n !== max) {
        window.$(progress.bar).progressbar({
          max: value + n,
          value: value
        });
        progress.total.textContent = value + n;
      }
    } else {
      window.$(progress.bar).progressbar({
        max: n
      });
      progress.total.textContent = n;
    }
    // noinspection JSIgnoredPromiseFromCall
    this.mgc_importGiveaway(giveaways, 0, mgc, n, popup, progress, textArea, () => {
      this.mgc_updateCache(mgc);
      popup.close();
    }, callback);
  }

  async mgc_importGiveaway(giveaways, i, mgc, n, popup, progress, textArea, mainCallback, callback) {
    let copies, found, giveaway, key, keyPos, match, name, namePos, values;
    if (i < n) {
      let countries = giveaways[i].match(/\[countries="(.+?)"]/);
      let startTime = giveaways[i].match(/\[startTime="(.+?)"]/);
      let endTime = giveaways[i].match(/\[endTime="(.+?)"]/);
      let whoCanEnter = giveaways[i].match(/\[whoCanEnter="(.+?)"]/);
      let groups = giveaways[i].match(/\[groups="(.+?)"]/);
      let level = giveaways[i].match(/\[level="(.+?)"]/);
      let description = giveaways[i].match(/\[description="(.+?)"]/);
      if (gSettings.mgc_createTrain && !((description && description[1]) || mgc.description.value || ``).match(/\[ESGST-P]|\[ESGST-N]/)) {
        createAlert(`The next/previous links format is missing from the description.`);
        callback();
        return;
      }
      if (mgc.discussion && !((description && description[1]) || mgc.description.value || ``).match(/\[ESGST-B]/)) {
        createAlert(`The bump link format is missing from the description.`);
        callback();
        return;
      }
      if (countries) {
        if (countries[1] === `*`) {
          countries = `*`;
        } else {
          let ids = countries[1].split(/,\s/);
          countries = ``;
          ids.forEach(id => {
            let element = document.querySelector(`[data-input="country_item_string"]`).querySelector(`[data-name$="${id}"]`);
            if (element) {
              countries += `${element.getAttribute(`data-item-id`)} `;
            }
          });
        }
      }
      let whitelist = ``;
      if (groups) {
        let ids = groups[1].split(/,\s/);
        groups = ``;
        ids.forEach(id => {
          if (id === `My Whitelist`) {
            whitelist = `1`;
            return;
          }
          let element = document.querySelector(`[data-input="group_item_string"]`).querySelector(`[data-name$="${id}"]`);
          if (element) {
            groups += `${element.getAttribute(`data-item-id`)} `;
          }
        });
      }
      let steamLink = giveaways[i].match(/https?:\/\/.*?store\.steampowered\.com\/(app|sub)\/(\d+)/);
      let steamInfo = null;
      if (steamLink) {
        steamInfo = {
          id: steamLink[2],
          type: `${steamLink[1]}s`
        };
      }
      giveaways[i] = giveaways[i].replace(/\[(.+?)="(.+?)"]/g, ``).replace(/https?:\/\/.*?store\.steampowered\.com(.*?\s|.*)/, `[ESGST] `).trim();
      match = giveaways[i].match(/^(([\d\w]{5}(-[\d\w]{5}){2,}\s?|https?:\/\/.+?\s?)+)\s(.+)$/);
      if (match) {
        key = true;
        keyPos = 1;
        namePos = 4;
      } else {
        match = giveaways[i].match(/^(.+?)\s(([\d\w]{5}(-[\d\w]{5}){2,}\s?|https?:\/\/.+?\s?)+)$/);
        if (match) {
          key = true;
          keyPos = 2;
          namePos = 1;
        } else {
          match = giveaways[i].match(/^(.+?)(\s\((\d+?)\sCopies\))?$/);
          if (match) {
            key = false;
            namePos = 1;
          }
        }
      }
      if (match) {
        name = match[namePos].replace(/\[ESGST]/, ``).trim().toLowerCase();
        values = {
          countries: (countries === `*` ? `` : (countries || mgc.countries.value || ``)).trim(),
          startTime: (startTime && startTime[1]) || mgc.startTime.value || ``,
          endTime: (endTime && endTime[1]) || mgc.endTime.value || ``,
          region: countries === `*` ? `0` : (countries ? `1` : (mgc.region.value || `0`)),
          whoCanEnter: (whoCanEnter && whoCanEnter[1]) || mgc.whoCanEnter.value || `everyone`,
          whitelist: whitelist || mgc.whitelist.value || `0`,
          groups: (groups || mgc.groups.value || ``).trim(),
          level: (level && level[1]) || mgc.level.value || `0`,
          description: description ? description[1].replace(/\\n/g, `\n`) : (mgc.description.value || ``),
          gameType: undefined,
          keys: undefined,
          copies: undefined
        };
        if (key) {
          values.gameType = `key`;
          values.keys = match[keyPos].replace(/\s/g, `\n`);
        } else {
          values.gameType = `gift`;
          copies = match[3];
          if (copies) {
            values.copies = copies;
          } else {
            values.copies = `1`;
          }
        }
        let toRemove = [giveaways[i]];
        if ((gSettings.mgc_groupKeys || gSettings.mgc_groupAllKeys) && key) {
          let k = i;
          do {
            found = false;
            giveaway = giveaways[k + 1];
            if (giveaway) {
              let nextSteamLink = giveaway.match(/https?:\/\/.*?store\.steampowered\.com\/(app|sub)\/(\d+)/);
              let nextSteamInfo = null;
              if (nextSteamLink) {
                nextSteamInfo = {
                  id: nextSteamLink[2],
                  type: `${nextSteamLink[1]}s`
                };
              }
              giveaway = giveaway.replace(/\[(.+?)="(.+?)"]/g, ``).replace(/https?:\/\/.*?store\.steampowered\.com(.*?\s|.*)/, `[ESGST] `).trim();
              match = giveaway.match(/^(([\d\w]{5}(-[\d\w]{5}){2,}\s?|https?:\/\/.+?\s?)+)\s(.+)$/);
              if (match) {
                key = true;
                keyPos = 1;
                namePos = 4;
              } else {
                match = giveaway.match(/^(.+?)\s(([\d\w]{5}(-[\d\w]{5}){2,}\s?|https?:\/\/.+?\s?)+)$/);
                if (match) {
                  key = true;
                  keyPos = 2;
                  namePos = 1;
                } else {
                  key = false;
                }
              }
              if (match && key && ((name && match[namePos].replace(/\[ESGST]/, ``).trim().toLowerCase() === name) || (nextSteamInfo && steamInfo && nextSteamInfo.type === steamInfo.type && nextSteamInfo.id === steamInfo.id))) {
                found = true;
                values.keys += `\n${match[keyPos].replace(/\s/g, `\n`)}`;
                toRemove.push(giveaways.splice(k + 1, 1)[0]);
                k--;
                n--;
              }
            }
            k++;
          } while ((gSettings.mgc_groupKeys && found) || (gSettings.mgc_groupAllKeys && giveaways[k + 1]));
        }
        // noinspection JSIgnoredPromiseFromCall
        this.mgc_getGiveaway(giveaways, i + 1, toRemove, mgc, n, name, popup, progress, steamInfo, textArea, values, mainCallback, callback, await request({
          data: `do=autocomplete_giveaway_game&page_number=1&search_query=${encodeURIComponent((steamInfo && steamInfo.id) || name)}`,
          method: `POST`,
          url: `/ajax.php`
        }));
      } else {
        createAlert(`The next giveaway is not in the right format. Please correct it and click on "Import" again to continue importing.`);
        callback();
      }
    } else {
      mainCallback();
    }
  }

  async mgc_getGiveaway(giveaways, i, toRemove, mgc, n, name, popup, progress, steamInfo, textArea, values, mainCallback, callback, response) {
    let button, conflictPopup, context, element, elements, exactMatch, info, k, matches, numElements, value;
    elements = parseHtml(JSON.parse(response.responseText).html).getElementsByClassName(`table__row-outer-wrap`);
    exactMatch = null;
    matches = [];
    for (k = 0, numElements = elements.length; k < numElements; k++) {
      element = elements[k];
      if (element.getAttribute(`data-autocomplete-name`).toLowerCase() === name) {
        if (steamInfo) {
          info = await this.esgst.modules.games.games_getInfo(element);
          if (steamInfo.type === info.type && steamInfo.id === info.id) {
            exactMatch = element;
            break;
          }
        } else {
          matches.push(element);
        }
      } else if (steamInfo) {
        info = await this.esgst.modules.games.games_getInfo(element);
        if (steamInfo.type === info.type && steamInfo.id === info.id) {
          exactMatch = element;
          break;
        }
      }
    }
    if (!exactMatch && matches.length === 1) {
      exactMatch = matches[0];
    }
    if (exactMatch) {
      values.gameName = exactMatch.getAttribute(`data-autocomplete-name`);
      values.gameId = exactMatch.getAttribute(`data-autocomplete-id`);
      values.steam = await this.esgst.modules.games.games_getInfo(exactMatch);
      this.mgc_addGiveaway(false, mgc, values);
      value = window.$(progress.bar).progressbar(`option`, `value`) + toRemove.length;
      window.$(progress.bar).progressbar(`option`, `value`, value);
      progress.current.textContent = value;
      toRemove.forEach(line => {
        textArea.value = textArea.value.replace(`${line}\n`, ``);
      });
      window.setTimeout(() => this.mgc_importGiveaway(giveaways, i, mgc, n, popup, progress, textArea, mainCallback, callback), 0);
    } else if (matches.length > 0) {
      conflictPopup = new Popup({
        icon: `fa-exclamation`,
        isTemp: true,
        title: `There are ${matches.length} matches for ${name}. Please select the correct match.`,
        addScrollable: `left`
      });
      context = conflictPopup.getScrollable();
      matches.forEach(match => {
        let element = createElements(context, `beforeEnd`, [{
          context: match.cloneNode(true)
        }]);
        element.classList.remove(`is-clickable`);
        button = new ButtonSet({
          color1: `green`,
          color2: ``,
          icon1: `fa-arrow-circle-right`,
          icon2: ``,
          title1: `Select`,
          title2: ``,
          callback1: async () => {
            conflictPopup.close();
            values.gameName = element.getAttribute(`data-autocomplete-name`);
            values.gameId = element.getAttribute(`data-autocomplete-id`);
            values.steam = await this.esgst.modules.games.games_getInfo(element);
            this.mgc_addGiveaway(false, mgc, values);
            value = window.$(progress.bar).progressbar(`option`, `value`) + toRemove.length;
            window.$(progress.bar).progressbar(`option`, `value`, value);
            progress.current.textContent = value;
            toRemove.forEach(line => {
              textArea.value = textArea.value.replace(`${line}\n`, ``);
            });
            window.setTimeout(() => this.mgc_importGiveaway(giveaways, i, mgc, n, popup, progress, textArea, mainCallback, callback), 0);
          }
        });
        button.set.style.position = `absolute`;
        button.set.style.right = `50px`;
        element.insertBefore(button.set, element.firstElementChild);
      });
      conflictPopup.onClose = callback;
      conflictPopup.open();
    } else {
      createAlert(`${(steamInfo && `${steamInfo.type}/${steamInfo.id}`) || name} was not found! Please correct the title of the game and click on "Import" again to continue importing (it must be exactly like on Steam).`);
      callback();
    }
  }

  mgc_focusTextArea(textArea) {
    textArea.focus();
  }

  mgc_exportGiveaways(mgc) {
    let file, i, j, n, popup, values;
    popup = new Popup({ addScrollable: true, icon: `fa-arrow-down`, title: `Export` });
    new ToggleSwitch(popup.description, `mgc_reversePosition`, false, `Export keys in reverse position (before the name of the game).`, false, false, ``, gSettings.mgc_reversePosition);
    popup.description.appendChild(new ButtonSet({
      color1: `green`,
      color2: ``,
      icon1: `fa-arrow-down`,
      icon2: ``,
      title1: `Export`,
      title2: ``,
      callback1: () => {
        file = ``;
        for (i = 0, n = mgc.giveaways.children.length; i < n; ++i) {
          values = mgc.giveaways.children[i].title.split(/\n/);
          if (values[1] === `Gift`) {
            if (parseInt(values[2].match(/\d+/)[0]) > 1) {
              file += `${values[0]} (${values[2]})\r\n`;
            } else {
              file += `${values[0]}\r\n`;
            }
          } else {
            for (j = 2; values[j]; ++j) {
              if (gSettings.mgc_reversePosition) {
                file += `${values[j]} ${values[0]}\r\n`;
              } else {
                file += `${values[0]} ${values[j]}\r\n`;
              }
            }
          }
        }
        downloadFile(file, `giveaways.txt`);
      }
    }).set);
    popup.open();
  }

  mgc_emptyGiveaways(mgc) {
    if (window.confirm(`Are you sure you want to empty the creator?`)) {
      delLocalValue(`mgcCache`);
      this.esgst.busy = false;
      mgc.datas = [];
      mgc.values = [];
      mgc.created = [];
      mgc.giveaways.innerHTML = ``;
      mgc.copies.value = `1`;
      mgc.keys.value = ``;
    }
  }

  mgc_createGiveaways(mgc, viewButton, callback) {
    if (!mgc.datas.length) {
      createAlert(`There are no giveaways in the queue. Click on the "Add" button to add a giveaway to the queue.`);
      callback();
      return;
    }
    let popup = new Popup({
      addScrollable: true,
      icon: `fa-arrow-circle-right`,
      title: `ESGST will create the giveaways below. Are you sure you want to continue?`
    });
    let rows = createElements(popup.scrollable, `beforeEnd`, [{
      attributes: {
        class: `table esgst-mgc-table`
      },
      type: `div`,
      children: [{
        attributes: {
          class: `table__heading`
        },
        type: `div`,
        children: [{
          attributes: {
            class: `table__column--width-small`
          },
          text: `No.`,
          type: `div`
        }, {
          attributes: {
            class: `table__column--width-fill`
          },
          text: `Game`,
          type: `div`
        }, {
          attributes: {
            class: `table__column--width-small`
          },
          text: `Copies/Keys`,
          type: `div`
        }, {
          attributes: {
            class: `table__column--width-small`
          },
          text: `Start Time`,
          type: `div`
        }, {
          attributes: {
            class: `table__column--width-small`
          },
          text: `End Time`,
          type: `div`
        }, {
          attributes: {
            class: `table__column--width-small`
          },
          text: `Region Restricted`,
          type: `div`
        }, {
          attributes: {
            class: `table__column--width-small`
          },
          text: `Who Can Enter`,
          type: `div`
        }, {
          attributes: {
            class: `table__column--width-small`
          },
          text: `Level`,
          type: `div`
        }, {
          attributes: {
            class: `table__column--width-small`
          },
          text: `Description`,
          type: `div`
        }]
      }, {
        attributes: {
          class: `table__rows`
        },
        type: `div`
      }]
    }]).lastElementChild;
    for (let i = 0, n = mgc.giveaways.children.length; i < n; i++) {
      let values = mgc.values[parseInt(mgc.giveaways.children[i].textContent) - 1];
      let regionRestricted = `No`;
      if (values.region === `1`) {
        regionRestricted = `Yes (`;
        values.countries.split(/\s/).forEach(id => {
          window.console.log(id, mgc.countryNames[id]);
          regionRestricted += `${mgc.countryNames[id].match(/.+\s(.+)$/)[1]}, `;
        });
        regionRestricted = `${regionRestricted.slice(0, -2)})`;
      }
      let whoCanEnter = `Everyone`;
      if (values.whoCanEnter === `invite_only`) {
        whoCanEnter = `Invite Only`;
      } else if (values.whoCanEnter === `groups`) {
        whoCanEnter = `Groups (`;
        if (values.whitelist === `1`) {
          whoCanEnter += `Whitelist, `;
        }
        if (values.groups) {
          values.groups.split(/\s/).forEach(id => {
            whoCanEnter += `${mgc.groupNames[id]}, `;
          });
        }
        whoCanEnter = `${whoCanEnter.slice(0, -2)})`;
      }
      let keys = [];
      if (values.keys) {
        for (const key of values.keys.split(/\n/)) {
          if (!key) {
            continue;
          }
          keys.push({
            text: key,
            type: `node`
          }, {
              type: `br`
            });
        }
      }
      createElements(rows, `beforeEnd`, [{
        attributes: {
          class: `table__row-outer-wrap`
        },
        type: `div`,
        children: [{
          attributes: {
            class: `table__row-inner-wrap`
          },
          type: `div`,
          children: [{
            attributes: {
              class: `table__column--width-small`
            },
            text: i + 1,
            type: `div`
          }, {
            attributes: {
              class: `table__column--width-fill`
            },
            type: `div`,
            children: [values.steam ? {
              attributes: {
                class: `table__column__secondary-link`,
                href: `https://store.steampowered.com/${values.steam.type.slice(0, -1)}/${values.steam.id}`
              },
              text: values.gameName,
              type: `a`
            } : {
                text: values.gameName,
                type: `span`
              }]
          }, {
            attributes: {
              class: `table__column--width-small`
            },
            text: keys.length ? null : `${values.copies} Copies`,
            type: `div`,
            children: keys.length ? keys : null
          }, {
            attributes: {
              class: `table__column--width-small`
            },
            text: values.startTime,
            type: `div`
          }, {
            attributes: {
              class: `table__column--width-small`
            },
            text: values.endTime,
            type: `div`
          }, {
            attributes: {
              class: `table__column--width-small`
            },
            text: regionRestricted,
            type: `div`
          }, {
            attributes: {
              class: `table__column--width-small`
            },
            text: whoCanEnter,
            type: `div`
          }, {
            attributes: {
              class: `table__column--width-small`
            },
            text: values.level,
            type: `div`
          }, {
            attributes: {
              class: `table__column--width-small`,
              title: values.description.replace(/"/g, `&quot;`)
            },
            text: values.description.length > 100 ? `${values.description.slice(0, 100)}...` : values.description,
            type: `div`
          }]
        }]
      }]);
    }
    popup.description.appendChild(new ButtonSet({
      color1: `green`,
      color2: ``,
      icon1: `fa-check`,
      icon2: ``,
      title1: `Yes`,
      title2: ``,
      callback1: this.mgc_createGiveaways_2.bind(this, mgc, viewButton, popup, callback)
    }).set);
    popup.description.appendChild(new ButtonSet({
      color1: `red`,
      color2: ``,
      icon1: `fa-times`,
      icon2: ``,
      title1: `No`,
      title2: ``,
      callback1: popup.close.bind(popup)
    }).set);
    popup.onClose = () => {
      if (popup.isOpen) {
        callback();
      }
    };
    popup.open();
  }

  mgc_createGiveaways_2(mgc, viewButton, popup, callback) {
    popup.onClose = null;
    popup.close();
    mgc.copies.value = `1`;
    mgc.keys.value = ``;
    viewButton.set.classList.add(`esgst-hidden`);
    mgc.saveGiveaways = {};
    // noinspection JSIgnoredPromiseFromCall
    this.mgc_createGiveaway(0, mgc, mgc.giveaways.children.length, gSettings.cewgd || (gSettings.gc && gSettings.gc_gi) || gSettings.lpv || gSettings.rcvc ? this.mgc_saveGiveaways.bind(this, mgc, this.mgc_completeCreation.bind(this, mgc, viewButton, callback)) : this.mgc_completeCreation.bind(this, mgc, viewButton, callback));
  }

  async mgc_createGiveaway(i, mgc, n, callback) {
    if (i < n) {
      if (!mgc.giveaways.children[i].classList.contains(`success`)) {
        const j = parseInt(mgc.giveaways.children[i].textContent) - 1;
        // noinspection JSIgnoredPromiseFromCall
        this.mgc_checkCreation(i, mgc, n, callback, await request({
          data: mgc.datas[j].replace(/start_time=(.+?)&/, this.mgc_correctTime.bind(this)),
          method: `POST`,
          url: `/giveaways/new`
        }));
      } else {
        window.setTimeout(() => this.mgc_createGiveaway(i + 1, mgc, n, callback), 0);
      }
    } else if (gSettings.mgc_createTrain) {
      // noinspection JSIgnoredPromiseFromCall
      this.mgc_createTrain(0, mgc, mgc.created.length, callback);
    } else {
      callback();
    }
  }

  mgc_correctTime(fullMatch, match1) {
    const offsetTime = Date.now() + 5000;
    if ((new Date(decodeURIComponent(match1)).getTime()) < offsetTime) {
      return `start_time=${encodeURIComponent(dateFns_format(offsetTime, this.esgst.newGiveawayDateFormat))}&`;
    } else {
      return fullMatch;
    }
  }

  async mgc_checkCreation(i, mgc, n, callback, response) {
    let errors, errorsTitle, giveaway, j, numErrors, responseHtml;
    giveaway = mgc.giveaways.children[i];
    if (response.finalUrl.match(/\/giveaways\/new/)) {
      if (response.responseText.match(/Error\.\sYou\salready\sposted\san\sidentical\sgiveaway\swithin\sthe\spast\s2\sminutes\.\sTo\sprevent\sdouble\sposts,\sit's\sbeen\sblocked\./)) {
        const popup = new Popup({
          addScrollable: true, icon: `fa-circle-o-notch fa-spin`, title: [
            `Waiting `,
            [`span`],
            ` minutes to create another identical giveaway... Please do not close this popup. If you do not want this waiting period, create a single multiple-copy giveaway for the game.`
          ]
        });
        popup.open();
        setCountdown(popup.title.firstElementChild, 120, async () => {
          popup.close();
          const j = parseInt(mgc.giveaways.children[i].textContent) - 1;
          window.setTimeout(async () => this.mgc_checkCreation(i, mgc, n, callback, await request({
            data: mgc.datas[j].replace(/start_time=(.+?)&/, this.mgc_correctTime.bind(this)),
            method: `POST`,
            url: `/giveaways/new`
          })), 0);
        });
      } else {
        giveaway.classList.add(`error`);
        errors = parseHtml(response.responseText).getElementsByClassName(`form__row__error`);
        errorsTitle = `Errors:\n`;
        for (j = 0, numErrors = errors.length; j < numErrors; ++j) {
          errorsTitle += `${errors[j].textContent}\n`;
        }
        errorsTitle += `\n`;
        giveaway.title = `${errorsTitle}${giveaway.title}`;
        window.setTimeout(() => this.mgc_createGiveaway(++i, mgc, n, callback), 0);
      }
    } else {
      giveaway.classList.add(`success`);
      responseHtml = parseHtml(response.responseText);
      mgc.created.push({
        giveaway: giveaway,
        html: (await buildGiveaway(responseHtml, response.finalUrl)).html,
        url: response.finalUrl
      });
      if (gSettings.cewgd || (gSettings.gc && gSettings.gc_gi) || gSettings.lpv || gSettings.rcvc) {
        giveaway = (await this.esgst.modules.giveaways.giveaways_get(responseHtml, false, response.finalUrl))[0];
        if (giveaway) {
          mgc.saveGiveaways[giveaway.code] = giveaway;
        }
        window.setTimeout(() => this.mgc_createGiveaway(++i, mgc, n, callback), 0);
      } else {
        window.setTimeout(() => this.mgc_createGiveaway(++i, mgc, n, callback), 0);
      }
    }
  }

  async mgc_saveGiveaways(mgc, callback) {
    let user = {
      steamId: gSettings.steamId,
      username: gSettings.username
    };
    let ugd;
    const savedUser = await getUser(null, user);
    let giveaways = null;
    if (savedUser) {
      giveaways = savedUser.giveaways;
    }
    if (!giveaways) {
      giveaways = {
        sent: {
          apps: {},
          subs: {}
        },
        won: {
          apps: {},
          subs: {}
        },
        sentTimestamp: 0,
        wonTimestamp: 0
      };
      if (savedUser) {
        ugd = savedUser.ugd;
        if (ugd) {
          if (ugd.sent) {
            for (let key in ugd.sent.apps) {
              if (ugd.sent.apps.hasOwnProperty(key)) {
                giveaways.sent.apps[key] = [];
                for (let i = 0, n = ugd.sent.apps[key].length; i < n; ++i) {
                  mgc.saveGiveaways[ugd.sent.apps[key][i].code] = ugd.sent.apps[key][i];
                  giveaways.sent.apps[key].push(ugd.sent.apps[key][i].code);
                }
              }
            }
            for (let key in ugd.sent.subs) {
              if (ugd.sent.subs.hasOwnProperty(key)) {
                giveaways.sent.subs[key] = [];
                for (let i = 0, n = ugd.sent.subs[key].length; i < n; ++i) {
                  mgc.saveGiveaways[ugd.sent.subs[key][i].code] = ugd.sent.subs[key][i];
                  giveaways.sent.subs[key].push(ugd.sent.subs[key][i].code);
                }
              }
            }
            giveaways.sentTimestamp = ugd.sentTimestamp;
          }
          if (ugd.won) {
            for (let key in ugd.won.apps) {
              if (ugd.won.apps.hasOwnProperty(key)) {
                giveaways.won.apps[key] = [];
                for (let i = 0, n = ugd.won.apps[key].length; i < n; ++i) {
                  mgc.saveGiveaways[ugd.won.apps[key][i].code] = ugd.won.apps[key][i];
                  giveaways.won.apps[key].push(ugd.won.apps[key][i].code);
                }
              }
            }
            for (let key in ugd.won.subs) {
              if (ugd.won.subs.hasOwnProperty(key)) {
                giveaways.won.subs[key] = [];
                for (let i = 0, n = ugd.won.subs[key].length; i < n; ++i) {
                  mgc.saveGiveaways[ugd.won.subs[key][i].code] = ugd.won.subs[key][i];
                  giveaways.won.subs[key].push(ugd.won.subs[key][i].code);
                }
              }
            }
            giveaways.wonTimestamp = ugd.wonTimestamp;
          }
        }
      }
    }
    for (const key in mgc.saveGiveaways) {
      if (mgc.saveGiveaways.hasOwnProperty(key)) {
        let giveaway = mgc.saveGiveaways[key];
        if (!giveaways.sent[giveaway.gameType][giveaway.gameSteamId]) {
          giveaways.sent[giveaway.gameType][giveaway.gameSteamId] = [];
        }
        if (giveaways.sent[giveaway.gameType][giveaway.gameSteamId].indexOf(giveaway.code) < 0) {
          giveaways.sent[giveaway.gameType][giveaway.gameSteamId].push(giveaway.code);
        }
      }
    }
    user.values = {
      giveaways: giveaways
    };
    await lockAndSaveGiveaways(mgc.saveGiveaways);
    await saveUser(null, null, user);
    callback();
  }

  async mgc_createTrain(i, mgc, n, callback) {
    if (i >= n || n - 1 === 0) {
      callback();
    } else {
      let responseHtml = parseHtml((await request({ method: `GET`, url: mgc.created[i].url })).responseText);
      let id = responseHtml.querySelector(`[name="giveaway_id"]`).value;
      let description = responseHtml.querySelector(`[name="description"]`).value;
      let replaceCallback = null;
      if (i === 0) {
        mgc.firstWagon = mgc.created[i].url;
        replaceCallback = this.mgc_getNext;
      } else if (i === n - 1) {
        replaceCallback = this.mgc_getPrevious;
      } else {
        replaceCallback = this.mgc_getBoth;
      }
      description = description.replace(/\[ESGST-P](.+?)\[\/ESGST-P](.+?)\[ESGST-N](.+?)\[\/ESGST-N]/g, replaceCallback.bind(this, i, mgc, false));
      description = description.replace(/\[ESGST-P](.+?)\[\/ESGST-P]|\[ESGST-N](.+?)\[\/ESGST-N]/g, replaceCallback.bind(this, i, mgc, true));
      description = description.replace(/\[ESGST-C](.+?)\[\/ESGST-C]/g, this.mgc_getCounter.bind(this, i, n));
      if (mgc.discussion && (!gSettings.mgc_bumpLast || i === n - 1)) {
        description = description.replace(/\[ESGST-B](.+?)\[\/ESGST-B]/g, `[$1](/discussion/${mgc.discussion}/)`);
      } else {
        description = description.replace(/\[ESGST-B](.+?)\[\/ESGST-B]/g, ``);
      }
      await request({
        data: `xsrf_token=${this.esgst.xsrfToken}&do=edit_giveaway_description&giveaway_id=${id}&description=${encodeURIComponent(description.trim())}`,
        method: `POST`,
        url: `/ajax.php`
      });
      mgc.created[i].giveaway.classList.add(`connected`);
      window.setTimeout(() => this.mgc_createTrain(i + 1, mgc, n, callback), 0);
    }
  }

  mgc_getNext(i, mgc, single, fullMatch, match1, match2, match3) {
    let match, next, nextPref, nextSuf;
    if ((single && match2) || !single) {
      match = (single ? match2 : match3).match(/(.*?)\[N](.+?)\[\/N](.*?)$/);
      if (match) {
        nextPref = match[1];
        next = match[2];
        nextSuf = match[3];
      } else {
        nextPref = ``;
        next = single ? match2 : match3;
        nextSuf = ``;
      }
      if (gSettings.mgc_removeLinks || single) {
        return `${nextPref}[${next}](${mgc.created[i + 1].url})${nextSuf}`;
      } else {
        return `${match1}${match2}${nextPref}[${next}](${mgc.created[i + 1].url})${nextSuf}`;
      }
    } else {
      return ``;
    }
  }

  mgc_getPrevious(i, mgc, single, fullMatch, match1, match2, match3) {
    let match, prev, prevPref, prevSuf;
    if ((single && match1) || !single) {
      match = match1.match(/(.*?)\[P](.+?)\[\/P](.*?)$/);
      if (match) {
        prevPref = match[1];
        prev = match[2];
        prevSuf = match[3];
      } else {
        prevPref = ``;
        prev = match1;
        prevSuf = ``;
      }
      if (gSettings.mgc_removeLinks || single) {
        return `${prevPref}[${prev}](${mgc.created[i - 1].url})${prevSuf}`;
      } else {
        return `${prevPref}[${prev}](${mgc.created[i - 1].url})${prevSuf}${match2}${match3}`;
      }
    } else {
      return ``;
    }
  }

  mgc_getBoth(i, mgc, single, fullMatch, match1, match2, match3) {
    let match, next, nextPref, nextSuf, prev, prevPref, prevSuf;
    if (single) {
      if (match1) {
        return this.mgc_getPrevious(i, mgc, true, fullMatch, match1);
      } else {
        return this.mgc_getNext(i, mgc, true, fullMatch, null, match2);
      }
    } else {
      match = match1.match(/(.*?)\[P](.+?)\[\/P](.*?)$/);
      if (match) {
        prevPref = match[1];
        prev = match[2];
        prevSuf = match[3];
      } else {
        prevPref = ``;
        prev = match1;
        prevSuf = ``;
      }
      match = match3.match(/(.*?)\[N](.+?)\[\/N](.*?)$/);
      if (match) {
        nextPref = match[1];
        next = match[2];
        nextSuf = match[3];
      } else {
        nextPref = ``;
        next = match3;
        nextSuf = ``;
      }
      return `${prevPref}[${prev}](${mgc.created[i - 1].url})${prevSuf}${match2}${nextPref}[${next}](${mgc.created[i + 1].url})${nextSuf}`;
    }
  }

  mgc_getCounter(i, n, fullMatch, match1) {
    return `${i + 1}${match1}${n}`;
  }

  mgc_completeCreation(mgc, viewButton, callback) {
    if (mgc.discussion) {
      if (mgc.created.length) {
        delLocalValue(`mgcCache`);
        setLocalValue(`mgcAttach_step4`, mgc.firstWagon);
        window.open(`/discussion/${mgc.discussion}/`);
        viewButton.set.classList.remove(`esgst-hidden`);
      }
      callback();
    } else {
      if (mgc.created.length) {
        delLocalValue(`mgcCache`);
        viewButton.set.classList.remove(`esgst-hidden`);
      }
      callback();
    }
  }

  mgc_shuffleGiveaways(mgc) {
    if (!mgc.datas.length) {
      createAlert(`There are no giveaways in the queue. Click on the "Add" button to add a giveaway to the queue.`);
      return;
    }
    let i;
    for (i = mgc.giveaways.children.length; i > -1; --i) {
      mgc.giveaways.appendChild(mgc.giveaways.children[Math.random() * i | 0]);
    }
    this.mgc_updateCache(mgc);
  }

  mgc_updateCache(mgc) {
    let cache, i, n;
    cache = [];
    for (i = 0, n = mgc.giveaways.children.length; i < n; ++i) {
      cache.push(mgc.values[parseInt(mgc.giveaways.children[i].textContent) - 1]);
    }
    setLocalValue(`mgcCache`, JSON.stringify(cache));
  }

  mgc_attachDiscussion(mgc) {
    let input, popup;
    popup = new Popup({ addScrollable: true, icon: `fa-comments`, title: `Attach discussion:` });
    createElements(popup.description, `afterBegin`, [{
      attributes: {
        class: `esgst-description`
      },
      type: `div`,
      children: [{
        text: `You can attach an existing or a new discussion. To attach an existing discussion, simply enter its code below and click "Attach Existing". To attach a new discussion, simply click "Attach New".`,
        type: `div`
      }, {
        type: `br`
      }, {
        text: `Use [ESGST-B][/ESGST-B] to delimit the bump link in the description of the giveaway, for example: ### [ESGST-B]Bump[/ESGST-B]`,
        type: `div`
      }, {
        type: `br`
      }, {
        text: `Use [ESGST-T][/ESGST-T] to delimit the train link in the description of the discussion (this link will lead to the first giveaway of the train), for example: ### [ESGST-T]Choo choo![/ESGST-T]`,
        type: `div`
      }, {
        type: `br`
      }, {
        text: `When the discussion page opens in your browser at the end of the train creation, wait until it has completely finished altering it (you will get a popup when this happens).`,
        type: `div`
      }, {
        type: `br`
      }]
    }]);
    input = createElements(popup.description, `beforeEnd`, [{
      attributes: {
        placeholder: `XXXXX`,
        type: `text`
      },
      type: `input`
    }]);
    popup.description.appendChild(new ButtonSet({
      color1: `green`,
      color2: `grey`,
      icon1: `fa-paperclip`,
      icon2: `fa-circle-o-notch fa-spin`,
      title1: `Attach Existing`,
      title2: `Attaching...`,
      callback1: this.mgc_attachExistingDiscussion.bind(this, input, mgc, popup)
    }).set);
    popup.description.appendChild(new ButtonSet({
      color1: `green`,
      color2: `grey`,
      icon1: `fa-paperclip`,
      icon2: `fa-circle-o-notch fa-spin`,
      title1: `Attach New`,
      title2: `Attaching...`,
      callback1: () => {
        return new Promise(resolve => this.mgc_attachNewDiscussion(mgc, popup, resolve));
      }
    }).set);
    popup.open();
  }

  mgc_attachExistingDiscussion(input, mgc, popup) {
    mgc.discussion = input.value;
    mgc.discussionPanel.classList.remove(`esgst-hidden`);
    mgc.discussionLink.href = `/discussion/${mgc.discussion}/`;
    mgc.discussionLink.textContent = mgc.discussion;
    popup.close();
  }

  mgc_attachNewDiscussion(mgc, popup, callback) {
    let win;
    setLocalValue(`mgcAttach_step1`, true);
    win = window.open(`/discussions/new`);
    window.setTimeout(() => this.mgc_checkAttached(mgc, popup, win, callback), 100);
  }

  mgc_checkAttached(mgc, popup, win, callback) {
    if (win.closed) {
      mgc.discussion = getLocalValue(`mgcAttach_step3`);
      delLocalValue(`mgcAttach_step3`);
      mgc.discussionPanel.classList.remove(`esgst-hidden`);
      mgc.discussionLink.href = `/discussion/${mgc.discussion}/`;
      mgc.discussionLink.textContent = mgc.discussion;
      callback();
      popup.close();
    } else {
      window.setTimeout(() => this.mgc_checkAttached(mgc, popup, win, callback), 100);
    }
  }

  mgc_addCreateAndAttachButton() {
    let rows;
    rows = document.getElementsByClassName(`form__rows`)[0];
    rows.appendChild(new ButtonSet({
      color1: `green`,
      color2: `grey`,
      icon1: `fa-check`,
      icon2: `fa-circle-o-notch fa-spin`,
      title1: `Create & Attach`,
      title2: `Creating & attaching...`,
      callback1: this.mgc_createAndAttachDiscussion.bind(this, rows)
    }).set);
  }

  mgc_createAndAttachDiscussion(rows) {
    setLocalValue(`mgcAttach_step2`, true);
    rows.parentElement.submit();
  }

  mgc_editDiscussion() {
    const description = document.querySelector(`[name=description]`);
    description.value = description.value.replace(/\[ESGST-T(.+?)\[\/ESGST-T/g, `[$1](${getLocalValue(`mgcAttach_step4`)})`);
    delLocalValue(`mgcAttach_step4`);
    setLocalValue(`mgcAttach_step5`, true);
    document.getElementsByClassName(`js__submit-form`)[0].click();
  }

  mgc_detachDiscussion(mgc) {
    mgc.discussion = null;
    mgc.discussionPanel.classList.add(`esgst-hidden`);
  }

  async mgc_viewResults(mgc) {
    const popup = new Popup({ addScrollable: true, icon: `fa-eye`, title: `Results` });
    const items = [];
    for (const item of mgc.created) {
      items.push(...item.html);
    }
    createElements(popup.scrollable, `beforeEnd`, [{
      attributes: {
        class: `popup__keys__list`
      },
      type: `div`,
      children: items
    }]);
    const giveaways = await this.esgst.modules.giveaways.giveaways_get(popup.scrollable);
    if (gSettings.mm) {
      const heading = createElements(popup.scrollable, `afterBegin`, [{
        attributes: {
          class: `esgst-page-heading`
        },
        type: `div`
      }]);
      this.esgst.modules.generalMultiManager.mm(heading, giveaways, `Giveaways`);
    }
    popup.open();
  }

  mgc_removeGiveaway(mgc) {
    if (window.confirm(`Are you sure you want to remove this giveaway?`)) {
      mgc.source.remove();
      mgc.source = null;
      this.mgc_updateCache(mgc);
    }
  }
}

const giveawaysMultipleGiveawayCreator = new GiveawaysMultipleGiveawayCreator();

export { giveawaysMultipleGiveawayCreator };