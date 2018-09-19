_MODULES.push({
    description: `
      <ul>
        <li>Reverses the comments of any <a href="https://www.steamgifts.com/discussion/e9zDo/">discussion</a> page so that they are ordered from newest to oldest.</li>
      </ul>
    `,
    id: `cr`,
    load: cr,
    name: `Comment Reverser`,
    sg: true,
    st: true,
    type: `comments`
  });

  function cr() {
    if (!esgst.discussionPath || !esgst.pagination) return;
    reverseComments(esgst.pagination.previousElementSibling);
  }

