import React, { Component } from 'react'

import { EditorField, ApplyAll } from "components/Card";
import Slider from "components/Form/Slider";
import Select from "components/Form/Select";
import Counter from "components/Form/Counter";
import MultiSelectButton from 'components/Form/MultiSelectButton';

import { TouchEnabled, TouchVendor, TouchUsb } from "const/Terminals/TerminalFieldNames";
import { VendorOptions } from "const/Terminals/TerminalConsts";

export default class TouchCard extends Component {
  constructor(props) {
    super(props);
  }

  change = (e) => {
    let { props: { data, onChange } } = this;
    e.target.title === 'COM Port' ?
      data[e.target.name] = e.target.checked : data[e.target.name] = e.target.value;
    onChange(data, true);
  };

  getWrapperField(title, name, options, Tag, style) {
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
        style={style}
        onChange={this.change}
      />
    );
  }

  render() {
    let { props: { data, isEditMode } } = this;
    const comPortAmountData = Object.entries(data)
      .filter((obj) => obj[0].includes("TouchCom"))
      .map((item) => (
        item.reduce((target, key, index) => {
          index === 0 ? target["name"] = key : target["isTouch"] = key
          return target;
        }, {})));

    return (
      <ul className="editor-content">
        {this.getWrapperField(
          "TOUCH",
          TouchEnabled,
          {
            value: data[TouchEnabled],
            type: "slider",
          },
          Slider
        )}
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
        <li>
          <div className="mt-24">
            <label>COM PORT AMOUNT</label>
            <div className='touch-btn-content'>
              {comPortAmountData.map((item, idx) => (
                <MultiSelectButton title='COM Port' name={item.name} styleItem={item.isTouch ? 'touch-btn-active' : 'touch-btn'} onChange={this.change} checked={item.isTouch} idx={idx + 1} key={item.name} isEditMode={isEditMode} />
              ))}
            </div>
          </div>
        </li>
      </ul>
    )
  }
}
