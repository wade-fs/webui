import React, { Fragment } from "react";
import { MainCard } from "components/Card/SettingCard";
import Dhcp from "./Dhcp";
import ActiveDirectory from "./ActiveDirectory";

import { showInfoBar } from "actions/InfobarActions";

import {
  ALL,
  DHCP,
  ACTIVE_DIRECTORY,
  UPDATE_SERVER_AND_CERTIFICATE,
  SERVER_SETTING,
} from "const/Consts";
import { ServerTabs } from "const/Setting/Tab";

import { apiUploadCertificate } from "api";

export default class ServerSetting extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tabFnMap: [],
      uploadServerCertFiles: undefined,
      uploadServerCertResult: "",
    };
    this.multiFileServerCert = React.createRef();
  }

  componentDidMount() {
    const tabFnMap = ServerTabs.map((tab) => this.bindTabActions(tab));
    this.setState({ tabFnMap: tabFnMap });
  }

  bindTabActions = (tab) => {
    let content = { ...tab };
    let type;
    // only upload need to bind actions
    switch (tab.content) {
      case DHCP:
      case ACTIVE_DIRECTORY:
        break;
      case UPDATE_SERVER_AND_CERTIFICATE:
        type = "ServerCert";
        content.fileKey = `upload${type}Files`;
        content.uploadResultKey = `upload${type}Result`;
        content.upload = this.uploadServerCert;
        break;
      default:
        break;
    }
    return content;
  };

  selectTab = (tab) => {
    let {
      props: { selectTab },
    } = this;
    if (tab === UPDATE_SERVER_AND_CERTIFICATE) {
      this.multiFileServerCert.current.click();
    } else {
      selectTab(SERVER_SETTING, tab);
    }
  };

  onMultiFileChangeServerCert = (e) => {
    if (e.target.files.length !== 0) {
      this.setState({ uploadServerCertFiles: e.target.files });
    } else {
      this.setState({ uploadServerCertFiles: undefined });
    }
    this.setState({ uploadServerCertResult: "" });
  };

  uploadServerCert = async () => {
    if (this.state.uploadServerCertFiles[0] !== undefined) {
      const response = await apiUploadCertificate(
        this.state.uploadServerCertFiles
      );
      if (response.result === true) {
        this.props.dispatch(showInfoBar("Upload Success !!"));
        this.setState({ uploadServerCertResult: "Success" });
      } else {
        this.props.dispatch(showInfoBar(response.data, "error"));
        this.setState({ uploadServerCertResult: "Fail" });
      }
    }
  };

  render() {
    let {
      props: { dispatch, mainTab, tab },
      state: { tabFnMap },
    } = this;
    return (
      <Fragment>
        <input
          type="file"
          name="files"
          onChange={this.onMultiFileChangeServerCert}
          ref={this.multiFileServerCert}
          // accept=".mod"
          accept=".key,.pem,"
          multiple
          style={{ display: "none" }}
        />
        {(mainTab === ALL || mainTab === SERVER_SETTING) &&
          tab !== DHCP &&
          tab !== ACTIVE_DIRECTORY &&
          tabFnMap.map((tab) => (
            <MainCard
              key={tab.content}
              tab={tab}
              selectTab={this.selectTab}
              currentFiles={this.state[tab.fileKey]}
              uploadResult={this.state[tab.uploadResultKey]}
              upload={tab.upload}
            />
          ))}
        {mainTab === SERVER_SETTING && tab != null && (
          <div className="mask-1">
            {tab === DHCP && <Dhcp dispatch={dispatch} />}
            {tab === ACTIVE_DIRECTORY && (
              <ActiveDirectory dispatch={dispatch} />
            )}
          </div>
        )}
      </Fragment>
    );
  }
}
