import React, { Fragment } from "react";
import { clone } from "lib/Util";

export default class Checkbox extends React.Component {
  constructor(props) {
    super(props);
  }

  toggle = () => {
    let data = clone(this.props);
    data.value = !data.value;
    data.checked = !data.checked;
    this.props.onChange({ target: data });
  };

  render() {
    let {
      props: {
        id,
        name,
        title,
        value = false,
        description,
        labelClass = "",
        inputStyle = {},
        disabled = false,
      },
    } = this;

    return (
      <label className={labelClass + (disabled ? " op-35" : "")}>
        <input
          id={id}
          type="checkbox"
          checked={value == true}
          disabled={disabled}
          name={name}
          onChange={this.toggle}
          style={inputStyle}
        />
        {description == null && <Fragment>{title}</Fragment>}
        {description != null && (
          <Fragment>
            <p>{title}</p> <br /> <p className="maximum">{description}</p>{" "}
          </Fragment>
        )}
      </label>
    );
  }
}
