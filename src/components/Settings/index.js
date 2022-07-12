import React, { Fragment } from "react";
import { connect } from "react-redux";
import Spinner from "components/Other/Spinner";
import PackageSetting from "./PackageSetting";
import License from "./License";
import ServerSetting from "./ServerSetting";
import Database from "./Database";
import AdminSetting from "./AdminSetting";

import { getModelMap } from "actions/TerminalActions";
import { ALL } from "const/Consts";
import { MainTabs } from "const/Setting/Tab";
import { LOADING } from "const/DataLoaderState";

class Settings extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mainTab: MainTabs[0][0], // main category
      tab: null, // sub category under main category
    };
    props.dispatch(getModelMap());
  }

  isActiveDirectorySetting = () => {
    let {
      props: { adServer },
    } = this;
    return adServer.user.state == LOADING;
  };

  selectTab = (mainTab, tab) => {
    this.setState({ mainTab: mainTab, tab: tab });
  };

  render() {
    let {
      state: { mainTab, tab },
      props: { dispatch, license, manufacturerModelMap, packages, userList },
    } = this;

    return (
      <Fragment>
        {/* {(  this.isActiveDirectorySetting()) && <Spinner />} */}
        <div style={{ width: "100%", height: "97%" }}>
          <div className="setting-header" style={{ height: "7%" }}>
            {MainTabs.map(([tabName, subTabs]) => (
              <div className="setting-tab-content">
                <div
                  className={
                    "setting-tab" + (mainTab === tabName ? " tab-selected" : "")
                  }
                  onClick={() => this.selectTab(tabName, null)}
                >
                  {tabName}
                </div>
                {subTabs.map((subTabName) => (
                  <div
                    className="setting-tab setting-tab-subtab"
                    onClick={() => this.selectTab(tabName, subTabName)}
                  >
                    {subTabName}
                  </div>
                ))}
              </div>
            ))}
          </div>
          <div className="setting-breadcrumb">
            <div
              className="menu-setting"
              onClick={() => this.selectTab(ALL, null)}
            ></div>
            <h3
              onClick={() => this.selectTab(ALL, null)}
              style={{ cursor: "pointer" }}
            >
              SETTINGS
            </h3>
            <h3
              onClick={() => this.selectTab(mainTab, null)}
              style={{ cursor: "pointer", marginLeft: "10px" }}
            >
              {mainTab === ALL ? "" : ` / ${mainTab}`}
            </h3>
            <h3 style={{ color: "#b4b4b4", marginLeft: "10px" }}>
              {tab == null ? "" : ` / ${tab}`}
            </h3>
          </div>
          <div
            className="groupcontainer-2"
            style={{ height: "81%", overflow: "auto", marginTop: "8px" }}
          >
            <div className="setting-container">
              <License
                dispatch={dispatch}
                license={license}
                mainTab={mainTab}
                selectTab={this.selectTab}
                tab={tab}
              />
              <PackageSetting
                dispatch={dispatch}
                packages={packages}
                manufacturerModelMap={manufacturerModelMap}
                mainTab={mainTab}
                selectTab={this.selectTab}
                tab={tab}
              />
              <AdminSetting
                dispatch={dispatch}
                userList={userList}
                mainTab={mainTab}
                selectTab={this.selectTab}
                tab={tab}
              />
              <ServerSetting
                dispatch={dispatch}
                manufacturerModelMap={manufacturerModelMap}
                packages={packages}
                mainTab={mainTab}
                selectTab={this.selectTab}
                tab={tab}
              />
              <Database
                dispatch={dispatch}
                mainTab={mainTab}
                selectTab={this.selectTab}
                tab={tab}
              />
            </div>
          </div>
        </div>
      </Fragment>
    );
  }
}

export default connect((state) => {
  return {
    license: state.settings.license,
    manufacturerModelMap: state.terminals.manufacturerModelMap,
    packages: state.settings.packages,
    adServer: state.settings.adServer,
    terminals: state.terminals,
    userList: state.auths.userList,
    infobar: state.infobar,
  };
})(Settings);
