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
      showAllTree: true,	// TODO: 預設打開樹
      filterFavorite: false,
      tab: 'RDS',
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
  selectTab = (tab) => {
    this.setState({ tab: tab });
  };

  render() {
    let {
      props: { data, terminals, servers, rdss, rdsGroups, rdsMainTree, vncs, vncGroups, vncMainTree, dispatch, showAppReminder },
      state: { selectedId, showAllTree, filterFavorite, tab },
    } = this;
    const state = getObjectProperty(data, "applications.state");

	let applicationsById = {};
    if (tab == "RDS") {
      applicationsById = data.applications?.data?.reduce((acc, cur) => {
        acc[cur.Id] = cur;
        return acc;
      }, {});
    } else {
      applicationsById = data.vncs?.data?.reduce((acc, cur) => {
        acc[cur.Id] = cur;
        return acc; 
      }, {});
    }

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
          <Editor
            data={data}
            terminalsData={terminals}
            servers={servers}
            rdss={rdss} rdsGroups={rdsGroups} rdsMainTree={rdsMainTree}
            vncs={vncs} vncGroups={vncGroups} vncMainTree={vncMainTree}
            dispatch={dispatch}
            currentTab={tab}
            treeTab={tab} />
        )}
        {data.wizardOpened && (
          <Wizard
            data={data}
            parentId={selectedId ?? 0}
            servers={servers}
            terminals={terminals}
            rdss={rdss}
            rdsGroups={rdsGroups}
            rdsMainTree={rdsMainTree}
            vncs={vncs}
            vncGroups={vncGroups}
            vncMainTree={vncMainTree}
            dispatch={dispatch}
            tab={tab}
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
            tree = {tab == "RDS" ?
              data.applicationMainTree.data :
              data.vncMainTree.data}
            treeType="appTree"
            rdss={rdss}
            rdsGroups={rdsGroups}
            rdsMainTree={rdsMainTree}
            vncs={vncs}
            vncGroups={vncGroups}
            vncMainTree={vncMainTree}
            filterFavorite={filterFavorite}
            showAllTree={showAllTree}
            wsItems={applicationsById}
            selectedId={selectedId}
            toggleAllTree={this.toggleAllTree}
            onSelect={this.selectGroup}
            openEditor={this.openEditor}
            selectTab={this.selectTab}
            currentTab={tab}
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
          applications={data.applications.data}
          applicationGroups={data.applicationGroups.data}
          rdss={rdss}
          rdsGroups={rdsGroups}
          rdsMainTree={rdsMainTree}
          vncs={vncs}
          vncGroups={vncGroups}
          vncMainTree={vncMainTree}
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
          currentTab={tab}
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
