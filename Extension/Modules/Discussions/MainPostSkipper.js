_MODULES.push({
    description: `
      <ul>
        <li>Skips to the comments of a discussion if you have used the pagination navigation. For example, if you enter a discussion and use the pagination navigation to go to page 2, on page 2 the feature will skip the main post and take you directly to the comments.</li>
      </ul>
    `,
    id: `mps`,
    load: mps,
    name: `Main Post Skipper`,
    sg: true,
    type: `discussions`
  });

  function mps() {
    if (!location.hash && esgst.discussionPath && esgst.paginationNavigation && document.referrer.match(new RegExp(`/discussion/${[location.pathname.match(/^\/discussion\/(.+?)\//)[1]]}/`))) {
      goToComment(``, esgst.pagination.previousElementSibling.firstElementChild.firstElementChild, true);
    }
  }

