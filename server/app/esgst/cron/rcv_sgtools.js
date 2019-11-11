const Connection = require('../class/Connection');
const CustomError = require('../class/CustomError');
const Request = require('../class/Request');
const Game = require('../routes/games/Game');

doRcvSgToolsCronJob();

async function doRcvSgToolsCronJob() {
  const connection = new Connection();
  await connection.connect();
  try {
    await updateRcvSgTools(connection);
  } catch (err) {
    console.log(`RCV games update from SGTools failed: ${err}`);
    if (connection.inTransaction) {
      await connection.rollback();
    }
  }
  await connection.disconnect();
}

/**
 * @param {import('mysql').Connection} connection 
 */
async function updateRcvSgTools(connection) {
  const url = 'https://www.sgtools.info/lastbundled';
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
  const elements = response.html.querySelectorAll('tr');
  for (const element of elements) {
    const link = element.firstElementChild.firstElementChild;
    if (!link) {
      continue;
    }
    const matches = link.getAttribute('href').match(/(app|sub)\/(\d+)/);
    const type = matches[1];
    const id = parseInt(matches[2]);
    const name = link.textContent;
    const effectiveDate = (new Date(`${element.firstElementChild.nextElementSibling.textContent} UTC`)).getTime() / 1e3;
    const addedDate = (new Date(`${element.firstElementChild.nextElementSibling.nextElementSibling.textContent} UTC`)).getTime() / 1e3;
    names[type].push({ id, name });
    rcv[type].push({ id, effectiveDate, addedDate });
  }  
  await connection.beginTransaction();
  for (const type of Game.TYPES) {
    if (type === 'bundle') {
      continue;
    }
    if (names[type].length > 0) {
      await connection.query(`
        INSERT IGNORE INTO games__${type}_name (${type}_id, name)
        VALUES ${names[type].map(name => `(${connection.escape(name.id)}, ${connection.escape(name.name)})`).join(', ')}
      `);
    }
    if (rcv[type].length > 0) {
      await connection.query(`
        INSERT INTO games__${type}_rcv (${type}_id, effective_date, added_date, found)
        VALUES ${rcv[type].map(rcv => `(${connection.escape(rcv.id)}, ${connection.escape(rcv.effectiveDate)}, ${connection.escape(rcv.addedDate)}, TRUE)`).join(', ')}
        ON DUPLICATE KEY UPDATE effective_date = VALUES(effective_date)
      `);
    }
  }  
  await connection.commit();
}