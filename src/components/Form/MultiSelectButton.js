import React, { Component } from 'react'
import { clone } from "lib/Util";

export default class MultiSelectButton extends Component {
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
    let { props: { title, styleItem, isTouch, idx, isEditMode } } = this;
    return (
      <button className={styleItem} onClick={this.toggle} checked={isTouch} disabled={!isEditMode}>
        <div key={title}>{title}</div>
        <div>{idx}</div>
      </button>
    )
  }
}
