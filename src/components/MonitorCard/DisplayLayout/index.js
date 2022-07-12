import React, { Component, Fragment } from "react";

import ScreenSize from "./ScreenSize";
import ScreenShape from "./ScreenShape";
import { DEFAULT, _1xN, _Mx1, _MxM, _2x3, _3x2, _2x4, _4x2 } from "const/Terminals/Display";

export default class DisplayLayout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      stage: 0,
    };
  }

  onSelect = (screenId) => {
    let {
      props: { onSelect, selectedScreenId },
    } = this;
    if (selectedScreenId !== screenId) {
      onSelect(screenId);
    }
  };
  onNext = (stage) => {
    this.setState({ stage: stage + 1 });
  };
  onBack = (stage) => {
    this.setState({ stage: stage - 1 });
  };
  render() {
    let {
      props: {
        data,
        isGroup,
        isEditMode,
        maxPort,
        maxPortArray,
        screens,
        selectedMonitors,
        selectedMonitorArray,
        selectedScreenId,
        scale,
        onChange,
        onChangeScreenShape,
        onUpdateScreens,
        onShiftAndUpdateData,
        onSelect,
      },
      state: { stage },
    } = this;
    return (
      <div className="display-layout">
        {isEditMode && (
          <div className="display-sort-bar">
            <div className="sort-bar-content">
              <div
                className="display-stage-btn"
                style={{ cursor: isEditMode ? "pointer" : "default" }}
                onClick={() => onChangeScreenShape(DEFAULT)}
              >
                {DEFAULT}
              </div>
            </div>
            <div className="sort-bar-content">
              {screens[selectedScreenId].monitors.length > 1 && (
                <Fragment>
                  <div
                    className="display-sort-shape-btn"
                    style={{ cursor: isEditMode ? "pointer" : "default" }}
                    onClick={() => onChangeScreenShape(_1xN)}
                  >
                    <div className="display-sort-row"></div>
                  </div>
                  <div
                    className="display-sort-shape-btn"
                    style={{ cursor: isEditMode ? "pointer" : "default" }}
                    onClick={() => onChangeScreenShape(_Mx1)}
                  >
                    <div className="display-sort-column"></div>
                  </div>
                </Fragment>
              )}
              {screens[selectedScreenId].monitors.length === 4 && (
                <div
                  className="display-sort-shape-btn"
                  style={{ cursor: isEditMode ? "pointer" : "default" }}
                  onClick={() => onChangeScreenShape(_MxM)}
                >
                  <div className="display-sort-2x2"></div>
                </div>
              )}
              {screens[selectedScreenId].monitors.length === 6 && (
                <Fragment>
                  <div
                    className="display-sort-shape-btn"
                    style={{ cursor: isEditMode ? "pointer" : "default" }}
                    onClick={() => onChangeScreenShape(_2x3)}
                  >
                    <div className="display-sort-2x3"></div>
                  </div>
                  <div
                    className="display-sort-shape-btn"
                    style={{ cursor: isEditMode ? "pointer" : "default" }}
                    onClick={() => onChangeScreenShape(_3x2)}
                  >
                    <div className="display-sort-3x2"></div>
                  </div>
                </Fragment>
              )}
              {screens[selectedScreenId].monitors.length === 8 && (
                <Fragment>
                  <div
                    className="display-sort-shape-btn"
                    style={{ cursor: isEditMode ? "pointer" : "default" }}
                    onClick={() => onChangeScreenShape(_2x4)}
                  >
                    <div className="display-sort-2x4"></div>
                  </div>
                  <div
                    className="display-sort-shape-btn"
                    style={{ cursor: isEditMode ? "pointer" : "default" }}
                    onClick={() => onChangeScreenShape(_4x2)}
                  >
                    <div className="display-sort-4x2"></div>
                  </div>
                </Fragment>
              )}
            </div>
          </div>
        )}
        {stage === 0 && (
          <ScreenSize
            isGroup={isGroup}
            isEditMode={isEditMode}
            onSelect={onSelect}
            screens={screens}
            data={data}
            maxPort={maxPort}
            selectedMonitors={selectedMonitors}
            selectedMonitorArray={selectedMonitorArray}
            maxPortArray={maxPortArray}
            selectedScreenId={selectedScreenId}
            onChange={onChange}
          />
        )}
        {stage === 0 && (
          <ScreenShape
            isGroup={isGroup}
            isEditMode={isEditMode}
            onSelect={onSelect}
            screens={screens}
            data={data}
            maxPort={maxPort}
            selectedMonitors={selectedMonitors}
            selectedMonitorArray={selectedMonitorArray}
            maxPortArray={maxPortArray}
            selectedScreenId={selectedScreenId}
            scale={scale}
            onChange={onChange}
            onChangeScreenShape={onChangeScreenShape}
            onUpdateScreens={onUpdateScreens}
            onShiftAndUpdateData={onShiftAndUpdateData}
          />
        )}
      </div>
    );
  }
}
