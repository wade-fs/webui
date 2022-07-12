import React, { Fragment } from "react";

export default class Textarea extends React.Component {
  constructor(props) {
    super(props);
  }

  onChange = (e) => {
    let { onChange, validator, max } = this.props;
    let hasError = false;
    if (max) {
      if (e.target.value.length > max) {
        hasError = true;
      }
    }
    e.target.error = hasError ? "Maximum exceed" : null;
    if (onChange) onChange(e);
  };

  render() {
    let {
      props: {
        name,
        value,
        type,
        className = "w-180",
        showCharacterCounter = false,
        max,
      },
    } = this;

    return (
      <Fragment>
        <textarea
          type={type}
          className={className}
          id={`u${name}`}
          name={name}
          value={value == null ? "" : value}
          onChange={this.onChange}
        />
        {showCharacterCounter && (
          <span
            className={value != null && value.length > max ? "msg err" : "msg"}
          >
            {value == null ? 0 : value.length}/{max}
          </span>
        )}
      </Fragment>
    );
  }
}
