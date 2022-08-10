import React, { Fragment } from "react";
import { connect } from "react-redux";
import Editor from "./Editor";
import Wizard from "./Wizard";
import { default as AppEditor } from "components/Applications/Editor";
import ObjectDashboard from "components/ObjectCommon/ObjectDashboard";
import Spinner from "components/Other/Spinner";
import { Tree } from "components/Tree";

import {
  getTerminal,
  loadTerminalsAndGroups,
  openTerminalEditor,
  openTerminalWizard,
} from "actions/TerminalActions";
import { loadServersAndGroups } from "actions/ServerActions";
import { loadApplicationsAndGroups } from "actions/ApplicationActions";

import { getObjectProperty } from "lib/Util";

import { LOADED, LOADING } from "const/DataLoaderState";
import { TerminalObject } from "const/Consts";

// react 由 component, props, state 組成
//   component 相當於 UI (即 View)
//   props 是 UI 上的變量，傳給 component
//   state 相當於 store, 注意，使用 setState() 時是非同步的
class Terminals extends React.Component {
  // 初始化 state 或綁定其他方法時需要
  constructor(props) {
    super(props);	// 一定要 super(prosp)
    this.state = {	// 初始化內部 state
      selectedId: undefined,
      showAllTree: false,
      filterDefault: false,
      filterFavorite: false,
    };
  }
  // 用來初始化 DOM node
  componentDidMount = async () => {
    let { dispatch } = this.props;
    await dispatch(loadTerminalsAndGroups());
    await dispatch(loadServersAndGroups());
    await dispatch(loadApplicationsAndGroups());
  }

  // 在 components/Terminals/Editor/QuickSwitch.js 同樣有 openEditor()
  //   但是沒有 async/await
  // 在 components/Tree/TreeItem.js 中 settingIcon 一樣在 onClick() 呼叫 openEditor()
  // 在 components/ObjectCommon/ObjectDashboard.js 中有
  //   click = (id, isGroup) => { this.props.openEditor(id, isGroup); };
  // 而在 components/ObjectCommon/ObjectTitles.js 會呼叫 click
  openEditor = async (id, isGroup) => {
    let { dispatch } = this.props;
    await dispatch(getTerminal(id, isGroup));
    await dispatch(openTerminalEditor(id, isGroup));
  };

  // 感覺是定義在 actions/ServerActions.js
  // 其中 openTerminalWizard() 定義在 actions/TerminalActions.js
  openWizard = (isGroup) => {
    this.props.dispatch(openTerminalWizard(isGroup));
  };

  // 因為目前 state 有誤，已停用
  isEditorLoading = () => {
    let { data } = this.props;
    return (
      data.editorOpened &&
      (data.editingTerminal.state === LOADING ||
        data.schedules.state === LOADING ||
        data.modules.state === LOADING)
    );
  };
  // 因為目前 state 有誤，已停用
  isNewTerminalSaving = () => {
    let { data, infobar } = this.props;
    return (
      data.wizardOpened &&
      data.terminals.state === LOADING &&
      !infobar.showInfoBar
    );
  };
  // 因為目前 state 有誤，已停用
  isOperating = () => {
    let { data } = this.props;
    return data.editorOpened && data.operate.state === LOADING;
  };
  // 因為目前 state 有誤，已停用
  isSavingModule = () => {
    let { data } = this.props;
    return (
      data.editorOpened &&
      (data.newModuleSetting.state === LOADING ||
        data.newModuleSettingId.state === LOADING)
    );
  };
  // 因為目前 state 有誤，已停用
  isSavingApp = () => {
    let { data, applications } = this.props;
    return (
      applications.subEditorOpened &&
      applications.editingApplication.state === LOADING
    );
  };

  selectGroup = (id) => {
    let {
      state: { selectedId, filterDefault },
    } = this;
    selectedId = id;
    if (filterDefault) {
      filterDefault = false;
      this.setState({ selectedId, filterDefault });
    } else {
      this.setState({ selectedId });
    }
  };
  toggleAllTree = () => {
    this.setState({ showAllTree: !this.state.showAllTree });
  };
  toggleFilterAll = () => {
    this.setState({
      selectedId: undefined,
      filterDefault: false,
      filterFavorite: false,
    });
  };
  toggleFilterDefault = () => {
    let {
      props: { data },
    } = this;
    const defaultTerminal = data.terminals.data.find(
      (item) => item.Default === true
    );
    if (!this.state.filterDefault) {
      this.setState({
        selectedId: defaultTerminal.ParentId,
        showAllTree: true,
        filterDefault: true,
      });
    } else {
      this.setState({
        selectedId: undefined,
        showAllTree: false,
        filterDefault: false,
      });
    }
  };
  toggleFilterFavorite = () => {
    if (!this.state.filterFavorite) {
      this.setState({
        filterFavorite: true,
        filterDefault: false,
        showAllTree: true,
        selectedId: undefined,
      });
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
      props: { dispatch, data, servers, applications, applicationGroups, applicationMainTree, rdss, rdsGroups, rdsMainTree, vncs, vncGroups, vncMainTree, currentTab, infobar },
      state: { selectedId, showAllTree, filterDefault, filterFavorite },
    } = this;

    const state = getObjectProperty(data, "terminals.state");
    const terminalsById = data.terminals?.data?.reduce((acc, cur) => {
      acc[cur.Id] = cur;
      return acc;
    }, {});

    return (
      <Fragment>
        {/* {(this.isEditorLoading() ||
          this.isNewTerminalSaving() ||
          this.isOperating() ||
          this.isSavingModule() ||
          this.isSavingApp()) && <Spinner />} */}
        {data.editorOpened && (
          <Editor
            data={data}
            applications={applications}
            applicationGroups={applicationGroups}
            applicationMainTree={applicationMainTree}
            rdss={rdss} rdsGroups={rdsGroups} rdsMainTree={rdsMainTree}
            vncs={vncs} vncGroups={vncGroups} vncMainTree={vncMainTree}
            servers={servers}
            infobar={infobar}
            dispatch={dispatch}
          />
        )}
        {applications?.subEditorOpened && (
          <AppEditor
            data={applications}
            applications={applications}
            rdss={rdss}
            rdsGroups={rdsGroups}
            rdsMainTree={rdsMainTree}
            vncs={vncs}
            vncGroups={vncGroups}
            vncMainTree={vncMainTree}
            servers={servers}
            dispatch={dispatch}
          />
        )}
        {data.wizardOpened && (
          <Wizard
            data={data}
            applications={applications}
            rdss={rdss}
            rdsGroups={rdsGroups}
            rdsMainTree={rdsMainTree}
            vncs={vncs}
            vncGroups={vncGroups}
            vncMainTree={vncMainTree}
            dispatch={dispatch}
            parentId={selectedId != null ? selectedId : 0}
          />
        )}
        <section className="main-group-content">
          <header>
            <section className="flex">
              <div
                className={
                  selectedId === undefined && !filterDefault && !filterFavorite
                    ? "filter-btn-active"
                    : "filter-btn"
                }
                onClick={this.toggleFilterAll}
              >
                ALL
              </div>
              <div
                className={filterDefault ? "filter-btn-active" : "filter-btn"}
                onClick={this.toggleFilterDefault}
              >
                DEFAULT
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
                className="action-add-terminal"
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
            tree={data.terminalMainTree.data}
            treeType="terminalTree"
            rdss={rdss}
            rdsGroups={rdsGroups}
            rdsMainTree={rdsMainTree}
            vncs={vncs}
            vncGroups={vncGroups}
            vncMainTree={vncMainTree}
            filterFavorite={filterFavorite}
            showAllTree={showAllTree}
            wsItems={terminalsById}
            selectedId={selectedId}
            toggleAllTree={this.toggleAllTree}
            onSelect={this.selectGroup}
            openEditor={this.openEditor}
          />
        </section>
        <ObjectDashboard
          data={data}
          servers={servers?.servers}
          applications={applications?.data}
          vncs={vncs?.data}
          original={terminalsById}
          objects={data.terminals}
          objectGroups={data.terminalGroups}
          mainTree={data.terminalMainTree}
          rdss={rdss}
          rdsGroups={rdsGroups}
          rdsMainTree={rdsMainTree}
          vncGroups={vncGroups}
          vncMainTree={vncMainTree}
          dispatch={dispatch}
          isGroup={false}
          object={TerminalObject}
          openEditor={this.openEditor}
          openWizard={this.openWizard}
          insideEditor={false}
          selectedId={selectedId}
          filterDefault={filterDefault}
          wizardOpened={data.wizardOpened}
          editorOpened={data.editorOpened}
        />
      </Fragment>
    );
  }
}

export default connect((state) => {
  return {
    data: state.terminals,
    infobar: state.infobar,
  };
})(Terminals);
