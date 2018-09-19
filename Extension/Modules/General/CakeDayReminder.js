_MODULES.push({
  description: `
    <ul>
      <li>Shows a popup reminding you of your cake day on SteamGifts.</li>
      <li>You can set it to remind you a specified number of days before your cake day.</li>
    </ul>
  `,
  features: {
    cdr_b: {
      inputItems: [
        {
          id: `cdr_days`,
          prefix: `Days: `
        }
      ],
      name: `Remind you a specified number of days before your cake day.`,
      sg: true
    },
    cdr_d: {
      description: `
        <ul>
          <li>With this option enabled, the feature also reminds you if some days have already passed since your cake day and you had not logged in during that time.</li>
        </ul>
      `,
      name: `Remind you on your cake day.`,
      sg: true
    }
  },
  id: `cdr`,
  load: cdr,
  name: `Cake Day Reminder`,
  sg: true,
  type: `general`
});

function cdr() {
  let currentDate = new Date();
  let year = currentDate.getFullYear();
  let time = currentDate.getTime();
  let registrationDate = new Date(esgst.registrationDate * 1e3);
  registrationDate.setFullYear(year);
  registrationDate = registrationDate.getTime();
  const bYear = parseInt(getLocalValue(`cdr_bYear`, 0));
  let dYear = getLocalValue(`cdr_dYear`);
  if (dYear) {
    dYear = parseInt(dYear);
  } else {
    setLocalValue(`cdr_dYear`, year);
    dYear = year;
  }
  if (esgst.cdr_b && bYear !== year && time < registrationDate && time + (esgst.cdr_days * 86400000) >= registrationDate) {
    setLocalValue(`cdr_bYear`, year);
    new Popup(`fa-birthday-cake`, `ESGST reminder: your cake day is in ${Math.floor((registrationDate - time) / 86400000)} days.`, true).open();
  } else if (esgst.cdr_d && dYear !== year && time >= registrationDate) {
    setLocalValue(`cdr_dYear`, year);
    if (time >= registrationDate + 86400000) {
      new Popup(`fa-birthday-cake`, `ESGST reminder: your cake day was ${Math.floor((time - registrationDate) / 86400000)} days ago.`, true).open();
    } else {
      new Popup(`fa-birthday-cake`, `ESGST reminder: your cake day is today. Happy cake day!`, true).open();
    }
  }
}