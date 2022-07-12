import React from "react";
import { clone } from "lib/Util";

export default class RadioButton extends React.Component {
  constructor(props) {
    super(props);
  }

  toggle = () => {
    let data = clone(this.props);
    data.value =
      this.props.selectedValue == null
        ? this.props.title
        : this.props.selectedValue;
    this.props.onChange({ target: data });
  };

  render() {
    let {
      props: {
        title,
        value,
        selectedValue,
        labelClass = "",
        style = {},
        inputStyle = {},
        disabled = false,
        inputClass = "",
      },
    } = this;

    if (selectedValue == null) selectedValue = title;

    return (
      <label className={labelClass + (disabled ? " op-35" : "")} style={style}>
        <input
          type="radio"
          className={inputClass}
          checked={value == selectedValue}
          onChange={this.toggle}
          disabled={disabled}
          style={inputStyle}
        />
        {title}
      </label>
    );
  }
}
