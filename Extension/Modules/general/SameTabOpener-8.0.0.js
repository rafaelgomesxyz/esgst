_MODULES.push({
    description: `
      <ul>
        <li>Opens any link in the page in the same tab.</li>
      </ul>
    `,
    id: `sto`,
    load: sto,
    name: `Same Tab Opener`,
    sg: true,
    st: true,
    type: `general`
  });

  function sto() {
    esgst.endlessFeatures.push(sto_setLinks);
  }

  function sto_setLinks(context, main, source, endless) {
    const elements = context.querySelectorAll(`${endless ? `.esgst-es-page-${endless} [target="_blank"], .esgst-es-page-${endless}[target="_blank"]` : `[target="_blank"]`}`);
    for (let i = 0, n = elements.length; i < n; ++i) {
      elements[i].removeAttribute(`target`);
    }
  }

