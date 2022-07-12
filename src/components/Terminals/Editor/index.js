import React, { Fragment } from "react";
import { Modal } from "react-bootstrap";
import { EditorContainer } from "components/Card";

import {
  copyTerminal,
  closeTerminalEditor,
  deleteTerminal,
  getDefaultKeyboardMapping,
  getDefaultMouseMapping,
  getFirmwarePackage,
  getDisplayOptions,
  getModelMap,
  getParentTerminal,
  clearParentTerminal,
  loadModules,
  loadModuleSettings,
  updateTerminal,
  getTerminal,
} from "actions/TerminalActions";
import { loadSchedules } from "actions/ScheduleActions";

import { stringValid, isNotEmptyObject, isDefaultObject } from "lib/Util";

import { LOADED, LOADING } from "const/DataLoaderState";
import { ABOUT, CONFIGURATION } from "const/Consts";
import { MODULE, SHADOW, SCHEDULE, LOG } from "const/Terminals/TerminalConsts";
import {
  Manufacturer,
  Model,
  InstalledModules,
  Name,
  ParentId,
  ModuleApplyAll,
  ScheduleApplyAll,
  Schedules,
  extractSchedule,
  extractModule,
  extractTerminalAbout,
} from "const/Terminals/TerminalFieldNames";
import {
  EditorGroupTabs,
  EditorTabs,
  TERMINAL_INFO,
  TERMINAL_GROUP_INFO,
} from "const/Terminals/TerminalConsts";

import QuickSwitch from "./QuickSwitch";
import Header from "./Header";
import About from "./About";
import Configuration from "./Configuration";
import ModuleCard from "./Module";
import Shadow from "./Shadow";
import ScheduleTable from "components/Schedule/ScheduleTable";
import Log from "components/Log";
import CopyObjectAlert from "components/Alert/CopyObjectAlert";
import CloseEditorAlert from "components/Alert/CloseEditorAlert";
import EditorTopbar, { Tab } from "components/ObjectCommon/EditorTopbar";
import TabSwitchAlert from "components/Alert/TabSwitchAlert";

import { showInfoBar } from "actions/InfobarActions";

import { isDataUpdated } from "utils/Check";
import { getDataForBaseCard, getObjectById } from "utils/Object";

import { apiGetTerminalAbout } from "api";

export default class Editor extends React.Component {
  constructor(props) {
    super(props);
    const tabs =
      props.data.isGroup === false ? [...EditorTabs] : [...EditorGroupTabs];
    const updatedTabs = tabs.map((tab) => new Tab(tab));
    const initConfigTab =
      props.data.isGroup === false ? TERMINAL_INFO : TERMINAL_GROUP_INFO;
    this.state = {
      isEditMode: false,
      isEdited: false,
      isUpdated: true,
      about: {},
      tabs: updatedTabs,
      configTab: initConfigTab,
      nextConfigTab: "",
      selectedTabIndex: 0,
      nextTabIndex: -1,
      showCopyAlert: false,
      showExitAlert: false,
      showTabSwitchAlert: false,
      showConfigTabSwitchAlert: false,
    };
    this.prefetchData(props.dispatch);
  }

  async componentDidMount() {
    const response = await apiGetTerminalAbout(this.props.data.editingId);
    if (response.result === true) {
      this.setState({ about: response.data });
      this.props.dispatch(showInfoBar("Get Terminal About success !!"));
    } else {
      this.props.dispatch(showInfoBar(response.data, "error"));
    }
  }

  componentDidUpdate(prevProps) {
    if (this.shouldLoadDataBasedOnTerminal(prevProps)) {
      this.loadDataBasedOnTerminal(prevProps);
    }
  }

  prefetchData(dispatch) {
    dispatch(getDefaultKeyboardMapping());
    dispatch(getDefaultMouseMapping());
    dispatch(getModelMap());
    dispatch(loadModuleSettings());
    // dispatch(getFirmwarePackage());
  }
  shouldLoadDataBasedOnTerminal(prevProps) {
    const prevEditingTerminal = prevProps.data.editingTerminal;
    const editingTerminal = this.props.data.editingTerminal;
    return (
      isNotEmptyObject(editingTerminal.data) &&
      isDataUpdated(editingTerminal, prevEditingTerminal)
    );
  }
  loadDataBasedOnTerminal(prevProps) {
    let {
      props: { dispatch, data },
    } = this;
    const editingTerminal = this.props.data.editingTerminal.data;
    const editingId = data.editingId;
    const manufacturer = editingTerminal[Manufacturer];
    const model = editingTerminal[Model];
    const installedModules = editingTerminal[InstalledModules];
    const schedules = editingTerminal[Schedules];
    if (
      !this.props.data.isGroup &&
      stringValid(manufacturer) &&
      stringValid(model)
    ) {
      dispatch(getDisplayOptions(manufacturer, model));
    }
    if (stringValid(installedModules)) {
      const moduleIds = installedModules.split(",");
      if (moduleIds.length > 0) {
        if (
          isDefaultObject(this.props.data.modules) ||
          isDataUpdated(this.props.data.modules, prevProps.data.modules)
        ) {
          dispatch(loadModules(moduleIds));
        }
      }
    }
    if (stringValid(schedules)) {
      const scheduleIds = schedules.split(",");
      if (scheduleIds.length > 0) {
        if (
          isDefaultObject(this.props.data.schedules) ||
          isDataUpdated(this.props.data.schedules, prevProps.data.schedules)
        ) {
          dispatch(loadSchedules(scheduleIds, "terminals.schedules"));
        }
      }
    }
    const parentId = editingTerminal[ParentId];
    if (parentId != null && parentId != 0) {
      dispatch(getParentTerminal(parentId));
    } else if (parentId == 0) {
      dispatch(clearParentTerminal());
    }
  }
  onEdit = () => {
    this.setState({ isEditMode: true });
  };
  onCancel = () => {
    let {
      props: { dispatch, data },
    } = this;
    dispatch(getTerminal(data.editingId, data.isGroup));
    this.setState({
      isEditMode: false,
      isEdited: false,
      showTabSwitchAlert: false,
      showConfigTabSwitchAlert: false,
    });
  };

  cancelOnStatus = () => {
    this.setState({
      isEditMode: false,
      isEdited: false,
      showTabSwitchAlert: false,
      showConfigTabSwitchAlert: false,
    });
  };
  openExitAlert = () => {
    this.setState({ showExitAlert: true });
  };
  closeExitAlert = () => {
    this.setState({ showExitAlert: false });
  };
  close = (force = false) => {
    if (force || !this.state.isEdited) {
      let {
        props: { dispatch },
      } = this;
      this.setState({
        tab: ABOUT,
      });
      dispatch(closeTerminalEditor());
    } else {
      this.openExitAlert();
    }
  };
  copy = (newTerminal) => {
    let {
      props: { dispatch, data },
    } = this;
    const isGroup = data.isGroup;
    dispatch(
      copyTerminal(
        data.editingId,
        newTerminal[Name],
        newTerminal[ParentId],
        isGroup
      )
    );
    this.closeCopyAlert();
  };
  openCopyAlert = () => {
    this.setState({
      showCopyAlert: true,
    });
  };
  closeCopyAlert = () => {
    this.setState({
      showCopyAlert: false,
    });
  };

  trash = () => {
    let {
      props: { dispatch, data },
    } = this;
    const isGroup = data.isGroup;
    dispatch(deleteTerminal(data.editingId, isGroup));
  };
  lock = () => {
    let {
      props: { data, dispatch },
    } = this;
    const editingId = data.editingId;
    dispatch(
      updateTerminal(editingId, {
        ConfigLock: !data.editingTerminal.data.ConfigLock,
      })
    );
  };
  favorite = () => {
    let {
      props: { dispatch, data },
    } = this;
    const id = data.editingId;
    const updateData = {
      Favorite: !data.editingTerminal.data.Favorite,
    };
    const isGroup = data.isGroup;
    dispatch(updateTerminal(id, updateData, isGroup));
  };

  selectTab = (index, force = false) => {
    if (force || !this.state.isEdited) {
      if (index !== this.state.selectedTabIndex)
        this.setState({
          configTab:
            this.props.data.isGroup === true
              ? TERMINAL_GROUP_INFO
              : TERMINAL_INFO,
          nextTabIndex: -1,
          selectedTabIndex: index,
          showTabSwitchAlert: false,
          isEditMode: false,
          isEdited: false,
        });
    } else {
      this.setState({
        nextTabIndex: index,
        showTabSwitchAlert: true,
      });
    }
  };
  selectConfigTab = (configTab, force = false) => {
    if (force || !this.state.isEdited) {
      if (configTab !== this.state.configTab)
        this.setState({
          configTab: configTab,
          showConfigTabSwitchAlert: false,
          isEditMode: false,
          isEdited: false,
          isUpdated: false,
        });
    } else {
      this.setState({
        nextConfigTab: configTab,
        showConfigTabSwitchAlert: true,
      });
    }
  };

  notSwitch = () => {
    this.setState({
      showTabSwitchAlert: false,
      showConfigTabSwitchAlert: false,
    });
  };

  onChangeEdit = (edited) => {
    this.setState({ isEdited: edited });
  };

  updateConfigFlag = (flag) => {
    this.setState({ isUpdated: flag });
  };

  render() {
    let {
      props: { dispatch, data, applications, servers, infobar },
      state: {
        isEditMode,
        isEdited,
        isUpdated,
        showTabSwitchAlert,
        showConfigTabSwitchAlert,
        about,
        tabs,
        configTab,
        nextConfigTab,
        nextTabIndex,
        selectedTabIndex,
        showCopyAlert,
        showExitAlert,
      },
    } = this;
    let {
      editingTerminal,
      isGroup,
      editingId,
      terminalMainTree,
      terminals,
      terminalGroups,
      schedules,
      modules,
      msIdWrappers,
      moduleSettings,
      parentTerminal,
      possibleModuleSettings,
    } = data;

    const selectedTab = tabs[selectedTabIndex].label;
    const nextTab = nextTabIndex != -1 ? tabs[nextTabIndex].label : "";

    const terminal = getObjectById(
      editingId,
      isGroup ? terminalGroups : terminals
    );
    const status = terminal?.Status ?? "";
    const disabled = terminal?.Disabled ?? "";
    const ip = terminal?.IpAddress ?? "";
    const mac = terminal?.MAC ?? "";
    const power = ip != "";

    const isNtr = editingId > 0 && status.indexOf("N") >= 0;
    const isNolic = editingId > 0 && status.indexOf("I") >= 0;
    const isBusy = editingId > 0 && status.indexOf("B") >= 0;
    const isDisabled = status.indexOf("D") >= 0;
    const isOff = status == "" || !power || status.indexOf("F") >= 0;
    const isOffDisabled = isOff && isDisabled;
    const isActive = editingId > 0 && status.indexOf("A") >= 0;
    const isActiveDisabled = isActive && isDisabled;
    const isActiveNtr = isActive && isNtr;
    const isActiveDisabledNtr = isActive && isDisabled && isNtr;
    const isActiveBusy = isBusy;
    const isBooting = status.indexOf("B") >= 0;
    const isBootingDisabled = isBooting && isDisabled;
    const isError = editingId > 0 && status.indexOf("E") >= 0;
    const isErrorDisabled = isError && isDisabled;
    const isErrorNtr = isError && isNtr;
    const isErrorDisabledNtr = isError && isDisabled && isNtr;

    this.title = terminal?.Name ?? "";

    const isLoading = editingTerminal.state == LOADING;
    const isLoaded =
      editingTerminal.data != null && editingTerminal.data.Id != null
        ? true
        : false;
    const configSchedules = getDataForBaseCard(
      extractSchedule(editingTerminal.data)
    );
    const configModules = getDataForBaseCard(
      extractModule(editingTerminal.data)
    );
    // const about = getDataForBaseCard(
    //   extractTerminalAbout(editingTerminal.data)
    // );
    if (isGroup === false) {
      delete configSchedules[ScheduleApplyAll];
      delete configModules[ModuleApplyAll];
    }

    return (
      <Modal show={true} onHide={this.close}>
        <QuickSwitch
          dispatch={dispatch}
          isGroup={isGroup}
          data={data}
          editingId={editingId}
          applications={applications}
          servers={servers}
        />
        <div className="w-container">
          <div className="wrapper2">
            <Header title={this.title} terminal={terminal} close={this.close} />
            <EditorTopbar
              dispatch={dispatch}
              isLoaded={isLoaded}
              isGroup={isGroup}
              editType="terminal"
              editingId={editingId}
              name={this.title}
              title="DELETE TERMINAL"
              onSelect={this.selectTab}
              tabs={tabs}
              selectedTabIndex={selectedTabIndex}
              close={this.close}
              copy={this.openCopyAlert}
              trash={this.trash}
              favorite={this.favorite}
              lock={this.lock}
              showTrash={
                isGroup ||
                (editingId != 0 && (status.indexOf("F")>=0 || status === ""))
              }
              showOp={editingId != 0 && status.indexOf("B") == 0}
              status={status}
              disabled={disabled}
              isNtr={isNtr}
              mac={mac}
              isBooting={isBooting}
              isActive={isActive}
              isError={isError}
              isBusy={isBusy}
              isNolic={isNolic}
              isDisabled={isDisabled}
              isFavorite={editingTerminal.data?.Favorite ?? false}
              onCancel={this.cancelOnStatus}
            />
            <Modal.Body>
              {showTabSwitchAlert && (
                <TabSwitchAlert
                  tab={nextTab}
                  yes={() => this.selectTab(nextTabIndex, true /*force*/)}
                  no={this.notSwitch}
                />
              )}
              {showConfigTabSwitchAlert && (
                <TabSwitchAlert
                  tab={nextConfigTab}
                  yes={() => this.selectConfigTab(nextConfigTab, true)}
                  no={this.notSwitch}
                />
              )}
              {showExitAlert && (
                <CloseEditorAlert
                  yes={() => this.close(true /*force*/)}
                  no={this.closeExitAlert}
                />
              )}
              {selectedTab === CONFIGURATION && (
                <Configuration
                  dispatch={dispatch}
                  isLoading={isLoading}
                  isLoaded={isLoaded}
                  isEditMode={isEditMode}
                  isEdited={isEdited}
                  isUpdated={isUpdated}
                  data={data}
                  infobar={infobar}
                  tab={configTab}
                  applications={applications}
                  appMultiTree={applications.applicationMainTree.data}
                  status={status}
                  onEdit={this.onEdit}
                  onCancel={this.onCancel}
                  onChangeEdit={this.onChangeEdit}
                  selectConfigTab={this.selectConfigTab}
                  updateConfigFlag={this.updateConfigFlag}
                />
              )}
              {selectedTab === ABOUT && (
                <About
                  dispatch={dispatch}
                  isLoading={isLoading}
                  isLoaded={isLoaded}
                  isGroup={isGroup}
                  data={about}
                  editingId={editingId}
                  terminals={terminals}
                  terminalGroups={terminalGroups}
                />
              )}
              {selectedTab === SCHEDULE && (
                <div
                  className="modal-content-card"
                  style={{ paddingTop: "0px" }}
                >
                  <ScheduleTable
                    dispatch={dispatch}
                    isLoading={isLoading}
                    isLoaded={isLoaded}
                    isEditMode={isEditMode}
                    isGroup={isGroup}
                    data={configSchedules}
                    parentTerminal={parentTerminal}
                    schedules={schedules}
                    editingId={editingId}
                    objectType="Terminal"
                    onEdit={this.onEdit}
                    onCancel={this.onCancel}
                    onChangeEdit={this.onChangeEdit}
                  />
                </div>
              )}
              {selectedTab === MODULE && (
                <div
                  className="modal-content-card"
                  style={{ paddingTop: "0px" }}
                >
                  <ModuleCard
                    dispatch={dispatch}
                    isLoading={isLoading}
                    isLoaded={isLoaded}
                    isEditMode={isEditMode}
                    isGroup={isGroup}
                    data={configModules}
                    parentTerminal={parentTerminal}
                    modules={modules}
                    editingId={editingId}
                    moduleSettings={moduleSettings}
                    possibleModuleSettings={possibleModuleSettings}
                    msIdWrappers={msIdWrappers}
                    onChangeEdit={this.onChangeEdit}
                    onEdit={this.onEdit}
                    onCancel={this.onCancel}
                  />
                </div>
              )}
              {selectedTab === SHADOW && (
                <Shadow
                  dispatch={dispatch}
                  terminal={editingTerminal}
                  about={about}
                  editingId={editingId}
                />
              )}
              {selectedTab === LOG && (
                <Log type="terminal" terminalId={editingId} />
              )}
              {showCopyAlert && (
                <CopyObjectAlert
                  isGroup={isGroup}
                  objectType="Terminal"
                  treeType="terminalGroup"
                  objectName={this.title}
                  objects={terminals}
                  objectGroups={terminalGroups}
                  mainTree={terminalMainTree}
                  pickerTitle="CHOOSE EXISTING GROUP"
                  parentId={parseInt(editingTerminal.data.ParentId)}
                  confirm={this.copy}
                  cancel={this.closeCopyAlert}
                />
              )}
            </Modal.Body>
          </div>
        </div>
      </Modal>
    );
  }
}
