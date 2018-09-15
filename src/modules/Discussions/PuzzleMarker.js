import Module from '../../class/Module';

class DiscussionsPuzzleMarker extends Module {
info = ({
    description: `
      <ul>
        <li>Adds a checkbox in front of a discussion categorized as "Puzzles" (in any page) that changes states (<i class="fa fa-circle-o esgst-grey"></i> by default, <i class="fa fa-times-circle esgst-red"></i> for "unsolved", <i class="fa fa-exclamation-circle esgst-orange"></i> for "in progress" and <i class="fa fa-check-circle esgst-green"></i> for "solved") and allows you to mark the puzzle as unsolved/in progress/solved.</li>
      </ul>
    `,
    features: {
      pm_a: {
        name: `Show the checkbox for all discussions, regardless of their category.`,
        sg: true
      }
    },
    id: `pm`,
    name: `Puzzle Marker`,
    sg: true,
    type: `discussions`
  });

  async pm_change(code, status) {
    let deleteLock = await this.esgst.modules.common.createLock(`commentLock`, 300);
    let discussions = JSON.parse(await getValue(`discussions`));
    if (!discussions[code]) {
      discussions[code] = {
        readComments: {}
      };
    }
    if (status === `off`) {
      delete discussions[code].status;
    } else {
      discussions[code].status = status;
    }
    discussions[code].lastUsed = Date.now();
    await setValue(`discussions`, JSON.stringify(discussions));
    deleteLock();
    return true;
  }
}

export default DiscussionsPuzzleMarker;