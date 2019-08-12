import { ButtonSet } from '../class/ButtonSet';
import { Checkbox } from '../class/Checkbox';
import { Module } from '../class/Module';
import { Popup } from '../class/Popup';
import { ToggleSwitch } from '../class/ToggleSwitch';
import { utils } from '../lib/jsUtils';
import { common } from './Common';
import { gSettings } from '../class/Globals';
import { shared } from '../class/Shared';
import { SYNC_KEYS } from './Sync';
import { logger } from '../class/Logger';

const
  isSet = utils.isSet.bind(utils),
  createElements = common.createElements.bind(common),
  createFadeMessage = common.createElements.bind(common),
  getFeatureTooltip = common.getFeatureTooltip.bind(common),
  request = common.request.bind(common),
  setSetting = common.setSetting.bind(common)
;

class Filters extends Module {
  constructor(id) {
    super();
    this.id = id;
    this.isProgrammaticChange = false;
  }

  getFilters(popup) {}

  addSingleButton(icon) {
    this.singleButton = shared.common.createHeadingButton({ id: `${this.id}_s_s`, icons: [icon], title: `Hide / unhide items filtered by single filters temporarily` });
    this.singleButton.classList.add(`esgst-hidden`);
    shared.common.createElements_v2(this.singleButton, `afterBegin`, [[`span`]]);
    this.singleSwitch = new ToggleSwitch(this.singleButton.firstElementChild, null, true, ``, false, false, null, true);
    this.singleSwitch.onChange = () => this.toggleFilteredItems();
    this.singleCounter = shared.common.createElements_v2(this.singleButton, `beforeEnd`, [[`span`, `0`]]);
  }    

  toggleFilteredItems() {
    const elements = document.querySelectorAll(`[data-esgst-not-filterable="${this.id}"]`);
    if (this.singleSwitch.value) {
      for (const element of elements) {
        element.classList.add(`esgst-hidden`);
      }
    } else {
      for (const element of elements) {
        element.classList.remove(`esgst-hidden`);
      }
    }
  }

  updateSingleCounter(count = 1) {
    const newCount = parseInt(this.singleCounter.textContent) + count;
    this.singleCounter.textContent = newCount;
    if (newCount > 0) {      
      this.singleButton.classList.remove(`esgst-hidden`);
    }
  }

  filters_addContainer(heading, popup) {
    const obj = {
      basicFilters: {},
      id: this.id,
      key: `${this.id}_presets`,
      popup: popup,
      rules: null,
      type: popup || (this.esgst.groupPath ? `Groups` : (window.location.search.match(/type/) ? {
        wishlist: `Wishlist`,
        recommended: `Recommended`,
        group: `Group`,
        new: `New`
      }[window.location.search.match(/type=(wishlist|recommended|group|new)/)[1]] : (this.esgst.createdPath ? `Created` : (this.esgst.enteredPath ? `Entered` : (this.esgst.wonPath ? `Won` : (this.esgst.userPath ? `User` : ``))))))
    };
    obj.filters = this.getFilters(popup);
    if (popup) {
      this.esgst[`${this.id}Popup`] = obj;
    } else {
      this.esgst[this.id] = obj;
    }

    const headingButton = document.createElement(`div`);
    headingButton.className = `esgst-heading-button esgst-gf-heading-button`;
    headingButton.id = `esgst-${obj.id}`;
    headingButton.setAttribute(`data-draggable-id`, obj.id);
    createElements(headingButton, `inner`, [{
      attributes: {
        class: `esgst-gf-toggle-switch`
      },
      type: `span`
    }, {
      attributes: {
        class: `fa fa-sliders`,
        title: getFeatureTooltip(obj.id, `Manage presets`)
      },
      type: `i`
    }]);
    const toggleSwitch = new ToggleSwitch(
      headingButton.firstElementChild,
      `${obj.id}_enable${obj.type}`,
      true,
      ``,
      false,
      false,
      null,
      gSettings[`${obj.id}_enable${obj.type}`]
    );
    const presetButton = headingButton.lastElementChild;

    toggleSwitch.onEnabled = this.filters_filter.bind(this, obj);
    toggleSwitch.onDisabled = this.filters_filter.bind(this, obj, true);

    obj.container = createElements(heading, `afterEnd`, [{
      attributes: {
        class: `esgst-gf-container`
      },
      type: `div`,
      children: [{
        attributes: {
          class: `esgst-gf-box`
        },
        type: `div`,
        children: [{
          attributes: {
            class: `esgst-gf-filters esgst-hidden`
          },
          type: `div`,
          children: [{
            attributes: {
              class: `esgst-gf-left-panel`
            },
            type: `div`,
            children: [{
              attributes: {
                class: `esgst-gf-box warning esgst-hidden`
              },
              type: `div`
            }, {
              attributes: {
                class: `esgst-gf-basic-filters`
              },
              type: `div`,
              children: [{
                attributes: {
                  class: `esgst-gf-number-filters`
                },
                type: `div`
              }, {
                attributes: {
                  class: `esgst-gf-boolean-filters`
                },
                type: `div`
              }, {
                attributes: {
                  class: `esgst-gf-string-filters`
                },
                type: `div`
              }]
            }, {
              type: `div`,
              children: [{
                text: `Advanced `,
                type: `node`
              }, {
                attributes: {
                  class: `fa fa-question-circle`,
                  title: `Advanced filters offer more options and flexibility, but may be more complex to understand and use. When you change settings in the basic filters, they will also be changed in the advanced ones, and vice-versa. But the two types are not compatible backwards: basic -> advanced conversion works fine, but advanced -> basic conversion does not, and will result in the loss of any settings that are exclusive to the advanced filter. Bear this in mind when saving a preset, since the last applied preset will be saved.`
                },
                type: `i`
              }]
            }, {
              attributes: {
                class: `esgst-clickable`
              },
              type: `div`,
              children: [{
                text: `Manual `,
                type: `node`
              }, {
                attributes: {
                  class: `fa fa-book`
                },
                type: `i`
              }]
            }, {
              attributes: {
                class: `esgst-gf-advanced-filters`
              },
              type: `div`
            }]
          }, {
            attributes: {
              class: `esgst-gf-right-panel`
            },
            type: `div`,
            children: [{
              attributes: {
                class: `esgst-gf-steamgifts-filters`
              },
              type: `div`,
              children: [{
                type: `div`,
                children: [{
                  attributes: {
                    class: `esgst-bold`
                  },
                  text: `SteamGifts Filters:`,
                  type: `span`
                }]
              }]
            }, {
              type: `br`
            }, {
              attributes: {
                class: `esgst-gf-preset-panel`
              },
              type: `div`,
              children: [{
                type: `div`,
                children: [{
                  attributes: {
                    class: `esgst-bold`
                  },
                  text: `Preset:`,
                  type: `span`
                }, {
                  attributes: {
                    class: `fa fa-question-circle`,
                    title: `If you have both the basic and the advanced filters enabled, the last applied preset will be saved. For example, if the last setting you altered was in the basic filters, it will save the basic preset, and if the last setting you altered was in the advanced filters, it will save the advanced preset. The two presets are not compatible, so they will overwrite each other. Be careful with this, as you might lose some settings.`
                  },
                  type: `i`
                }]
              }, {
                attributes: {
                  class: `form__input-small`,
                  type: `text`
                },
                type: `input`
              }, {
                attributes: {
                  class: `esgst-description esgst-bold`
                },
                type: `div`
              }, {
                attributes: {
                  class: `form__row__error esgst-hidden`
                },
                type: `div`,
                children: [{
                  attributes: {
                    class: `fa fa-exclamation-circle`
                  },
                  type: `i`
                }, {
                  text: ` Please enter a name for the preset.`,
                  type: `node`
                }]
              }, {
                attributes: {
                  class: `esgst-description`
                },
                text: `The name of the preset.`,
                type: `div`
              }]
            }]
          }]
        }]
      }, {
        attributes: {
          class: `esgst-gf-button`
        },
        type: `div`,
        children: [{
          text: `Expand`,
          type: `span`
        }, {
          attributes: {
            class: `esgst-hidden`
          },
          text: `Collapse`,
          type: `span`
        }, {
          text: ` filters (`,
          type: `node`
        }, {
          text: `0`,
          type: `span`
        }, {
          text: ` filtered `,
          type: `node`,
        }, ...(obj.id === `gf` ? [{
          text: `- `,
          type: `node`
        }, {
          text: `0`,
          type: `span`
        }, {
          text: `P required to enter all unfiltered `,
          type: `node`
        }] : []), {
          text: `- `,
          type: `node`
        }, {
          type: `span`
        }, {
          text: `)`,
          type: `node`
        }]
      }]
    }]);

    if (!obj.popup) {
      this.esgst.commentsTop += 23;
    }

    const box = obj.container.firstElementChild;
    obj.filtersPanel = box.firstElementChild;
    const leftPanel = obj.filtersPanel.firstElementChild;
    obj.warningsPanel = leftPanel.firstElementChild;
    const basicFilters = obj.warningsPanel.nextElementSibling;
    const numberFilters = basicFilters.firstElementChild;
    const booleanFilters = numberFilters.nextElementSibling;
    const stringFilters = booleanFilters.nextElementSibling;
    const advancedFilters = leftPanel.lastElementChild;
    const rightPanel = leftPanel.nextElementSibling;
    const sgFilters = rightPanel.firstElementChild;
    const presetPanel = rightPanel.lastElementChild;
    obj.presetInput = presetPanel.firstElementChild.nextElementSibling;
    obj.presetMessage = obj.presetInput.nextElementSibling;
    obj.presetWarning = obj.presetMessage.nextElementSibling;
    obj.button = box.nextElementSibling;
    obj.expandButton = obj.button.firstElementChild;
    obj.collapseButton = obj.expandButton.nextElementSibling;
    obj.filteredCount = obj.collapseButton.nextElementSibling;
    if (obj.id === `gf`) {
      obj.pointsCount = obj.filteredCount.nextElementSibling;
      obj.presetDisplay = obj.pointsCount.nextElementSibling;
    } else {
      obj.presetDisplay = obj.filteredCount.nextElementSibling;
    }

    advancedFilters.previousElementSibling.addEventListener(`click`, this.filter_manual.bind(this, {}));

    presetPanel.appendChild(new ButtonSet({
      color1: `green`,
      color2: `grey`,
      icon1: `fa-check`,
      icon2: `fa-circle-o-notch fa-spin`,
      title1: `Save`,
      title2: `Saving...`,
      callback1: this.filters_savePreset.bind(this, obj)
    }).set);

    let name = gSettings[`${obj.id}_preset${obj.type}`];
    if (name) {
      let i;
      const presets = gSettings[obj.key];
      for (i = presets.length - 1; i > -1 && presets[i].name !== name; i--) {
      }
      if (i > -1) {
        obj.rules = presets[i].rules;
      }
    }
    if (!obj.rules) {
      name = `Default${obj.type}`;
      const preset = {
        name,
        rules: {}
      };
      const presets = gSettings[obj.key];
      presets.push(preset);
      setSetting([
        {
          id: `${obj.id}_preset${obj.type}`,
          value: name
        },
        {
          id: obj.key,
          value: presets
        }
      ]);
      obj.rules = {};
    }
    obj.rules_save = obj.rules;
    obj.presetDisplay.textContent = obj.presetInput.value = name;

    presetButton.addEventListener(`click`, this.filters_openPresetPopup.bind(this, obj));
    obj.button.addEventListener(`click`, this.filters_toggleFilters.bind(this, obj));

    const filters = [];
    for (const key in obj.filters) {
      if (obj.filters.hasOwnProperty(key)) {
        const filter = obj.filters[key];
        const rule = {
          id: key,
          label: filter.name
        };
        let context;
        let checkbox;
        let textInput;
        let maxInput;
        let minInput;
        switch (filter.type) {
          case `boolean`:
            rule.input = `radio`;
            rule.operators = [`equal`];
            rule.type = `boolean`;
            rule.values = [`true`, `false`];

            if (!gSettings[`${obj.id}_m_b`]) {
              const attributes = {};
              if (!gSettings[`${obj.id}_${key}`] || !filter.check) {
                attributes.class = `esgst-hidden`;
              }
              context = createElements(booleanFilters, `beforeEnd`, [{
                attributes,
                type: `div`,
                children: [{
                  type: `span`
                }, {
                  attributes: {
                    class: `esgst-gf-filter-count`,
                    title: `Number of items this rule is hiding`
                  },
                  type: `span`
                }, {
                  text: filter.name,
                  type: `node`
                }]
              }]);
              checkbox = new Checkbox(context.firstElementChild, `enabled`, true);
              obj.basicFilters[rule.id] = {
                data: {
                  basicCount: context.firstElementChild.nextElementSibling
                },
                input: rule.input,
                operator: `equal`,
                type: rule.type,
                filterType: `boolean`,
                checkbox: checkbox
              };
              checkbox.onChange = this.filters_basicToAdv.bind(this, obj);
            }
            break;
          case `number`:
            rule.operators = [
              `equal`,
              `not_equal`,
              `less`,
              `less_or_equal`,
              `greater`,
              `greater_or_equal`,
              `is_null`,
              `is_not_null`
            ];
            if (filter.date) {
              rule.input = (rule, name) => {
                return `
                  <input class="form-control" name="${name}" type="date">
                `;
              };
              rule.type = `date`;

              if (!gSettings[`${obj.id}_m_b`]) {
                const attributes = {};
                if (!gSettings[`${obj.id}_${key}`] || !filter.check) {
                  attributes.class = `esgst-hidden`;
                }
                context = createElements(numberFilters, `beforeEnd`, [{
                  attributes,
                  type: `div`,
                  children: [{
                    attributes: {
                      class: `esgst-gf-filter-count`,
                      title: `Number of items this rule is hiding`
                    },
                    type: `span`
                  }, {
                    text: filter.name,
                    type: `node`
                  }, {
                    type: `span`,
                    children: [{
                      attributes: {
                        type: `date`
                      },
                      type: `input`
                    }, {
                      text: `-`,
                      type: `node`
                    }, {
                      attributes: {
                        type: `date`
                      },
                      type: `input`
                    }]
                  }]
                }]);
              }
            } else {
              rule.input = `number`;
              if (filter.step) {
                rule.type = `double`;
              } else {
                rule.type = `integer`;
              }
              rule.validation = {
                max: filter.maxValue,
                min: filter.minValue,
                step: filter.step
              };

              if (!gSettings[`${obj.id}_m_b`]) {
                const attributes = {};
                if (!gSettings[`${obj.id}_${key}`] || !filter.check) {
                  attributes.class = `esgst-hidden`;
                }
                context = createElements(numberFilters, `beforeEnd`, [{
                  attributes,
                  type: `div`,
                  children: [{
                    attributes: {
                      class: `esgst-gf-filter-count`,
                      title: `Number of items this rule is hiding`
                    },
                    type: `span`
                  }, {
                    text: filter.name,
                    type: `node`
                  }, {
                    type: `span`,
                    children: [{
                      attributes: {
                        type: `number`
                      },
                      type: `input`
                    }, {
                      text: `-`,
                      type: `node`
                    }, {
                      attributes: {
                        type: `number`
                      },
                      type: `input`
                    }]
                  }]
                }]);
              }
            }

            if (!gSettings[`${obj.id}_m_b`]) {
              minInput = context.lastElementChild.firstElementChild;
              maxInput = minInput.nextElementSibling;
              obj.basicFilters[rule.id] = {
                data: {
                  basicCount: context.firstElementChild
                },
                input: rule.input,
                type: rule.type,
                filterType: `number`,
                maxInput: maxInput,
                minInput: minInput
              };
              maxInput.addEventListener(`change`, this.filters_basicToAdv.bind(this, obj));
              minInput.addEventListener(`change`, this.filters_basicToAdv.bind(this, obj));
            }

            break;
          case `string`:
            rule.input = `text`;
            rule.operators = [`contains`, `not_contains`];
            rule.placeholder = `Item1, Item2, ...`;
            rule.type = `string`;

            if (!gSettings[`${obj.id}_m_b`]) {
              const attributes = {};
              if (!gSettings[`${obj.id}_${key}`] || !filter.check) {
                attributes.class = `esgst-hidden`;
              }
              context = createElements(stringFilters, `beforeEnd`, [{
                attributes,
                type: `div`,
                children: [{
                  type: `span`,
                  children: [{
                    type: `span`
                  }, {
                    text: ` ${filter.name}`,
                    type: `node`
                  }]
                }, {
                  attributes: {
                    class: `esgst-gf-filter-count`,
                    title: `Number of items this rule is hiding`
                  },
                  type: `span`
                }, {
                  attributes: {
                    placeholder: `Item1, Item2, ...`,
                    type: `text`
                  },
                  type: `input`
                }]
              }]);
              checkbox = new Checkbox(context.firstElementChild.firstElementChild, `enabled`, true);
              textInput = context.lastElementChild;
              obj.basicFilters[rule.id] = {
                data: {
                  basicCount: context.firstElementChild.nextElementSibling
                },
                id: rule.id,
                input: rule.input,
                type: rule.type,
                filterType: `string`,
                checkbox: checkbox,
                textInput: textInput
              };
              checkbox.onChange = this.filters_basicToAdv.bind(this, obj);
              textInput.addEventListener(`change`, this.filters_basicToAdv.bind(this, obj));
            }
            break;
        }
        if (!rule.data) {
          rule.data = {};
        }
        rule.data.check = gSettings[`${obj.id}_${rule.id}`] && filter.check;
        filters.push(rule);
      }
    }

    if (!gSettings[`${obj.id}_m_b`]) {
      createElements(stringFilters, `beforeEnd`, [{
        attributes: {
          class: `esgst-gf-legend-panel`
        },
        type: `div`,
        children: [{
          attributes: {
            class: `esgst-bold`
          },
          text: `Legend:`,
          type: `div`
        }, {
          type: `div`,
          children: [{
            attributes: {
              class: `fa fa-check-square`
            },
            type: `i`
          }, {
            text: ` - Show All`,
            type: `node`
          }]
        }, {
          type: `div`,
          children: [{
            attributes: {
              class: `fa fa-square-o`
            },
            type: `i`
          }, {
            text: ` - Hide All`,
            type: `node`
          }]
        }, {
          type: `div`,
          children: [{
            attributes: {
              class: `fa fa-square`
            },
            type: `i`
          }, {
            text: ` - Show Only`,
            type: `node`
          }]
        }]
      }]);
      if (obj.rules.rules && obj.rules.rules.length) {
        this.filters_applyBasic(obj, obj.rules);
      }
    }
    if (!gSettings[`${obj.id}_m_a`]) {
      const templates = {
        group: `
          <div id="{{= it.group_id }}" class="rules-group-container">
            <div class="rules-group-header">
              <span class="esgst-gf-filter-count" title="Number of items this group is hiding">0</span>
              <div class="btn-group pull-right group-actions">
                <button type="button" class="btn btn-xs btn-success" data-add="rule">
                  <i class="{{= it.icons.add_rule }}"></i> {{= it.translate("add_rule") }}
                </button>
              {{? it.settings.allow_groups===-1 || it.settings.allow_groups>=it.level }}
                <button type="button" class="btn btn-xs btn-success" data-add="group">
                  <i class="{{= it.icons.add_group }}"></i> {{= it.translate("add_group") }}
                </button>
              {{?}}
              {{? it.level>1 }}
                <button type="button" class="btn btn-xs btn-primary" data-pause="group">
                  <i class="{{= it.icons.pause_group }}"></i> {{= it.translate("pause_group") }}
                </button>
                <button type="button" class="btn btn-xs btn-primary" data-resume="group">
                  <i class="{{= it.icons.resume_group }}"></i> {{= it.translate("resume_group") }}
                </button>
                <button type="button" class="btn btn-xs btn-danger" data-delete="group">
                  <i class="{{= it.icons.remove_group }}"></i> {{= it.translate("delete_group") }}
                </button>
              {{?}}
              </div>
              <div class="btn-group group-conditions">
              {{~ it.conditions: condition }}
                <label class="btn btn-xs btn-default">
                  <input type="radio" name="{{= it.group_id }}_cond" value="{{= condition }}"> {{= it.translate("conditions", condition) }}
                </label>
              {{~}}
              </div>
            {{? it.settings.display_errors }}
              <div class="error-container">
                <i class="{{= it.icons.error }}"></i>
              </div>
            {{?}}
            </div>
            <div class=rules-group-body>
              <div class=rules-list></div>
            </div>
          </div>
        `,
        rule: `
          <div id="{{= it.rule_id }}" class="rule-container">
            <div class="rule-header">
              <div class="btn-group pull-right rule-actions">
                <button type="button" class="btn btn-xs btn-primary" data-pause="rule">
                  <i class="{{= it.icons.pause_rule }}"></i> {{= it.translate("pause_rule") }}
                </button>
                <button type="button" class="btn btn-xs btn-primary" data-resume="rule">
                  <i class="{{= it.icons.resume_rule }}"></i> {{= it.translate("resume_rule") }}
                </button>
                <button type="button" class="btn btn-xs btn-danger" data-delete="rule">
                  <i class="{{= it.icons.remove_rule }}"></i> {{= it.translate("delete_rule") }}
                </button>
              </div>
            </div>
          {{? it.settings.display_errors }}
            <div class="error-container">
              <i class="{{= it.icons.error }}"></i>
            </div>
          {{?}}
            <span class="esgst-gf-filter-count" title="Number of items this rule is hiding">0</span>
            <div class="rule-filter-container"></div>
            <div class="rule-operator-container"></div>
            <div class="rule-value-container"></div>
          </div>
        `,
        filterSelect: `
          {{ var optgroup = null; }}
          <select class="form-control" name="{{= it.rule.id }}_filter">
          {{? it.settings.display_empty_filter }}
            <option value="-1">{{= it.settings.select_placeholder }}</option>
          {{?}}
          {{~ it.filters: filter }}
            {{ var className = filter.data.check ? '' : 'class="esgst-hidden"'; }}
            {{? optgroup !== filter.optgroup }}
              {{? optgroup !== null }}</optgroup>{{?}}
              {{? (optgroup = filter.optgroup) !== null }}
                <optgroup label="{{= it.translate(it.settings.optgroups[optgroup]) }}">
              {{?}}
            {{?}}
            <option {{= className }} value="{{= filter.id }}" {{? filter.icon}}data-icon="{{= filter.icon}}"{{?}}>{{= it.translate(filter.label) }}</option>
          {{~}}
          {{? optgroup !== null }}</optgroup>{{?}}
          </select>
        `
      };
      const options = {
        filters: filters,
        icons: {
          add_group: `fa fa-plus`,
          add_rule: `fa fa-plus`,
          pause_group: `fa fa-pause`,
          pause_rule: `fa fa-pause`,
          remove_group: `fa fa-times`,
          remove_rule: `fa fa-times`,
          resume_group: `fa fa-play`,
          resume_rule: `fa fa-play`,
          error: `fa fa-exclamation`
        },
        plugins: {
          [`bt-checkbox`]: {
            font: `fontawesome`
          },
          [`not-group`]: {
            icon_checked: `fa fa-check-square-o`,
            icon_unchecked: `fa fa-square-o`
          },
          [`sortable`]: {
            icon: `fa fa-arrows`
          }
        },
        sort_filters: true,
        lang: {
          pause_group: `Pause`,
          pause_rule: `Pause`,
          resume_group: `Resume`,
          resume_rule: `Resume`
        },
        templates: templates
      };
      if (obj.rules.rules && obj.rules.rules.length) {
        options.rules = obj.rules;
      }
      window.$(advancedFilters).queryBuilder(options);
      obj.builder = window.$(advancedFilters)[0].queryBuilder;
      [obj.rules, obj.rules_save] = this.filters_changeRules(obj);

      obj.builder.$el.on(`click.queryBuilder`, `[data-pause=group]`, event => {
        const group = event.currentTarget.closest(`.rules-group-container`);
        group.setAttribute(`data-esgst-paused`, true);
        this.onRulesChanged(obj, {});
      });
      obj.builder.$el.on(`click.queryBuilder`, `[data-resume=group]`, event => {
        const group = event.currentTarget.closest(`.rules-group-container`);
        group.removeAttribute(`data-esgst-paused`);
        this.onRulesChanged(obj, {});
      });
      obj.builder.$el.on(`click.queryBuilder`, `[data-pause=rule]`, event => {
        const rule = event.currentTarget.closest(`.rule-container`);
        rule.setAttribute(`data-esgst-paused`, true);
        this.onRulesChanged(obj, {});
      });
      obj.builder.$el.on(`click.queryBuilder`, `[data-resume=rule]`, event => {
        const rule = event.currentTarget.closest(`.rule-container`);
        rule.removeAttribute(`data-esgst-paused`);
        this.onRulesChanged(obj, {});
      });

      obj.builder.on(`rulesChanged.queryBuilder`, () => {
        if (!this.isProgrammaticChange) {
          this.onRulesChanged(obj, {});
        }
      });
      obj.builder.on(`getRules.queryBuilder.filter`, this.filters_changeRules.bind(this, obj));
    }

    if (gSettings[`${obj.id}_m_b`]) {
      basicFilters.classList.add(`esgst-hidden`);
      basicFilters.nextElementSibling.classList.add(`esgst-hidden`);
    }
    if (gSettings[`${obj.id}_m_a`]) {
      advancedFilters.classList.add(`esgst-hidden`);
      basicFilters.nextElementSibling.classList.add(`esgst-hidden`);
    }

    if (obj.id === `gf`) {
      [
        {
          id: `filter_os`,
          key: `os`,
          name: `OS`
        },
        {
          id: `filter_giveaways_exist_in_account`,
          key: `alreadyOwned`,
          name: `Already Owned`
        },
        {
          id: `filter_giveaways_missing_base_game`,
          key: `dlcMissingBase`,
          name: `DLC Missing Base`
        },
        {
          id: `filter_giveaways_level`,
          key: `aboveLevel`,
          name: `Above Level`
        },
        {
          id: `filter_giveaways_additional_games`,
          key: `manuallyFiltered`,
          name: `Manually Filtered`
        }
      ].forEach(filter => {
        if (!gSettings[`${obj.id}_${filter.key}`]) return;

        const children = [{
          text: filter.name,
          type: `node`
        }];
        if (filter.key === `os`) {
          // @ts-ignore
          children.push({
            type: `select`,
            children: [{
              attributes: {
                value: `0`
              },
              text: `All`,
              type: `option`
            }, {
              attributes: {
                value: `1`
              },
              text: `Windows`,
              type: `option`
            }, {
              attributes: {
                value: `2`
              },
              text: `Linux`,
              type: `option`
            }, {
              attributes: {
                value: `3`
              },
              text: `Mac`,
              type: `option`
            }]
          });
        }
        const sgFilter = createElements(sgFilters, `beforeEnd`, [{
          attributes: {
            class: `esgst-gf-category-filter`
          },
          type: `div`,
          children: [{
            type: `span`,
            children
          }, {
            attributes: {
              class: `fa fa-circle-o-notch fa-spin esgst-hidden`
            },
            type: `i`
          }, {
            attributes: {
              class: `fa fa-check esgst-green esgst-hidden`
            },
            type: `i`
          }]
        }]);
        const check = sgFilter.lastElementChild;
        const spinning = check.previousElementSibling;
        if (filter.key === `os`) {
          const select = sgFilter.firstElementChild.firstElementChild;
          select.value = gSettings[filter.id];
          select.addEventListener(`change`, async () => {
            check.classList.add(`esgst-hidden`);
            spinning.classList.remove(`esgst-hidden`);
            await setSetting(filter.id, select.value);
            await request({
              data: `filter_os=${gSettings.filter_os}&filter_giveaways_exist_in_account=${gSettings.filter_giveaways_exist_in_account}&filter_giveaways_missing_base_game=${gSettings.filter_giveaways_missing_base_game}&filter_giveaways_level=${gSettings.filter_giveaways_level}&filter_giveaways_additional_games=${gSettings.filter_giveaways_additional_games}&xsrf_token=${this.esgst.xsrfToken}`,
              method: `POST`,
              url: `/account/settings/giveaways`
            });
            spinning.classList.add(`esgst-hidden`);
            check.classList.remove(`esgst-hidden`);
          });
        } else {
          const checkbox = new Checkbox(sgFilter, !!gSettings[filter.id]);
          checkbox.onChange = async () => {
            check.classList.add(`esgst-hidden`);
            spinning.classList.remove(`esgst-hidden`);
            await setSetting(filter.id, checkbox.value ? 1 : 0);
            await request({
              data: `filter_os=${gSettings.filter_os}&filter_giveaways_exist_in_account=${gSettings.filter_giveaways_exist_in_account}&filter_giveaways_missing_base_game=${gSettings.filter_giveaways_missing_base_game}&filter_giveaways_level=${gSettings.filter_giveaways_level}&filter_giveaways_additional_games=${gSettings.filter_giveaways_additional_games}&xsrf_token=${this.esgst.xsrfToken}`,
              method: `POST`,
              url: `/account/settings/giveaways`
            });
            spinning.classList.add(`esgst-hidden`);
            check.classList.remove(`esgst-hidden`);
          };
        }
      });
    }
    if (sgFilters.children.length === 1) {
      sgFilters.classList.add(`esgst-hidden`);
    }

    let warnings = [];
    const now = Date.now();
    const usedFilters = this.getUsedFilters(obj.rules);
    for (const key of usedFilters) {
      const filter = obj.filters[key];        
      if (filter.category && (!gSettings.gc || !gSettings[filter.category])) {
        warnings.push(`"${filter.name}" requires "${shared.common.getFeatureName(null, filter.category)}" to be enabled in the settings menu.`);
      } else if (filter.sync) {
        for (const syncKey of filter.sync) {
          if (now - gSettings[`lastSync${syncKey}`] > 2592000000) {
            warnings.push(`"${filter.name}" requires "${SYNC_KEYS[`sync${syncKey}`].name}" to be synced in the sync menu, but that item has either never been synced or it was last synced more than 30 days ago.`);
          }
        }
      }
    }

    if (warnings.length > 0) {
      shared.common.createElements_v2(obj.warningsPanel, `beforeEnd`, [
        `You are using some filters that may require your attention:`,
        [`div`, { class: `markdown` }, [
          [`ul`, warnings.map(x => [`li`, x])]
        ]]
      ]);
      obj.button.classList.add(`warning`);
    }

    return headingButton;
  }

  getUsedFilters(rule, usedFilters = new Set()) {
    if (rule.condition) {
      for (const subRule of rule.rules) {
        this.getUsedFilters(subRule, usedFilters);
      }
      return usedFilters;
    } else {
      usedFilters.add(rule.id);
    }
  }

  onRulesChanged(obj, event) {
    try {
      [obj.rules, obj.rules_save] = this.filters_changeRules(obj, event);
      if (!obj.basicApplied && !gSettings[`${obj.id}_m_b`]) {
        this.filters_resetBasic(obj);
        this.filters_applyBasic(obj, obj.rules);
      }
      this.filters_filter(obj);
    } catch (e) {
      logger.error(e.stack);
    }
    obj.basicApplied = false;
  }

  filter_manual(obj) {
    if (obj.manualPopup) {
      obj.manualPopup.open();
      return;
    }
    obj.manualPopup = new Popup({
      icon: `fa-book`,
      title: `Advanced Filters Manual`,
      addScrollable: `left`
    });
    obj.manualPopup.getScrollable([
      [`div`, { class: `esgst-bold` }, `Interface`],
      [`br`],
      [`div`, { class: `markdown` }, [
        [`ul`, [
          [`li`, [
            [`span`, { class: `esgst-bold` }, [
              [`i`, { class: `fa fa-square-o` }],
              ` NOT`
            ]],
            ` - If checked, only items that do not apply to the group will be shown.`
          ]],
          [`li`, [
            [`span`, { class: `esgst-bold` }, `AND`],
            ` - Turns the group into an AND group, which means that only items that apply to every single rule of the group will be shown.`
          ]],
          [`li`, [
            [`span`, { class: `esgst-bold` }, `OR`],
            ` - Turns the group into an OR group, which means that only items that apply to at least one rule of the group will be shown.`
          ]],
          [`li`, [
            [`span`, { class: `esgst-bold` }, [
              [`i`, { class: `fa fa-arrows` }]
            ]],
            ` - Allows you reorder/move rules/groups. The order of the rules does not alter the result.`
          ]],
          [`li`, [
            [`span`, { class: `esgst-bold` }, [
              [`i`, { class: `fa fa-pause` }],
              ` Pause`
            ]],
            ` - Allows you to pause the rule/group, so that it does not filter anything until you resume it or refresh the page.`
          ]],
          [`li`, `The other buttons in the interface should be self-explanatory.`]
        ]]
      ]],
      [`br`],
      [`div`, { class: `esgst-bold` }, `Types of Filters`],
      [`br`],
      [`div`, { class: `markdown` }, [
        [`ul`, [
          [`li`, [
            [`span`, { class: `esgst-bold` }, `Boolean`],
            ` - Presents a choice between true and false. Set to true if you only want to see items that apply to the filter, and to false otherwise. For example, if you only want to see giveaways that are on your wishlist, set wishlisted to "true"; if you only want to see giveaways that you have not entered, set entered to "false".`
          ]],
          [`li`, [
            [`span`, { class: `esgst-bold` }, `Number`],
            ` - Presents a text field and a choice between equal, not equal, less, less or equal, greater, greater or equal, is null and is not null. Enter the value that you want in the text field and choose the option that you want. For example, if you only want to see giveaways above level 5, you can either set level to "greater than 4" or to "greater or equal to 5". The is null and is not null options regard the presence of the filter. For example, some giveaways do not have a rating. If you still want to see those giveaways when filtering by rating, add an additional rule and set rating to "is null".`
          ]],
          [`li`, [
            [`span`, { class: `esgst-bold` }, `Text`],
            ` - Presents a text field and a choice between contains and doesn't contain. Enter the values that you want in the text field, separated by a comma followed by a space, and choose the option that you want. For example, if you only want to see giveaways that have the adventure or the action genres, set genres to "contains Adventure, Action". But if you only want to see giveaways that have both the adventure and the action genres, add 2 rules, set one to "contains Adventure" and the other to "contains Action", and turn the group into an AND group.`
          ]]
        ]]
      ]],
      [`br`],
      [`div`, { class: `esgst-bold` }, `Building the Filters`],
      [`br`],
      [`div`, { class: `markdown` }, [
        [`div`, `The process of building the filters might seem intimidating at first, but it is actually quite simple. Just think of it like this:`],
        [`ul`, [
          [`li`, `Show me a="true" AND b="false".`],
          [`li`, `Show me a="false" OR b="true".`],
          [`li`, `Do NOT show me a="true".`]
        ]],
        [`div`, `The building process for the filters above becomes, respectively:`],
        [`ul`, [
          [`li`, `Turn group into AND, add rule a="true", add rule b="false".`],
          [`li`, `Turn group into OR, add rule a="false", add rule b="true".`],
          [`li`, `Check NOT option, add rule a="true".`]
        ]],
        [`div`, `For more advanced filters, think in parenthesis:`],
        [`ul`, [
          [`li`, `Show me (a="true" AND b="false") OR c="greater or equal to 5".`],
          [`li`, `Show me (a="false" AND b="true" AND c="false") OR (d="true" AND e="false") OR f="equal to 2".`],
          [`li`, `Show me (a="true" AND b="false" AND c="true" AND d="false") AND do NOT show me e="contains Adventure, Action".`]
        ]],
        [`div`, `Each parenthesis represents a new group. NOT filters also represent a new group, since there isn't a NOT option for rules. So the building process for the filters above becomes, respectively:`],
        [`ul`, [
          [`li`, `Turn group into OR, add group (turn group into AND, add rule a="true", add rule b="false"), add rule c="greater or equal to 5".`],
          [`li`, `Turn group into OR, add group (turn group into AND, add rule a="false", add rule b="true", add rule c="false"), add group (turn group into AND, add rule d="true", add rule e="false"), add rule f="equal to 2".`],
          [`li`, `Turn group into AND, add group (turn group into AND, add rule a="true", add rule b="false", add rule c="true", add rule d="false"), add group (check NOT option, add rule e="contains Adventure, Action").`]
        ]],
        [`div`, `Real example: suppose you only want to see giveaways that are for level 5 or more and that have achievements or trading cards. The sentence for that system is:`],
        [`ul`, [
          [`li`, `Show me level="greater or equal to 5" AND (achievements="true" OR tradingCards="true").`]
        ]],
        [`div`, `And the building process is:`],
        [`ul`, [
          [`li`, `Turn group into AND, add rule level="greater or equal to 5", add group (turn group into OR, add rule achievements="true", add rule tradingCards="true").`]
        ]],
        [`div`, `The final result is illustrated in the picture below:`]
      ]],
      [`img`, { src: `https://i.imgur.com/F1UXcKs.png` }]
    ]);
    obj.manualPopup.open();
  }

  filters_convert(presets) {
    const minValues = {
      level: 0,
      entries: 0,
      copies: 1,
      points: 0,
      comments: 0,
      minutesToEnd: 0,
      minutesFromStart: 0,
      chance: 0,
      chancePerPoint: 0,
      ratio: 0,
      rating: 0,
      reviews: 0,
      releaseDate: 0
    };
    const maxValues = {
      level: 10,
      points: 100,
      minutesToEnd: 43800,
      minutesFromStart: 43800,
      chance: 100,
      chancePerPoint: 100,
      rating: 100,
      releaseDate: 3187209600
    };
    const newPresets = [];
    for (const preset of presets) {
      let newPreset = {
        condition: `AND`,
        not: false,
        rules: []
      };

      // Convert basic rules.
      for (let key in preset) {
        if (preset.hasOwnProperty(key)) {
          if (key.match(/^(authors|creators|exceptions|genres|groups|words|name|overrides)$/)) {
            continue;
          }

          const isMax = key.match(/^max/);
          const isMin = key.match(/^min/);
          const value = preset[key];
          key = key.replace(/(^(max|min))|List$/, ``);
          key = `${key[0].toLowerCase()}${key.slice(1)}`;
          if (isMax) {
            if (value !== maxValues[key] && !value.toString().match(/^9+$/)) {
              newPreset.rules.push({
                field: key,
                id: key,
                input: key === `releaseDate` ? `date` : `number`,
                operator: `less_or_equal`,
                type: key === `releaseDate` ? `text` : (key.match(/^(chance|chancePerPoint)$/) ? `double` : `integer`),
                value: value
              });
            }
          } else if (isMin) {
            if (value !== minValues[key]) {
              newPreset.rules.push({
                field: key,
                id: key,
                input: key === `releaseDate` ? `date` : `number`,
                operator: `greater_or_equal`,
                type: key === `releaseDate` ? `text` : (key.match(/^(chance|chancePerPoint)$/) ? `double` : `integer`),
                value: value
              });
            }
          } else if (value && typeof value === `string` && !value.match(/^(enabled|undefined)$/)) {
            if (value === `disabled`) {
              newPreset.rules.push({
                field: key,
                id: key,
                input: `radio`,
                operator: `equal`,
                type: `boolean`,
                value: false
              });
            } else if (value === `none`) {
              newPreset.rules.push({
                field: key,
                id: key,
                input: `radio`,
                operator: `equal`,
                type: `boolean`,
                value: true
              });
            } else {
              const rule = {
                field: key,
                id: key,
                input: `text`,
                operator: preset[key] === `disabled` ? `not_contains` : `contains`,
                type: `string`,
                value: value
              };
              if (preset[key] === `enabled`) {
                rule.data = {
                  paused: true
                };
              }
              newPreset.rules.push(rule);
            }
          }
        }
      }

      // Convert exceptions.
      let newExceptions = null;
      if (preset.exceptions) {
        newExceptions = {
          condition: `OR`,
          not: false,
          rules: []
        };
        if (newPreset.rules.length) {
          newExceptions.rules.push(newPreset);
        }
        for (const exception of preset.exceptions) {
          const newException = {
            condition: `AND`,
            not: false,
            rules: []
          };
          for (let key in exception) {
            if (exception.hasOwnProperty(key)) {
              if (key.match(/^(authors|creators|exceptions|genres|groups|words|name|overrides)$/)) {
                continue;
              }

              const isMax = key.match(/^max/);
              const isMin = key.match(/^min/);
              const value = preset[key];
              key = key.replace(/(^(max|min))|List$/, ``);
              key = `${key[0].toLowerCase()}${key.slice(1)}`;
              if (isMax) {
                if (value !== maxValues[key] && !value.toString().match(/^9+$/)) {
                  newException.rules.push({
                    field: key,
                    id: key,
                    input: key === `releaseDate` ? `date` : `number`,
                    operator: `less_or_equal`,
                    type: key === `releaseDate` ? `text` : (key.match(/^(chance|chancePerPoint)$/) ? `double` : `integer`),
                    value: value
                  });
                }
              } else if (isMin) {
                if (value !== minValues[key]) {
                  newException.rules.push({
                    field: key,
                    id: key,
                    input: key === `releaseDate` ? `date` : `number`,
                    operator: `greater_or_equal`,
                    type: key === `releaseDate` ? `text` : (key.match(/^(chance|chancePerPoint)$/) ? `double` : `integer`),
                    value: value
                  });
                }
              } else if (value && value !== `undefined`) {
                if (key.match(/^(authors|creators|genres|groups|words)$/)) {
                  if (exception[key]) {
                    newException.rules.push({
                      field: key,
                      id: key,
                      input: `text`,
                      operator: `contains`,
                      type: `string`,
                      value: value
                    });
                  }
                } else {
                  newException.rules.push({
                    field: key,
                    id: key,
                    input: `radio`,
                    operator: `equal`,
                    type: `boolean`,
                    value: true
                  });
                }
              }
            }
          }
          if (newException.rules.length) {
            newExceptions.rules.push(newException);
          }
        }

        // Apply overrides.
        if (preset.overrides) {
          for (let i = newPreset.rules.length - 1; i > -1; i--) {
            const rule = newPreset.rules[i];
            if (preset.overrides[rule.id]) {
              for (const exception of newExceptions.rules) {
                if (exception === newPreset) continue;

                exception.rules.push(rule);
              }
            }
          }
        }

        if (newExceptions.rules.length) {
          newPreset = newExceptions;
        }
      }

      if (newPreset.rules.length) {
        newPreset.valid = true;
        newPresets.push({
          name: `__old-preset__${preset.name}`,
          rules: newPreset
        });
      }
    }
    return newPresets;
  }

  filters_changeRules(obj, event) {
    let out = [{
      condition: `AND`,
      not: false,
      rules: [],
      valid: true
    }, {
      condition: `AND`,
      not: false,
      rules: [],
      valid: true
    }];
    let valid = false;
    try {
      valid = obj.builder.validate();
    } catch (e) {
      return out;
    }
    if (!valid) {
      if (event) {
        event.value = out;
      }
      return out;
    }

    out = (function parse(group) {
      const groupData = {
        condition: group.condition,
        data: {
          count: group.$el[0].getElementsByClassName(`esgst-gf-filter-count`)[0]
        },
        rules: []
      };
      const groupData_save = {
        condition: group.condition,
        rules: []
      };
      group.each(function (rule) {
        if (!event) {
          if (rule.data && rule.data.paused) {
            rule.$el[0].setAttribute(`data-esgst-paused`, true);
          } else {
            rule.$el[0].removeAttribute(`data-esgst-paused`);
          }
        }

        let value = null;
        if (!rule.operator || rule.operator.nb_inputs !== 0) {
          value = rule.value;
        }
        const ruleData = {
          data: rule.data,
          id: rule.filter ? rule.filter.id : null,
          field: rule.filter ? rule.filter.field : null,
          type: rule.filter ? rule.filter.type : null,
          input: rule.filter ? rule.filter.input : null,
          operator: rule.operator ? rule.operator.type : null,
          value: value
        };
        if (groupData.condition === `AND`) {
          if (!ruleData.data) {
            ruleData.data = {};
          }
          ruleData.data.count = rule.$el[0].getElementsByClassName(`esgst-gf-filter-count`)[0];
          ruleData.data.count.classList.remove(`esgst-hidden`);
        } else {
          rule.$el[0].getElementsByClassName(`esgst-gf-filter-count`)[0].classList.add(`esgst-hidden`);
        }
        const ruleData_save = {
          id: rule.filter ? rule.filter.id : null,
          field: rule.filter ? rule.filter.field : null,
          type: rule.filter ? rule.filter.type : null,
          input: rule.filter ? rule.filter.input : null,
          operator: rule.operator ? rule.operator.type : null,
          value: value
        };
        if (rule.$el[0].getAttribute(`data-esgst-paused`)) {
          if (!ruleData.data) {
            ruleData.data = {};
          }
          ruleData.data.paused = true;
          ruleData_save.data = {
            paused: true
          };
        } else if (ruleData.data && ruleData.data.paused) {
          delete ruleData.data.paused;
        }
        groupData.rules.push(obj.builder.change(`ruleToJson`, ruleData, rule));
        groupData_save.rules.push(obj.builder.change(`ruleToJson`, ruleData_save, rule));
      }, function (model) {
        if (!event) {
          if (model.data && model.data.paused) {
            model.$el[0].setAttribute(`data-esgst-paused`, true);
          } else {
            model.$el[0].removeAttribute(`data-esgst-paused`);
          }
        }

        const [data, data_save] = parse(model);
        if (data.rules.length !== 0) {
          if (model.$el[0].getAttribute(`data-esgst-paused`)) {
            data_save.data = {
              paused: true
            };
          } else {
            groupData.rules.push(data);
          }
          groupData_save.rules.push(data_save);
        }
      }, obj.builder);

      return [
        obj.builder.change(`groupToJson`, groupData, group),
        obj.builder.change(`groupToJson`, groupData_save, group)
      ];
    }(obj.builder.model.root));

    out[0].valid = valid;
    out[1].valid = valid;

    if (event) {
      event.value = out;
    }

    return out;
  }

  filters_basicToAdv(obj) {
    const adv = {
      condition: `AND`,
      not: false,
      rules: [],
      valid: true
    };
    for (const id in obj.basicFilters) {
      if (obj.basicFilters.hasOwnProperty(id)) {
        const filter = obj.basicFilters[id];
        switch (filter.filterType) {
          case `boolean`:
            if (filter.checkbox.value === `enabled`) break;

            adv.rules.push({
              data: filter.data,
              field: id,
              id: id,
              input: filter.input,
              operator: filter.operator,
              type: filter.type,
              value: filter.checkbox.value === `none`
            });
            break;
          case `number`:
            if (filter.maxInput.value) {
              adv.rules.push({
                data: filter.data,
                field: id,
                id: id,
                input: filter.input,
                operator: `less_or_equal`,
                type: filter.type,
                value: filter.maxInput.value
              });
            }
            if (filter.minInput.value) {
              adv.rules.push({
                data: filter.data,
                field: id,
                id: id,
                input: filter.input,
                operator: `greater_or_equal`,
                type: filter.type,
                value: filter.minInput.value
              });
            }
            break;
          case `string`:
            if (!filter.textInput.value) break;

            if (filter.checkbox.value === `enabled`) {
              if (!filter.data) {
                filter.data = {};
              }
              filter.data.paused = true;
            } else if (filter.data && filter.data.paused) {
              delete filter.data.paused;
            }
            adv.rules.push({
              data: filter.data,
              field: id,
              id: id,
              input: filter.input,
              operator: filter.checkbox.value === `disabled` ? `not_contains` : `contains`,
              type: filter.type,
              value: filter.textInput.value
            });
            break;
        }
      }
    }
    obj.rules = adv;
    if (obj.rules.rules) {
      if (gSettings[`${obj.id}_m_a`]) {
        obj.rules_save = obj.rules;
        this.filters_filter(obj);
      } else {
        if (!obj.rules.rules.length) {
          obj.rules = {
            condition: `AND`,
            rules: [
              {empty: true}
            ],
            valid: true
          };
        }
        obj.basicApplied = true;
        this.isProgrammaticChange = true;
        obj.builder.setRules(obj.rules);
        this.onRulesChanged(obj);
        this.isProgrammaticChange = false;
      }
    }
  }

  filters_applyBasic(obj, rules) {
    if (rules.condition !== `AND`) return;

    for (const rule of rules.rules) {
      if (rule.condition) continue;

      const filter = obj.basicFilters[rule.id];
      switch (rule.type) {
        case `boolean`:
          filter.checkbox.change(false, rule.value ? `none` : `disabled`);
          break;
        case `date`:
        case `double`:
        case `integer`:
          if (rule.operator === `less_or_equal`) {
            filter.maxInput.value = rule.value;
          } else if (rule.operator === `greater_or_equal`) {
            filter.minInput.value = rule.value;
          }
          break;
        case `string`:
          filter.checkbox.change(false, rule.operator === `contains` ? (rule.data && rule.data.paused ? `enabled` : `none`) : `disabled`);
          filter.textInput.value = rule.value;
          break;
      }
    }
  }

  filters_resetBasic(obj) {
    for (const id in obj.basicFilters) {
      if (obj.basicFilters.hasOwnProperty(id)) {
        const filter = obj.basicFilters[id];
        switch (filter.filterType) {
          case `boolean`:
            filter.checkbox.change(false, `enabled`);
            break;
          case `number`:
            filter.maxInput.value = ``;
            filter.minInput.value = ``;
            break;
          case `string`:
            filter.checkbox.change(false, `enabled`);
            filter.textInput.value = ``;
            break;
        }
      }
    }
  }

  async filters_savePreset(obj) {
    const name = obj.presetInput.value;

    if (!name) {
      obj.presetWarning.classList.remove(`esgst-hidden`);
      return;
    }

    obj.presetWarning.classList.add(`esgst-hidden`);
    const preset = {
      name,
      rules: obj.rules_save
    };
    let i;
    const presets = gSettings[obj.key];
    for (i = presets.length - 1; i > -1 && presets[i].name !== name; i--) {
    }
    if (i > -1) {
      presets[i] = preset;
    } else {
      presets.push(preset);
    }
    await setSetting([
      {
        id: `${obj.id}_preset${obj.type}`,
        value: name
      },
      {
        id: obj.key,
        value: presets
      }
    ]);
    createFadeMessage(obj.presetMessage, `Saved!`);
  }

  async filters_openPresetPopup(obj) {
    const popup = new Popup({addScrollable: true, icon: `fa-sliders`, isTemp: true, title: `Manage presets:`});
    createElements(popup.description, `afterBegin`, [{
      attributes: {
        class: `esgst-description`
      },
      text: `To edit a preset, apply it and save it with the same name. To rename a preset, click the edit icon, enter the new name and hit "Enter". Drag and drop presets to move them.`,
      type: `div`
    }]);
    let deleted = [];
    const undoButton = createElements(popup.description, `beforeEnd`, [{
      attributes: {
        class: `esgst-clickable esgst-hidden`
      },
      type: `div`,
      children: [{
        attributes: {
          class: `fa fa-rotate-left`,
        },
        type: `i`
      }, {
        text: `Undo Delete`,
        type: `span`
      }]
    }]);
    undoButton.addEventListener(`click`, this.filters_undoDeletePreset.bind(this, obj, deleted, undoButton));
    const table = createElements(popup.scrollable, `beforeEnd`, [{
      attributes: {
        class: `esgst-text-left popup__keys__list`
      },
      type: `div`
    }]);
    for (const preset of gSettings[obj.key]) {
      const attributes = {
        draggable: true
      };
      if (obj.presetInput.value === preset.name) {
        attributes.class = `esgst-green-highlight`;
      }
      const row = createElements(table, `beforeEnd`, [{
        attributes,
        type: `div`,
        children: [{
          attributes: {
            class: `esgst-float-left`
          },
          type: `div`,
          children: [{
            attributes: {
              class: `esgst-hidden`,
              type: `text`,
              value: preset.name
            },
            type: `input`
          }, {
            attributes: {
              class: `esgst-clickable`
            },
            text: preset.name,
            type: `strong`
          }]
        }, {
          attributes: {
            class: `esgst-clickable esgst-float-right`
          },
          type: `div`,
          children: [{
            attributes: {
              class: `fa fa-edit`,
              title: `Rename preset`
            },
            type: `i`
          }, {
            attributes: {
              title: `Delete preset`
            },
            type: `span`,
            children: [{
              attributes: {
                class: `fa fa-trash`
              },
              type: `i`
            }]
          }]
        }, {
          attributes: {
            class: `esgst-clear`
          },
          type: `div`
        }]
      }]);
      const renameInput = row.firstElementChild.firstElementChild;
      const heading = renameInput.nextElementSibling;
      const renameButton = row.firstElementChild.nextElementSibling.firstElementChild;

      row.addEventListener(`dragstart`, this.filters_setSource.bind(this, obj, preset, row));
      row.addEventListener(`dragenter`, this.filters_getSource.bind(this, obj, row, table));
      row.addEventListener(`dragend`, this.filters_saveSource.bind(this, obj));
      renameInput.addEventListener(`keypress`, this.filters_renamePreset.bind(this, obj, heading, preset));
      heading.addEventListener(`click`, this.filters_applyPreset.bind(this, obj, popup, preset));
      renameButton.addEventListener(`click`, this.filters_showRenameInput.bind(this, heading, renameInput));
      renameButton.nextElementSibling.addEventListener(`click`, this.filters_deletePreset.bind(this, obj, deleted, preset, row, undoButton));
    }
    popup.open();
  }

  async filters_setSource(obj, preset, row, event) {
    event.dataTransfer.setData(`text/plain`, ``);
    obj.source = row;
    let i;
    const presets = gSettings[obj.key];
    for (i = presets.length - 1; i > -1 && presets[i].name !== preset.name; i--) {
    }
    obj.sourceIndex = i;
  }

  filters_getSource(obj, row, table) {
    let current = obj.source;
    let i = 0;
    do {
      current = current.previousElementSibling;
      if (current && current === row) {
        obj.sourceNewIndex = i;
        table.insertBefore(obj.source, row);
        return;
      }
      ++i;
    } while (current);
    obj.sourceNewIndex = i - 1;
    table.insertBefore(obj.source, row.nextElementSibling);
  }

  async filters_saveSource(obj) {
    const presets = gSettings[obj.key];
    presets.splice(obj.sourceNewIndex, 0, presets.splice(obj.sourceIndex, 1)[0]);
    await setSetting(obj.key, presets);
  }

  async filters_applyPreset(obj, popup, preset) {
    if (!preset.rules || !preset.rules.rules || !preset.rules.rules.length) {
      preset.rules = {
        condition: `AND`,
        rules: [
          {empty: true}
        ],
        valid: true
      };
    }

    if (!gSettings[`${obj.id}_m_b`]) {
      this.filters_resetBasic(obj);
      this.filters_applyBasic(obj, preset.rules);
    }
    if (!gSettings[`${obj.id}_m_a`]) {
      this.isProgrammaticChange = true;
      obj.builder.setRules(preset.rules);
      this.onRulesChanged(obj);
      this.isProgrammaticChange = false;
      [obj.rules, obj.rules_save] = this.filters_changeRules(obj);
    }
    popup.close();
    obj.presetDisplay.textContent = obj.presetInput.value = preset.name;
    this.filters_filter(obj);
    setSetting(`${obj.id}_preset${obj.type}`, preset.name);
  }

  filters_showRenameInput(heading, renameInput) {
    heading.classList.add(`esgst-hidden`);
    renameInput.classList.remove(`esgst-hidden`);
    const value = renameInput.value;
    renameInput.value = ``;
    renameInput.focus();
    renameInput.value = value;
  }

  async filters_renamePreset(obj, heading, preset, event) {
    if (event.key !== `Enter`) return;

    const oldName = preset.name;
    const newName = event.currentTarget.value;
    let i;
    const presets = gSettings[obj.key];
    for (i = presets.length - 1; i > -1 && presets[i].name !== oldName; i--) {
    }
    preset.name = presets[i].name = newName;
    const values = [{
      id: obj.key,
      value: presets
    }];
    heading.textContent = newName;
    if (obj.presetInput.value === oldName) {
      obj.presetDisplay.textContent = obj.presetInput.value = newName;
    }
    const types = [``, `Wishlist`, `Recommended`, `Group`, `New`, `Created`, `Entered`, `Won`, `Groups`, `User`, `Gb`, `Ge`, `Ged`];
    for (const type of types) {
      if (gSettings[`${obj.id}_preset${type}`] === oldName) {
        values.push({
          id: `${obj.id}_preset${type}`,
          value: newName
        });
      }
    }
    event.currentTarget.classList.add(`esgst-hidden`);
    heading.classList.remove(`esgst-hidden`);
    await setSetting(values);
  }

  async filters_deletePreset(obj, deleted, preset, row, undoButton, event) {
    const deleteButton = event.currentTarget;
    createElements(deleteButton, `inner`, [{
      attributes: {
        class: `fa fa-circle-o-notch fa-spin`
      },
      type: `i`
    }]);
    let i;
    const presets = gSettings[obj.key];
    for (i = presets.length - 1; i > -1 && presets[i].name !== preset.name; i--) {
    }
    presets.splice(i, 1);
    await setSetting(obj.key, presets);
    createElements(deleteButton, `inner`, [{
      attributes: {
        class: `fa fa-trash`
      },
      type: `i`
    }]);
    row.classList.add(`esgst-hidden`);
    deleted.push({
      details: preset,
      row: row
    });
    undoButton.classList.remove(`esgst-hidden`);
  }

  async filters_undoDeletePreset(obj, deleted, undoButton) {
    const preset = deleted.pop();
    preset.row.classList.remove(`esgst-hidden`);
    preset.row.parentElement.appendChild(preset.row);
    const presets = gSettings[obj.key];
    presets.push(preset.details);
    await setSetting(obj.key, presets);
    if (deleted.length === 0) {
      undoButton.classList.add(`esgst-hidden`);
    }
  }

  filters_toggleFilters(obj) {
    obj.collapseButton.classList.toggle(`esgst-hidden`);
    obj.expandButton.classList.toggle(`esgst-hidden`);
    if (obj.warningsPanel.firstElementChild) {
      obj.warningsPanel.classList.toggle(`esgst-hidden`);
    }
    obj.filtersPanel.classList.toggle(`esgst-hidden`);

  }

  filters_filter(obj, unfilter, endless) {
    if (!unfilter && !gSettings[`${obj.id}_enable${obj.type}`]) return;

    let items;
    if (obj.id === `gf`) {
      items = this.esgst.currentScope.giveaways;
    } else if (obj.id === `df`) {
      items = this.esgst.currentScope.discussions;
    } else if (obj.id === `tf`) {
      items = this.esgst.currentScope.trades;
    } else if (obj.id === `gpf`) {
      items = this.esgst.currentScope.groups;
    } else {
      items = this.esgst.currentScope.comments;
    }
    const counters = document.getElementsByClassName(`esgst-gf-filter-count`);
    for (const counter of counters) {
      counter.textContent = `0`;
    }
    let filteredCount = 0;
    let pointsCount = 0;
    for (const item of items) {
      if (unfilter) {
        if (item.outerWrap.classList.contains(`esgst-hidden`) && !item.outerWrap.getAttribute(`data-esgst-not-filterable`)) {
          item.outerWrap.classList.remove(`esgst-hidden`);
        }
        if (obj.id === `cf` && item.outerWrap.parentElement.classList.contains(`esgst-hidden`) && !item.outerWrap.parentElement.getAttribute(`data-esgst-not-filterable`)) {
          item.outerWrap.parentElement.classList.remove(`esgst-hidden`);
        }
      } else if (this.filters_filterItem(obj.filters, item, obj.rules)) {
        if (item.outerWrap.classList.contains(`esgst-hidden`) && !item.outerWrap.getAttribute(`data-esgst-not-filterable`)) {
          item.outerWrap.classList.remove(`esgst-hidden`);
        }
        if (obj.id === `cf` && item.outerWrap.parentElement.classList.contains(`esgst-hidden`) && !item.outerWrap.parentElement.getAttribute(`data-esgst-not-filterable`)) {
          item.outerWrap.parentElement.classList.remove(`esgst-hidden`);
        }
        if (item.points && !item.entered) {
          pointsCount += item.points;
        }
      } else {
        if (!item.outerWrap.classList.contains(`esgst-hidden`) && !item.outerWrap.getAttribute(`data-esgst-not-filterable`)) {
          item.outerWrap.classList.add(`esgst-hidden`);
        }
        if (obj.id === `cf` && !item.outerWrap.parentElement.classList.contains(`esgst-hidden`) && !item.outerWrap.parentElement.getAttribute(`data-esgst-not-filterable`)) {
          item.outerWrap.parentElement.classList.add(`esgst-hidden`);
        }
        filteredCount += 1;
      }
    }
    if (obj.filteredCount) {
      obj.filteredCount.textContent = filteredCount;
    }
    if (obj.id === `gf` && obj.pointsCount) {
      obj.pointsCount.textContent = pointsCount;
    }
    if (obj.id === `gf` && this.esgst.gcToFetch) {
      const games = {apps: {}, subs: {}};
      for (const id in this.esgst.gcToFetch.apps) {
        if (this.esgst.gcToFetch.apps.hasOwnProperty(id)) {
          games.apps[id] = [...this.esgst.gcToFetch.apps[id]];
        }
      }
      for (const id in this.esgst.gcToFetch.subs) {
        if (this.esgst.gcToFetch.subs.hasOwnProperty(id)) {
          games.subs[id] = [...this.esgst.gcToFetch.subs[id]];
        }
      }
      // noinspection JSIgnoredPromiseFromCall
      this.esgst.modules.gamesGameCategories.gc_getGames(games, true, null, false, true);
    }
  }

  /**
   * Checks if an item passes a set of filter rules.
   * @param {object} filters An object containing all the filters.
   * @param {object} item An object containing information about the item to be checked.
   * @param {object} rules An object containing the rules to check.
   * @returns {boolean} True if the item passed the filters and false otherwise.
   */
  filters_filterItem(filters, item, rules, notMain) {
    if (
      !rules ||
      (!rules.id && (!rules.condition || (isSet(rules.valid) && !rules.valid))) ||
      (rules.id && !gSettings[`${this.id}_${rules.id}`])
    ) {
      return true;
    }

    let filtered;

    if (rules.condition) {
      if (rules.condition === `AND`) {
        // The giveaway must be filtered by all rules.
        filtered = true;
        for (const rule of rules.rules) {
          if (rule.data && rule.data.paused) continue;
          filtered = filtered && this.filters_filterItem(filters, item, rule, notMain);
          if (!filtered) break;
        }
      } else {
        // The giveaway must be filtered by at least 1 rule.
        filtered = false;
        if (rules.rules.length) {
          for (const rule of rules.rules) {
            if (rule.data && rule.data.paused) continue;
            filtered = filtered || this.filters_filterItem(filters, item, rule, notMain);
            if (filtered) break;
          }
        } else {
          filtered = true;
        }
      }
      filtered = rules.not ? !filtered : filtered;
      /**
       * @property {object} rules.data
       */
      if (!filtered && rules.data && rules.data.count) {
        rules.data.count.textContent = parseInt(rules.data.count.textContent) + 1;
      }
      return filtered;
    }

    filtered = true;
    let key = rules.id;
    const filter = filters[key];

    if (
      !filter.check ||
      (filter.category && (!gSettings.gc || !gSettings[filter.category] || !item.gcReady)) ||
      (item.sgTools && key.match(/^(chance|chancePerPoint|comments|entries|ratio)$/))
    ) {
      return filtered;
    }

    /**
     * @property {string} rules.type
     */
    // noinspection FallThroughInSwitchStatementJS
    switch (rules.type) {
      case `date`:
      case `integer`:
      case `double`: {
        if (key === `minutesToEnd` && (item.ended || item.deleted)) break;
        if (key === `minutesFromStart` && !item.started) break;

        const ruleValue = rules.type === `date` ? new Date(rules.value).getTime() : rules.value;

        const value = key === `minutesToEnd`
          ? ((item.endTime - Date.now()) / 60000)
          : (
            key === `minutesFromStart`
            ? ((Date.now() - item.startTime) / 60000)
            : item[key]
          );
        /**
         * @property {string} rules.operator
         */
        switch (rules.operator) {
          case `equal`:
            filtered = ruleValue === value;
            break;
          case `not_equal`:
            filtered = ruleValue !== value;
            break;
          case `less`:
            filtered = value < ruleValue;
            break;
          case `less_or_equal`:
            filtered = value <= ruleValue;
            break;
          case `greater`:
            filtered = value > ruleValue;
            break;
          case `greater_or_equal`:
            filtered = value >= ruleValue;
            break;
          case `is_null`:
            filtered = !isSet(value) || value < 0;
            break;
          case `is_not_null`:
            filtered = isSet(value) && value > -1;
            break;
        }

        break;
      }
      case `boolean`:
        if (key === `regionRestricted` && this.esgst.parameters.region_restricted) break;

        if (
          (
            key !== `fullCV` || (
              (rules.value || item.reducedCV || item.noCV) &&
              (!rules.value || (!item.reducedCV && !item.noCV))
            )
          ) &&
          (
            key === `fullCV` || (
              (!rules.value || item[key]) && (rules.value || !item[key])
            )
          )
        ) break;

        filtered = false;

        if (!notMain && !item.deleted && key === `ended` && !rules.value && (this.esgst.createdPath || this.esgst.enteredPath || this.esgst.wonPath || this.esgst.userPath || this.esgst.groupPath)) {
          this.esgst.stopEs = true;
        }

        break;
      case `string`: {
        const list = rules.value.toLowerCase().split(/,\s/);

        if (key === `winners`) {
          key = `winnerNames`;
        }

        if (rules.operator === `contains`) {
          if (!item[key] || !Array.isArray(item[key])) {
            filtered = false;
            break;
          }

          let i;
          for (i = list.length - 1; i > -1 && item[key].indexOf(list[i]) < 0; i--) {
          }
          filtered = i > -1;
        } else {
          if (!item[key] || !Array.isArray(item[key])) {
            break;
          }

          let i;
          for (i = list.length - 1; i > -1 && item[key].indexOf(list[i]) < 0; i--) {
          }
          filtered = i < 0;
        }

        break;
      }
    }
    if (!filtered && rules.data) {
      if (rules.data.count) {
        rules.data.count.textContent = parseInt(rules.data.count.textContent) + 1;
      }
      if (rules.data.basicCount) {
        rules.data.basicCount.textContent = parseInt(rules.data.basicCount.textContent) + 1;
      }
    }
    return filtered;
  }
}

export { Filters };