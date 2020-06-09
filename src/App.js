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
import AccountStore from './stores/AccountStore';
import GlobalStore from './stores/GlobalStore';
import LoginStore from './stores/LoginStore';
import AccountListPage from './pages/AccountListPage';
import LoginPage from './pages/LoginPage';
import History from './components/History';
import NoAccessPage from './pages/NoAccessPage';
import BuildingListPage from './pages/BuildingListPage';
import BuildingAccountListPage from './pages/BuildingAccountListPage';
import DoorAccountListPage from './pages/DoorAccountListPage';
import DoorDeviceListPage from './pages/DoorDeviceListPage';
import EventAttendeeListPage from './pages/EventAttendeeListPage';
import EventListPage from './pages/EventListPage';
import ReservationListPage from './pages/ReservationListPage';
import ReservationRefundPage from './pages/ReservationRefundPage';
import ReservationRefundListPage from './pages/ReservationRefundListPage';
import StoreListPage from './pages/StoreListPage';
import StorePriceListPage from './pages/StorePriceListPage';

@observer
class App extends Component {
  componentDidMount() {
    AccountStore.GetUserInfo();
  }

  render() {
    const { collapsed, collapseSideMenu } = GlobalStore;
    const { currentUser } = AccountStore;
    return (
      <Router history={History}>
        <Route
          data-login-status={LoginStore.isLogin}
          render={({ location }) => (
            <div className="App">
              <Route
                exact
                path="/"
                render={() => <Redirect to={SUB_NAV_ROUTES.STORE_LIST.path} />}
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
                          <PrivateRoute component={BuildingListPage} path={SUB_NAV_ROUTES.BUILDING_LIST.path} />
                          <PrivateRoute component={BuildingAccountListPage} path={SUB_NAV_ROUTES.BUILDING_ACCOUNT_LIST.path} />
                          <PrivateRoute component={StoreListPage} path={SUB_NAV_ROUTES.STORE_LIST.path} />
                          <PrivateRoute component={StorePriceListPage} path={SUB_NAV_ROUTES.STORE_PRICE_LIST.path} />
                          <PrivateRoute component={ReservationListPage} path={SUB_NAV_ROUTES.RESERVATION_GROUP.path} />
                          <PrivateRoute component={ReservationRefundPage} path={SUB_NAV_ROUTES.RESERVATION_REFUND_PAGE.path} />
                          <PrivateRoute component={ReservationRefundListPage} path={SUB_NAV_ROUTES.RESERVATION_REFUND_LIST_PAGE.path} />
                          <PrivateRoute component={DoorAccountListPage} path={SUB_NAV_ROUTES.DOOR_ACCOUNT_LIST.path} />
                          <PrivateRoute component={DoorDeviceListPage} path={SUB_NAV_ROUTES.DOOR_DEVICE_LIST.path} />
                          <PrivateRoute component={EventAttendeeListPage} path={SUB_NAV_ROUTES.EVENT_ATTENDEE_LIST.path} />
                          <PrivateRoute component={EventListPage} path={SUB_NAV_ROUTES.EVENT_LIST.path} />
                          <Route component={NoAccessPage} path={SUB_NAV_ROUTES.NO_ACCESS.path} />
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
