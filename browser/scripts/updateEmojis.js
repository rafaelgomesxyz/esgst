const fetch = require('node-fetch')
const fs = require('fs');
const path = require('path');

const ROOT_PATH = path.resolve(__dirname, '..');
const SRC_PATH = `${ROOT_PATH}/src`;

updateEmojis();

async function updateEmojis() {
  const emojis = [];

  const customEmojis = [
    {
      codes: ['AF', '5C', '5C', '5C', '5F', '28', '30C4', '29', '5F', '2F', 'AF'],
      name: ``
    },
    {
      codes: ['28', '20', '361', 'B0', '20', '35C', '296', '20', '361', 'B0', '29'],
      name: ``
    },
    {
      codes: ['28', '20', '361', '2299', '20', '35C', '296', '20', '361', '2299', '29'],
      name: ``
    },
    {
      codes: ['28', '30CE', 'CA0', '76CA', 'CA0', '29', '30CE'],
      name: ``
    },
    {
      codes: ['28', '256F', 'B0', '25A1', 'B0', 'FF09', '256F', 'FE35', '20', '253B', '2501', '253B'],
      name: ``
    },
    {
      codes: ['252C', '2500', '252C', '30CE', '28', '20', 'BA', '20', '5F', '20', 'BA', '30CE', '29'],
      name: ``
    },
    {
      codes: ['10DA', '28', 'CA0', '76CA', 'CA0', '10DA', '29'],
      name: ``
    },
    {
      codes: ['28', '25D5', '203F', '2D', '29', '270C'],
      name: ``
    },
    {
      codes: ['28', 'FF61', '25D5', '203F', '25D5', 'FF61', '29'],
      name: ``
    },
    {
      codes: ['28', '25D1', '203F', '25D0', '29'],
      name: ``
    },
    {
      codes: ['25D4', '5F', '25D4'],
      name: ``
    },
    {
      codes: ['28', '2022', '203F', '2022', '29'],
      name: ``
    },
    {
      codes: ['28', 'CA0', '5F', 'CA0', '29'],
      name: ``
    },
    {
      codes: ['28', 'AC', 'FF64', 'AC', '29'],
      name: ``
    },
    {
      codes: ['28', '2500', '203F', '203F', '2500', '29'],
      name: ``
    },
    {
      codes: ['28', 'CA5', 'FE4F', 'CA5', '29'],
      name: ``
    },
    {
      codes: ['28', 'CA5', '2038', 'CA5', '29'],
      name: ``
    },
    {
      codes: ['28', '2310', '25A0', '5F', '25A0', '29'],
      name: ``
    },
    {
      codes: ['28', '25B0', '2D8', '25E1', '2D8', '25B0', '29'],
      name: ``
    },
    {
      codes: ['4E41', '28', '20', '25D4', '20', 'C6A', '25D4', '29', '310F'],
      name: ``
    },
    {
      codes: ['28', 'E07', '20', '360', 'B0', '20', '35F', '296', '20', '361', 'B0', '29', 'E07'],
      name: ``
    },
    {
      codes: ['3B6', 'F3C', '19F', '346', '644', '35C', '19F', '346', 'F3D', '1D98'],
      name: ``
    },
    {
      codes: ['295', '2022', '1D25', '2022', '294'],
      name: ``
    },
    {
      codes: ['28', '20', '35D', 'B0', '20', '35C', '296', '361', 'B0', '29'],
      name: ``
    },
    {
      codes: ['28', '2F', 'FF9F', '414', 'FF9F', '29', '2F'],
      name: ``
    },
    {
      codes: ['B67', 'F3C', 'CA0', '76CA', 'CA0', 'F3D', 'B68'],
      name: ``
    },
    {
      codes: ['28', 'E07', '20', '2022', '300', '5F', '2022', '301', '29', 'E07'],
      name: ``
    }
  ];

  for (const customEmoji of customEmojis) {
    emojis.push({
      emoji: getEmoji(customEmoji.codes),
      entity: getEntity(customEmoji.codes),
      name: customEmoji.name
    });
  }

  const url = `https://unicode.org/emoji/charts/full-emoji-list.html`;
  // @ts-ignore
  const response = await fetch(url);
  const text = await response.text();
  const matches = text.match(/<td\sclass='code'><a\shref='#.+?'\sname='.+?'>.+?<\/a><\/td>[\s\S]+?<td\sclass='name'>.+?<\/td>/g);
  for (const match of matches) {
    const subMatches = match.match(/<td\sclass='code'><a\shref='#.+?'\sname='.+?'>(.+?)<\/a><\/td>[\s\S]+?<td\sclass='name'>(.+?)<\/td>/);
    const codes = subMatches[1].trim().split(/\s+/).map(code => code.replace(/U\+/, ``));
    emojis.push({
      emoji: getEmoji(codes),
      entity: getEntity(codes),
      name: formatName(subMatches[2].trim())
    });
  }

  fs.writeFileSync(`${SRC_PATH}/emojis.js`, `export default ${JSON.stringify(emojis, null, 2)};`);
}

function getEmoji(codes) {
  return String.fromCodePoint(...codes.map(code => parseInt(code, 16)));
}

function getEntity(codes) {
  return codes.map(code => `&#x${code}`).join(``);
}

function formatName(name) {
  return name.replace(/(^|\s)([a-z])/g, (match, group1, group2) => `${group1}${group2.toUpperCase()}`);
}