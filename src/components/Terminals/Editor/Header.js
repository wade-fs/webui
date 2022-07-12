import React, { Fragment } from "react";

import { getTerminalStatus } from "utils/Status";
export let terminalStatus = "OFF"; // 主要給 Shadow 用

export default class Header extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let {
      props: { terminal, title, close },
    } = this;
    if (title == null) title = "";
    let termStatus = getTerminalStatus("header", terminal);
    if (termStatus.indexOf("active") != -1) {
      terminalStatus = "ACTIVE";
    } else if (termStatus.indexOf("booting") != -1) {
      terminalStatus = "BOOTING";
    } else if (termStatus.indexOf("error") != -1) {
      terminalStatus = "ERROR";
    } else {
      terminalStatus = "OFF";
    }
    return (
      <header className="editor-header">
        <div
          className="modal-return-icon"
          onClick={close}
          data-dismiss="modal"
          aria-label="Close"
        ></div>
        {title !== "" && (
          <div className={termStatus}></div>
        )}
        <p className="title">{title}</p>
      </header>
    );
  }
}
