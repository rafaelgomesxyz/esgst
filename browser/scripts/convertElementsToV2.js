console.log(CONVERT([{
  attributes: {
    class: `esgst-bold`
  },
  text: 'Interface',
  type: 'div'
}, {
  type: 'br'
}, {
  attributes: {
    class: 'markdown'
  },
  type: 'div',
  children: [{
    type: 'ul',
    children: [{
      type: 'li',
      children: [{
        attributes: {
          class: `esgst-bold`
        },
        type: 'span',
        children: [{
          attributes: {
            class: `fa fa-square-o`
          },
          type: 'i'
        }, {
          text: ` NOT`,
          type: 'node'
        }]
      }, {
        text: ` - If checked, only items that do not apply to the group will be shown.`,
        type: 'node'
      }]
    }, {
      type: 'li',
      children: [{
        attributes: {
          class: `esgst-bold`
        },
        text: 'AND',
        type: 'span'
      }, {
        text: ` - Turns the group into an AND group, which means that only items that apply to every single rule of the group will be shown.`,
        type: 'node'
      }]
    }, {
      type: 'li',
      children: [{
        attributes: {
          class: `esgst-bold`
        },
        text: 'OR',
        type: 'span'
      }, {
        text: ` - Turns the group into an OR group, which means that only items that apply to at least one rule of the group will be shown.`,
        type: 'node'
      }]
    }, {
      type: 'li',
      children: [{
        attributes: {
          class: `esgst-bold`
        },
        type: 'span',
        children: [{
          attributes: {
            class: `fa fa-arrows`
          },
          type: 'i'
        }]
      }, {
        text: ` - Allows you reorder/move rules/groups. The order of the rules does not alter the result.`,
        type: 'node'
      }]
    }, {
      type: 'li',
      children: [{
        attributes: {
          class: `esgst-bold`
        },
        type: 'span',
        children: [{
          attributes: {
            class: `fa fa-pause`
          },
          type: 'i'
        }, {
          text: ` Pause`,
          type: 'node'
        }]
      }, {
        text: ` - Allows you to pause the rule/group, so that it does not filter anything until you resume it or refresh the page.`,
        type: 'node'
      }]
    }, {
      text: `The other buttons in the interface should be self-explanatory.`,
      type: 'li'
    }]
  }]
}, {
  type: 'br'
}, {
  attributes: {
    class: `esgst-bold`
  },
  text: `Types of Filters`,
  type: 'div'
}, {
  type: 'br'
}, {
  attributes: {
    class: 'markdown'
  },
  type: 'div',
  children: [{
    type: 'ul',
    children: [{
      type: 'li',
      children: [{
        attributes: {
          class: `esgst-bold`
        },
        text: 'Boolean',
        type: 'span'
      }, {
        text: ` - Presents a choice between true and false. Set to true if you only want to see items that apply to the filter, and to false otherwise. For example, if you only want to see giveaways that are on your wishlist, set wishlisted to "true"; if you only want to see giveaways that you have not entered, set entered to "false".`,
        type: 'node'
      }]
    }, {
      type: 'li',
      children: [{
        attributes: {
          class: `esgst-bold`
        },
        text: 'Number',
        type: 'span'
      }, {
        text: ` - Presents a text field and a choice between equal, not equal, less, less or equal, greater, greater or equal, is null and is not null. Enter the value that you want in the text field and choose the option that you want. For example, if you only want to see giveaways above level 5, you can either set level to "greater than 4" or to "greater or equal to 5". The is null and is not null options regard the presence of the filter. For example, some giveaways do not have a rating. If you still want to see those giveaways when filtering by rating, add an additional rule and set rating to "is null".`,
        type: 'node'
      }]
    }, {
      type: 'li',
      children: [{
        attributes: {
          class: `esgst-bold`
        },
        text: 'Text',
        type: 'span'
      }, {
        text: ` - Presents a text field and a choice between contains and doesn't contain. Enter the values that you want in the text field, separated by a comma followed by a space, and choose the option that you want. For example, if you only want to see giveaways that have the adventure or the action genres, set genres to "contains Adventure, Action". But if you only want to see giveaways that have both the adventure and the action genres, add 2 rules, set one to "contains Adventure" and the other to "contains Action", and turn the group into an AND group.`,
        type: 'node'
      }]
    }]
  }]
}, {
  type: 'br'
}, {
  attributes: {
    class: `esgst-bold`
  },
  text: `Building the Filters`,
  type: 'div'
}, {
  type: 'br'
}, {
  attributes: {
    class: 'markdown'
  },
  type: 'div',
  children: [{
    text: `The process of building the filters might seem intimidating at first, but it is actually quite simple. Just think of it like this:`,
    type: 'div'
  }, {
    type: 'ul',
    children: [{
      text: `Show me a="true" AND b="false".`,
      type: 'li'
    }, {
      text: `Show me a="false" OR b="true".`,
      type: 'li'
    }, {
      text: `Do NOT show me a="true".`,
      type: 'li'
    }]
  }, {
    text: `The building process for the filters above becomes, respectively:`,
    type: 'div'
  }, {
    type: 'ul',
    children: [{
      text: `Turn group into AND, add rule a="true", add rule b="false".`,
      type: 'li'
    }, {
      text: `Turn group into OR, add rule a="false", add rule b="true".`,
      type: 'li'
    }, {
      text: `Check NOT option, add rule a="true".`,
      type: 'li'
    }]
  }, {
    text: `For more advanced filters, think in parenthesis:`,
    type: 'div'
  }, {
    type: 'ul',
    children: [{
      text: `Show me (a="true" AND b="false") OR c="greater or equal to 5".`,
      type: 'li'
    }, {
      text: `Show me (a="false" AND b="true" AND c="false") OR (d="true" AND e="false") OR f="equal to 2".`,
      type: 'li'
    }, {
      text: `Show me (a="true" AND b="false" AND c="true" AND d="false") AND do NOT show me e="contains Adventure, Action".`,
      type: 'li'
    }]
  }, {
    text: `Each parenthesis represents a new group. NOT filters also represent a new group, since there isn't a NOT option for rules. So the building process for the filters above becomes, respectively:`,
    type: 'div'
  }, {
    type: 'ul',
    children: [{
      text: `Turn group into OR, add group (turn group into AND, add rule a="true", add rule b="false"), add rule c="greater or equal to 5".`,
      type: 'li'
    }, {
      text: `Turn group into OR, add group (turn group into AND, add rule a="false", add rule b="true", add rule c="false"), add group (turn group into AND, add rule d="true", add rule e="false"), add rule f="equal to 2".`,
      type: 'li'
    }, {
      text: `Turn group into AND, add group (turn group into AND, add rule a="true", add rule b="false", add rule c="true", add rule d="false"), add group (check NOT option, add rule e="contains Adventure, Action").`,
      type: 'li'
    }]
  }, {
    text: `Real example: suppose you only want to see giveaways that are for level 5 or more and that have achievements or trading cards. The sentence for that system is:`,
    type: 'div'
  }, {
    type: 'ul',
    children: [{
      text: `Show me level="greater or equal to 5" AND (achievements="true" OR tradingCards="true").`,
      type: 'li'
    }]
  }, {
    text: `And the building process is:`,
    type: 'div'
  }, {
    type: 'ul',
    children: [{
      text: `Turn group into AND, add rule level="greater or equal to 5", add group (turn group into OR, add rule achievements="true", add rule tradingCards="true").`,
      type: 'li'
    }]
  }, {
    text: `The final result is illustrated in the picture below:`,
    type: 'div'
  }]
}, {
  attributes: {
    src: `https://i.imgur.com/F1UXcKs.png`
  },
  type: 'img'
}]));

function CONVERT(items) {
  const result = convert(items);
  return JSON.stringify(result).replace(/"/g, `\``).replace(/\\`/g, `"`).replace(/{`(.+?)`:/g, `{$1:`);
}

function convert(items) {
  const newItems = [];
  for (const item of items) {
    if (item.type === 'node') {
      newItems.push(item.text);
      continue;
    }
    const newItem = [];
    newItem.push(item.type)
    if (item.attributes) {
      newItem.push(item.attributes);
    }
    if (item.text) {
      newItem.push(item.text);
    }
    if (item.children) {
      newItem.push(convert(item.children));
    }
    newItems.push(newItem);
  }
  return newItems;
}