import React, { Component } from 'react'
import { ApplyAll, WizardField } from "components/Card";
import {
  getApplyAllProperties,
  getDisabledProperties,
} from "utils/Properties";

import Checkbox from "components/Form/Checkbox";
import Select from "components/Form/Select";
import Counter from "components/Form/Counter"
import MultiSelectButton from 'components/Form/MultiSelectButton';

import { TouchEnabled, TouchVendor, TouchUsb } from "const/Terminals/TerminalFieldNames";
import { VendorOptions } from "const/Terminals/TerminalConsts";

export default class TouchCard extends Component {
  constructor(props) {
    super(props);
    const applyAllProperties = getApplyAllProperties(props.parentTerminal.data);
    const isInherited = Object.keys(applyAllProperties).length > 0;
    const disabledApplyAllProperties = getDisabledProperties(
      props.parentTerminal.data
    );
    this.state = {
      isInherited: isInherited,
      disabledApplyAllProperties: disabledApplyAllProperties,
    };
  }

  change = (e) => {
    let { props: { data, onChange } } = this;
    e.target.title === 'COM Port' ?
      data[e.target.name] = e.target.checked : data[e.target.name] = e.target.value;
    onChange(data);
  };

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
    let { props: { data } } = this;
    const comPortAmountData = Object.entries(data)
      .filter((obj) => obj[0].includes("TouchCom"))
      .map((item) => (
        item.reduce((target, key, index) => {
          index === 0 ? target["name"] = key : target["isTouch"] = key
          return target;
        }, {})));

    return (
      <>
        <div className="wrap01 wrap-bg-w clearfix pb-8">
          <h3 className=" border-bottom h-40">TOUCH</h3>
          <div className="align-left">
            <div style={{ float: "left" }}>
              <div className="mt-24">
                {this.getWrapperField(
                  "TOUCH",
                  TouchEnabled,
                  {
                    type: "checkbox",
                  },
                  Checkbox
                )}
              </div>
              <div className="mt-24">
                {this.getWrapperField(
                  "VENDOR",
                  TouchVendor,
                  {
                    type: "select",
                    options: VendorOptions,
                    value: data[TouchVendor],
                  },
                  Select
                )}
              </div>
              <div className="mt-24">
                {this.getWrapperField(
                  "USB AMOUNT",
                  TouchUsb,
                  {
                    type: "counter",
                    min: 0,
                    max: 8,
                    value: data[TouchUsb],
                  },
                  Counter
                )}
              </div>
              <div className="mt-24">
                <label>COM PORT AMOUNT</label>
                <div className='touch-btn-content'>
                  {comPortAmountData.map((item, idx) => (
                    <MultiSelectButton title='COM Port' name={item.name} styleItem={item.isTouch ? 'touch-btn-active' : 'touch-btn'} onChange={this.change} checked={item.isTouch} idx={idx + 1} key={item.name} isEditMode={true} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    )
  }
}
