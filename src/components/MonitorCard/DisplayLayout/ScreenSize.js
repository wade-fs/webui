import React, { Component, Fragment } from "react";
import { EditorField } from "components/Card";
import Select from "components/Form/Select";

import { NumberOfScreens } from "const/Terminals/TerminalFieldNames";

import { toLetter } from "utils/String";

export default class ScreenSize extends Component {
  constructor(props) {
    super(props);
  }

  onSelect(screenId) {
    let {
      props: { onSelect, selectedScreenId },
    } = this;
    if (selectedScreenId !== screenId) {
      onSelect(screenId);
    }
  }

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
        onChange,
      },
    } = this;
    return (
      <Fragment>
        <div className="display-size-options">
          <div className="flex-column">
            <div className="display-item-setting">
              <div className="float-left">
                <div className="display-content-item">SCREENS</div>
              </div>
              <div className="ml-20">
                <select
                  name={NumberOfScreens}
                  onChange={onChange}
                  disabled={!isEditMode}
                  value={data[NumberOfScreens]}
                >
                  {maxPortArray.map((port) => (
                    <option key={port}>{port}</option>
                  ))}
                </select>
              </div>
            </div>
            {!isGroup && (
              <div className="display-item-setting">
                <div className="display-content-item">NUMBER OF MONITORS</div>
                {/* <div className="ml-20">
              <p style={{ marginTop: "6px" }}>{data.NumberOfMonitors}</p>
            </div> */}
              </div>
            )}
          </div>
          <div className="display-screen-select-layout">
            {Object.keys(screens)
              .map((screenId) => parseInt(screenId))
              .map((intScreenId) => (
                <div
                  key={`size_${intScreenId}`}
                  className="display-screen-setting-item"
                  style={{
                    marginLeft: "8px",
                    marginBottom: "20px",
                  }}
                >
                  <div
                    className="display-layout-monitor-select"
                    style={
                      selectedScreenId === intScreenId
                        ? {}
                        : { borderColor: "transparent" }
                    }
                  >
                    <div
                      className={`display-layout-monitor screen-${intScreenId}`}
                      style={{
                        width: "36px",
                        height: "28px",
                        cursor: isEditMode ? "pointer" : "default",
                      }}
                      onClick={() => this.onSelect(intScreenId)}
                    >
                      {toLetter(intScreenId)}
                    </div>
                  </div>
                  {!isGroup && (
                    <select
                      name="NumberOfMonitors"
                      onChange={(e) => onChange(e, intScreenId)}
                      disabled={!isEditMode}
                      value={selectedMonitorArray[intScreenId - 1]}
                    >
                      {maxPortArray
                        .slice(
                          0,
                          maxPort -
                            selectedMonitors +
                            selectedMonitorArray[intScreenId - 1]
                        )
                        .map((port) => (
                          <option key={port}>{port}</option>
                        ))}
                    </select>
                  )}
                </div>
              ))}
          </div>
        </div>
      </Fragment>
    );
  }
}
