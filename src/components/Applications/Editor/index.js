import React from "react";
import { Modal } from "react-bootstrap";
import Header from "./Header";
import Configuration from "./Configuration";
import TabSwitchAlert from "components/Alert/TabSwitchAlert";
import EditorTopbar, { Tab } from "components/ObjectCommon/EditorTopbar";
import CopyObjectAlert from "components/Alert/CopyObjectAlert";
import CloseEditorAlert from "components/Alert/CloseEditorAlert";

import {
  closeApplicationEditor,
  copyApplication,
  deleteApplication,
  closeSubAppEditor,
  updateApplication,
} from "actions/ApplicationActions";

import { LOADING } from "const/DataLoaderState";
import { CONFIGURATION } from "const/Consts";
import {
  APPLICATION_INFO,
  APPLICATION_GROUP_INFO,
} from "const/Applications/ApplicationConsts";
import { Name, ParentId } from "const/Applications/ApplicationFieldNames";
import {
  EditorTabs,
  EditorGroupTabs,
} from "const/Applications/ApplicationConsts";

import { getObjectById } from "utils/Object";

export default class Editor extends React.Component {
  constructor(props) {
    super(props);
    const tabs =
      props.data.isGroup === false ? [...EditorTabs] : [...EditorGroupTabs];
    const updatedTabs = tabs.map((tab) => new Tab(tab));
    const initConfigTab =
      props.data.isGroup === false ? APPLICATION_INFO : APPLICATION_GROUP_INFO;
    this.state = {
      isEditMode: false,
      isEdited: false,
      tabs: updatedTabs,
      configTab: initConfigTab,
      nextConfigTab: "",
      selectedTabIndex: 0,
      showCopyAlert: false,
      showExitAlert: false,
      showConfigTabSwitchAlert: false,
    };
    this.title = "";
  }

  close = (force = false) => {
    if (force || !this.state.isEdited) {
      this.props.dispatch(closeApplicationEditor());
    } else {
      this.openExitAlert();
    }
  };
  subClose = () => {
    if (!this.state.isEdited) {
      this.props.dispatch(closeSubAppEditor());
    } else {
      this.openExitAlert();
    }
  };
  onEdit = () => {
    this.setState({
      isEditMode: true,
      isEdited: false,
      showConfigTabSwitchAlert: false,
    });
  };
  onCancel = () => {
    this.setState({
      isEditMode: false,
      isEdited: false,
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
      isEdited: false,
    });
  };

  copy = (newApplication) => {
    let {
      props: { dispatch, data },
    } = this;
    const idGroup = data.isGroup;
    dispatch(
      copyApplication(
        data.editingId,
        newApplication[Name],
        newApplication[ParentId],
        idGroup
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
    dispatch(deleteApplication(id, isGroup));
  };
  favorite = () => {
    let {
      props: { dispatch, data },
    } = this;
    const id = data.editingId;
    const isGroup = data.isGroup;
    const updateData = {
      Favorite: !data.editingApplication.data.Favorite,
    };
    dispatch(updateApplication(id, updateData, isGroup));
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
      showConfigTabSwitchAlert: false,
    });
  };
  onSelect = (selectedTabIndex) => {
    this.setState({ selectedTabIndex });
  };

  onChangeEdit = (edited) => {
    if (edited !== this.state.isEdited) {
      this.setState({ isEdited: edited });
    }
  };

  render() {
    let {
      props: { data, servers, dispatch },
      state: {
        isEditMode,
        isEdited,
        tabs,
        configTab,
        nextConfigTab,
        showCopyAlert,
        showConfigTabSwitchAlert,
        selectedTabIndex,
        showExitAlert,
      },
    } = this;
    let {
      editingApplication,
      isGroup,
      editingId,
      subEditorOpened,
      applicationMainTree,
      applications,
      applicationGroups,
    } = data;

    const isLoading = editingApplication.state == LOADING;
    const isLoaded =
      editingApplication.data != null && editingApplication.data.Id != null
        ? true
        : false;
    const app = getObjectById(
      editingId,
      isGroup ? applicationGroups : applications
    );
    this.title = app?.Name ?? "";
    let tab = CONFIGURATION;
    if (tabs[selectedTabIndex] != null) {
      tab = tabs[selectedTabIndex].label;
    }

    return (
      <Modal
        id="app-editor"
        show={true}
        onHide={!subEditorOpened ? this.close : this.subClose}
      >
        <div className="w-container">
          <div className="wrapper2">
            <Header
              title={this.title}
              app={app}
              style={subEditorOpened ? { backgroundColor: "#434343" } : {}}
              close={!subEditorOpened ? this.close : this.subClose}
            />
            {!subEditorOpened && (
              <EditorTopbar
                dispatch={dispatch}
                isLoading={isLoading}
                isLoaded={isLoaded}
                isGroup={isGroup}
                isFavorite={editingApplication.data?.Favorite ?? false}
                editType="application"
                name={this.title}
                title="DELETE APPLICATION"
                onSelect={this.onSelect}
                tabs={tabs}
                selectedTabIndex={selectedTabIndex}
                close={!subEditorOpened ? this.close : this.subClose}
                copy={this.openCopyAlert}
                trash={this.trash}
                favorite={this.favorite}
              />
            )}
            <Modal.Body>
              {showExitAlert && (
                <CloseEditorAlert
                  yes={() =>
                    !subEditorOpened
                      ? this.close(true /*force*/)
                      : this.subClose()
                  }
                  no={this.closeExitAlert}
                />
              )}
              {showConfigTabSwitchAlert && (
                <TabSwitchAlert
                  tab={nextConfigTab}
                  yes={() => this.selectConfigTab(nextConfigTab, true)}
                  no={this.notSwitch}
                />
              )}
              {tab == CONFIGURATION && (
                <Configuration
                  dispatch={dispatch}
                  isLoading={isLoading}
                  isLoaded={isLoaded}
                  isEditMode={isEditMode}
                  isEdited={isEdited}
                  data={data}
                  servers={servers}
                  editingId={editingId}
                  tab={configTab}
                  onEdit={this.onEdit}
                  onCancel={this.onCancel}
                  onChangeEdit={this.onChangeEdit}
                  selectConfigTab={this.selectConfigTab}
                />
              )}
              {showCopyAlert && (
                <CopyObjectAlert
                  objectName={this.title}
                  objects={applications}
                  objectGroups={applicationGroups}
                  mainTree={applicationMainTree}
                  objectType="Application"
                  treeType="appGroup"
                  isGroup={false}
                  parentId={parseInt(editingApplication.data?.ParentId)}
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
