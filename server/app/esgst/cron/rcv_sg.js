const Connection = require('../class/Connection');
const CustomError = require('../class/CustomError');
const Request = require('../class/Request');
const Utils = require('../class/Utils');
const Game = require('../routes/games/Game');

doRcvSgCronJob();

async function doRcvSgCronJob() {
  const connection = new Connection();
  await connection.connect();
  try {
    await updateRcvSg(connection);
  } catch (err) {
    console.log(`RCV games update from SG failed: ${err}`);
    if (connection.inTransaction) {
      await connection.rollback();
    }
  }
  await connection.disconnect();
}

/**
 * @param {import('mysql').Connection} connection 
 */
async function updateRcvSg(connection) {
  const addedDate = Math.trunc(Date.now() / 1e3);
  let page = 0;
  let ended = false;
  do {
    await Utils.timeout(1);
    page += 1;    
    console.log(`Updating RCV games from SG (page ${page}...)`);
    const url = `https://www.steamgifts.com/bundle-games/search?page=${page}`;
    const response = await Request.get(url);
    if (!response.html) {
      throw new CustomError(CustomError.COMMON_MESSAGES.sg, 500);
    }
    const names = {
      app: [],
      sub: [],
    };
    const rcv = {
      app: [],
      sub: [],
    };
    const elements = response.html.querySelectorAll('.table__row-inner-wrap');
    for (const element of elements) {
      const link = element.querySelector('.table__column__secondary-link');
      if (!link) {
        continue;
      }
      const matches = link.getAttribute('href').match(/(app|sub)\/(\d+)/);
      const type = matches[1];
      const id = parseInt(matches[2]);
      const name = element.querySelector('.table__column__heading').textContent;
      const effectiveDate = Math.trunc((new Date(`${element.querySelector('.table__column--width-small').textContent} UTC`)).getTime() / 1e3);
      names[type].push({ id, name });
      rcv[type].push({ id, effectiveDate });
    }
    const pagination = response.html.querySelector('.pagination__navigation');
    if (!pagination) {
      throw new CustomError(CustomError.COMMON_MESSAGES.sg, 500);
    }    
    ended = pagination.lastElementChild.classList.contains('is-selected');
  } while (!ended);  
  await connection.beginTransaction();
  for (const type of Game.TYPES) {
    if (type === 'bundle') {
      continue;
    }
    await connection.query(`UPDATE games__${type}_rcv SET found = FALSE`);
    if (names[type].length > 0) {
      await connection.query(`
        INSERT IGNORE INTO games__${type}_name (${type}_id, name)
        VALUES ${names[type].map(name => `(${connection.escape(name.id)}, ${connection.escape(name.name)})`).join(', ')}
      `);
    }
    if (rcv[types].length > 0) {
      await connection.query(`
        INSERT INTO games__${type}_rcv (${type}_id, effective_date, added_date, found)
        VALUES ${rcv[types].map(rcv => `(${connection.escape(rcv.id)}, ${connection.escape(rcv.effectiveDate)}, ${connection.escape(addedDate)}, TRUE)`).join(', ')}
        ON DUPLICATE KEY UPDATE effective_date = VALUES(effective_date), found = VALUES(found)
      `);
    }
    await connection.query(`
      DELETE FROM games__${type}_rcv
      WHERE found = FALSE
    `);
  }  
  await connection.commit();
}