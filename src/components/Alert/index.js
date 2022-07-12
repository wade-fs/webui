import React from "react";
import { CancelAndConfirm } from "components/Form/Button";

export default class Alert extends React.Component {
  constructor(props) {
    super(props);
  }

  onYes = () => {
    let { yes } = this.props;
    if (!!yes) yes();
  };
  onNo = () => {
    let { no } = this.props;
    if (!!no) no();
  };

  render() {
    let {
      props: {
        isPermanently,
        title,
        type = "",
        description,
        description2 = "",
        name = "",
      },
    } = this;

    return (
      <div className="checkalert">
        <div className="modal-title-content">{title}</div>
        <div className="content">
          {description}
          <b>{name}</b>
          {isPermanently && " permanently?"}
          {description2 !== "" && (
            <div style={{ marginTop: "6px" }}>{description2}</div>
          )}
        </div>
        <CancelAndConfirm
          type={type === "" ? "DELETE" : type.toUpperCase()}
          onConfirm={this.onYes}
          onCancel={this.onNo}
        />
      </div>
    );
  }
}
