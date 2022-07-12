import React, { Fragment } from "react";
import { EditorField } from "components/Card";
import RadioButton from "components/Form/RadioButton";
import Counter from "components/Form/Counter";

import { Fast, Medium, Slow, Custom } from "const/Servers/ServerConsts";
import {
  IntervalMode,
  LoadBalanced,
  ServerUpdate,
  SessionUpdate,
  ProcessUpdate,
} from "const/Servers/ServerFieldNames";

export default class DataGatheringCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      intervalMode: Fast,
    };
  }
  componentDidUpdate(prevProps) {
    // check cancel
    if (prevProps.data !== this.props.data) {
      this.setIntervalMode(this.props.data);
    }
  }
  change = (e) => {
    let {
      props: { data, onChange },
      state: { intervalMode },
    } = this;
    const smartSessionEnabled =
      data[LoadBalanced] == "YES" || data[LoadBalanced] == true;
    if (e.target.name === IntervalMode) {
      intervalMode = e.target.value;
      switch (e.target.value) {
        case Fast:
          if (smartSessionEnabled) {
            data[ServerUpdate] = 8;
          }
          data[ProcessUpdate] = 5;
          data[SessionUpdate] = 8;
          break;
        case Medium:
          if (smartSessionEnabled) {
            data[ServerUpdate] = 10;
          }
          data[ProcessUpdate] = 8;
          data[SessionUpdate] = 12;
          break;
        case Slow:
          if (smartSessionEnabled) {
            data[ServerUpdate] = 15;
          }
          data[ProcessUpdate] = 10;
          data[SessionUpdate] = 15;
          break;
        default:
          break;
      }
    } else {
      data[e.target.name] = e.target.value;
    }
    this.setState({ intervalMode }, () => {
      onChange(data, true);
    });
  };

  getWrapperField(title, name, options, Tag) {
    let {
      props: { isEditMode, data },
    } = this;
    return (
      <EditorField
        title={title}
        name={name}
        options={{ value: data[name], ...options }}
        Tag={Tag}
        isEditMode={isEditMode}
        onChange={this.change}
      />
    );
  }

  setIntervalMode(data) {
    let {
      state: { intervalMode },
    } = this;

    if (data[ProcessUpdate] == 5 && data[SessionUpdate] == 8) {
      intervalMode = Fast;
    } else if (data[ProcessUpdate] == 8 && data[SessionUpdate] == 12) {
      intervalMode = Medium;
    } else if (data[ProcessUpdate] == 10 && data[SessionUpdate] == 15) {
      intervalMode = Slow;
    } else {
      intervalMode = Custom;
    }
    this.setState({ intervalMode });
  }

  render() {
    let {
      props: { isLoaded, isEditMode, data },
      state: { intervalMode },
    } = this;

    const isNotInCustomMode = intervalMode !== Custom;

    return (
      isLoaded && (
        <ul className="editor-content">
          <li>
            <label>INTERVALS MODE</label>
            {!isEditMode && <p data-view>{intervalMode}</p>}
            {isEditMode && (
              <div className="flex mt-8">
                <RadioButton
                  title={Fast}
                  name={IntervalMode}
                  value={intervalMode}
                  selectedValue={Fast}
                  onChange={this.change}
                />
                <RadioButton
                  title={Medium}
                  name={IntervalMode}
                  value={intervalMode}
                  selectedValue={Medium}
                  onChange={this.change}
                />
                <RadioButton
                  title={Slow}
                  name={IntervalMode}
                  value={intervalMode}
                  selectedValue={Slow}
                  onChange={this.change}
                />
                <RadioButton
                  title={Custom}
                  name={IntervalMode}
                  value={intervalMode}
                  selectedValue={Custom}
                  onChange={this.change}
                />
              </div>
            )}
          </li>
          {(data[LoadBalanced] == "YES" || data[LoadBalanced] == true) &&
            this.getWrapperField(
              "LOAD BALANCED DATA UPDATE INTERVAL",
              ServerUpdate,
              { type: "counter", min: 0, max: 999 },
              Counter
            )}
          {this.getWrapperField(
            "PROCESS UPDATE INTERVAL",
            ProcessUpdate,
            {
              type: "counter",
              min: 0,
              max: 999,
              disabled: isNotInCustomMode,
            },
            Counter
          )}
          {this.getWrapperField(
            "SESSION UPDATE INTERVAL",
            SessionUpdate,
            {
              type: "counter",
              min: 0,
              max: 999,
              disabled: isNotInCustomMode,
            },
            Counter
          )}
        </ul>
      )
    );
  }
}
