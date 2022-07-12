import React, { Fragment } from "react";

import { getRdsServerStatus } from "utils/Status";

export default class Header extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let {
      props: { title = "", rdsServer, close },
    } = this;

    return (
      <header className="editor-header">
        <div
          className="modal-return-icon"
          onClick={close}
          data-dismiss="modal"
          aria-label="Close"
        ></div>
        {title !== "" && (
          <div className={getRdsServerStatus("header", rdsServer)}></div>
        )}
        <p className="title">{title}</p>
      </header>
    );
  }
}
