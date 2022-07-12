import React, { Fragment } from "react";
import { connect } from "react-redux";
import Editor from "./Editor";
import Wizard from "./Wizard";
import ObjectDashboard from "components/ObjectCommon/ObjectDashboard";
import Spinner from "components/Other/Spinner";
import { Tree } from "components/Tree";
import Reminder from "components/Other/Reminder";

import {
  getApplication,
  loadApplicationsAndGroups,
  openApplicationEditor,
  openApplicationWizard,
} from "actions/ApplicationActions";
import { loadTerminalsAndGroups } from "actions/TerminalActions";
import { loadServersAndGroups } from "actions/ServerActions";

import { ApplicationObject } from "const/Consts";
import { LOADED, LOADING } from "const/DataLoaderState";

import { getObjectProperty } from "lib/Util";

class Applications extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedId: undefined,
      showAllTree: false,
      filterFavorite: false,
    };
  }

  componentDidMount() {
    let { dispatch } = this.props;
    dispatch(loadTerminalsAndGroups());
    dispatch(loadServersAndGroups());
    dispatch(loadApplicationsAndGroups());
  }

  openEditor = (id, isGroup) => {
    let { dispatch } = this.props;
    dispatch(openApplicationEditor(id, isGroup));
    dispatch(getApplication(id, isGroup));
  };
  openWizard = (isGroup) => {
    this.props.dispatch(openApplicationWizard(isGroup));
  };
  isEditorLoading = () => {
    let { data } = this.props;
    return data.editorOpened && data.editingApplication.state == LOADING;
  };
  isNewApplicationSaving = () => {
    let { data, infobar } = this.props;
    return (
      data.wizardOpened &&
      data.applications.state == LOADING &&
      !infobar.showInfoBar
    );
  };
  selectGroup = (id) => {
    let {
      state: { selectedId },
    } = this;
    selectedId = id;
    this.setState({ selectedId });
  };
  toggleAllTree = () => {
    this.setState({ showAllTree: !this.state.showAllTree });
  };
  toggleFilterAll = () => {
    this.setState({ selectedId: undefined, filterFavorite: false });
  };

  render() {
    let {
      props: { data, terminals, servers, dispatch, showAppReminder },
      state: { selectedId, showAllTree, filterFavorite },
    } = this;

    const state = getObjectProperty(data, "applications.state");
    const applicationsById = data.applications?.data?.reduce((acc, cur) => {
      acc[cur.Id] = cur;
      return acc;
    }, {});

    return (
      <Fragment>
        {/* {(this.isEditorLoading() || this.isNewApplicationSaving()) && (
          <Spinner />
        )} */}
        {showAppReminder && (
          <Reminder
            domId="add-app-item"
            description={
              <div>
                Create <b>APP</b> to unlock <b>TERMINAL</b>
              </div>
            }
          ></Reminder>
        )}
        {data.editorOpened && (
          <Editor data={data} servers={servers} dispatch={dispatch} />
        )}
        {data.wizardOpened && (
          <Wizard
            data={data}
            parentId={selectedId ?? 0}
            servers={servers}
            dispatch={dispatch}
          />
        )}
        <section className="main-group-content">
          <header>
            <section className="flex">
              <div
                className={
                  selectedId === undefined && !filterFavorite
                    ? "filter-btn-active"
                    : "filter-btn"
                }
                onClick={this.toggleFilterAll}
              >
                ALL
              </div>
            </section>
            <section>
              <div
                className="action-add-group"
                onClick={
                  state === "LOADING" ? null : () => this.openWizard(true)
                }
              ></div>
              <div
                id="add-app-item"
                className="action-add-app"
                onClick={
                  state === "LOADING" ? null : () => this.openWizard(false)
                }
              ></div>
            </section>
          </header>
          <Tree
            hoverwidth={270}
            outerClass=" main-page-tree"
            expandClass=" ml-20"
            tree={data.applicationMainTree.data}
            filterFavorite={filterFavorite}
            showAllTree={showAllTree}
            treeType="appTree"
            wsItems={applicationsById}
            selectedId={selectedId}
            toggleAllTree={this.toggleAllTree}
            onSelect={this.selectGroup}
            openEditor={this.openEditor}
          />
        </section>
        <ObjectDashboard
          data={data}
          servers={servers.servers}
          terminals={terminals?.terminals}
          original={applicationsById}
          objects={data.applications}
          objectGroups={data.applicationGroups}
          mainTree={data.applicationMainTree}
          dispatch={dispatch}
          isGroup={false}
          hasItems={!showAppReminder}
          object={ApplicationObject}
          openEditor={this.openEditor}
          openWizard={this.openWizard}
          hideGroup={true}
          insideEditor={false}
          selectedId={selectedId}
          wizardOpened={data.wizardOpened}
          editorOpened={data.editorOpened}
        />
      </Fragment>
    );
  }
}

export default connect((state) => {
  return {
    data: state.applications,
    servers: state.servers,
    infobar: state.infobar,
  };
})(Applications);
