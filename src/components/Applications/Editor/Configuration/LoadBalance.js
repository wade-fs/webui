import React, { Fragment } from "react";
import { EditorField } from "components/Card";
import Counter from "components/Form/Counter";
import Slider from "components/Form/Slider";
import {
  LoadBalanced,
  CPUWeight,
  MemoryWeight,
  SessionWeight,
  EnforcePrimary,
  InstantFailover,
  MinQueueTime,
  MaxQueueTime,
  Infinite,
} from "const/Applications/ApplicationFieldNames";

export default class LoadBalance extends React.Component {
  change = (e) => {
    let {
      props: { data, onChange },
    } = this;
    data[e.target.name] = e.target.value;
    if (e.target.name === "LinkedApp") {
      if (e.target.value === "Desktop") {
        data[e.target.name] = false;
      }
      if (e.target.value === "Application") {
        data[e.target.name] = true;
      }
    }
    onChange(data, true);
  };

  getWrapperField(title, name, options, Tag) {
    let {
      props: { isEditMode, data },
    } = this;
    return (
      <EditorField
        isEditMode={isEditMode}
        title={title}
        name={name}
        options={{ value: data[name], ...options }}
        Tag={Tag}
        onChange={this.change}
      />
    );
  }

  render() {
    let {
      props: { isLoaded, data },
    } = this;
    return (
      isLoaded && (
        <ul className="editor-content">
          {this.getWrapperField(
            "LOAD BALANCE",
            LoadBalanced,
            { type: "slider", disabled: data[EnforcePrimary] },
            Slider
          )}
          {this.getWrapperField(
            "ENFORCE PRIMARY",
            EnforcePrimary,
            { type: "slider", disabled: data[LoadBalanced] },
            Slider
          )}
          {this.getWrapperField(
            "CPU UTILIZATION WEIGHT",
            CPUWeight,
            {
              type: "counter",
              disabled: !data[LoadBalanced],
              min: 0,
              max: 100,
            },
            Counter
          )}
          {this.getWrapperField(
            "MEMORY UTILIZATION WEIGHT",
            MemoryWeight,
            {
              type: "counter",
              disabled: !data[LoadBalanced],
              min: 0,
              max: 100,
            },
            Counter
          )}
          {this.getWrapperField(
            "SESSION WEIGHT",
            SessionWeight,
            {
              type: "counter",
              disabled: !data[LoadBalanced],
              min: 0,
              max: 100,
            },
            Counter
          )}
          {this.getWrapperField(
            "INSTANT FAILOVER",
            InstantFailover,
            { type: "slider" },
            Slider
          )}
          {this.getWrapperField(
            "MINIMUM QUEUE TIME (SECOND)",
            MinQueueTime,
            { type: "counter", min: 0, max: 999 },
            Counter
          )}
          {this.getWrapperField(
            "MAXIMUM QUEUE TIME (SECOND)",
            MaxQueueTime,
            { type: "counter", min: 0, max: 999 },
            Counter
          )}
          {this.getWrapperField(
            "INFINITE ?",
            Infinite,
            { type: "slider" },
            Slider
          )}
        </ul>
      )
    );
  }
}
