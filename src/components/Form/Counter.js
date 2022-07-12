import React from "react";
import { clone, stringValid } from "lib/Util";

export default class Counter extends React.Component {
  constructor(props) {
    super(props);
  }

  deduct = () => {
    let {
      props: { min, disabled = false },
    } = this;
    if (disabled) return;
    let data = clone(this.props);
    if ((min != null && data.value - 1 >= min) || min == null) {
      data.value--;
    }
    this.props.onChange({ target: data });
  };
  increment = () => {
    let {
      props: { max, disabled = false },
    } = this;
    if (disabled) return;
    let data = clone(this.props);
    if ((max != null && data.value + 1 <= max) || max == null) {
      data.value++;
    }
    this.props.onChange({ target: data });
  };

  render() {
    let {
      props: { value, max, min, disabled = false },
    } = this;

    return (
      <div className="count-bar">
        <div
          className="count-minus"
          disabled={(min != null && value == min) || disabled}
          onClick={value > min ? this.deduct : null}
        ></div>
        <p disabled={disabled}>{value}</p>
        <div
          className="count-add"
          disabled={(max != null && value == max) || disabled}
          onClick={value < max ? this.increment : null}
        ></div>
      </div>
    );
  }
}
