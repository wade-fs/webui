import React from "react";
import { clone } from "lib/Util";

export default class Slider extends React.Component {
  constructor(props) {
    super(props);
  }

  no = () => {
    if (this.props.disabled) return;
    let data = clone(this.props);
    data.value = false;
    this.props.onChange({ target: data });
  };
  yes = () => {
    if (this.props.disabled) return;
    let data = clone(this.props);
    data.value = true;
    this.props.onChange({ target: data });
  };

  render() {
    let {
      props: { value, className = "slideline2 w-152", disabled },
    } = this;
    let yesClass =
      value == "YES" || value == "ENABLED" || value == true ? "bg-white" : "";
    let noClass =
      value == "NO" || value == "DISABLED" || value == false ? "bg-white" : "";

    return (
      <div className={className}>
        <ul disabled={disabled}>
          <li className={noClass} onClick={this.no}>
            NO
          </li>
          <li className={yesClass} onClick={this.yes}>
            Yes
          </li>
        </ul>
      </div>
    );
  }
}
