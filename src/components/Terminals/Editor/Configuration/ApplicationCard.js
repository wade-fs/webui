import React, { Fragment } from "react";
import { ApplyAll } from "components/Card";
import { MultiTree } from "components/Tree";
import AppOverride from "components/AppOverride";

import { stringValid } from "lib/Util";
import { getApplication, openSubAppEditor } from "actions/ApplicationActions";

import { ApplicationApplyAll } from "const/Terminals/TerminalFieldNames";

import { toLetter, toNumber } from "utils/String";
import { checkEdit, isInheritedFromParent } from "utils/Check";

export default class ApplicationCard extends React.Component {
  constructor(props) {
    super(props);
    if (props.isLoaded) {
      const isInherited = isInheritedFromParent(
        props.parentTerminal.data,
        ApplicationApplyAll
      );
      const [data, usedMapFromId, screenOptions] = this.updateAppsFromProps(
        props.isWizard === false && props.isEditMode === false
      );
      const terminal = Object.assign({}, props.terminal);
      this.state = {
        isInherited: isInherited,
        appOverrides:
          this.props.appOverrides.data !== "null"
            ? this.props.appOverrides.data
            : {},
        selectedMapFromId: {},
        returnedMapFromId: {},
        usedMapFromId: usedMapFromId,
        showAllTree: false,
        terminal: terminal,
        data: data, // {SelectedScreen: 'ScreenA', Applications: []}
        showApplicationDeleteAlert: false,
        showOverride: false,
        screenOptions: screenOptions,
        currentOverrideIdx: undefined,
      };
      this.deleteIdx = -1;
    }
  }

  componentDidUpdate(prevProps) {
    // check cancel (this.props.isCancel from MonitorCard)
    if (
      this.props.isCancel === true &&
      this.props.isCancel !== prevProps.isCancel
    ) {
      this.props.resetCancel();
      const [data, usedMapFromId, screenOptions] = this.updateAppsFromProps(
        this.props.isCancel
      );
      this.setState({
        data: data,
        usedMapFromId: usedMapFromId,
        screenOptions: screenOptions,
        selectedMapFromId: {},
        returnedMapFromId: {},
        currentOverrideIdx: undefined,
      });
    }
    // check apply all
    if (
      this.props.isGroup &&
      this.props.isWizard &&
      this.props.terminal.ApplicationApplyAll !==
        this.state.terminal.ApplicationApplyAll
    ) {
      terminal = this.state.terminal;
      terminal[ApplicationApplyAll] = this.props.terminal.ApplicationApplyAll;
      this.setState({ terminal: terminal });
    }
    // check increase or decrease
    if (
      this.props.isLoaded &&
      Object.keys(this.props.terminal).length > 0 &&
      this.props.terminal["NumberOfScreens"] !== this.state.screenOptions.length
    ) {
      const terminal = Object.assign({}, this.props.terminal);
      const [data, usedMapFromId, screenOptions] = this.updateAppsFromProps(
        false
      );
      this.setState({
        data: data,
        screenOptions: screenOptions,
        usedMapFromId: usedMapFromId,
        terminal: terminal,
      });
    }
  }

  updateAppsFromProps = (isReset) => {
    let usedMapFromId = {};
    let data = isReset ? {} : { ...this.state?.data } ?? {};
    const terminal = { ...this.props.terminal };
    const appOverrides = JSON.parse(
      JSON.stringify(
        isReset ? this.props.oriAppOverrides.data : this.props.appOverrides.data
      )
    );
    const screenOptions = getScreenOptions();
    function getSelectedApplications(appOverrides, usedMapFromId) {
      usedMapFromId = Object.values(appOverrides).reduce((acc, cur) => {
        acc[cur.AppId] = {};
        acc[cur.AppId] = cur;
        return acc;
      }, usedMapFromId);
      return usedMapFromId;
    }
    function getApplications(screen) {
      let applicationArr = [];
      if (
        typeof terminal !== "object" ||
        typeof appOverrides !== "object" ||
        terminal == null ||
        appOverrides == null
      )
        return applicationArr;

      const key = `Screen${toNumber(screen)}_Applications`;
      let ids = [];
      if (stringValid(terminal[key])) {
        ids = terminal[key].split(",");
      }
      if (typeof appOverrides === "object" && appOverrides != null) {
        ids.forEach((id) => {
          const find = appOverrides[id];
          if (find != null) {
            applicationArr.push(find);
          }
        });
      }
      return applicationArr;
    }
    function getScreenOptions() {
      let screenOptions = [];
      if (typeof terminal !== "object" || terminal == null)
        return screenOptions;

      const numberOfScreens = parseInt(terminal["NumberOfScreens"]);
      for (let i = 0; i < numberOfScreens; i++) {
        screenOptions.push(toLetter(i + 1));
      }
      return screenOptions;
    }

    screenOptions.forEach((screen) => {
      data[screen] = getApplications(screen);
      if (data[screen].length > 0) {
        usedMapFromId = getSelectedApplications(data[screen], usedMapFromId);
      }
    });

    return [data, usedMapFromId, screenOptions];
  };

  change = (e) => {
    let {
      props: { onChangeEdit },
      state: { terminal },
    } = this;
    terminal[e.target.name] = e.target.value;
    this.setState({ terminal }, () => {
      onChangeEdit(this.state.edited);
    });
  };

  up = (screen, index) => {
    this.swap(screen, index, -1);
  };
  down = (screen, index) => {
    this.swap(screen, index, 1);
  };
  swap = (screen, id1, offset) => {
    let {
      state: { terminal, data },
      props: { onChange },
    } = this;

    const length = data[screen].length;
    let id2 = (id1 + offset) % length;
    id2 = id2 < 0 ? id2 + length : id2;
    const temp = data[screen][id2];
    data[screen][id2] = data[screen][id1];
    data[screen][id1] = temp;
    const key = `Screen${toNumber(screen)}_Applications`;
    terminal[key] = data[screen]
      .map((application) => application["AppId"])
      .join(",");
    this.setState({
      data,
      terminal,
      edited: true,
    });
    onChange(terminal);
  };

  addApplicationsFromTree = async (selectedScreen) => {
    let {
      props: { isWizard, onChangeEdit, isInDisplay, setApplication },
      state: { terminal, data, selectedMapFromId, usedMapFromId },
    } = this;

    const selectedApps = Object.values(selectedMapFromId);
    const key = `Screen${toNumber(selectedScreen)}_Applications`;
    for await (const appOverride of selectedApps) {
      data[selectedScreen].push(appOverride);
      usedMapFromId[appOverride.AppId] = {};
      usedMapFromId[appOverride.AppId] = appOverride;
    }
    terminal[key] = data[selectedScreen].map((app) => app["AppId"]).join(",");
    selectedMapFromId = {};
    this.setState(
      {
        usedMapFromId,
        selectedMapFromId,
        data,
        terminal,
      },
      () => {
        if (isInDisplay) {
          setApplication(terminal);
        }
        if (!isWizard) {
          onChangeEdit(this.state.edited);
        }
      }
    );
  };
  returnApplicationsToTree = (selectedScreen) => {
    let {
      props: { isWizard, onChangeEdit, isInDisplay, setApplication },
      state: { data, terminal, returnedMapFromId, usedMapFromId },
    } = this;

    const oriData = [...data[selectedScreen]];
    const key = `Screen${toNumber(selectedScreen)}_Applications`;
    terminal[key] = oriData
      .map((app) => {
        if (returnedMapFromId[app.AppId] != null) {
          const index = data[selectedScreen].findIndex(
            (item) => item.AppId === parseInt(app.AppId)
          );
          data[selectedScreen].splice(index, 1);
          delete usedMapFromId[app.AppId];
        } else {
          return app.AppId;
        }
      })
      .filter((item) => item != null)
      .join(",");
    this.setState(
      {
        data,
        terminal,
        usedMapFromId,
        currentOverrideIdx: undefined,
      },
      () => {
        if (isInDisplay) {
          returnedMapFromId = {};
          this.setState({ returnedMapFromId });
          setApplication(terminal);
        }
        if (!isWizard) {
          onChangeEdit(this.state.edited);
        }
      }
    );
  };
  selectApp = (item) => {
    let {
      state: { selectedMapFromId, returnedMapFromId, appOverrides },
    } = this;

    if (Object.keys(returnedMapFromId).length !== 0) {
      returnedMapFromId = {};
      this.setState({ returnedMapFromId });
    }
    if (selectedMapFromId[item.Id] != null) {
      delete selectedMapFromId[item.Id];
    } else {
      selectedMapFromId[item.Id] = {};
      selectedMapFromId[item.Id] = appOverrides[item.Id];
    }
    this.setState({
      selectedMapFromId,
    });
  };
  selectMovedApp = (screen, item) => {
    let {
      props: { isWizard, selectedScreen, onSelect, onChangeEdit },
      state: { appOverrides, selectedMapFromId, returnedMapFromId },
    } = this;
    if (!isWizard) {
      onChangeEdit(this.state.edited);
    }

    if (Object.keys(selectedMapFromId) !== 0) {
      selectedMapFromId = {};
      this.setState({ selectedMapFromId });
    }
    if (returnedMapFromId[item.AppId] != null) {
      delete returnedMapFromId[item.AppId];
    } else {
      if (screen !== selectedScreen) {
        returnedMapFromId = {};
      }
      returnedMapFromId[item.AppId] = appOverrides[item.AppId];
    }
    this.setState(
      {
        returnedMapFromId,
      },
      () => {
        onSelect(toNumber(screen));
      }
    );
  };
  selectScreen = (screenId) => {
    let {
      props: { onSelect, selectedScreen },
      state: { returnedMapFromId },
    } = this;

    if (screenId !== selectedScreen) {
      returnedMapFromId = {};
    }
    this.setState({ returnedMapFromId, currentOverrideIdx: undefined }, () => {
      onSelect(screenId);
    });
  };
  closeOverride = (editData) => {
    let {
      props: {
        isWizard,
        selectedScreen,
        setAppOverrides,
        checkAppOverrideEdit,
        oriAppOverrides,
      },
      state: { data, appOverrides, currentOverrideIdx },
    } = this;

    data[selectedScreen][currentOverrideIdx] = { ...editData };
    appOverrides[editData.AppId] = { ...editData };
    // check app override edited
    if (!isWizard) {
      const overrideEdited = checkEdit(
        editData,
        oriAppOverrides.data[editData.AppId]
      );
      checkAppOverrideEdit(overrideEdited ? true : false);
    }
    this.setState({ data, appOverrides, showOverride: false }, () => {
      setAppOverrides(appOverrides);
    });
  };
  openOverride = (application, overrideIdx) => {
    let {
      state: { returnedMapFromId },
    } = this;
    const openApp = Object.assign({}, returnedMapFromId[application.AppId]);
    returnedMapFromId = {};
    returnedMapFromId[openApp.AppId] = openApp;
    this.setState({
      returnedMapFromId,
      showOverride: true,
      currentOverrideIdx: overrideIdx,
    });
  };
  cancelOverride = () => {
    this.setState({ showOverride: false });
  };

  toggleAllTree = () => {
    this.setState({ showAllTree: !this.state.showAllTree });
  };
  openSubEditor = (id, isGroup) => {
    let {
      props: { dispatch },
    } = this;

    dispatch(getApplication(id));
    dispatch(openSubAppEditor(id, isGroup));
  };

  getItem(screen, application, index) {
    let {
      props: { isEditMode },
      state: { returnedMapFromId },
    } = this;
    const appId = application.AppId;
    const isSelected = returnedMapFromId[appId] != null;
    return (
      <Fragment key={appId}>
        {isEditMode && (
          <div
            className={
              isSelected
                ? "selected-app-item app-selected"
                : "selected-app-item"
            }
            onClick={() => this.selectMovedApp(screen, application)}
          >
            <div>
              <span
                className="up"
                onClick={() => this.up(screen, index)}
              ></span>
              <span
                className="down"
                onClick={() => this.down(screen, index)}
              ></span>
              {application.DisplayNameOverride ||
              application.UserAccessOverride ||
              application.AppCommandOverride ||
              application.VideoSettingOverride ? (
                <div className="item-app-override"></div>
              ) : (
                <div className="item-app"></div>
              )}
              <p className="inline-flex ml-5">{application["Name"]}</p>
            </div>
            {isSelected && (
              <div
                className="action-edit-sm"
                onClick={() => this.openOverride(application, index)}
              ></div>
            )}
          </div>
        )}
        {!isEditMode && (
          <div className="selected-app-item" style={{ cursor: "default" }}>
            <div>
              {application.DisplayNameOverride ||
              application.UserAccessOverride ||
              application.AppCommandOverride ||
              application.VideoSettingOverride ? (
                <div className="item-app-override"></div>
              ) : (
                <div className="item-app"></div>
              )}
              <p className="inline-flex ml-5">{application["Name"]}</p>
            </div>
          </div>
        )}
      </Fragment>
    );
  }

  getEditButton() {
    let {
      props: { parentTerminal },
      state: { isInherited },
    } = this;
    if (isInherited === true) {
      return (
        <div
          className="modal-text-b"
          style={{
            position: "absolute",
            top: "16px",
            right: "80px",
          }}
        >
          Inherit from {parentTerminal.data["Name"]}
        </div>
      );
    }
    return super.getEditButton();
  }

  render() {
    let {
      props: {
        isLoaded,
        isEditMode,
        editingId = 0,
        appMultiTree,
        adUsers,
        verifyAuthUserResult,
        isGroup,
        isInDisplay,
        selectedScreen,
        selectedScreenId,
        dispatch,
      },
      state: {
        isInherited,
        data,
        terminal,
        showOverride,
        showAllTree,
        screenOptions,
        currentOverrideIdx,
        selectedMapFromId,
        returnedMapFromId,
        usedMapFromId,
      },
    } = this;

    const hasSelectedApps = Object.keys(selectedMapFromId).length > 0;
    const hasSelectedOverrides = Object.keys(returnedMapFromId).length > 0;
    return (
      <Fragment>
        <div
          className="wrap-960 wrap-bg-w"
          style={
            isInDisplay
              ? {
                  minWidth: "600px",
                  height: "95%",
                  padding: "0",
                  border: "none",
                }
              : { minWidth: "960px", height: "95%" }
          }
        >
          {/* {isGroup && isLoaded && (
            <ApplyAll
              name={ApplicationApplyAll}
              isEditMode={isEditMode}
              value={terminal[ApplicationApplyAll]}
              onChange={this.change}
              disabled={!isEditMode || isInherited}
            />
          )} */}
          <div className="display-app-content">
            <div className="display-available-content">
              <div className="display-title">AVAILABLE</div>
              <div className="display-app-tree">
                <MultiTree
                  isEditMode={isEditMode}
                  showAllTree={showAllTree}
                  editingId={editingId}
                  tree={appMultiTree}
                  treeType="application"
                  selectedMapFromId={selectedMapFromId}
                  usedMapFromId={usedMapFromId}
                  toggleAllTree={this.toggleAllTree}
                  onSelect={this.selectApp}
                  onOpenSubEditor={this.openSubEditor}
                />
              </div>
            </div>
            <div className="display-app-arrow-content ">
              {isEditMode && (
                <Fragment>
                  <div
                    className="app-right-item"
                    style={
                      hasSelectedApps
                        ? { opacity: "1", cursor: "pointer" }
                        : { opacity: "0.35", cursor: "default" }
                    }
                    onClick={() =>
                      hasSelectedApps
                        ? this.addApplicationsFromTree(selectedScreen)
                        : null
                    }
                  ></div>
                  <div
                    className="app-left-item"
                    style={
                      hasSelectedOverrides
                        ? { opacity: "1", cursor: "pointer" }
                        : { opacity: "0.35", cursor: "default" }
                    }
                    onClick={() =>
                      hasSelectedOverrides
                        ? this.returnApplicationsToTree(selectedScreen)
                        : null
                    }
                  ></div>
                </Fragment>
              )}
            </div>
            <div className="display-select-content">
              <div className="display-title" style={{ marginLeft: "56px" }}>
                SELECTED
              </div>
              {isLoaded &&
                screenOptions.map((screen) => (
                  <div key={screen} className="flex app-move-content">
                    <div
                      className={`display-monitor-screen screen-${toNumber(
                        screen
                      )}`}
                      style={{
                        margin: "0",
                        border:
                          selectedScreen === screen ? "4px solid #b4b4b4" : "",
                        cursor: isEditMode ? "pointer" : "default",
                      }}
                      onClick={() => this.selectScreen(toNumber(screen))}
                    >
                      {screen}
                    </div>
                    <div
                      className={
                        "terminal-selected-app" +
                        (toNumber(screen) === selectedScreenId
                          ? " selcted"
                          : "")
                      }
                    >
                      {data[screen] !== undefined &&
                        data[screen].map((application, index) =>
                          this.getItem(screen, application, index)
                        )}
                    </div>
                    <br />
                  </div>
                ))}
            </div>
          </div>
        </div>
        {showOverride && (
          <div style={{ overflow: "auto" }}>
            <AppOverride
              dispatch={dispatch}
              isGroup={isGroup}
              data={data[selectedScreen][currentOverrideIdx]}
              adUsers={adUsers}
              verifyAuthUserResult={verifyAuthUserResult}
              onConfirm={this.closeOverride}
              onCancel={this.cancelOverride}
            />
          </div>
        )}
      </Fragment>
    );
  }
}
