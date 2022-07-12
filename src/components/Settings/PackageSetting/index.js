import React, { Fragment } from "react";
import { MainCard } from "components/Card/SettingCard";
import ManageFirmware from "./ManageFirmware";

import { showInfoBar } from "actions/InfobarActions";
import { loadPackages } from "actions/SettingActions";

import { LOADING, LOADED } from "const/DataLoaderState";
import {
  ChainLoader,
  Firmware,
  Package,
  TerminalCap,
  ALL,
  PACKAGE_SETTING,
  INSTALL_SYSTEM,
//  FIRMWARE_PACKAGE,
//  INSTALL_DRIVERS,
  CHAIN_LOADER,
//  TERMCAP,
} from "const/Consts";
import { PackageTabs } from "const/Setting/Tab";

import { apiUploadModules, apiUploadSystem, apiUploadTermcap } from "api";

const tabs = [
  INSTALL_SYSTEM,
  // FIRMWARE_PACKAGE,
  // INSTALL_DRIVERS,
  // CHAIN_LOADER,
  // TERMCAP,
];

export default class PackageSetting extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tabFnMap: [],
      uploadFirmwareFile: undefined,
      uploadModulesFiles: undefined,
      uploadTermcapFile: undefined,
      uploadFirmwareResult: "",
      uploadModulesResult: "",
      uploadTermcapResult: "",
    };
    this.fileFirmware = React.createRef();
    this.fileTermcap = React.createRef();
    this.multiFileModules = React.createRef();
  }

  componentDidMount() {
    const tabFnMap = PackageTabs.map((tab) => this.bindTabActions(tab));
    this.setState({ tabFnMap: tabFnMap });
  }

  bindTabActions = (tab) => {
    let content = { ...tab };
    let type;
    // only upload need to bind actions
    switch (tab.content) {
      case INSTALL_SYSTEM:
        type = "Firmware";
        content.fileKey = `upload${type}File`;
        content.uploadResultKey = `upload${type}Result`;
        content.upload = this.uploadFirmware;
        break;
/*
      case INSTALL_DRIVERS:
        type = "Modules";
        content.fileKey = `upload${type}Files`;
        content.uploadResultKey = `upload${type}Result`;
        content.upload = this.uploadModules;
        break;
      case TERMCAP:
        type = "Termcap";
        content.fileKey = `upload${type}File`;
        content.uploadResultKey = `upload${type}Result`;
        content.upload = this.uploadTermcap;
        break;
      case FIRMWARE_PACKAGE:
        break;
*/
      default:
        break;
    }
    return content;
  };
  checkInstallType = (type) => {
    if (type === INSTALL_SYSTEM) {
      this.fileFirmware.current.click();
/*
    } else if (type === INSTALL_DRIVERS) {
      this.multiFileModules.current.click();
    } else if (type === TERMCAP) {
      this.fileTermcap.current.click();
*/
    }
  };
  selectTab = (tab) => {
    let {
      props: { selectTab },
    } = this;
    if (tab === INSTALL_SYSTEM) { // if (tab === INSTALL_SYSTEM || tab === INSTALL_DRIVERS || tab === TERMCAP) {
      this.checkInstallType(tab);
    } else {
      selectTab(PACKAGE_SETTING, tab);
    }
  };

  onFileChangeFirmware = (e) => {
    if (e.target.files.length !== 0) {
      this.setState({ uploadFirmwareFile: e.target.files });
    } else {
      this.setState({ uploadFirmwareFile: undefined });
    }
    this.setState({ uploadFirmwareResult: "" });
  };
  onFileChangeTermcap = (e) => {
    if (e.target.files.length !== 0) {
      this.setState({ uploadTermcapFile: e.target.files });
    } else {
      this.setState({ uploadTermcapFile: undefined });
    }
    this.setState({ uploadTermcapResult: "" });
  };
  onMultiFileChangeModules = (e) => {
    if (e.target.files.length !== 0) {
      this.setState({ uploadModulesFiles: e.target.files });
    } else {
      this.setState({ uploadModulesFiles: undefined });
    }
    this.setState({ uploadModulesResult: "" });
  };

  uploadFirmware = async () => {
    if (this.state.uploadFirmwareFile !== undefined) {
      const response = await apiUploadSystem(this.state.uploadFirmwareFile);
      if (response.result === true) {
        this.setState({ uploadFirmwareResult: "Success" });
      } else {
        // to do error infobar
        this.setState({ uploadFirmwareResult: "Fail" });
      }
    }
  };
  uploadTermcap = async () => {
    if (this.state.uploadTermcapFile !== undefined) {
      const response = await apiUploadTermcap(this.state.uploadTermcapFile);
      if (response.result === true) {
        this.setState({ uploadTermcapResult: "Success" });
      } else {
        // to do error infobar
        this.setState({ uploadTermcapResult: "Fail" });
      }
    }
  };
  uploadModules = async () => {
    if (this.state.uploadModulesFiles !== undefined) {
      const response = await apiUploadModules(this.state.uploadModulesFiles);
      if (response.result === true) {
        this.setState({ uploadModulesResult: "Success" });
      } else {
        // to do error infobar
        this.setState({ uploadModulesResult: "Fail" });
      }
    }
  };

  render() {
    let {
      props: { dispatch, mainTab, tab, packages, manufacturerModelMap },
      state: { tabFnMap },
    } = this;
    let packageList = packages.packageList;
    let lists = {
      [Firmware]: [],
      [Package]: [],
      [ChainLoader]: [],
      [TerminalCap]: [],
    };
    if (
      packageList.state == LOADED &&
      packageList.data != null &&
      packageList.data instanceof Array
    ) {
      lists[Firmware] = packageList.data.filter(
        (item) => item.Type == Firmware
      );
      lists[Package] = packageList.data.filter((item) => item.Type == Package);
      lists[ChainLoader] = packageList.data.filter(
        (item) => item.Type == ChainLoader
      );
      lists[TerminalCap] = packageList.data.filter(
        (item) => item.Type == TerminalCap
      );
    }
    return (
      <Fragment>
        <input
          type="file"
          name="file"
          onChange={this.onFileChangeFirmware}
          ref={this.fileFirmware}
          accept=".zip"
          multiple
          style={{
            display: "none",
          }}
        />
        <input
          type="file"
          name="file"
          onChange={this.onFileChangeTermcap}
          ref={this.fileTermcap}
          accept=".fs"
          style={{
            display: "none",
          }}
        />
        <input
          type="file"
          name="files"
          onChange={this.onMultiFileChangeModules}
          ref={this.multiFileModules}
          accept=".mod"
          multiple
          style={{
            display: "none",
          }}
        />
        {(mainTab === ALL || mainTab === PACKAGE_SETTING) &&
          /*tab !== FIRMWARE_PACKAGE &&*/
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
        {/*mainTab === PACKAGE_SETTING && tab === FIRMWARE_PACKAGE && (
          <div className="mask-1">
            <ManageFirmware
              dispatch={dispatch}
              packages={packages}
              manufacturerModelMap={manufacturerModelMap}
            />
          </div>
        )*/}
      </Fragment>
    );
  }
}
