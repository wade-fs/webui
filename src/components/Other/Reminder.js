import React, { Component } from "react";

export default class Reminder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      x: undefined,
      y: undefined,
    };
  }
  componentDidMount() {
    this.getDOMPosition(this.props.domId);
  }
  getDOMPosition(id) {
    const element = document.getElementById(id);
    const selfElement = document.getElementById(id + "_reminder");
    if (element !== null) {
      const domRect = element.getBoundingClientRect();
      const selfDomRect = selfElement.getBoundingClientRect();
      this.setDomPosition(domRect, selfDomRect);
    }
  }
  setDomPosition(domRect, selfDomRect) {
    const x = domRect.left + domRect.width - selfDomRect.width + 32;
    const y = domRect.top + domRect.height + 6;
    this.setState({ x: x, y: y });
  }
  render() {
    let {
      props: { domId, description },
      state: { x, y },
    } = this;
    return (
      <div
        id={domId + "_reminder"}
        className="pop-reminder"
        style={{ left: x, top: y }}
      >
        <div
          className="pop-reminder-arrow-up"
          style={{ marginLeft: "auto", marginRight: "48px" }}
        ></div>
        <div className="pop-reminder-body item-blink">{description}</div>
      </div>
    );
  }
}
