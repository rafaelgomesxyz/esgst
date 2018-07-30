_MODULES.push({
    description: `
      <ul>
        <li>Adds an icon (<i class="fa fa-heart esgst-whitelist"></i> if the user is whitelisted and <i class="fa fa-ban esgst-blacklist"></i> if they are blacklisted) next to the a user's username (in any page) to indicate that they are on your whitelist/blacklist.</li>
        <li>If you hover over the icon, it shows the date when you added the user to your whitelist/blacklist.</li>
      </ul>
    `,
    features: {
      wbh_b: {
        colors: true,
        description: `
          <ul>
            <li>Adds a background color of your own preference to the user's username if they are blacklisted, instead of an icon.</li>
            <li>If you hover over the username, it shows the date when you added the user to your whitelist/blacklist.</li>
          </ul>
        `,
        name: `Use background colors for blacklisted users instead of icons.`,
        sg: true,
        st: true
      },
      wbh_w: {
        colors: true,
        description: `
          <ul>
            <li>Adds a background color of your own preference to the user's username if they are whitelisted, instead of an icon.</li>
            <li>If you hover over the username, it shows the date when you added the user to your whitelist/blacklist.</li>
          </ul>
        `,
        name: `Use background colors for whitelisted users instead of icons.`,
        sg: true,
        st: true
      }
    },
    id: `wbh`,
    name: `Whitelist/Blacklist Highlighter`,
    sg: {include: [{enabled: 1, pattern: `.*`}], exclude: [{enabled: 1, pattern: `^/account/manage/(whitelist|blacklist)`}]},
    st: true,
    sync: `Whitelist and Blacklist`,
    type: `users`
  });

