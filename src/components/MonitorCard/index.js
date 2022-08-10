import React, { Fragment } from "react";
import { EditorSubTab } from "components/Card";
import DisplayLayout from "./DisplayLayout";
import MonitorOptions from "./MonitorOptions";
import ScreenOptions from "./ScreenOptions";
import ApplicationCard from "../Terminals/Editor/Configuration/ApplicationCard";
import MultistationSettings from "./MultistationSettings";
import MouseButtonMapSettings from "./MouseButtonMapSettings";

import { iterateObject, objectEqual } from "lib/Util";

import {
  MonitorSettings,
  ScreenSettings,
  ApplicationSettings,
} from "const/Consts";
import {
  MainMonitor,
  NumberOfMonitors,
  NumberOfScreens,
  extractApplications,
  VideoPortMapping,
} from "const/Terminals/TerminalFieldNames";
import {
  PIXEL_FACTOR,
  DEFAULT,
  _1xN,
  _Mx1,
  _MxM,
  _2x3,
  _3x2,
  _2x4,
  _4x2,
  ZOOM_OPTIONS,
  DefaultResolution,
} from "../../const/Terminals/Display";

import { toLetter } from "../../utils/String";
import {
  serverDataToTerminal,
  serverDataToScreens,
  dataToServerData,
  dataToScreens,
  screensToData,
  changeScreens,
  changeMonitors,
} from "../../utils/Display";

import { apiGetDisplayLimit } from "api";

export default class MonitorCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: !props.isGroup
        ? serverDataToTerminal({ ...props.terminal.data })
        : { ...props.terminal.data },
      screens: serverDataToScreens(props.terminal.data),
      selectedTag: !props.isGroup ? MonitorSettings : ScreenSettings,
      selectedScreenId: 1,
      videoPortMapping: [],
      resIndex: 0,
      hzIndex: 0,
      colorIndex: 0,
      maxPort: 1,
      maxPortArray: [],
      selectedMonitors: 1,
      selectedMonitorArray: [1],
      scale: 1,
      allMonitorSetting: undefined,
      showMultistationSettings: false,
      showMouseButtonMapSettings: false,
    };
  }
  async componentDidMount() {
    // get maxport
    let maxPort = this.state.maxPort;
    let maxPortArray = [];
    let response;
    let data = { ...this.props.terminal.data };
    let videoPortMapping = [];

    // update max port
    // hardwareInfo is resolution options
    if (!this.props.isGroup) {
      response = await apiGetDisplayLimit(
        this.props.hardware.Manufacturer,
        this.props.hardware.Model
      );
      if (response.result === true) {
        maxPort = 8;
      }
      for (let i = 1; i < data.NumberOfMonitors + 1; i++) {
        const monitorParams = data[`Monitor${i}_Video`].split(",");
        data[`Monitor${i}_VideoPort`] = i;
        data[`Monitor${i}_Resolution`] = monitorParams[0];
        data[`Monitor${i}_ColorDepth`] = monitorParams[1];
        data[`Monitor${i}_RefreshRate`] = monitorParams[2];
        videoPortMapping.push(i);
        delete data[`Monitor${i}_Video`];
      }
    } else {
      maxPort = 1;
      for (let i = 1; i < data.NumberOfMonitors + 1; i++) {
        videoPortMapping.push(i);
      }
      delete data["Monitor1_Video"];
    }
    data[VideoPortMapping] = videoPortMapping.join(",");

    // update max port array
    for await (const port of [...Array(maxPort).keys()]) {
      maxPortArray.push(port + 1);
    }

    const screens = serverDataToScreens(this.props.terminal.data);
    let selectedMonitorArray = [...this.state.selectedMonitorArray];
    for await (const _screenData of Object.values(screens)) {
      selectedMonitorArray[_screenData.displayScreenId - 1] =
        _screenData.monitors.length;
    }

    this.setState({
      maxPort: maxPort,
      maxPortArray: maxPortArray,
      data: data,
      screens: screens,
      selectedMonitors: data.NumberOfMonitors,
      selectedMonitorArray: selectedMonitorArray,
    });
  }
  async componentDidUpdate(prevProps, prevState) {
    if (
      (this.props.isCancel === true &&
        prevProps.isCancel !== this.props.isCancel) ||
      (this.props.terminal.data != null &&
        !objectEqual(prevProps.terminal.data, this.props.terminal.data))
    ) {
      if (
        this.props.isCancel === true &&
        prevProps.isCancel !== this.props.isCance
      ) {
        this.setState({ allMonitorSetting: undefined });
      }
      if (!this.props.isGroup) {
        const terminal = serverDataToTerminal(this.props.terminal.data);
        const screens = serverDataToScreens(this.props.terminal.data);
        let selectedMonitorArray = [...this.state.selectedMonitorArray];
        for await (const _screenData of Object.values(screens)) {
          selectedMonitorArray[_screenData.displayScreenId - 1] =
            _screenData.monitors.length;
        }
        this.setState({
          data: terminal,
          screens: screens,
          selectedMonitors: terminal.NumberOfMonitors,
          selectedMonitorArray: selectedMonitorArray,
        });
      } else {
        this.setState({
          data: { ...this.props.terminal.data },
        });
      }
    }
  }

  change = async (e, screenId) => {
    let {
      props: { onChange },
      state: { selectedScreenId, selectedMonitorArray },
    } = this;

    let data = { ...this.state.data };
    let screens = { ...this.state.screens };
    if (e.target.name === NumberOfScreens) {
      // change screens
      const numberOfScreens = parseInt(e.target.value);
      screens = {};
      selectedMonitorArray = [];
      selectedScreenId = 1;
      [data, screens] = await changeScreens(
        data,
        screens,
        numberOfScreens,
        selectedMonitorArray
      );
    } else if (e.target.name === NumberOfMonitors) {
      // change monitors
      const numberOfMonitors = parseInt(e.target.value);
      selectedScreenId = screenId;
      selectedMonitorArray[screenId - 1] = numberOfMonitors;
      [data, screens] = await changeMonitors(
        data,
        screens,
        numberOfMonitors,
        screenId,
        selectedMonitorArray
      );
    } else if (e.target.name.indexOf("_Resolution") !== -1) {
      // change resolution
      const targetKey = e.target.name;
      const oldResolution = data[targetKey];
      const newResolution = e.target.value;
      const baseMonitorId = parseInt(targetKey[targetKey.indexOf("_") - 1]);
      const baseScreenId = data[`Monitor${baseMonitorId}_ScreenId`];
      const oldData = { ...data };
      data = await this.shiftAndUpdateData(
        oldData,
        baseMonitorId,
        baseScreenId,
        oldResolution,
        newResolution
      );
      screens = await dataToScreens(data);
    } else {
      // change screen options or main monitor
      data[e.target.name] = e.target.value;
    }

    this.setState({
      data,
      screens,
      selectedScreenId,
      selectedMonitors: data[NumberOfMonitors],
      selectedMonitorArray,
      allMonitorSetting: undefined,
    });
    // onChange is change props.terminal.data
    if (!!onChange) {
      onChange(dataToServerData(data), "monitor");
    }
  };

  selectTag = (selectedTag) => {
    this.setState({ selectedTag });
  };

  shiftAndUpdateData = async (
    data,
    baseMonitorId,
    baseScreenId,
    oldResolution,
    newResolution
  ) => {
    let newData = JSON.parse(JSON.stringify(data));
    let newSize = newResolution.split("x").map((value) => parseInt(value));
    let oldSize = oldResolution.split("x").map((value) => parseInt(value));
    const baseMonitorX = data[`Monitor${baseMonitorId}_XPosition`];
    const baseMonitorY = data[`Monitor${baseMonitorId}_YPosition`];
    const baseScreenX = data[`Screen${baseScreenId}_XPosition`];
    const baseScreenY = data[`Screen${baseScreenId}_YPosition`];
    const baseScreenW = data[`Screen${baseScreenId}_Width`];
    const baseScreenH = data[`Screen${baseScreenId}_Height`];
    const column = baseScreenW / oldSize[0];
    const row = baseScreenH / oldSize[1];
    const newScreenW = column * newSize[0];
    const newScreenH = row * newSize[1];
    const screenShiftX = newScreenW - baseScreenW;

    for await (const _screenId of [...Array(data[NumberOfScreens]).keys()]) {
      // update screen data
      if (_screenId + 1 === baseScreenId) {
        newData[`Screen${_screenId + 1}_Width`] = newScreenW;
        newData[`Screen${_screenId + 1}_Height`] = newScreenH;
      }
      // shift screen data
      if (data[`Screen${_screenId + 1}_XPosition`] > baseScreenX) {
        newData[`Screen${_screenId + 1}_XPosition`] =
          data[`Screen${_screenId + 1}_XPosition`] + screenShiftX;
      }
    }

    // update monitor data
    for await (const _monitorId of [...Array(data.NumberOfMonitors).keys()]) {
      // same Screen Id
      if (data[`Monitor${_monitorId + 1}_ScreenId`] === baseScreenId) {
        const itemColumn =
          (data[`Monitor${_monitorId + 1}_XPosition`] - baseScreenX) /
          oldSize[0];
        const itemRow =
          (data[`Monitor${_monitorId + 1}_YPosition`] - baseScreenY) /
          oldSize[1];

        // update monitor Resolution
        newData[`Monitor${_monitorId + 1}_Resolution`] = newResolution;

        // shift monitor position
        if (data[`Monitor${_monitorId + 1}_XPosition`] > baseMonitorX) {
          newData[`Monitor${_monitorId + 1}_XPosition`] =
            data[`Monitor${_monitorId + 1}_XPosition`] -
            itemColumn * oldSize[0] +
            itemColumn * newSize[0];
        }
        if (data[`Monitor${_monitorId + 1}_YPosition`] > baseMonitorY) {
          newData[`Monitor${_monitorId + 1}_YPosition`] =
            data[`Monitor${_monitorId + 1}_YPosition`] -
            itemRow * oldSize[1] +
            itemRow * newSize[1];
        }
      // different Screen Id
      } else {
        // shift monitor position
        if (data[`Monitor${_monitorId + 1}_XPosition`] > baseMonitorX) {
          newData[`Monitor${_monitorId + 1}_XPosition`] += screenShiftX;
        }
      }
    }

    return newData;
  };

  changeScreenShape = async (gridType) => {
    if (isEditMode === false) return;

    let {
      props: { isEditMode, onChange },
      state: { data, selectedScreenId },
    } = this;
    let screens = JSON.parse(JSON.stringify(this.state.screens));
    let x = 0;
    let y = 0;
    let shiftX = 0;
    let shiftY = 0;
    let screenShiftX = 0;
    let monitorWidth = screens[selectedScreenId].monitors[0].resolutionW;
    let monitorHeight = screens[selectedScreenId].monitors[0].resolutionH;
    // use on unique shpae(NxN, 2x3, 3x2 )
    let monitorCount = 1;

	if (gridType === DEFAULT) {
		gridType = _1xN;
	}
    for await (const _screenId of Object.keys(this.state.screens)) {
        // 先判斷 layout 的 gridType
	    let len = this.state.screens[_screenId].monitors.length;
        let m = 1; // Y 軸
        let n = len;
        switch (gridType) {
        case _1xN:
          m = 1;
          n = len;
          break;
        case _Mx1:
          m = len;
          n = 1;
          break;
        case _MxM:
          m = Math.sqrt(len);
          n = m;
          break;
        case _2x3:
          m = 2;
          n = 3;
          break;
        case _3x2:
          m = 3;
          n = 2;
          break;
        case _2x4:
          m = 2;
          n = 4;
          break;
        case _4x2:
          m = 4;
          n = 2;
          break;
        }

        if (n > len) { // monitor 數量比寬度少
          m = 1;
       	  n = len;
        }
        let screenWidth = monitorWidth*n;
        let screenHeight = monitorHeight*m;
        shiftX = x - this.state.screens[_screenId].x;
        screens[_screenId].x += shiftX;
        shiftY = y - this.state.screens[_screenId].y;
        screens[_screenId].y = 0;
        screens[_screenId].w = screenWidth;
        screens[_screenId].h = screenHeight;

		let sid = parseInt(_screenId);
		// 在選擇的 screen 之前
		if (sid < selectedScreenId) {
		  screens[sid].x = this.state.screens[sid].x;
		  screens[sid].y = 0;
		  screens[sid].w = this.state.screens[sid].w;
		  screens[sid].h = this.state.screens[sid].h;
        // same Screen Id
        } else if (sid == selectedScreenId) {
		  screens[sid].x = this.state.screens[sid].x;
		  screens[sid].y = this.state.screens[sid].y;
          monitorCount = 1;
          for await (const _monitor of this.state.screens[sid].monitors) {
            screens[sid].monitors[monitorCount - 1].x = x;
            screens[sid].monitors[monitorCount - 1].y = y;
			// 轉折，最右邊
            if (monitorCount%n == 0) {
              x = screens[sid].x;
              y += monitorHeight;
			// 往右
            } else if (monitorCount < len) {
              x += monitorWidth;
			// 最後一個
			} else {
              x += monitorWidth;
              y = 0;
            }
            monitorCount++;
          }
          screens[sid].w = screenWidth;
          screens[sid].h = screenHeight;
          screenShiftX = screenWidth - this.state.screens[sid].w;
        } else if (sid > selectedScreenId) {
          if (sid == 0) {
            screens[0].x = 0;
          } else {
            screens[sid].x = screens[sid-1].w + screens[sid-1].x;
          }
		  screens[sid].y = 0;
		  screens[sid].w = this.state.screens[sid].w;
		  screens[sid].h = this.state.screens[sid].h;
          for await (const _monitor of this.state.screens[sid].monitors) {
            screens[sid].monitors[monitorCount].x = _monitor.x + screenShiftX;
            screens[sid].monitors[monitorCount].y = _monitor.y;
            monitorCount++;
          }
        }
        // add screen width
        x += screens[sid].w;
        // reset shift value
        shiftX = 0;
        shiftY = 0;
        monitorCount = 0;
    }
    data = await screensToData(screens, data);
    data[MainMonitor] = 1;
    this.setState({ data, screens: screens }, () => {
      onChange(dataToServerData(data), "monitor");
    });
  };

  updateScreens = async (screens) => {
    let {
      props: { onChange },
      state: { data },
    } = this;
    data = await screensToData(screens, data);
    this.setState({ data: data, screens: screens }, () => {
      // onChange is change props.terminal.data (serverData)
      if (!!onChange) {
        onChange(dataToServerData(data), "monitor");
      }
    });
  };

  onSelectScreen = (selectedScreenId) => {
    const intSelectedScreenId = parseInt(selectedScreenId);
    this.setState({
      selectedScreenId: intSelectedScreenId,
    });
  };

  applyAllScreen = async (e, monitorId) => {
    let {
      props: { onChange },
    } = this;

    let data = { ...this.state.data };
    let screens = { ...this.state.screens };
    if (e.target.checked) {
      const resolution = document.getElementById(
        `uMonitor${monitorId}_Resolution`
      ).value;
      const refreshRate = document.getElementById(
        `uMonitor${monitorId}_RefreshRate`
      ).value;
      const colorDepth = document.getElementById(
        `uMonitor${monitorId}_ColorDepth`
      ).value;
      const allMonitorSetting = {
        monitorId: monitorId,
        resolution: resolution,
        refreshRate: refreshRate,
        colorDepth: colorDepth,
      };
      const [resolutionW, resolutionH] = resolution
        .split("x")
        .map((value) => parseInt(value));

      // replace monitor count
      for await (const _screenId of Object.keys(this.state.screens)) {
        const column =
          screens[_screenId].w / screens[_screenId].monitors[0].resolutionW;
        const row =
          screens[_screenId].h / screens[_screenId].monitors[0].resolutionH;
        // only change different screen size
        if (_screenId !== data[`Monitor${monitorId}_ScreenId`]) {
          screens[_screenId].w = column * resolutionW;
          screens[_screenId].h = row * resolutionH;
          screens[_screenId].x =
            _screenId > 1
              ? screens[_screenId - 1].x + screens[_screenId - 1].w
              : 0;
        }
        // update data
        data[`Screen${_screenId}_XPosition`] = screens[_screenId].x;
        data[`Screen${_screenId}_YPosition`] = screens[_screenId].y;
        data[`Screen${_screenId}_Width`] = screens[_screenId].w;
        data[`Screen${_screenId}_Height`] = screens[_screenId].h;
        let monitorCount = 1;
        let columnCount = 1;
        let rowCount = 1;
        let resolutionShiftX = 0;
        let resolutionShiftY = 0;
        for await (const _monitor of screens[_screenId].monitors) {
          // reset when first monitor in screen
          if (monitorCount === 1) {
            resolutionShiftX = resolutionW - _monitor.resolutionW;
            resolutionShiftY = resolutionH - _monitor.resolutionH;
            _monitor.x = screens[_screenId].x;
            _monitor.y = screens[_screenId].y;
          } else {
            _monitor.x =
              screens[_screenId].monitors[monitorCount - 1].x !== 0
                ? screens[_screenId].monitors[monitorCount - 1].x +
                  columnCount * resolutionShiftX
                : 0;
            _monitor.y =
              screens[_screenId].monitors[monitorCount - 1].y !== 0
                ? screens[_screenId].monitors[monitorCount - 1].y +
                  rowCount * resolutionShiftY
                : 0;
            if (monitorCount > 1 &&
                screens[_screenId].monitors[monitorCount - 1].x >
                screens[_screenId].monitors[monitorCount - 2].x)
            {
              columnCount++;
            } else {
              columnCount = 1;
              rowCount++;
            }
          }
          _monitor.resolutionW = resolutionW;
          _monitor.resolutionH = resolutionH;

          // update data
          data[`Monitor${_monitor.id}_Resolution`] =
            allMonitorSetting.resolution;
          data[`Monitor${_monitor.id}_RefreshRate`] =
            allMonitorSetting.refreshRate;
          data[`Monitor${_monitor.id}_ColorDepth`] =
            allMonitorSetting.colorDepth;
          data[`Monitor${_monitor.id}_XPosition`] = _monitor.x;
          data[`Monitor${_monitor.id}_YPosition`] = _monitor.y;
          monitorCount++;
        }
        monitorCount = 1;
        resolutionShiftX = 0;
        resolutionShiftY = 0;
      }

      this.setState(
        { data, screens, allMonitorSetting: allMonitorSetting },
        () => {
          // update apply status
          onChange(dataToServerData(data), "monitor");
        }
      );
    } else {
      this.setState({ allMonitorSetting: undefined });
    }
  };

  setApplication = (screenApplications) => {
    let {
      props: { onChange },
    } = this;

    const data = { ...this.state.data };
    const applicationKeys = extractApplications(screenApplications);
    Object.keys(applicationKeys).forEach((key) => {
      if (data.hasOwnProperty(key)) {
        data[key] = screenApplications[key];
      }
    });
    this.setState({ data: data }, () => {
      onChange(dataToServerData(data), "monitor");
    });
  };

  changeScale = (e) => {
    let scale;
    switch (e.target.value) {
      case "100%":
        scale = 1;
        break;
      case "90%":
        scale = 0.9;
        break;
      case "80%":
        scale = 0.8;
        break;
      case "75%":
        scale = 0.75;
        break;
      case "70%":
        scale = 0.7;
        break;
      case "60%":
        scale = 0.6;
        break;
      case "50%":
        scale = 0.5;
        break;
      case "40%":
        scale = 0.4;
        break;
      case "30%":
        scale = 0.3;
        break;
      case "20%":
        scale = 0.2;
        break;
      default:
        break;
    }
    this.setState({ scale: scale });
  };

  openMultistationSettings = () => {
    if (
      this.props.terminal.data["UseMultistation"] == true ||
      this.props.terminal.data["UseMultistation"] == "YES"
    ) {
      this.setState({ showMultistationSettings: true });
    }
  };
  closeMultistationSettings = () => {
    this.setState({ showMultistationSettings: false });
  };
  saveMultistationSettings = (multisationSettings) => {
    let {
      props: { onChange },
      state: { data },
    } = this;
    iterateObject(multisationSettings, ({ key, value }) => {
      data[key] = value;
    });
    if (!!onChange) onChange(data);
    this.setState({ data });
    this.closeMultistationSettings();
  };

  openMouseButtonMapSettings = () => {
    this.setState({ showMouseButtonMapSettings: true });
  };
  closeMouseButtonMapSettings = () => {
    this.setState({ showMouseButtonMapSettings: false });
  };
  saveMouseButtonMapSettings = (mouseButtonMapSettings) => {
    let {
      props: { onChange },
      state: { data, selectedScreenId },
    } = this;
    let screenPrefix = `Screen${parseInt(selectedScreenId)}`;
    let key = `${screenPrefix}_MouseButtonMapping`;
    data[key] = mouseButtonMapSettings[key];
    if (!!onChange) onChange(data);
    this.setState({ data });
    this.closeMouseButtonMapSettings();
  };

  render() {
    let {
      props: {
        isLoaded = true, isEditMode, isCancel, displayEdit = true, resetCancel, setAppOverrides, checkAppOverrideEdit = null, editingId = 0,
        terminalMainTree, isWizard, terminal, hardwareInfo,
        rdss, rdsGroups, rdsMainTree,
        vncs, vncGroups, vncMainTree,
        currentTab,
        adUsers, verifyAuthUserResult, parentTerminal, defaultMouseMapping, className = "wrap01 wrap-bg-w", disabled = false, isGroup = false, style = {}, dispatch, onChangeEdit, appOverrides, oriAppOverrides, onChange,
      },
      state: {
        data, maxPort, maxPortArray, selectedTag, selectedScreenId, screens, resIndex, hzIndex, colorIndex, allMonitorSetting, showMultistationSettings, showMouseButtonMapSettings, selectedMonitors, selectedMonitorArray, scale,
      },
    } = this;

    const TAGS = isGroup
      ? [ScreenSettings, ApplicationSettings]
      : [MonitorSettings, ScreenSettings, ApplicationSettings];
    const screenPrefix = `Screen${selectedScreenId}`;

    return (
      <div className={className} style={style}>
        <div style={{ padding: "0px" }}></div>
        <div className="display-zoom">
          Zoom
          <select onChange={this.changeScale}>
            {ZOOM_OPTIONS.map((zoom) => (
              <option key={zoom}>{zoom}</option>
            ))}
          </select>
        </div>
        <DisplayLayout
          isGroup={isGroup}
          isEditMode={isEditMode}
          screens={screens}
          data={data}
          maxPort={maxPort}
          selectedMonitors={selectedMonitors}
          selectedMonitorArray={selectedMonitorArray}
          maxPortArray={maxPortArray}
          selectedScreenId={selectedScreenId}
          scale={scale}
          onChange={this.change}
          onChangeScreenShape={this.changeScreenShape}
          onUpdateScreens={this.updateScreens}
          onShiftAndUpdateData={this.shiftAndUpdateData}
          onSelect={this.onSelectScreen}
        />
        {showMultistationSettings && (
          <MultistationSettings
            isEditMode={true}
            screenId={selectedScreenId}
            onCancel={this.closeMultistationSettings}
            onConfirm={this.saveMultistationSettings}
          />
        )}
        {showMouseButtonMapSettings && (
          <MouseButtonMapSettings
            data={terminal.data}
            defaultMouseMapping={defaultMouseMapping}
            path={`${screenPrefix}_MouseButtonMapping`}
            onCancel={this.closeMouseButtonMapSettings}
            onConfirm={this.saveMouseButtonMapSettings}
          />
        )}
        <div className="display-tab-region">
          {TAGS.length > 1 && (
            <EditorSubTab
              tabWidth={130}
              tabZIndex={2}
              tabClass="sub-tab"
              subTabs={TAGS}
              currentTab={selectedTag}
              selectTab={this.selectTag}
            />
          )}
          <div
            className="display-switch-content"
            style={isWizard ? { width: "508px", height: "570px" } : {}}
          >
            {isLoaded &&
              ((TAGS.length == 1 && isGroup) ||
                selectedTag == ScreenSettings) && (
                <ScreenOptions
                  isEditMode={isEditMode}
                  data={data}
                  selectedScreenId={selectedScreenId}
                  disabled={disabled}
                  change={this.change}
                  openMouseButtonMapSettings={this.openMouseButtonMapSettings}
                />
              )}
            {selectedTag === MonitorSettings && (
              <div className="display-monitor-settings">
                {!isGroup &&
                  Object.keys(screens).map((_screenId) => (
                    <Fragment key={_screenId}>
                      {screens[_screenId].monitors.map((_monitor) => (
                        <MonitorOptions
                          isEditMode={isEditMode}
                          isWizard={isWizard}
                          data={data}
                          screens={screens}
                          hardwareInfo={hardwareInfo.data}
                          change={this.change}
                          applyAllScreen={this.applyAllScreen}
                          disabled={disabled}
                          monitorId={_monitor.id}
                          screenId={_screenId}
                          allMonitorSetting={allMonitorSetting}
                          resIndex={resIndex}
                          hzIndex={hzIndex}
                          colorIndex={colorIndex}
                        />
                      ))}
                    </Fragment>
                  ))}
              </div>
            )}
            {selectedTag == ApplicationSettings && (
              <ApplicationCard
                isCancel={isCancel}
                isWizard={isWizard}
                isEditMode={isEditMode}
                displayEdit={displayEdit}
                isLoaded={isLoaded}
                appOverrides={appOverrides}
                oriAppOverrides={oriAppOverrides}
                editingId={editingId}
                terminalMainTree={terminalMainTree}
                terminal={terminal.data}
                rdss={rdss}
                rdsGroups={rdsGroups}
                rdsMainTree={rdsMainTree}
                vncs={vncs}
                vncGroups={vncGroups}
                vncMainTree={vncMainTree}
                currentTAb={currentTab}
                adUsers={adUsers}
                verifyAuthUserResult={verifyAuthUserResult}
                dispatch={dispatch}
                onSelect={this.onSelectScreen}
                isGroup={isGroup}
                parentTerminal={parentTerminal}
                onChangeEdit={onChangeEdit}
                isInDisplay={true}
                selectedScreenId={selectedScreenId}
                selectedScreen={toLetter(selectedScreenId)}
                setApplication={this.setApplication}
                resetCancel={resetCancel}
                setAppOverrides={setAppOverrides}
                checkAppOverrideEdit={checkAppOverrideEdit}
				onChange={onChange}
              />
            )}
          </div>
        </div>
      </div>
    );
  }
}
