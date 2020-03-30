import { Session } from '../class/Session';
import { Namespaces } from '../constants/Namespaces';

abstract class User implements IUser {
  nodes: IUserNodes;
  data: IUserData;

  constructor() {
    this.nodes = User.getDefaultNodes();
    this.data = User.getDefaultData();
  }

  static getDefaultNodes(): IUserNodes {
    return {
      avatarOuter: null,
      avatarInner: null,
      usernameOuter: null,
      usernameInner: null,
      role: null,
      patreon: null,
      reputation: null,
      positiveReputation: null,
      negativeReputation: null,
    };
  }

  static getDefaultData(): IUserData {
    return {
      id: '',
      steamId: '',
      avatar: '',
      username: '',
      url: '',
      isOp: false,
      roleId: '',
      roleName: '',
      isPatron: false,
      positiveReputation: 0,
      negativeReputation: 0,
    };
  }

  static create(): IUser {
    switch (Session.namespace) {
      case Namespaces.SG: {
        return new SgUser();
      }
      case Namespaces.ST: {
        return new StUser();
      }
    }
    return null;
  }
}

class SgUser extends User {
  constructor() {
    super();
  }
}

class StUser extends User {
  constructor() {
    super();
  }
}

export { User };