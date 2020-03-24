import { Session } from '../class/Session';
import { Namespaces } from '../constants/Namespaces';

abstract class UserUtils implements IUserUtils {
  constructor() {}
}

class SgUserUtils extends UserUtils {
  constructor() {
    super();
  }
}

class StUserUtils extends UserUtils {
  constructor() {
    super();
  }
}

abstract class User implements IUser {
  nodes: IUserNodes;
  data: IUserData;

  constructor() {
    this.nodes = this.getDefaultNodes();
    this.data = this.getDefaultData();
  }

  getDefaultNodes(): IUserNodes {
    return {
      usernameOuter: null,
      usernameInner: null,
    };
  }

  getDefaultData(): IUserData {
    return {
      username: '',
    };
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

const createUserUtils = (): IUserUtils => {
  switch (Session.namespace) {
    case Namespaces.SG: {
      return new SgUserUtils();
    }
    case Namespaces.ST: {
      return new StUserUtils();
    }
  }
  return null;
};

const createUser = (): IUser => {
  switch (Session.namespace) {
    case Namespaces.SG: {
      return new SgUser();
    }
    case Namespaces.ST: {
      return new StUser();
    }
  }
  return null;
};

export { createUserUtils, createUser };