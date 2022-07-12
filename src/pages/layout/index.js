import React, { Fragment } from "react";
import ReactDOM from "react-dom";
import { Provider, connect } from "react-redux";
import store from "store";

import Header from "components/Header";
import Applications from "components/Applications";
import Terminals from "components/Terminals";
import Servers from "components/Servers";
import Settings from "components/Settings";
import Log from "components/Log";
import Login from "components/Login";
import WsNotification from "components/WsNotification";
import Timer from "components/Other/Timer";
import InfoBar from "components/Other/InfoBar";

import { getProductInfo, getWatchdog } from "actions/OtherActions";
import { loadUsers, getUserInfo } from "actions/AuthActions";
import { showInfoBar } from "actions/InfobarActions";
import {
  initPendingTerminals,
  loadTerminalsAndGroups,
} from "actions/TerminalActions";
import { loadServersAndGroups } from "actions/ServerActions";
import { loadApplicationsAndGroups } from "actions/ApplicationActions";
import { logout } from "actions/AuthActions";

import { DefaultSession, DefaultIdle } from "../../const/Env";
import { LOADED, LOADING, FAILURE } from "const/DataLoaderState";

const TERMINALS = "TERMINALS";
const SERVERS = "SERVERS";
const APPLICATIONS = "APPLICATIONS";
const SETTINGS = "SETTINGS";
const LOG = "LOG";

import "@fortawesome/fontawesome-free/css/all.css";
import "@babel/polyfill";

if (process.env.NODE_ENV == "production") {
  require("css/main/style.scss");
} else {
  require("css/main/style-dev.scss");
}

let mapToDispatch;

class Page extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tab: "",
      x: 0,
      y: 0,
      isLoaded: false,
    };
    props.dispatch(getProductInfo());
  }

  componentDidMount() {
    let {
      props: { dispatch, data },
    } = this;
    const watchDogTimer = setInterval(this.watchDog, 10000);
    watchDogTimer;
    mapToDispatch = this.bindDispatch.bind(this);

    const token = data.auths.token;

    const showHomepage = token.data != null && token.state == LOADED;

    if (showHomepage) {
      dispatch(loadTerminalsAndGroups());
      dispatch(loadServersAndGroups());
      dispatch(loadApplicationsAndGroups());
    }
  }

  componentDidUpdate(prevProps, prevState) {
    // check data is Loaded or not
    if (!this.state.isLoaded && this.state.tab === "") {
      if (
        this.props.data.terminals.terminals.state === "LOADED" &&
        this.props.data.servers.servers.state === "LOADED" &&
        this.props.data.applications.applications.state === "LOADED"
      ) {
        if (!this.hasServer()) {
          this.setState({ isLoaded: true, tab: SERVERS });
        } else if (
          this.props.data.applications.applications.data?.length === 0
        ) {
          this.setState({
            isLoaded: true,
            tab: APPLICATIONS,
          });
        } else {
          this.setState({ isLoaded: true, tab: TERMINALS });
        }
      }
    }
  }

  bindDispatch = (action) => {
    return this.props.dispatch(action);
  };

  watchDog = () => {
    let {
      props: { dispatch, data },
    } = this;
    if (data.auths.token?.data == null) {
      dispatch(getWatchdog());
    }
  };

  changeTab = (tab) => {
    let {
      props: { dispatch },
    } = this;

    switch (tab) {
      case TERMINALS:
      case SERVERS:
      case APPLICATIONS:
        break;
      default:
        break;
    }
    this.setState({ tab });
  };

  handleMouseMove = (e) => {
    this.setState({
      x: e.clientX,
      y: e.clientY,
    });
  };

  userLogout = () => {
    let {
      props: { dispatch, data },
    } = this;
    const userData = {
      Username: data.auths.userInfo.data.Username,
    };
    dispatch(logout(userData));
  };

  hasServer = () => {
    let {
      props: { data },
    } = this;
    if (
      Array.isArray(data.servers.servers.data) &&
      data.servers.servers.data.length > 0
    ) {
      return true;
    } else {
      return false;
    }
  };

  render() {
    let {
      props: { data },
      state: { tab, x, y },
    } = this;
    const token = data.auths.token;
    const productInfo = data.auths.productInfo;
    // During api get product info, show not show login page.
    const showLogin =
      (token.data == null ||
        token.state == FAILURE ||
        token.state == LOADING) &&
      productInfo.state != null &&
      productInfo.state != LOADING;
    const showHomepage = token.data != null && token.state == LOADED;

    const showServerReminder = !this.hasServer();
    const showAppReminder =
      this.hasServer() &&
      Array.isArray(data.applications.applications.data) &&
      data.applications.applications.data.length === 0;
    const isWatchdogAlive = data.auths.isWatchdogAlive.data === "OK";
    const isLogout = data.auths.token?.data != null ? false : true;
    return (
      <Fragment>
        <InfoBar />
        {showHomepage && !showLogin && <WsNotification />}
        {!isWatchdogAlive && <p>Watch Dog Fail</p>}
        {isWatchdogAlive && showLogin && !showHomepage && <Login />}
        {isWatchdogAlive && showHomepage && !showLogin && (
          <div className="wrapper" onMouseMove={this.handleMouseMove}>
            <Header
              onChangeTab={this.changeTab}
              tab={tab}
              productInfo={data.auths.productInfo}
              userLogout={this.userLogout}
            />
            <div style={{ display: "flex", height: "87.6vh" }}>
              <nav className="main-menu">
                <ul>
                  <li
                    id="menu-terminal-item"
                    className={tab === TERMINALS ? "click" : ""}
                    style={
                      !showServerReminder && !showAppReminder
                        ? {}
                        : { opacity: "0.35", cursor: "default" }
                    }
                    onClick={
                      !showServerReminder && !showAppReminder
                        ? this.changeTab.bind(this, TERMINALS)
                        : null
                    }
                  >
                    <div
                      className={
                        tab === TERMINALS
                          ? "menu-terminal-active"
                          : "menu-terminal"
                      }
                    ></div>
                    <p>TERMINALS</p>
                  </li>
                  <li
                    id="menu-server-item"
                    className={
                      tab === SERVERS
                        ? "click"
                        : showServerReminder
                        ? "menu-item-blink"
                        : ""
                    }
                    onClick={this.changeTab.bind(this, SERVERS)}
                  >
                    <div
                      className={
                        tab === SERVERS
                          ? "menu-app-server-active"
                          : "menu-app-server"
                      }
                    ></div>
                    <p>APP SERVERS</p>
                  </li>
                  <li
                    id="menu-app-item"
                    className={
                      tab === APPLICATIONS
                        ? "click"
                        : showAppReminder
                        ? "menu-item-blink"
                        : ""
                    }
                    style={
                      this.hasServer()
                        ? {}
                        : { opacity: "0.35", cursor: "default" }
                    }
                    onClick={
                      this.hasServer()
                        ? this.changeTab.bind(this, APPLICATIONS)
                        : null
                    }
                  >
                    <div
                      className={
                        tab === APPLICATIONS ? "menu-app-active" : "menu-app"
                      }
                    ></div>
                    <p>APP</p>
                  </li>
                  <li
                    className={tab === LOG ? "click" : ""}
                    onClick={this.changeTab.bind(this, LOG)}
                  >
                    <div
                      className={tab === LOG ? "menu-log-active" : "menu-log"}
                    ></div>
                    <p>LOG</p>
                  </li>
                  <li
                    className={tab === SETTINGS ? "click" : ""}
                    onClick={this.changeTab.bind(this, SETTINGS)}
                  >
                    <div
                      className={
                        tab === SETTINGS
                          ? "menu-setting-active"
                          : "menu-setting"
                      }
                    ></div>
                    <p>SETTINGS</p>
                  </li>
                </ul>
              </nav>
              <main>
                {tab === TERMINALS && (
                  <Terminals
                    servers={data.servers}
                    applications={data.applications}
                  />
                )}
                {tab === SERVERS && (
                  <Servers
                    terminals={data.terminals}
                    applications={data.applications}
                    showServerReminder={showServerReminder}
                  />
                )}
                {tab === APPLICATIONS && (
                  <Applications
                    terminals={data.terminals}
                    servers={data.servers}
                    showAppReminder={showAppReminder}
                  />
                )}
                {tab === SETTINGS && <Settings />}
                {tab === LOG && <Log type="server" />}
              </main>
            </div>
            {/* <Footer /> */}
            <Timer
              session={
                data.auths.userInfo?.data?.SessionTimeout ?? DefaultSession
              }
              current={data.auths.userInfo?.data?.IdleTimeout ?? DefaultIdle}
              x={x}
              y={y}
              isLogout={isLogout}
              userLogout={this.userLogout}
            />
          </div>
        )}
      </Fragment>
    );
  }
}

const ConnectedPage = connect((state) => {
  return {
    data: state,
  };
})(Page);

export const onDispatch = (action) => {
  return mapToDispatch(action);
};

ReactDOM.render(
  <Provider store={store}>
    <ConnectedPage />
  </Provider>,
  document.getElementById("app")
);
