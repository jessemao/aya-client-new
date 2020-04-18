import React from 'react';
import { observer } from 'mobx-react';
import NoAccess from '../../pages/no-access-page';
import accountStore from '../../stores/AccountStore';
import { ACCESS_LEVEL } from '../../constants/user';

function requireAccess({
  accessLevel = ACCESS_LEVEL.OPERATOR,
} = {}) {
  return function commponet(Component) {
    @observer
    class RequireAccess extends Component {
      // componentDidMount() {
      //   if (accountStore.account.accessLevel >= accessLevel) {
      //     super.componentDidMount();
      //   }
      // }

      render() {
        if (accountStore.account.accessLevel < accessLevel) {
          return (
            <NoAccess />
          );
        }
        return super.render();
      }
    }

    return RequireAccess;
  };
}

export default requireAccess;
