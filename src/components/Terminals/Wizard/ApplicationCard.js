import React, { Fragment } from "react";
import { ApplyAll } from "components/Card";
import { MultiTree } from "components/Tree";
import AppOverride from "components/AppOverride";

import { stringValid } from "lib/Util";
import { getApplication, openSubAppEditor } from "actions/ApplicationActions";

import { ApplicationApplyAll } from "const/Terminals/TerminalFieldNames";

import { toLetter, toNumber } from "utils/String";
import { isInheritedFromParent } from "utils/Check";

export default class ApplicationCard extends React.Component {
  constructor(props) {
    super(props);
    if (props.isLoaded) {
      const isInherited = isInheritedFromParent(
        props.parentTerminal.data,
        ApplicationApplyAll
      );
      const [data, usedMapFromId, screenOptions] = this.updateAppsFromProps();
      const terminal = Object.assign({}, props.terminal.data);
      this.state = {
        isInherited: isInherited,
        data: data, // {SelectedScreen: 'ScreenA', Applications: []}
        terminal: terminal,
        screenOptions: screenOptions,
        appOverrides:
          this.props.appOverrides.data !== "null"
            ? this.props.appOverrides.data
            : {},
        selectedMapFromId: {},
        returnedMapFromId: {},
        usedMapFromId: usedMapFromId,
        currentOverrideIdx: undefined,
        showAllTree: false,
        showApplicationDeleteAlert: false,
        showOverride: false,
      };
      this.deleteIdx = -1;
    }
  }
  async componentDidUpdate(prevProps, prevState) {
    // check apply all
    if (
      this.props.isGroup &&
      this.props.terminal.data.ApplicationApplyAll !==
        this.state.terminal.ApplicationApplyAll
    ) {
      terminal = this.state.terminal;
      terminal[ApplicationApplyAll] =
        this.props.terminal.data.ApplicationApplyAll;
      this.setState({ terminal });
    }
    // check app update
    if (prevProps.appOverrides.data !== this.props.appOverrides.data) {
      const [data, usedMapFromId, screenOptions] = this.updateAppsFromProps();
      this.setState({
        data,
        usedMapFromId,
        screenOptions,
      });
    }
  }

  updateAppsFromProps() {
    let usedMapFromId = {};
    let data = this.state?.data ?? {};
    const terminal = this.props.terminal.data;
    const appOverrides = this.props.appOverrides.data;
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
  }

  change = (e) => {
    let {
      props: { onChange },
      state: { terminal },
    } = this;
    terminal[e.target.name] = e.target.value;
    this.setState({ terminal });
    onChange(terminal);
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
    });
  };
  addApplicationsFromTree = async (selectedScreen) => {
    let {
      props: { setApplication },
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
        setApplication(terminal);
      }
    );
  };
  returnApplicationsToTree = (selectedScreen) => {
    let {
      props: { setApplication },
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
        usedMapFromId,
        data,
        terminal,
        currentOverrideIdx: undefined,
      },
      () => {
        returnedMapFromId = {};
        this.setState({ returnedMapFromId });
        setApplication(terminal);
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
      props: { selectedScreen, onSelect },
      state: { appOverrides, selectedMapFromId, returnedMapFromId },
    } = this;

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
      props: { selectedScreen, setAppOverrides },
      state: { data, appOverrides, currentOverrideIdx },
    } = this;

    const updateData = Object.assign({}, editData);
    data[selectedScreen][currentOverrideIdx] = updateData;
    appOverrides[editData.AppId] = updateData;
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
      state: { returnedMapFromId },
    } = this;

    const appId = application.AppId;
    const isSelected = returnedMapFromId[appId] != null;
    return (
      <Fragment key={appId}>
        <div
          className={
            isSelected ? "selected-app-item app-selected" : "selected-app-item"
          }
          onClick={() => this.selectMovedApp(screen, application, index)}
        >
          <div>
            <span className="up" onClick={() => this.up(screen, index)}></span>
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
      </Fragment>
    );
  }

  render() {
    let {
      props: {
        isLoaded,
        editingId = 0,
        appMultiTree,
        adUsers,
        verifyAuthUserResult,
        isGroup,
        selectedScreen,
        selectedScreenId,
        dispatch,
      },
      state: {
        data,
        terminal,
        isInherited,
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
          style={{ minWidth: "960px", height: "95%" }}
        >
          <h3 className="border-bottom h-40">APPLICATION</h3>
          {/* {isGroup && isLoaded && (
            <ApplyAll
              name={ApplicationApplyAll}
              isEditMode={true}
              value={terminal[ApplicationApplyAll]}
              onChange={this.change}
              disabled={isInherited}
            />
          )} */}
          <div className="display-app-content mt-16" style={{ height: "94%" }}>
            <div className="display-available-content">
              <div className="display-title">AVAILABLE</div>
              <div className="display-app-tree">
                <MultiTree
                  isEditMode={true}
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
            </div>
            <div className="display-select-content">
              <div className="display-title" style={{ marginLeft: "56px" }}>
                SELECTED
              </div>
              {isLoaded &&
                screenOptions.map((screen) => (
                  <div key={screen} className="flex">
                    <div className="app-move-content">
                      <div
                        className={`display-monitor-screen screen-${toNumber(
                          screen
                        )}`}
                        style={{
                          margin: "0",
                          border:
                            selectedScreen === screen
                              ? "4px solid #b4b4b4"
                              : "",
                          cursor: "pointer",
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
