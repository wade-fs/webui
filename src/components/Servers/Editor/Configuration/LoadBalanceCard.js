import React, { Fragment } from "react";
import { EditorField } from "components/Card";
import Counter from "components/Form/Counter";
import Slider from "components/Form/Slider";

export default class LoadBalanceCard extends React.Component {
  constructor(props) {
    super(props);
  }

  change = (e) => {
    let {
      props: { data, onChange },
    } = this;
    data[e.target.name] = e.target.value;
    onChange(data, true);
  };

  render() {
    let {
      props: { isLoaded, data },
    } = this;

    return (
      isLoaded && (
        <ul className="editor-content">
          <div>SUPPORTED CONNECTION TYPES</div>
          {this.getWrapperField(
            "LOAD BALANCE",
            "LoadBalanced",
            { type: "slider" },
            Slider
          )}
          {data["LoadBalanced"] === 1 && (
            <Fragment>
              {this.getWrapperField(
                "CPU UTILIZATION (MINIMUM)",
                "CPUMin",
                { type: "counter", unit: "%", min: 0, max: 100 },
                Counter
              )}
              {this.getWrapperField(
                "MEMORY UTILIZATION (MINIMUM)",
                "MemMin",
                { type: "counter", unit: "%", min: 0, max: 100 },
                Counter
              )}
            </Fragment>
          )}
          {data["LoadBalanced"] === 1 && (
            <Fragment>
              {this.getWrapperField(
                "CPU UTILIZATION (MAXIMUM)",
                "CPUMax",
                { type: "counter", unit: "%", min: 0, max: 100 },
                Counter
              )}
              {this.getWrapperField(
                "MEMORY UTILIZATION (MAXIMUM)",
                "MemMax",
                { type: "counter", unit: "%", min: 0, max: 100 },
                Counter
              )}
            </Fragment>
          )}
        </ul>
      )
    );
  }
}
