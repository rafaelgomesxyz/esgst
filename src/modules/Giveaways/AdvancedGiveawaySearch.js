import Module from '../../class/Module';

class GiveawaysAdvancedGiveawaySearch extends Module {
info = ({
    description: `
      <ul>
        <li>Adds a panel below the search field of the main page that allows you to easily search for giveaways using SteamGifts' <a href="https://www.steamgifts.com/discussion/8SzdT/">search parameters</a>.</li>
      </ul>
    `,
    id: `ags`,
    load: this.ags,
    name: `Advanced Giveaway Search`,
    sg: true,
    type: `giveaways`
  });

  ags() {
    let query = ``;
    if (this.esgst.giveawaysPath) {
      query += `.sidebar__search-container, `;
    }
    if (this.esgst.qgs) {
      query += `.esgst-qgs-container, `;
    }
    if (!query) return;
    const elements = document.querySelectorAll(query.slice(0, -2));
    for (const element of elements) {
      this.ags_addPanel(element);
    }
  }

  ags_addPanel(context) {
    const esgst.modules.giveawaysQuickGiveawaySearch.qgs = context.classList.contains(`esgst-qgs-container`);
    let obj = {
      this.esgst.modules.giveawaysQuickGiveawaySearch.qgs
    };
    context.firstElementChild.remove();
    obj.input = this.esgst.modules.common.createElements(context, `afterBegin`, [{
      attributes: {
        class: `${qgs ? `esgst-qgs-input` : `sidebar__search-input`}`,
        placeholder: `Search...`,
        type: `text`
      },
      type: `input`
    }]);
    let icon = obj.input.nextElementSibling;
    icon.classList.add(`esgst-clickable`);
    icon.title = this.esgst.modules.common.getFeatureTooltip(`ags`, `Use advanced search`);
    if (!qgs) {
      let match = location.search.match(/q=(.*?)(&.*?)?$/);
      if (match) {
        obj.input.value = decodeURIComponent(match[1]);
      }
    }
    if (!qgs && ((this.esgst.adots && this.esgst.adots_index === 0) || !this.esgst.adots)) {
      obj.panel = this.esgst.modules.common.createElements(context, `afterEnd`, [{
        attributes: {
          class: `esgst-ags-panel`
        },
        type: `div`
      }]);
    } else {
      obj.panel = new Popout(`esgst-ags-panel`, context, 100).popout;
    }
    let filterDetails = [
      {
        key: `ags_type`,
        parameter: `type`,
        name: `Type`,
        options: [
          {
            name: `All`,
            value: ``
          },
          {
            name: `Wishlist`,
            value: `wishlist`
          },
          {
            name: `Recommended`,
            value: `recommended`
          },
          {
            name: `Group`,
            value: `group`
          },
          {
            name: `New`,
            value: `new`
          }
        ],
        type: `select`
      },
      {
        maxKey: `ags_maxDate`,
        minKey: `ags_minDate`,
        maxParameter: `release_date_max`,
        minParameter: `release_date_min`,
        name: `Release Date`,
        type: `input`
      },
      {
        maxKey: `ags_maxScore`,
        minKey: `ags_minScore`,
        maxParameter: `metascore_max`,
        minParameter: `metascore_min`,
        name: `Metascore`,
        type: `input`
      },
      {
        maxKey: `ags_maxLevel`,
        minKey: `ags_minLevel`,
        maxParameter: `level_max`,
        minParameter: `level_min`,
        name: `Level`,
        type: `select`
      },
      {
        maxKey: `ags_maxEntries`,
        minKey: `ags_minEntries`,
        maxParameter: `entry_max`,
        minParameter: `entry_min`,
        name: `Entries`,
        type: `input`
      },
      {
        maxKey: `ags_maxCopies`,
        minKey: `ags_minCopies`,
        maxParameter: `copy_max`,
        minParameter: `copy_min`,
        name: `Copies`,
        type: `input`
      },
      {
        maxKey: `ags_maxPoints`,
        minKey: `ags_minPoints`,
        maxParameter: `point_max`,
        minParameter: `point_min`,
        name: `Points`,
        type: `input`
      },
      {
        key: `ags_regionRestricted`,
        name: `Region Restricted`,
        parameter: `region_restricted`,
        type: `checkbox`
      },
      {
        key: `ags_dlc`,
        name: `DLC`,
        parameter: `dlc`,
        type: `checkbox`
      },
      {
        key: `ags_app`,
        name: `App`,
        parameter: `app`,
        type: `checkbox`
      },
      {
        key: `ags_sub`,
        name: `Sub`,
        parameter: `sub`,
        type: `checkbox`
      }
    ];
    obj.filters = [];
    for (let i = 0, n = filterDetails.length; i < n; ++i) {
      this.ags_createFilter(obj, filterDetails[i]);
    }
    obj.input.addEventListener(`keydown`,
      this.esgst.modules.common.triggerOnEnter.bind(null, this.ags_searchQuery.bind(null, obj))
    );
    icon.addEventListener(`click`, this.ags_searchQuery.bind(null, obj));
  }

  ags_createFilter(obj, details) {
    if (details.key === `ags_type` && !obj.qgs) {
      return;
    }
    if (details.type === `checkbox`) {
      let element = this.esgst.modules.common.createElements(obj.panel, `beforeEnd`, [{
          attributes: {
            class: `esgst-ags-checkbox-filter`
          },
          type: `div`,
          children: [{
            text: details.name,
            type: `span`
          }]
        }]),
        filter = new Checkbox(
          element,
          this.esgst[details.key]
        ).input;
      this.esgst.modules.common.observeChange(filter, details.key, `checked`, `click`);
      obj.filters.push({
        filter: filter,
        key: `checked`,
        parameter: details.parameter
      });
    } else if (details.options) {
      let html = [{
        type: `select`,
        children: []
      }];
      details.options.forEach(option => {
        html[0].children.push({
          attributes: {
            value: option.value
          },
          text: option.name,
          type: `option`
         });
      });
      let element = this.esgst.modules.common.createElements(obj.panel, `beforeEnd`, [{
          attributes: {
            style: `display: block;`
          },
          type: `div`,
          children: [{
            text: `${details.name} `,
            type: `node`
          }, {
            attributes: {
              class: `esgst-ags-filter`
            },
            type: `class`,
            children: html
          }]
        }]),
        filter = element.firstElementChild.firstElementChild;
      filter.value = this.esgst[details.key];
      this.esgst.modules.common.observeNumChange(filter, details.key);
      obj.filters.push({
        filter: filter,
        key: `value`,
        parameter: details.parameter
      });
    } else {
      let items = [];
      if (details.type === `select`) {
        items.push({
          type: `select`,
          children: [{
            type: `option`
          }]
        });
        for (let i = 0; i <= 10; ++i) {
          items[0].children.push({
            text: i,
            type: `option`
          });
        }
      } else if (details.maxKey === `ags_maxDate`) {
        items = [{
          attributes: {
            type: `date`
          },
          type: `input`
        }];        
      } else {
        items = [{
          attributes: {
            type: `text`
          },
          type: `input`
        }];
      }
      let element = this.esgst.modules.common.createElements(obj.panel, `beforeEnd`, [{
        type: `div`,
        children: [{
          text: `${details.name} `,
          type: `node`
        }, {
          attributes: {
            class: `esgst-ags-filter`
          },
          type: `div`,
          children: items
        }, {
          attributes: {
            class: `esgst-ags-filter`
          },
          type: `div`,
          children: items
        }]
      }]);
      let maxFilter = element.lastElementChild.lastElementChild;
      maxFilter.value = this.esgst[details.maxKey];
      this.esgst.modules.common.observeNumChange(maxFilter, details.maxKey);
      let minFilter = element.firstElementChild.lastElementChild;
      minFilter.value = this.esgst[details.minKey];
      this.esgst.modules.common.observeNumChange(minFilter, details.minKey);
      if (details.type === `input`) {
        maxFilter.addEventListener(`keypress`,
          this.esgst.modules.common.triggerOnEnter.bind(null, this.ags_searchQuery.bind(null, obj))
        );
        minFilter.addEventListener(`keypress`,
          this.esgst.modules.common.triggerOnEnter.bind(null, this.ags_searchQuery.bind(null, obj))
        );
      }
      obj.filters.push({
        filter: minFilter,
        key: `value`,
        parameter: details.minParameter
      });
      obj.filters.push({
        filter: maxFilter,
        key: `value`,
        parameter: details.maxParameter
      });
    }
  }

  ags_searchQuery(obj) {
    let url;
    if (this.esgst.ags_app || this.esgst.ags_sub) {
      url = `https://www.steamgifts.com/giveaways/search?q=`;
    } else {
      url = `https://www.steamgifts.com/giveaways/search?q=${encodeURIComponent(obj.input.value)}`;
    }
    if (!obj.qgs) {
      let match = location.search.match(/(type=.*?)(&.*?)?$/);
      if (match) {
        url += `&${match[1]}`;
      }
    }
    for (let i = 0, n = obj.filters.length; i < n; ++i) {
      let filter = obj.filters[i],
        value = filter.filter[filter.key];
      if (value) {
        if (filter.parameter === `app`) {
          url += `&app=${obj.input.value}`;
        } else if (filter.parameter === `sub`) {
          url += `&sub=${obj.input.value}`;
        } else {
          url += `&${filter.parameter}=${value}`;
        }
      }
    }
    location.href = url;
  }
}

export default GiveawaysAdvancedGiveawaySearch;