import React, { Fragment } from "react";
import { connect } from "react-redux";
import Editor from "./Editor";
import Wizard from "./Wizard";
import ObjectDashboard from "components/ObjectCommon/ObjectDashboard";
import Spinner from "components/Other/Spinner";
import { Tree } from "components/Tree";
import Reminder from "components/Other/Reminder";

import {
  getServer,
  loadServersAndGroups,
  openEditor,
  openWizard,
} from "actions/ServerActions";
import { loadTerminalsAndGroups } from "actions/TerminalActions";
import { loadApplicationsAndGroups } from "actions/ApplicationActions";

import { ServerObject } from "const/Consts";
import { LOADED, LOADING } from "const/DataLoaderState";

import { getObjectProperty } from "lib/Util";

class Servers extends React.Component {
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
    dispatch(openEditor(id, isGroup));
    dispatch(getServer(id, isGroup));
  };
  openWizard = (isGroup) => {
    this.props.dispatch(openWizard(isGroup));
  };
  isEditorLoading = () => {
    let { data } = this.props;
    return data.editorOpened && data.editingServer.state === LOADING;
  };
  isNewServerSaving = () => {
    let { data, infobar } = this.props;
    return (
      data.wizardOpened &&
      data.servers.state === LOADING &&
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
  toggleFilterFavorite = () => {
    if (!this.state.filterFavorite) {
      this.setState({ filterFavorite: true, showAllTree: true });
    } else {
      this.setState({
        filterFavorite: false,
        showAllTree: false,
        selectedId: undefined,
      });
    }
  };

  render() {
    let {
      props: { data, terminals, applications, rdss, rdsGroups, rdsMainTree, vncs, vncGroups, vncMainTree, dispatch, showServerReminder },
      state: { selectedId, showAllTree, filterFavorite },
    } = this;
    const state = getObjectProperty(data, "servers.state");
    const serversById = data.servers?.data?.reduce((acc, cur) => {
      acc[cur.Id] = cur;
      return acc;
    }, {});

    return (
      <Fragment>
        {/* {(this.isEditorLoading() || this.isNewServerSaving()) && <Spinner />} */}
        {showServerReminder && (
          <Reminder
            domId="add-server-item"
            description={
              <div>
                Create <b>APP SERVER</b> to unlock <b>APP</b>
              </div>
            }
          ></Reminder>
        )}
        {data.editorOpened && <Editor data={data} dispatch={dispatch} />}
        {data.wizardOpened && (
          <Wizard
            data={data}
            parentId={selectedId != null ? selectedId : 0}
          rdss={rdss} rdsGroups={rdsGroups} rdsMainTree={rdsMainTree}
          vncs={vncs} vncGroups={vncGroups} vncMainTree={vncMainTree}
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
                id="add-server-item"
                className="action-add-server"
                onClick={
                  state === "LOADING" ? null : () => this.openWizard(false)
                }
              ></div>
            </section>
          </header>
          <Tree
            hoverwidth={270}
            loading={state === "LOADING" ? true : false}
            outerClass=" main-page-tree"
            expandClass=" ml-20"
            tree={data.serverMainTree.data}
            treeType="appServerTree"
          rdss={rdss}
          rdsGroups={rdsGroups}
          rdsMainTree={rdsMainTree}
          vncs={vncs}
          vncGroups={vncGroups}
          vncMainTree={vncMainTree}
            filterFavorite={filterFavorite}
            showAllTree={showAllTree}
            wsItems={serversById}
            selectedId={selectedId}
            toggleAllTree={this.toggleAllTree}
            onSelect={this.selectGroup}
            openEditor={this.openEditor}
          />
        </section>
        <ObjectDashboard
          data={data}
          terminals={terminals?.terminals}
          applications={applications?.data}
          rdss={rdss}
          rdsGroups={rdsGroups}
          rdsMainTree={rdsMainTree}
          vncs={vncs}
          vncGroups={vncGroups}
          vncMainTree={vncMainTree}
          original={serversById}
          objects={data.servers}
          objectGroups={data.serverGroups}
          mainTree={data.serverMainTree}
          dispatch={dispatch}
          isGroup={false}
          hasItems={!showServerReminder}
          object={ServerObject}
          openEditor={this.openEditor}
          openWizard={this.openWizard}
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
    data: state.servers,
    infobar: state.infobar,
  };
})(Servers);
