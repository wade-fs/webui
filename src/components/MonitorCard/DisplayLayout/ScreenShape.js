import React, { Component, Fragment } from "react";

import { PIXEL_FACTOR } from "../../../const/Terminals/Display";

import { objectEqual } from "../../../lib/Util/Object";

import { toLetter } from "../../../utils/String";

export default class ScreenShape extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dragScreenId: undefined,
      dragMonitorId: undefined,
      pixel: {},
    };
  }
  componentDidMount() {
    if (!this.props.isGroup) {
      this.setAllPixelSize();
    }
  }
  componentDidUpdate(prevProps, prevState) {
    if (!this.props.isGroup && !objectEqual(prevProps.data, this.props.data)) {
      this.setAllPixelSize();
    }
  }

  getPixelSize(port) {
    let {
      props: { data },
    } = this;
    let key = `Monitor${port}_Resolution`;
    if (data[key] !== undefined) {
      return data[key];
    }
    return;
  }
  setPixelSize(port) {
    let resolution = this.getPixelSize(port);
    if (resolution !== undefined) {
      let size = resolution.split("x");
      let pixelWidth = size[0] / PIXEL_FACTOR + "px";
      let pixelHeight = size[1] / PIXEL_FACTOR + "px";

      return {
        width: pixelWidth,
        height: pixelHeight,
        cursor: this.props.isEditMode ? "pointer" : "default",
      };
    }
  }
  setAllPixelSize() {
    const pixel = [
      ...Array(this.props.data?.NumberOfMonitors ?? 1).keys(),
    ].reduce((res, i) => {
      const port = i + 1;
      const { width, height, cursor } = this.setPixelSize(port);
      res[port] = {
        width,
        height,
        cursor,
      };
      return res;
    }, {});
    this.setState({ pixel: pixel });
  }

  onSelect(screenId) {
    let {
      props: { onSelect, selectedScreenId },
    } = this;
    if (selectedScreenId !== screenId) {
      onSelect(screenId);
    }
  }
  onDragMonitor(e, screenId, monitorId) {
    e.dataTransfer.setData("text/plain", e.target.id);
    e.target.classList.add("drag-item");
    e.target.classList.add(`screen-${screenId}`);
    this.setState({ dragScreenId: screenId, dragMonitorId: monitorId });
  }
  onDragMonitorEnd(e, screenId) {
    e.target.classList.remove("drag-item");
    e.target.classList.remove(`screen-${screenId}`);
    this.setState({ dragScreenId: undefined, dragMonitorId: undefined });
  }
  async onDropMonitor(e) {
    e.preventDefault && e.preventDefault(); 
    e.stopPropagation && e.stopPropagation(); 
    let data = e.dataTransfer.getData("text");
    e.target.classList.remove("drag-hover");
    let selectedSmall = false;
    // switch data
    let selectedItem = data.split("_");
    let selectedScreen = parseInt(selectedItem[0]);
    let selectedMonitor = parseInt(selectedItem[1]);
    let selectedResolution =
      this.props.data[`Monitor${selectedMonitor}_Resolution`];
    let selectedSize = selectedResolution.split("x");
    let selectedWidth = parseInt(selectedSize[0]);
    let selectedHeight = parseInt(selectedSize[1]);
    let selectedPositionX =
      this.props.data[`Monitor${selectedMonitor}_XPosition`];
    let switchItem = e.target.id.split("_");
    let switchScreen = parseInt(switchItem[0]);
    let switchMonitor = parseInt(switchItem[1]);
    let switchResolution =
      this.props.data[`Monitor${switchMonitor}_Resolution`];
    let switchSize = switchResolution.split("x");
    let switchWidth = parseInt(switchSize[0]);
    let switchHeight = parseInt(switchSize[1]);
    let switchPositionX = this.props.data[`Monitor${switchMonitor}_XPosition`];
    if (selectedPositionX < switchPositionX) {
      selectedSmall = true;
    }
    let screens = JSON.parse(JSON.stringify(this.props.screens));
    let idx = 0;
    for await (const _screenId of Object.keys(this.props.screens)) {
      idx = 0;
      for await (const _monitor of this.props.screens[_screenId].monitors) {
        if (_monitor.id === selectedMonitor) {
          if (selectedResolution !== switchResolution) {
            screens[selectedScreen].w = switchWidth;
            screens[selectedScreen].h = switchHeight;
          }
          screens[selectedScreen].monitors[idx].id = switchMonitor;
          screens[selectedScreen].monitors[idx].resolutionW = switchWidth;
          screens[selectedScreen].monitors[idx].resolutionH = switchHeight;
        } else if (_monitor.id === switchMonitor) {
          if (selectedResolution !== switchResolution) {
            screens[switchScreen].w = selectedWidth;
            screens[switchScreen].h = selectedHeight;
          }
          screens[switchScreen].monitors[idx].id = selectedMonitor;
          screens[switchScreen].monitors[idx].resolutionW = selectedWidth;
          screens[switchScreen].monitors[idx].resolutionH = selectedHeight;
        }
        if (selectedSmall) {
          if (
            switchWidth !== selectedWidth &&
            selectedPositionX < _monitor.x &&
            _monitor.x <= switchPositionX
          ) {
            screens[_screenId].x =
              this.props.screens[_screenId].x - selectedWidth + switchWidth;
            screens[_screenId].monitors[idx].x =
              this.props.screens[_screenId].x - selectedWidth + switchWidth;
          }
        } else if (!selectedSmall) {
          if (
            switchWidth !== selectedWidth &&
            switchPositionX < _monitor.x &&
            _monitor.x <= selectedPositionX
          ) {
            screens[_screenId].x =
              this.props.screens[_screenId].x - switchWidth + selectedWidth;
            screens[_screenId].monitors[idx].x =
              this.props.screens[_screenId].x - switchWidth + selectedWidth;
          }
        }
        idx++;
      }
    }
    this.props.onUpdateScreens(screens);
  }
  onHoverMonitor(e, screenId, monitorId, dragScreenId, dragMonitorId) {
    let {
      props: { data, screens },
    } = this;

    if (screens[dragScreenId].monitors.length === 1) {
      if (screens[screenId].monitors.length === 1) {
        e.preventDefault();
        e.target.classList.add("drag-hover");
      } else {
        if (
          data[`Monitor${dragMonitorId}_Resolution`] ===
          data[`Monitor${monitorId}_Resolution`]
        ) {
          e.preventDefault();
          e.target.classList.add("drag-hover");
        }
      }
    } else {
      if (
        data[`Monitor${dragMonitorId}_Resolution`] ===
        data[`Monitor${monitorId}_Resolution`]
      ) {
        e.preventDefault();
        e.target.classList.add("drag-hover");
      }
    }
  }
  onLeaveMonitor(e) {
    e.target.classList.remove("drag-hover");
  }

  render() {
    let {
      props: { data, isGroup, isEditMode, screens, scale },
      state: { pixel, dragScreenId, dragMonitorId },
    } = this;
    return (
      <div className="display-shape-layout">
        {!isGroup && (
          <div
            className={
              "display-shape-content display-scale" + ` scale-${scale * 100}`
            }
          >
            {Object.values(screens).map((screen, screenIdx) => (
              <div
                key={`${screen.displayScreenId}`}
                className={`display-layout-screen screen-${screenIdx + 1}`}
                style={{
                  width: `${screen.w / PIXEL_FACTOR + 6}px`,
                }}
              >
                {screen.monitors.map((monitor) => (
                  <div
                    key={`${monitor.screenId}_${monitor.id}`}
                    className={`display-layout-monitor-cover screen-${
                      screenIdx + 1
                    }`}
                  >
                    <div
                      id={`${screenIdx + 1}_${monitor.id}`}
                      className={`display-layout-monitor border-screen-${
                        screenIdx + 1
                      } ${
                        monitor.resolutionW < 800 && monitor.resolutionH < 600
                          ? "font-size-11"
                          : ""
                      }`}
                      style={pixel[monitor.id]}
                      onClick={() =>
                        this.onSelect(data[`Monitor${monitor.id}_ScreenId`])
                      }
                      draggable={isEditMode ? true : false}
                      onDragStart={(e) =>
                        this.onDragMonitor(e, screenIdx + 1, monitor.id)
                      }
                      onDragEnd={(e) => this.onDragMonitorEnd(e, screenIdx + 1)}
                      onDrop={
                        monitor.id !== dragMonitorId
                          ? (e) => this.onDropMonitor(e)
                          : null
                      }
                      onDragOver={(e) =>
                        monitor.id !== dragMonitorId
                          ? this.onHoverMonitor(
                              e,
                              screenIdx + 1,
                              monitor.id,
                              dragScreenId,
                              dragMonitorId
                            )
                          : null
                      }
                      onDragLeave={
                        monitor.id !== dragMonitorId
                          ? (e) => this.onLeaveMonitor(e)
                          : null
                      }
                    >
                      {monitor.id === data["MainMonitor"] && (
                        <div
                          className="main-monitor"
                          style={
                            monitor.resolutionW < 1024 &&
                            monitor.resolutionH < 768
                              ? { top: "0px", right: "0px" }
                              : {}
                          }
                        ></div>
                      )}
                      {`${toLetter(data[`Monitor${monitor.id}_ScreenId`])}-${
                        monitor.id
                      }`}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }
}
