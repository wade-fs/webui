import React, { Fragment } from "react";
import { EditorField } from "components/Card";
import Slider from "components/Form/Slider";
import Select from "components/Form/Select";
import Input from "components/Form/Input";

import { isDefaultObject, positiveNumberValidator } from "lib/Util";

import {
  MaintainAspectRatio,
  ScaleDownOnly,
  UseScreenSize,
  Resolution,
  SessionWidth,
  SessionHeight,
  ResolutionOptions,
} from "const/Applications/ApplicationFieldNames";

import { getAppResolution } from "utils/App";

export default class ScalingResolution extends React.Component {
  constructor(props) {
    super(props);
    const resolution = getAppResolution(props.data);
    this.state = {
      resolution: resolution,
    };
  }

  change = (e) => {
    let {
      props: { data, onChange },
      state: { errorFields },
    } = this;
    data[e.target.name] = e.target.value;
    if (e.target.name == Resolution && e.target.value !== "Custom") {
      const [width, height] = e.target.value.split(" x ");
      data[SessionWidth] = parseInt(width);
      data[SessionHeight] = parseInt(height);
    }
    if (e.target.name == UseScreenSize && e.target.value == false) {
      const resolution = ResolutionOptions[0];
      const [width, height] = resolution.split(" x ");
      data[Resolution] = resolution;
      data[SessionWidth] = parseInt(width);
      data[SessionHeight] = parseInt(height);
    }
    const canApply =
      data[SessionWidth] === "" ||
      data[SessionHeight] === "" ||
      isDefaultObject(errorFields) === false
        ? false
        : true;
    onChange(data, true);
  };

  getWrapperField(title, name, options, Tag) {
    let {
      props: { isEditMode, data },
    } = this;
    const value =
      name === Resolution
        ? `${data[SessionWidth]} x ${data[SessionHeight]}`
        : data[name];
    return (
      <EditorField
        isEditMode={isEditMode}
        title={title}
        name={name}
        options={{ value: value, ...options }}
        Tag={Tag}
        onChange={this.change}
      />
    );
  }

  render() {
    let {
      props: { isLoaded, data },
      state: { resolution },
    } = this;
    return (
      isLoaded && (
        <ul className="editor-content">
          {this.getWrapperField(
            "MAINTAIN ASPECT RATIO",
            MaintainAspectRatio,
            { type: "slider" },
            Slider
          )}
          {this.getWrapperField(
            "SCALE DOWN ONLY",
            ScaleDownOnly,
            { type: "slider" },
            Slider
          )}
          {this.getWrapperField(
            "USE SCREEN RESOLUTION",
            UseScreenSize,
            { type: "slider" },
            Slider
          )}
          {data[UseScreenSize] === false &&
            this.getWrapperField(
              "RESOLUTION",
              Resolution,
              {
                type: "select",
                value:
                  resolution === "Custom"
                    ? "Custom"
                    : data[SessionWidth] !== "" && data[SessionHeight] !== ""
                    ? `${data[SessionWidth]} x ${data[SessionHeight]}`
                    : "1024 x 768",
                options: ResolutionOptions,
                disabled: data[UseScreenSize] === true,
              },
              Select
            )}
          {data[Resolution] === "Custom" &&
            data[UseScreenSize] === false &&
            this.getWrapperField(
              "WIDTH",
              SessionWidth,
              {
                type: "number",
                disabled: data[UseScreenSize] === true,
                value: data[SessionWidth],
                validator: (e) => positiveNumberValidator(e),
                minNumber: 1,
              },
              Input
            )}
          {data[Resolution] === "Custom" &&
            data[UseScreenSize] === false &&
            this.getWrapperField(
              "HEIGHT",
              SessionHeight,
              {
                type: "number",
                disabled: data[UseScreenSize] === true,
                value: data[SessionHeight],
                validator: (e) => positiveNumberValidator(e),
                minNumber: 1,
              },
              Input
            )}
        </ul>
      )
    );
  }
}
