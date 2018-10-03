import Module from '../../class/Module';

class GeneralURLRedirector extends Module {
  constructor() {
    super();
    this.info = {
      description: `
      <ul>
        <li>Redirects broken URLs to the correct URLs. For example, "/giveaway/XXXXX" redirects to "/giveaway/XXXXX/".</li>
      </ul>
    `,
      id: `urlr`,
      name: `URL Redirector`,
      sg: true,
      st: true,
      type: `general`
    };
  }
}

export default GeneralURLRedirector;