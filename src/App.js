import React, { Component, Suspense, lazy } from 'react';
import {
  Router,
  Redirect,
  Route,
  Switch,
} from 'react-router-dom';

import { Layout } from 'antd';

import { observer } from 'mobx-react';


import GlobalHeaderView from './components/GlobalHeaderView';
import RightContent from './components/GlobalHeaderContent/RightContent';
import SideMenu from './components/SideMenu';
import PrivateRoute from './components/PrivateRoute';
import { SUB_NAV_ROUTES, NAV_ROUTES } from './constants';
import accountStore from './stores/AccountStore';
import globalStore from './stores/GlobalStore';

import loginStore from './stores/LoginStore';
import AccountListPage from './pages/editPages/AccountListPage';
import LoginPage from './pages/LoginPage';
import OverallPage from './pages/OverallPage';
import CreditPage from './pages/CreditPage';
import History from './components/History';
import NoAccessPage from './pages/NoAccessPage';
import EditCreditPage from './pages/editPages/EditCreditPage';
import EditLocPage from './pages/editPages/EditLocPage';
import EditStandbyLocPage from './pages/editPages/EditStandbyLocPage';
import EditExposurePage from './pages/editPages/EditExposurePage';
import EditGuarantyCustomsPage from './pages/editPages/EditGuarantyCustomsPage';


@observer
class App extends Component {
  componentDidMount() {
    accountStore.GetUserInfo();
  }

  render() {
    const { collapsed, collapseSideMenu } = globalStore;
    const { currentUser } = accountStore;
    return (
      <Router history={History}>
        <Route
          data-login-status={loginStore.isLogin}
          render={({ location }) => (
            <div className="App">
              <Route
                exact
                path="/"
                render={() => <Redirect to={NAV_ROUTES.OVERALL_PAGE.path} />}
              />
              <Switch location={location}>
                {/* login */}
                <Route component={LoginPage} path={NAV_ROUTES.LOGIN.path} />
                <Layout>
                  <SideMenu
                    accountRole={currentUser.role}
                    collapsed={collapsed}
                    onCollapse={collapseSideMenu}
                  />
                  <Layout>
                    <GlobalHeaderView
                      currentUser={currentUser}
                      rightContentRender={(rightProps) => <RightContent {...rightProps} />}
                      collapsed={collapsed}
                      onCollapse={collapseSideMenu}
                    />
                    <Layout>
                      <Suspense fallback={<div> loading... </div>}>
                        <Switch location={location}>
                          {/* login */}
                          <PrivateRoute component={AccountListPage} path={SUB_NAV_ROUTES.ACCOUNT_LIST.path} />
                          <Route component={NoAccessPage} path={SUB_NAV_ROUTES.NO_ACCESS.path} />
                          <PrivateRoute component={OverallPage} path={NAV_ROUTES.OVERALL_PAGE.path} />
                          <PrivateRoute component={CreditPage} path={NAV_ROUTES.CREDIT_PAGE.path} />
                          <PrivateRoute component={EditCreditPage} path={SUB_NAV_ROUTES.EDIT_CREDIT_PAGE.path} />
                          <PrivateRoute component={EditLocPage} path={SUB_NAV_ROUTES.EDIT_LOC_PAGE.path} />
                          <PrivateRoute component={EditStandbyLocPage} path={SUB_NAV_ROUTES.EDIT_STANDBY_LOC_PAGE.path} />
                          <PrivateRoute component={EditExposurePage} path={SUB_NAV_ROUTES.EDIT_EXPOSURE_PAGE.path} />
                          <PrivateRoute component={EditGuarantyCustomsPage} path={SUB_NAV_ROUTES.EDIT_GUARANTY_CUSTOMS_PAGE.path} />
                        </Switch>
                      </Suspense>
                    </Layout>
                  </Layout>
                </Layout>
              </Switch>
            </div>
          )}
        />
      </Router>

    );
  }
}

export default App;
