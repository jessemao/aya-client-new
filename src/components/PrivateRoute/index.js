import React from 'react';
import {
  Route,
  Redirect,
} from 'react-router-dom';
import { observer } from 'mobx-react';

import LoginStore from '../../stores/LoginStore';
import accountStore from '../../stores/AccountStore';

// 1. Click the public page
// 2. Click the protected page
// 3. Log in
// 4. Click the back button, note the URL each time
const PrivateRoute = ({ component: Component, ...rest }) => {
  if (!accountStore.hasGetInfo) {
    return null;
  }

  let redirectPath = '';
  if (!LoginStore.isLogin) {
    redirectPath = '/login';
  }

  const noRedirect = LoginStore.isLogin;

  return (
    <Route
      {...rest}
      render={(props) => (noRedirect ? (
        <Component {...props} />
      ) : (
        <Redirect
          to={{
            pathname: redirectPath,
            state: { from: props.location },
          }}
        />
      ))}
    />
  );
};

export default observer(PrivateRoute);
