import React, { Fragment } from "react";

export default class Spinner extends React.Component {
  render() {
    let {
      props: { styles },
    } = this;
    return (
      <div className="lightbox_bg-2" style={{ zIndex: "5555", ...styles }}>
        <div className="spinner"></div>
      </div>
    );
  }
}
