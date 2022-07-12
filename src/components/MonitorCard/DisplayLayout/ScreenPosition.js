import React, { Component } from "react";

import { toLetter } from "utils/String";

const PIXEL_FACTOR = 16;

export default class ScreenPosition extends Component {
  constructor(props) {
    super(props);
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

      return { width: pixelWidth, height: pixelHeight };
    }
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
      props: { data, screens, selectedScreenId },
    } = this;
    return (
      <div style={{ display: "flex" }}>
        {Object.values(screens).map((screen) => (
          <div
            key={screen.displayScreenId}
            className="display-layout-screen"
            style={{
              width: `${screen.w / PIXEL_FACTOR}px`,
            }}
          >
            {screen.monitors.map((monitor) => (
              <div
                className={
                  "display-layout-monitor" +
                  (selectedScreenId === data[`Monitor${monitor.id}_ScreenId`]
                    ? " display-selected"
                    : "")
                }
                style={this.setPixelSize(monitor.id)}
                onClick={() =>
                  this.onSelect(data[`Monitor${monitor.id}_ScreenId`])
                }
              >
                {`${toLetter(data[`Monitor${monitor.id}_ScreenId`])}-${
                  monitor.id
                }`}
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  }
}
