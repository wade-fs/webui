import React, { Fragment } from "react";
import { getAppStatus } from "utils/Status";

export default class Header extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let {
      props: { title = "", app, style = {}, close },
    } = this;
    return (
      <header className="editor-header" style={style}>
        <div
          className="modal-return-icon"
          onClick={close}
          data-dismiss="modal"
          aria-label="Close"
        ></div>
        {title !== "" && <div className={getAppStatus("header", app)}></div>}
        <p className="title">{title}</p>
      </header>
    );
  }
}
