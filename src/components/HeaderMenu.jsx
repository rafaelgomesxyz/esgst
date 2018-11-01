import React from 'react';
import {container} from '../class/Container';

class HeaderMenu extends React.Component {
  constructor(props) {
    super(props);
    this.dropdown = React.createRef();
    this.arrow = React.createRef();
    this.menu = React.createRef();
    this.state = {showDropdown: false};
  }

  componentDidMount() {
    document.addEventListener(`click`, this.closeHeaderMenu.bind(this), true);
  }
  
  getItems() {
    const items = [
      {
        type: `link`,
        href: `https://github.com/gsrafael01/ESGST`,
        icon: `fa-github grey`,
        name: `GitHub`,
        description: `Visit the GitHub page.`
      }, {
        type: `link`,
        href: `https://github.com/gsrafael01/ESGST/issues`,
        icon: `fa-bug red`,
        name: `Bugs/Suggestions`,
        description: `Report bugs and/or make suggestions.`
      }, {
        type: `link`,
        href: `https://github.com/gsrafael01/ESGST/milestones`,
        icon: `fa-map-signs blue`,
        name: `Milestones`,
        description: `Check out what's coming in the next version.`
      }, {
        type: `link`,
        href: `https://www.steamgifts.com/discussion/TDyzv/`,
        icon: `fa-commenting green`,
        name: `Discussion`,
        description: `Visit the discussion page.`
      }, {
        type: `link`,
        href: `http://steamcommunity.com/groups/esgst`,
        icon: `fa-steam green`,
        name: `Steam Group`,
        description: `Visit/join the Steam group.`
      }, {
        onClick: container.common.loadChangelog.bind(container.common),
        icon: `fa-file-text-o yellow`,
        name: `Changelog`,
        description: `Check out the changelog.`
      }, {
        href: `https://www.patreon.com/gsrafael01`,
        icon: `fa-dollar grey`,
        name: `Patreon`,
        description: `Become a patron to support ESGST!`
      }, {
        disabled: true,
        icon: `fa-paypal grey`,
        name: `Paypal (gsrafael01@gmail.com)`,
        description: `Donate to support ESGST. Thank you!`
      }, {
        disabled: true,
        name: `Current Version: ${container.esgst.devVersion}`
      }
    ];
    if (!container.common._USER_INFO.extension) {
      items.unshift({
        onClick: container.common.checkUpdate.bind(container.common),
        icon: `fa-refresh blue`,
        name: `Update`,
        description: `Check for updates.`
      });
    }
    return items;
  }

  openMenu(event) {
    if (event.button === 2) return;
    event.preventDefault();
    if (container.esgst.openSettingsInTab || event.button === 1) {
      open(`/esgst/settings`);
    } else {
      container.common.loadMenu();
    }
  }

  closeHeaderMenu(event) {
    if (!this.menu.current.contains(event.target)) {
      this.setState({showDropdown: false});
    }
  }
  
  render() {
    if (this.state.showDropdown) {
      const buttons = document.querySelectorAll(`nav .nav__button, .nav_btn_dropdown, .page_heading_btn_dropdown`);
      for (const button of buttons) {
        button.classList.remove(container.esgst.selectedClass);
      }
      const dropdowns = document.querySelectorAll(`nav .nav__relative-dropdown, .dropdown`);
      for (const dropdown of dropdowns) {
        dropdown.classList.add(container.esgst.hiddenClass);
      }
    }
    const items = this.getItems();
    const children = [];
    for (const item of items) {
      const className = `esgst-header-menu-row${item.disabled ? ` esgst-version-row` : ``}`;
      if (item.href) {
        children.push(
          <a className={className} href={item.href} key={item.name} target='_blank'>
            {item.icon && <i className={`fa fa-fw ${item.icon}`}></i>}
            <div>
              <p className={`esgst-header-menu-name`}>{item.name}</p>
              <p className={`esgst-header-menu-description`}>{item.description}</p>
            </div>
          </a>
        );
      } else {
        const props = {
          className,
          key: item.name
        };
        if (item.onClick) {
          props.onClick = item.onClick;
        }
        children.push(
          <div {...props}>
            {item.icon && <i className={`fa fa-fw ${item.icon}`}></i>}
            <div>
              <p className={`esgst-header-menu-name`}>{item.name}</p>
              <p className={`esgst-header-menu-description`}>{item.description}</p>
            </div>
          </div>
        );
      }
    }
    return (
      <div className='esgst-header-menu' id='esgst' ref={this.menu} title={container.common.getFeatureTooltip()}>
        <div className={`esgst-header-menu-relative-dropdown ${this.state.showDropdown ? `` : `esgst-hidden`}`} ref={this.dropdown}>
          <div className='esgst-header-menu-absolute-dropdown'>{children}</div>
        </div>
        <div className='esgst-header-menu-button' onClick={this.openMenu.bind(this)}>
          <i className='fa'>
            <img src={container.esgst.icon}></img>
          </i>
          {` ESGST`}
        </div>
        <div className={`esgst-header-menu-button arrow ${this.state.showDropdown ? `selected` : ``}`} ref={this.arrow} onClick={() => this.setState({showDropdown: !this.state.showDropdown})}>
          <i className='fa fa-angle-down'></i>
        </div>
      </div>
    );
  }
}

export {HeaderMenu};