import React, { Fragment } from "react";
import { EditorContainer, EditorSubTab } from "components/Card";
import InfoCard from "./InfoCard";
import HardwareCard from "./HardwareCard";
import PropertiesCard from "./PropertiesCard";
import DisplayAndMonitorCard from "./DisplayAndMonitorCard";
import ApplicationCard from "./ApplicationCard";
import UserAccessCard from "./UserAccessCard";
import ControlCard from "./ControlCard";
import TouchCard from "./TouchCard";

import { showInfoBar } from "actions/InfobarActions";
import { updateTerminal, operateTerminal } from "actions/TerminalActions";

import { arrayEqual, objectEqual } from "../../../../lib/Util";

import {
  EditorConfigTabs,
  EditorGroupConfigTabs,
  TERMINAL_INFO,
  TERMINAL_GROUP_INFO,
  HARDWARE,
  PROPERTIES,
  DISPLAY,
  APPLICATION,
  USER_ACCESS,
  CONTROL,
  TOUCH,
} from "const/Terminals/TerminalConsts";

import {
  AllowShadow,
  EnforceBootPriority,
  ApplyAllProperties,
  ApplicationApplyAll,
  ControlApplyAll,
  UserAccessApplyAll,
  extractApplications,
  extractAuthUser,
  extractControls,
  extractHardware,
  extractMonitors,
  extractTerminalInfo,
  extractTerminalOptions,
  extractTouch,
} from "const/Terminals/TerminalFieldNames";
import {
  EnforceBootPriorityApplyAll,
  AllowShadowApplyAll,
} from "const/Terminals/Properties";

import {
  getApplyAllProperties,
  getDisabledProperties,
} from "utils/Properties";
import { checkEdit } from "utils/Check";
import { findOverrideById, getAppOverride } from "utils/Override";
import { getDataForBaseCard } from "utils/Object";
import TouchEnablesAlert from "components/Alert/TouchEnablesAlert"

import { apiUpdateAppOverride } from "api";

export default class Configuration extends React.Component {
  constructor(props) {
    super(props);
    const [
      info,
      properties,
      hardware,
      display,
      applications,
      authUser,
      controls,
      touch,
    ] = this.extractData();
    const applyAllProperties = getApplyAllProperties(properties);
    const oriApplyAllProperties = JSON.parse(
      JSON.stringify(applyAllProperties)
    );
    const subTabs =
      props.data.isGroup === false ? EditorConfigTabs : EditorGroupConfigTabs;
    this.state = {
      editData: { ...info },
      subTabs: subTabs,
      info: info,
      properties: properties,
      hardware: hardware,
      display: display,
      applications: applications,
      authUser: authUser,
      controls: controls,
      touch: touch,
      canApply: true,
      applyAllProperties: applyAllProperties ?? {},
      oriApplyAllProperties: oriApplyAllProperties ?? {},
      appOverrides: {},
      oriAppOverrides: {},
      showTouchEnablesAlert: false,
    };
  }

  async componentDidMount() {
    if (this.props.data.editingTerminal.data !== undefined) {
      const appData = await this.getAppOverrideTree();
      this.setState({ appOverrides: appData, oriAppOverrides: appData });
    }
  }
  async componentDidUpdate(prevProps) {
    if (prevProps.tab !== this.props.tab && this.props.isUpdated === false) {
      this.resetTab(this.props.tab);
    }
    if (
      !objectEqual(
        prevProps.data.editingTerminal.data,
        this.props.data.editingTerminal.data
      )
    ) {
      const [
        info,
        properties,
        hardware,
        display,
        applications,
        authUser,
        controls,
        touch,
      ] = this.extractData();
      const applyAllProperties = getApplyAllProperties(properties);
      const oriApplyAllProperties = JSON.parse(
        JSON.stringify(applyAllProperties)
      );
      this.setState(
        {
          info: info,
          properties: properties,
          hardware: hardware,
          display: display,
          applications: applications,
          authUser: authUser,
          controls: controls,
          touch: touch,
          applyAllProperties: applyAllProperties ?? {},
          oriApplyAllProperties: oriApplyAllProperties ?? {},
        },
        () => this.resetTab(this.props.tab)
      );
    } else if (
      prevProps.infobar?.showInfoBar !== this.props.infobar?.showInfoBar &&
      this.props.infobar?.showInfoBar === true &&
      this.props.infobar?.infoType === "error"
    ) {
      // reset data when API Fail
      this.resetTab(this.props.tab);
    }
    if (
      prevProps.data.editingTerminal.data !== undefined &&
      prevProps.applications !== undefined &&
      !arrayEqual(
        prevProps.applications,
        this.props.applications
      )
    ) {
      await this.setAppOverrideTree();
    }
  }

  change = (data, canApply = true, ...otherEdited) => {
    let {
      props: { tab },
      state: { applyAllProperties, oriApplyAllProperties },
    } = this;
    const oriData = this.getOriData(tab);
    let edited = checkEdit(data, oriData);
    if (otherEdited.length > 0 && edited === false) {
      edited = otherEdited.some((value) => value === true);
    }
    if (
      tab === PROPERTIES &&
      !objectEqual(applyAllProperties, oriApplyAllProperties)
    ) {
      edited = true;
    }
    canApply = canApply && edited;
    this.setState(
      { editData: data, canApply: canApply },
      this.props.onChangeEdit(edited)
    );
  };

  openTouchEnablesAlert = () => {
    this.setState({ showTouchEnablesAlert: true })
  }

  closeTouchEnablesAlert = () => {
    this.setState({ showTouchEnablesAlert: false })
  }

  edit = () => {
    let {
      props: { onEdit },
    } = this;
    onEdit();
  };

  cancel = () => {
    const { tab, onCancel } = this.props;
    this.resetTab(tab);
    onCancel();
  };

  apply = async () => {
    let {
      props: {
        dispatch,
        data: { editingId, isGroup },
        tab,
        onCancel,
        isEdited,
      },
      state: { editData, appOverrides, applyAllProperties },
    } = this;
    let urlPath;
    switch (tab) {
      case TERMINAL_INFO:
      case TERMINAL_GROUP_INFO:
        urlPath = "info";
        break;
      case HARDWARE:
        urlPath = "hardware";
        break;
      case PROPERTIES:
        urlPath = "property";
        if (isGroup) {
          const applyAllString = Object.values(applyAllProperties)
            .flat()
            .join(",");
          editData[ApplyAllProperties] = applyAllString;
        }
        break;
      case DISPLAY:
        urlPath = "display";
        const overrides = findOverrideById(editData, appOverrides.appData);
        const response = await apiUpdateAppOverride(overrides, editingId);
        if (response.result === false) {
          dispatch(showInfoBar(response.appData, "error"));
          this.cancel();
        } else {
          // check monitor and screnn count data[key]
          let checkData = { ...editData };
          const maxNumbers = [1, 2, 3, 4, 5, 6, 7, 8];
          let monitorArray = maxNumbers.slice(
            maxNumbers.indexOf(editData["NumberOfMonitors"]) + 1
          );
          let screenArray = maxNumbers.slice(
            maxNumbers.indexOf(editData["NumberOfScreens"]) + 1
          );
          let index = 0;
          for await (const count of monitorArray) {
            for await (const key of Object.keys(checkData)) {
              let checkMonitor = key.indexOf("Monitor" + monitorArray[index]);
              let checkScreen = key.indexOf("Screen" + screenArray[index]);
              if (checkMonitor === 0) {
                delete checkData[key];
              }
              if (checkScreen === 0) {
                delete checkData[key];
              }
            }
            index++;
          }
          editData = { ...checkData };
          this.props.onCancel();
          this.setAppOverrideTree();
        }
        break;
      case USER_ACCESS:
        urlPath = "user-access";
        if (isGroup === false) {
          delete editData[UserAccessApplyAll];
        }
        // updatedData = authUser;
        break;
      case CONTROL:
        urlPath = "controls";
        break;
      default:
        break;
    }
    if (tab === TOUCH && isEdited) {
      this.openTouchEnablesAlert()
    } else {
      dispatch(updateTerminal(editingId, editData, isGroup, urlPath));
      onCancel();
    }
  };

  resetTab = (tab) => {
    const oriData = this.getOriData(tab);
    const appOverrides = {
      appData: { ...this.state.oriAppOverrides.appData },
    };
    if (this.props.data.isGroup) {
      const applyAllProperties = JSON.parse(
        JSON.stringify(this.state.oriApplyAllProperties)
      );
      this.setState({ applyAllProperties: applyAllProperties });
    }
    this.setState(
      { editData: { ...oriData }, appOverrides: appOverrides },
      () => {
        this.props.updateConfigFlag(true);
      }
    );
  };

  getOriData = (tab) => {
    let {
      props: {
        data: { isGroup },
      },
      state: {
        info,
        properties,
        hardware,
        display,
        authUser,
        controls,
        touch,
        oriApplyAllProperties,
        oriAppOverrides,
      },
    } = this;
    let oriData;
    switch (tab) {
      case TERMINAL_INFO:
      case TERMINAL_GROUP_INFO:
        oriData = { ...info };
        break;
      case HARDWARE:
        oriData = { ...hardware };
        break;
      case PROPERTIES:
        oriData = { ...properties };
        break;
      case DISPLAY:
        oriData = { ...display };
        break;
      case USER_ACCESS:
        oriData = { ...authUser };
        break;
      case CONTROL:
        oriData = { ...controls };
        break;
      case TOUCH:
        oriData = { ...touch };
        break;
      default:
        break;
    }
    return oriData;
  };

  extractData = () => {
    let {
      props: {
        data: { isGroup, editingTerminal },
      },
    } = this;
    let info = getDataForBaseCard(extractTerminalInfo(editingTerminal.data));
    let properties = getDataForBaseCard(
      extractTerminalOptions(editingTerminal.data)
    );
    let hardware = getDataForBaseCard(extractHardware(editingTerminal.data));
    let display = getDataForBaseCard(extractMonitors(editingTerminal.data));
    let applications = getDataForBaseCard(
      extractApplications(editingTerminal.data)
    );
    let authUser = getDataForBaseCard(extractAuthUser(editingTerminal.data));
    let controls = getDataForBaseCard(extractControls(editingTerminal.data));
    let touch = getDataForBaseCard(extractTouch(editingTerminal.data));
    if (isGroup === false) {
      delete properties[ApplyAllProperties];
      delete applications[ApplicationApplyAll];
      delete authUser[UserAccessApplyAll];
      delete controls[ControlApplyAll];
    }
    return [
      info.data,
      properties.data,
      hardware.data,
      display.data,
      applications.data,
      authUser.data,
      controls.data,
      touch.data,
    ];
  };

  setPropertyApplyAll = (e, key) => {
    let {
      state: { editData, applyAllProperties },
    } = this;

    if (e.target.value === true) {
      if (key === EnforceBootPriority) {
        applyAllProperties[key] = [...EnforceBootPriorityApplyAll];
      } else if (key === AllowShadow) {
        applyAllProperties[key] = [...AllowShadowApplyAll];
      } else {
        applyAllProperties[key] = [key];
      }
    } else {
      delete applyAllProperties[key];
    }
    this.setState({ applyAllProperties }, () => {
      this.change(editData, true);
    });
  };
  setAppOverrides = (appOverrides) => {
    const updateOverrides = { appData: appOverrides };
    this.setState({ appOverrides: updateOverrides });
  };
  getAppOverrideTree = async () => {
    const appData = await getAppOverride(this.props.data.editingId);
    return appData;
  };
  setAppOverrideTree = async () => {
    const appData = await this.getAppOverrideTree();
    const oriAppOverrides = JSON.parse(JSON.stringify(appData));
    this.setState({ appOverrides: appData, oriAppOverrides: oriAppOverrides });
  };
  operateAction = (editingId, operateType) => {
    let {
      props: { dispatch },
    } = this;
    dispatch(operateTerminal(editingId, operateType));
  };

  render() {
    let {
      props: {
        dispatch, isLoading, isLoaded, isEditMode, isEdited, isUpdated,
        data, infobar, status, tab, selectConfigTab, onChangeEdit,
        rdss, rdsGroups, rdsMainTree,
        vncs, vncGroups, vncMainTree,
        currentTab
      },
      state: {
        canApply, editData, subTabs, info, hardware, properties, display,
        authUser, controls, appOverrides, oriAppOverrides, applyAllProperties, showTouchEnablesAlert
      },
    } = this;

    let {
      editingTerminal,
      parentTerminal,
      terminalMainTree,
      terminals,
      terminalGroups,
      adUsers,
      verifyAuthUserResult,
      defaultMouseMapping,
      defaultKeyboardMapping,
      hardwareInfo,
      manufacturerModelMap,
      firmwarePackage,
      editingId,
      isGroup,
    } = data;
    let configLoaded = false;

    if (typeof editingTerminal.data !== "undefined") {
      configLoaded = Object.keys(editingTerminal.data).length > 0;
    }

    return (
      <Fragment>
        {!configLoaded && (
          <div className="wrap-960 wrap-bg-w modal-content-edit">
            No data found...
          </div>
        )}
        {showTouchEnablesAlert && (
          <TouchEnablesAlert
            yes={() => {
              this.operateAction(editingId,"reboot")
              dispatch(updateTerminal(editingId, editData, isGroup));
              this.closeTouchEnablesAlert();
              this.props.onCancel();
            }}
            no={this.closeTouchEnablesAlert}
          />
        )}
        {configLoaded && (
          <Fragment>
            <EditorSubTab
              tabWidth={130}
              tabZIndex={7}
              tabClass="sub-tab"
              subTabs={subTabs}
              currentTab={tab}
              selectTab={selectConfigTab}
            />
            <EditorContainer
              isEditMode={isEditMode}
              title={tab}
              edited={isEdited}
              canApply={canApply}
              onEdit={this.edit}
              onCancel={this.cancel}
              onApply={this.apply}
            >
              {(tab === TERMINAL_INFO || tab === TERMINAL_GROUP_INFO) &&
                isUpdated && (
                  <InfoCard
                    dispatch={dispatch}
                    isLoaded={configLoaded}
                    isEditMode={isEditMode}
                    isGroup={isGroup}
                    data={editData}
                    editingId={editingId}
                    terminalMainTree={terminalMainTree}
                    objects={terminals}
                    objectGroups={terminalGroups}
                    onChange={this.change}
                  />
                )}
              {!isGroup && tab === HARDWARE && isUpdated && (
                <HardwareCard
                  dispatch={dispatch}
                  isLoaded={isLoaded}
                  isEditMode={isEditMode}
                  data={editData}
                  editingId={editingId}
                  status={status}
                  firmwarePackage={firmwarePackage}
                  manufacturerModelMap={manufacturerModelMap}
                  onChange={this.change}
                />
              )}
              {tab === PROPERTIES && isUpdated && (
                <PropertiesCard
                  dispatch={dispatch}
                  isLoaded={configLoaded}
                  isEditMode={isEditMode}
                  isGroup={isGroup}
                  data={editData}
                  parentTerminal={parentTerminal}
                  applyAllProperties={applyAllProperties}
                  setApplyAll={this.setPropertyApplyAll}
                  onChange={this.change}
                />
              )}
              {tab === DISPLAY && isUpdated && (
                <DisplayAndMonitorCard
                  dispatch={dispatch}
                  isLoaded={configLoaded}
                  isEditMode={isEditMode}
                  isGroup={isGroup}
                  data={editData}
                  editingId={editingId}
                  displayEdit={isEdited}
                  hardware={hardware}
                  hardwareInfo={hardwareInfo}
                  appOverrides={appOverrides}
                  oriAppOverrides={oriAppOverrides}
                  rdss={rdss} rdsGroups={rdsGroups} rdsMainTree={rdsMainTree}
                  vncs={vncs} vncGroups={vncGroups} vncMainTree={vncMainTree}
                  currentTab={currentTab}
                  adUsers={adUsers}
                  defaultMouseMapping={defaultMouseMapping}
                  verifyAuthUserResult={verifyAuthUserResult}
                  terminalMainTree={terminalMainTree}
                  parentTerminal={parentTerminal}
                  setAppOverrides={this.setAppOverrides}
                  setAppOverrideTree={this.setAppOverrideTree}
                  onChange={this.change}
                  onChangeEdit={onChangeEdit}
                />
              )}
              {tab === USER_ACCESS && isUpdated && (
                <UserAccessCard
                  dispatch={dispatch}
                  isLoaded={configLoaded}
                  isEditMode={isEditMode}
                  isGroup={isGroup}
                  data={editData}
                  adUsers={adUsers}
                  parentTerminal={parentTerminal}
                  verifyAuthUserResult={verifyAuthUserResult}
                  onChange={this.change}
                />
              )}
              {tab === CONTROL && isUpdated && (
                <ControlCard
                  dispatch={dispatch}
                  isLoaded={configLoaded}
                  isEditMode={isEditMode}
                  isGroup={isGroup}
                  data={editData}
                  parentTerminal={parentTerminal}
                  defaultMouseMapping={defaultMouseMapping}
                  defaultKeyboardMapping={defaultKeyboardMapping}
                  onChange={this.change}
                />
              )}
              {tab === TOUCH && isUpdated && (
                <TouchCard
                  dispatch={dispatch}
                  isLoaded={configLoaded}
                  isEditMode={isEditMode}
                  isGroup={isGroup}
                  data={editData}
                  parentTerminal={parentTerminal}
                  applyAllProperties={applyAllProperties}
                  setApplyAll={this.setPropertyApplyAll}
                  onChange={this.change}
                />
              )}
            </EditorContainer>
          </Fragment>
        )}
      </Fragment>
    );
  }
}
