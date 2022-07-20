import React, { Fragment } from "react";

import { getTerminalStatus } from "utils/Status";
export let terminalStatus = "F"; // 主要給 Shadow 用

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
    // TODO 這邊的優先順序需要確認
    if (termStatus.indexOf("active") != -1) {
      terminalStatus = "A";
    } else if (termStatus.indexOf("booting") != -1) {
      terminalStatus = "B";
    } else if (termStatus.indexOf("error") != -1) {
      terminalStatus = "E";
    } else {
      terminalStatus = "F";
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
