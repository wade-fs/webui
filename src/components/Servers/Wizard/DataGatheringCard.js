import React, { Fragment } from "react";
import { WizardField } from "components/Card";
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

const ratioOptions = { type: "radio" };

export default class DataGatheringCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      intervalMode: Fast,
    };
  }

  componentDidMount() {
    this.setIntervalMode(this.props.data);
  }

  change = (e) => {
    let {
      props: { data, onChange },
    } = this;
    data[e.target.name] = e.target.value;
    if (e.target.name != "IntervalMode") {
      // if (e.target.name == LoadBalanced) {
      //   if (e.target.value == false || e.target.value == "NO") {
      //     delete data[ServerUpdate];
      //   }
      // }
      onChange(data);
      return;
    }
    this.setState({
      intervalMode: e.target.value,
    });
    const smartSessionEnabled =
      data[LoadBalanced] == "YES" || data[LoadBalanced] == true;
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
    onChange(data);
  };

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

  getWrapperField(title, name, options, Tag) {
    let {
      props: { data },
    } = this;
    return (
      <WizardField
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
      props: { data },
      state: { intervalMode },
    } = this;

    const isNotInCustomMode = intervalMode !== Custom;

    return (
      <div className="wrap01 mt-12  wrap-bg-w pb-8 mb-28">
        <h3 className=" border-bottom ">DATA GATHERING</h3>
        <div className="align-left mt-4">
          <label for="">Intervals Mode</label>
          <div className="inline-flex">
            <RadioButton
              title={Fast}
              name={IntervalMode}
              value={intervalMode}
              selectedValue={Fast}
              {...ratioOptions}
              onChange={this.change}
            />
            <RadioButton
              title={Medium}
              name={IntervalMode}
              value={intervalMode}
              selectedValue={Medium}
              {...ratioOptions}
              onChange={this.change}
            />
            <RadioButton
              title={Slow}
              name={IntervalMode}
              value={intervalMode}
              selectedValue={Slow}
              {...ratioOptions}
              onChange={this.change}
            />
            <RadioButton
              title={Custom}
              name={IntervalMode}
              value={intervalMode}
              selectedValue={Custom}
              {...ratioOptions}
              onChange={this.change}
            />
          </div>
          {(data[LoadBalanced] == "YES" || data[LoadBalanced] == true) &&
            this.getWrapperField(
              "Load Balanced Data Update Interval (seconds)",
              ServerUpdate,
              {
                type: "counter",
                min: 0,
                max: 999,
                disabled: isNotInCustomMode,
              },
              Counter
            )}

          {this.getWrapperField(
            "Process Update Interval (seconds)",
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
            "Session Update Interval (seconds)",
            SessionUpdate,
            {
              type: "counter",
              min: 0,
              max: 999,
              disabled: isNotInCustomMode,
            },
            Counter
          )}
        </div>
      </div>
    );
  }
}
