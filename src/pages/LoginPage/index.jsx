import { AlipayCircleOutlined, TaobaoCircleOutlined, WeiboCircleOutlined } from '@ant-design/icons';
import { Alert, Checkbox } from 'antd';
import { withRouter } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import styles from './index.module.less';
import LoginFrom from './components/Login';
import { useStores } from '../../stores/hook';

const {
  Tab, UserName, Password, Mobile, Captcha, Submit,
} = LoginFrom;

const LoginMessage = ({ content }) => (
  <Alert
    style={{
      marginBottom: 24,
    }}
    message={content}
    type="error"
    showIcon
  />
);

const UserLogin = (props) => {
  const { userLogin = {}, submitting } = props;
  const { status, type: loginType } = userLogin;
  const [autoLogin, setAutoLogin] = useState(true);
  const [type, setType] = useState('account');
  const { LoginStore } = useStores();
  const { shouldRedirect } = LoginStore;

  const redirectAfterLogin = () => {
    const { history, location } = props;
    LoginStore.UpdateRedirect(false);
    const redirectUrl = (location.state && location.state.from.pathname) || '/';

    history.push(redirectUrl);
  };

  const handleSendCaptcha = (mobile) => {
    LoginStore.HandleGetSMSCode(mobile);
  };


  const handleSubmit = (values) => {
    LoginStore.HandleLocalLogin(values);
  };

  useEffect(() => {
    if (shouldRedirect) {
      redirectAfterLogin();
    }
  }, [shouldRedirect]);

  return (
    <div className={styles.container}>

      <div className={styles.main}>
        <div className={styles.content}>
          <div className={styles.top}>
            <div className={styles.header}>
              {/* <img className={styles.logo} src={LogoImg} alt="logo" /> */}
              <span className={styles.title}>
                M Lounge
              </span>
            </div>
            <div className={styles.desc}>
              管理系统
            </div>
            <LoginFrom activeKey={type} onTabChange={setType} onSubmit={handleSubmit}>
              <Tab key="account" tab="账户密码登录">
                {status === 'error' && loginType === 'account' && !submitting && (
                <LoginMessage content="账户或密码错误（admin/ant.design）" />
                )}

                <UserName
                  name="userName"
                  placeholder="用户名: admin or user"
                  rules={[
                    {
                      required: true,
                      message: '请输入用户名!',
                    },
                  ]}
                />
                <Password
                  name="password"
                  placeholder="密码:"
                  rules={[
                    {
                      required: true,
                      message: '请输入密码！',
                    },
                  ]}
                />
              </Tab>
              <Tab key="mobile" tab="手机号登录">
                {status === 'error' && loginType === 'mobile' && !submitting && (
                <LoginMessage content="验证码错误" />
                )}
                <Mobile
                  name="mobile"
                  placeholder="手机号"
                  rules={[
                    {
                      required: true,
                      message: '请输入手机号！',
                    },
                    {
                      pattern: /^1\d{10}$/,
                      message: '手机号格式错误！',
                    },
                  ]}
                />
                <Captcha
                  name="captcha"
                  placeholder="验证码"
                  countDown={120}
                  getCaptchaButtonText=""
                  getCaptchaSecondText="秒"
                  onSendCaptcha={handleSendCaptcha}
                  rules={[
                    {
                      required: true,
                      message: '请输入验证码！',
                    },
                  ]}
                />
              </Tab>
              <div>
                <Checkbox checked={autoLogin} onChange={(e) => setAutoLogin(e.target.checked)}>
                  自动登录
                </Checkbox>
                <a
                  style={{
                    float: 'right',
                  }}
                >
                  忘记密码
                </a>
              </div>
              <Submit loading={submitting}>登录</Submit>
              {
                /*
                  <div className={styles.other}>
                    其他登录方式
                    <AlipayCircleOutlined className={styles.icon} />
                    <TaobaoCircleOutlined className={styles.icon} />
                    <WeiboCircleOutlined className={styles.icon} />
                  </div>
                */
              }

            </LoginFrom>
          </div>
        </div>
      </div>
    </div>
  );
};

export default withRouter(UserLogin);
