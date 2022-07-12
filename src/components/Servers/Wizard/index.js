import React, { Fragment } from "react";
import { Modal } from "react-bootstrap";
import { NavButton } from "components/Card";
import InfoCard from "./InfoCard";
import DataGatheringCard from "./DataGatheringCard";
import UserAccessCard from "./UserAccessCard";
import LoadBalanceCard from "./LoadBalanceCard";
import CloseWizardAlert from "components/Alert/CloseWizardAlert";
import WizardSidebar, { Tab } from "components/ObjectCommon/WizardSidebar";
import ScheduleWizard from "components/Schedule/ScheduleWizard";

import { closeWizard, addServer } from "actions/ServerActions";

import { ipValid, stringValid, isDefaultObject } from "lib/Util";

import { LOADED, LOADING } from "const/DataLoaderState";
import {
  RdsServerTabs,
  RdsServerGroupTabs,
  SCHEDULE,
  RDS_SERVER_GROUP_INFO,
  RDS_SERVER_INFO,
  DATA_GATHERING,
  LOAD_BALANCE,
  USER_ACCESS,
} from "const/Servers/ServerConsts";
import {
  Name,
  Id,
  IPAddress,
  Type,
  ParentId,
  IntervalMode,
  ProcessUpdate,
  SessionUpdate,
  UserType,
  LoadBalanced,
  Username,
  Domain,
  Password,
  InfoFields,
} from "const/Servers/ServerFieldNames";
import {
  DefaultInfo,
  DefaultGroupInfo,
  DefaultDataGathering,
  DefaultLoadBalanced,
  DefaultAuthUser,
  DefaultSchedules,
} from "const/Servers/Default";

export default class Wizard extends React.Component {
  constructor(props) {
    super(props);
    const isGroup = props.data.isGroup;
    const tabs =
      isGroup === false ? [...RdsServerTabs] : [...RdsServerGroupTabs];
    const updateTabs = tabs.map((item, index) =>
      index == 0
        ? new Tab(item, { clickable: true, visited: true })
        : new Tab(item)
    );
    this.state = {
      tabs: updateTabs,
      selectedTabIndex: 0,
      errorFields: {},
      authUser: { ...DefaultAuthUser },
      serverInfo: props.data.isGroup
        ? { ...DefaultGroupInfo }
        : { ...DefaultInfo },
      dataGathering: { ...DefaultDataGathering },
      loadBalanced: { ...DefaultLoadBalanced },
      schedules: [],
      showExitAlert: false,
      defaultClose: JSON.stringify(isGroup ? DefaultGroupInfo : DefaultInfo),
    };
  }

  componentDidMount() {
    let {
      props: { parentId },
      state: { serverInfo, defaultClose },
    } = this;
    serverInfo[ParentId] = parentId;
    defaultClose = JSON.stringify(serverInfo);
    this.setState({ serverInfo, defaultClose });
  }

  onChange = (updated) => {
    let {
      state: { tabs, selectedTabIndex },
    } = this;
    let selectedTab = tabs[selectedTabIndex].label;
    switch (selectedTab) {
      case RDS_SERVER_INFO:
      case RDS_SERVER_GROUP_INFO:
        this.setState({
          serverInfo: updated,
          tabs: this.setTabClickable(
            tabs,
            selectedTabIndex,
            stringValid(updated[Name])
          ),
        });
        break;
      case DATA_GATHERING:
        this.setState({
          dataGathering: updated,
          tabs: this.setTabClickable(tabs, selectedTabIndex, true),
        });
        break;
      case LOAD_BALANCE:
        this.setState({
          loadBalanced: updated,
          tabs: this.setTabClickable(tabs, selectedTabIndex, true),
        });
        break;
      case SCHEDULE:
        this.setState({
          schedules: updated,
          tabs: this.setTabClickable(tabs, selectedTabIndex, true),
        });
        break;
      case USER_ACCESS:
        this.setState({
          authUser: updated,
          tabs: this.setTabClickable(tabs, selectedTabIndex, true),
        });
        break;
      default:
        break;
    }
  };

  onSelect = (selectedTabIndex) => {
    let { tabs } = this.state;
    tabs[selectedTabIndex].visited = true;
    this.setState({ selectedTabIndex });
  };
  onBack = () => {
    this.selectTab(-1);
  };
  onNext = () => {
    this.selectTab(1);
  };
  onFinish = () => {
    let {
      props: { dispatch, data },
      state: { authUser, serverInfo, dataGathering, loadBalanced, schedules },
    } = this;
    const isGroup = data.isGroup;
    let newServer = {};
    if (isGroup === false) {
      newServer = {
        // ...authUser,
        ...serverInfo,
        ...dataGathering,
        // ...loadBalanced,
      };
    } else {
      newServer = {
        ...serverInfo,
      };
    }
    delete authUser[UserType];
    if (dataGathering.hasOwnProperty(IntervalMode)) {
      delete dataGathering[IntervalMode];
    }
    dispatch(addServer(newServer, schedules, isGroup));
  };

  canBack = () => {
    let {
      state: { selectedTabIndex },
    } = this;
    return selectedTabIndex > 0;
  };
  canNext = () => {
    let {
      state: { selectedTabIndex, tabs, errorFields, serverInfo, authUser },
    } = this;
    if (selectedTabIndex > tabs.length - 2) return false;
    const tab = tabs[selectedTabIndex].label;
    switch (tab) {
      case RDS_SERVER_INFO:
        return (
          stringValid(serverInfo[Name]) &&
          isDefaultObject(errorFields) &&
          typeof ipValid(serverInfo[IPAddress], true) !== "string" &&
          serverInfo[IPAddress] !== undefined &&
          serverInfo[IPAddress] !== ""
        );
      case RDS_SERVER_GROUP_INFO:
        return stringValid(serverInfo[Name]) && isDefaultObject(errorFields);
      default:
        return true;
    }
  };
  canFinish = () => {
    let {
      state: { errorFields, serverInfo },
    } = this;
    const isGroup = this.props.data.isGroup;
    if (isGroup === true)
      return stringValid(serverInfo[Name]) && isDefaultObject(errorFields);
    return (
      stringValid(serverInfo[Name]) &&
      isDefaultObject(errorFields) &&
      typeof ipValid(serverInfo[IPAddress], true) !== "string" &&
      serverInfo[IPAddress] !== undefined &&
      serverInfo[IPAddress] !== ""
    );
  };

  handleErrorFields = (errorFields) => {
    this.setState({ errorFields });
  };

  selectTab(offset) {
    let {
      state: { selectedTabIndex, tabs },
    } = this;
    selectedTabIndex = (selectedTabIndex + offset) % tabs.length;

    tabs[selectedTabIndex].completed = true;
    tabs[selectedTabIndex].clickable = true;
    tabs[selectedTabIndex].visited = true;
    this.setState({ selectedTabIndex, tabs });
  }

  closeWizard = () => {
    this.props.dispatch(closeWizard());
  };
  openExitAlert = () => {
    this.setState({
      showExitAlert: true,
    });
  };
  closeExitAlert = () => {
    this.setState({
      showExitAlert: false,
    });
  };

  setTabClickable = (tabs, selectedTabIndex, isCurrentTabCompleted) => {
    tabs[selectedTabIndex].completed = isCurrentTabCompleted;
    tabs.forEach((tab) => {
      tab.clickable = tab.completed && isCurrentTabCompleted;
    });
    return tabs;
  };

  render() {
    let {
      props: { dispatch, data },
      state: {
        selectedTabIndex,
        tabs,
        showExitAlert,

        serverInfo,
        dataGathering,
        loadBalanced,
        authUser,
        schedules,
        defaultClose,
      },
    } = this;
    let {
      isGroup,
      verifyAuthUserResult,
      serverMainTree,
      servers,
      serverGroups,
      adUsers,
    } = data;
    const selectedTab = tabs[selectedTabIndex].label;
    const isSaving = servers.state == LOADING;
    const error = servers.error;

    const autoClose = JSON.stringify(serverInfo);

    return (
      <Modal show={true}>
        <div className="w-container">
          <div className="wrapper2" style={{ marginTop: "80px" }}>
            <Modal.Body
              style={{ backgroundColor: "#F2F8E5", paddingBottom: "0px" }}
            >
              <div className="clearfix">
                {showExitAlert && (
                  <CloseWizardAlert
                    yes={this.closeWizard}
                    no={this.closeExitAlert}
                  />
                )}
                <WizardSidebar
                  selectedTabIndex={selectedTabIndex}
                  tabs={tabs}
                  onSelect={this.onSelect}
                />
                <div
                  className="close mt-12"
                  onClick={
                    autoClose === defaultClose
                      ? this.closeWizard
                      : this.openExitAlert
                  }
                ></div>
                <div className="wizard-container">
                  <div className="modal-wizard-card">
                    {(selectedTab == RDS_SERVER_GROUP_INFO ||
                      selectedTab == RDS_SERVER_INFO) && (
                      <InfoCard
                        dispatch={dispatch}
                        isGroup={isGroup}
                        data={serverInfo}
                        serverMainTree={serverMainTree}
                        objects={servers}
                        objectGroups={serverGroups}
                        onChange={this.onChange}
                        handleErrorFields={this.handleErrorFields}
                      />
                    )}
                    {/* {selectedTab == USER_ACCESS && !isGroup && (
                      <UserAccessCard
                        dispatch={dispatch}
                        data={authUser}
                        adUsers={adUsers}
                        onChange={this.onChange}
                        verifyAuthUserResult={verifyAuthUserResult}
                      />
                    )} */}
                    {/* {selectedTab == SCHEDULE && (
                      <ScheduleWizard
                        isGroup={isGroup}
                        data={schedules}
                        parentTerminal={parentTerminal.data}
                        config={{ ScheduleApplyAll: serverInfo[ScheduleApplyAll] }}
                        object="Server"
                        onChange={this.onChange}
                      />
                    )} */}
                    {selectedTab == DATA_GATHERING && (
                      <DataGatheringCard
                        dispatch={dispatch}
                        data={dataGathering}
                        onChange={this.onChange}
                      />
                    )}
                    {/* {selectedTab == LOAD_BALANCE && (
                      <LoadBalanceCard
                        data={loadBalanced}
                        dispatch={dispatch}
                        onChange={this.onChange}
                      />
                    )} */}
                  </div>
                  <NavButton
                    canBack={this.canBack()}
                    canNext={this.canNext()}
                    canFinish={this.canFinish()}
                    onBack={this.onBack}
                    onNext={this.onNext}
                    onFinish={this.onFinish}
                  />
                  {isSaving && <div>Saving...</div>}
                  {error != null && <div>{error.message}</div>}
                </div>
              </div>
            </Modal.Body>
          </div>
        </div>
      </Modal>
    );
  }
}
