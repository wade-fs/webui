import React from "react";
import { Modal } from "react-bootstrap";
import Header from "./Header";
import About from "./About";
import Configuration from "./Configuration";
import CopyObjectAlert from "components/Alert/CopyObjectAlert";
import CloseEditorAlert from "components/Alert/CloseEditorAlert";
import EditorTopbar, { Tab } from "components/ObjectCommon/EditorTopbar";
import TabSwitchAlert from "components/Alert/TabSwitchAlert";
import ScheduleTable from "components/Schedule/ScheduleTable";

import {
  closeEditor,
  copyServer,
  deleteServer,
  updateServer,
} from "actions/ServerActions";

import { LOADING, LOADED } from "const/DataLoaderState";
import {
  EditorTabs,
  EditorGroupTabs,
  RDS_SERVER_INFO,
  RDS_SERVER_GROUP_INFO,
  SCHEDULE,
} from "const/Servers/ServerConsts";
import { ABOUT, CONFIGURATION } from "const/Consts";

import { getObjectById } from "utils/Object";

export default class Editor extends React.Component {
  constructor(props) {
    super(props);
    const tabs =
      props.data.isGroup === false ? [...EditorTabs] : [...EditorGroupTabs];
    const updatedTabs = tabs.map((tab) => new Tab(tab));
    const initConfigTab =
      props.data.isGroup === false ? RDS_SERVER_INFO : RDS_SERVER_GROUP_INFO;
    this.state = {
      isEditMode: false,
      isEdited: false,
      tabs: updatedTabs,
      configTab: initConfigTab,
      nextConfigTab: "",
      selectedTabIndex: 0,
      showCopyAlert: false,
      showExitAlert: false,
      showTabSwitchAlert: false,
      showConfigTabSwitchAlert: false,
    };
    this.title = "";
  }

  selectTab = (index, force = false) => {
    if (force == true || !this.state.isEdited) {
      if (index !== this.state.selectedTabIndex)
        this.setState({
          configTab:
            this.props.data.isGroup === true
              ? RDS_SERVER_GROUP_INFO
              : RDS_SERVER_INFO,
          nextTabIndex: -1,
          selectedTabIndex: index,
          showTabSwitchAlert: false,
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
          isEditMode: false,
          isEdited: false,
          showConfigTabSwitchAlert: false,
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
  openExitAlert = () => {
    this.setState({ showExitAlert: true });
  };
  closeExitAlert = () => {
    this.setState({ showExitAlert: false });
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

  close = (force = false) => {
    if (force || !this.state.isEdited) {
      let {
        props: { dispatch },
      } = this;
      this.setState({
        selectedTabIndex: 0,
      });
      dispatch(closeEditor());
    } else {
      this.openExitAlert();
    }
  };
  onEdit = () => {
    this.setState({
      isEditMode: true,
    });
  };
  onCancel = () => {
    this.setState({
      isEditMode: false,
      isEdited: false,
      showTabSwitchAlert: false,
      showConfigTabSwitchAlert: false,
    });
  };

  copy = (newServer) => {
    let {
      props: { dispatch, data },
    } = this;
    const isGroup = data.isGroup;
    dispatch(
      copyServer(
        data.editingId,
        newServer["Name"],
        newServer["ParentId"],
        isGroup
      )
    );
    this.closeCopyAlert();
  };
  trash = () => {
    let {
      props: { dispatch, data },
    } = this;
    const id = data.editingId;
    const isGroup = data.isGroup;
    dispatch(deleteServer(id, isGroup));
  };
  favorite = () => {
    let {
      props: { dispatch, data },
    } = this;
    const id = data.editingId;
    const isGroup = data.isGroup;
    const updateData = {
      Favorite: !data.editingServer.data.Favorite,
    };
    dispatch(updateServer(id, updateData, isGroup));
  };

  // onSetSchedule = () => {
  //   let {
  //     props: { dispatch, data },
  //   } = this;
  //   const editingId = data.editingId;
  //   dispatch(
  //     updateServer(
  //       editingId,
  //       {
  //         EnabledSchedule: !data.editingServer.data.EnabledSchedule,
  //       },
  //       false
  //     )
  //   );
  // };

  onChangeEdit = (edited) => {
    if (edited !== this.state.isEdited) {
      this.setState({ isEdited: edited });
    }
  };

  render() {
    let {
      props: { data, dispatch },
      state: {
        isEditMode,
        isEdited,
        tabs,
        configTab,
        nextConfigTab,
        nextTabIndex,
        selectedTabIndex,
        showCopyAlert,
        showExitAlert,
        showTabSwitchAlert,
        showConfigTabSwitchAlert,
      },
    } = this;
    let {
      editingServer,
      isGroup,
      editingId,
      serverMainTree,
      servers,
      serverGroups,
    } = data;

    const rdsServer = getObjectById(
      editingId,
      isGroup ? serverGroups : servers
    );
    this.title = rdsServer?.Name ?? "";

    const isLoading = editingServer.state == LOADING;
    const isLoaded =
      editingServer.data != null && editingServer.data.Id != null
        ? true
        : false;

    let tab = ABOUT;
    if (tabs[selectedTabIndex] != null) {
      tab = tabs[selectedTabIndex].label;
    }
    let nextTab = "";
    if (nextTabIndex != -1 && tabs[nextTabIndex] != null) {
      nextTab = tabs[nextTabIndex].label;
    }

    return (
      <Modal show={true} onHide={this.close}>
        <div className="w-container">
          <div className="wrapper2">
            <Header
              close={this.close}
              title={this.title}
              rdsServer={rdsServer}
            />
            <EditorTopbar
              isLoading={isLoading}
              isLoaded={isLoaded}
              editType="appServer"
              name={this.title}
              title="DELETE SERVER"
              isGroup={isGroup}
              onSelect={this.selectTab}
              tabs={tabs}
              selectedTabIndex={selectedTabIndex}
              dispatch={dispatch}
              close={this.close}
              copy={this.openCopyAlert}
              trash={this.trash}
              favorite={this.favorite}
              isFavorite={editingServer.data?.Favorite ?? false}
            />
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
            <Modal.Body>
              {showExitAlert && (
                <CloseEditorAlert
                  yes={() => this.close(true /*force*/)}
                  no={this.closeExitAlert}
                />
              )}
              {tab === ABOUT && (
                <About
                  isLoading={isLoading}
                  isLoaded={isLoaded}
                  isGroup={isGroup}
                  data={editingServer}
                  editingId={editingId}
                  servers={servers}
                />
              )}
              {tab === CONFIGURATION && (
                <Configuration
                  dispatch={dispatch}
                  isLoading={isLoading}
                  isLoaded={isLoaded}
                  isEditMode={isEditMode}
                  isEdited={isEdited}
                  data={data}
                  tab={configTab}
                  onEdit={this.onEdit}
                  onCancel={this.onCancel}
                  onChangeEdit={this.onChangeEdit}
                  selectConfigTab={this.selectConfigTab}
                />
              )}
              {/* {tab === SCHEDULE && (
                    <ScheduleTable
                      dispatch={dispatch}
                      isEditMode={isEditMode}
                      isGroup={isGroup}
                      data={editingServer}
                      editingId={editingId}
                      schedules={schedules}
                      enabledSchedule={enabledSchedule}
                      onSetSchedule={this.onSetSchedule}
                      object="Server"
                      path="servers.schedules"
                    />
                  )} */}
              {showCopyAlert && (
                <CopyObjectAlert
                  isGroup={isGroup}
                  objectType="Server"
                  treeType="appServerGroup"
                  objectName={this.title}
                  objects={servers}
                  objectGroups={serverGroups}
                  mainTree={serverMainTree}
                  pickerTitle="CHOOSE EXISTING GROUP"
                  parentId={parseInt(editingServer.data.ParentId)}
                  confirm={this.copy}
                  cancel={this.closeCopyAlert}
                />
              )}
            </Modal.Body>{" "}
          </div>
        </div>
      </Modal>
    );
  }
}
