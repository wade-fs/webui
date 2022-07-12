import React from "react";
import { WizardField } from "components/Card";
import Counter from "components/Form/Counter";
import Checkbox from "components/Form/Checkbox";

import {
  LoadBalanced,
  CPUMin,
  CPUMax,
  MemMin,
  MemMax,
  LoadBalancedFields,
} from "const/Servers/ServerFieldNames";

export default class LoadBalanceCard extends React.Component {
  constructor(props) {
    super(props);
  }
  change = (e) => {
    let {
      props: { data, onChange },
    } = this;
    if (e.target.name == LoadBalanced) {
      if (e.target.value) {
        if (this.hasNoLoadBalancedFields(data)) {
          data = {
            ...data,
            [CPUMin]: 0,
            [CPUMax]: 0,
            [MemMin]: 0,
            [MemMax]: 0,
          };
        }
      } else {
        data = this.deleteLoadBalanceFields(data);
      }
      onChange(data);
    }
  };
  hasNoLoadBalancedFields(data) {
    let hasFields = true;
    LoadBalancedFields.forEach((field) => {
      if (field == LoadBalanced) return;
      hasFields = hasFields && data.hasOwnProperty(field);
    });
    return !hasFields;
  }
  deleteLoadBalanceFields(data) {
    LoadBalancedFields.forEach((field) => {
      if (field == LoadBalanced) return;
      delete data[field];
    });
    return data;
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
    } = this;
    const counterOption = {
      type: "counter",
      value: 0,
      min: 0,
      max: 100,
      disabled: !data[LoadBalanced],
    };
    return (
      <div className="wrap01 mt-12  wrap-bg-w pb-8 mb-28">
        <h3 className=" border-bottom ">Load Balance Configuration</h3>
        <div className="align-left mt-12">
          {this.getWrapperField(
            "Load Balanced",
            LoadBalanced,
            { type: "checkbox" },
            Checkbox
          )}
          {this.getWrapperField(
            "CPU UTILIZATION (MINIMUM)",
            "CPUMin",
            counterOption,
            Counter
          )}
          {this.getWrapperField(
            "CPU UTILIZATION (MAXIMUM)",
            "CPUMax",
            counterOption,
            Counter
          )}
          {this.getWrapperField(
            "MEMORY UTILIZATION (MINIMUM)",
            "MemMin",
            counterOption,
            Counter
          )}
          {this.getWrapperField(
            "MEMORY UTILIZATION (MAXIMUM)",
            "MemMax",
            counterOption,
            Counter
          )}
        </div>
      </div>
    );
  }
}
