_MODULES.push({
    description: `
      <ul>
        <li>Replaces a timestamp (in any page) with an accurate timestamp. For example, "2 hours ago" becomes "Jan 1, 2017, 0:00:00 - 2 hours ago".</li>
        <li>You can choose whether to show seconds or not and whether to use a 12-hour clock or a 24-hour one.</li>
      </ul>
    `,
    features: {
      at_s: {
        name: `Show seconds.`,
        sg: true,
        st: true
      },
      at_24: {
        name: `Use a 24-hour clock.`,
        sg: true,
        st: true
      }
    },
    id: `at`,
    load: at,
    name: `Accurate Timestamp`,
    sg: true,
    st: true,
    type: `general`
  });

  function at() {
    esgst.endlessFeatures.push(at_getTimestamps);
  }

  function at_getTimestamps(context, main, source, endless) {
    let timestamps, i, n, timestamp, text, edited, seconds, accurateTimestamp;
    timestamps = context.querySelectorAll(`${endless ? `.esgst-es-page-${endless} [data-timestamp], .esgst-es-page-${endless}[data-timestamp]` : `[data-timestamp]`}`);
    for (i = 0, n = timestamps.length; i < n; ++i) {
      timestamp = timestamps[i];
      if (((esgst.activeDiscussions && ((esgst.activeDiscussions.contains(timestamp) && esgst.adots_index === 0) || !esgst.activeDiscussions.contains(timestamp))) || !esgst.activeDiscussions) && !timestamp.classList.contains(`esgst-at`)) {
        text = timestamp.textContent;
        edited = text.match(/\*/);
        seconds = parseInt(timestamp.getAttribute(`data-timestamp`));
        accurateTimestamp = getTimestamp(seconds * 1e3, esgst.at_24, esgst.at_s);
        if (edited) {
          text = ` (Edited ${accurateTimestamp})`;
        } else {
          text = `${accurateTimestamp} - ${text}`;
        }
        timestamp.classList.add(`esgst-at`);
        timestamp.textContent = text;
      }
    }
  }
  
