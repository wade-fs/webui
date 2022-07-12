import React, { Fragment } from "react";
import { Modal } from "react-bootstrap";
import { CancelAndConfirm } from "components/Form/Button";
import { WizardField } from "components/Card";
import Checkbox from "components/Form/Checkbox";

export default class MultistationSettings extends React.Component {
  constructor(props) {
    super(props);
    const data = { ...props.data };
    this.state = {
      data: data,
    };
  }
  onConfirm = () => {
    let {
      props: { onConfirm },
      state: { data },
    } = this;
    if (!!onConfirm) {
      onConfirm(data);
    }
  };
  onCancel = () => {
    let {
      props: { onCancel },
    } = this;
    if (!!onCancel) {
      onCancel();
    }
  };

  getWrapperField(title, name, options, Tag) {
    let {
      state: { data },
    } = this;
    return (
      <WizardField
        title={title}
        name={name}
        options={{ value: data[name], ...options }}
        Tag={Tag}
        onChange={this.change}
      />
    );
  }

  render() {
    let {
      props: { screenId },
    } = this;
    let fieldPrefix = `Screen${parseInt(screenId)}`;
    return (
      <Modal show={true}>
        <Modal.Body style={{ backgroundColor: "transparent" }}>
          <div className="pop-up-window ">
            <h2 className="mb-22">MULTISTATION SETTINGS</h2>
            <div className="align-left">
              {this.getWrapperField(
                "Station has a keyboard",
                fieldPrefix + "_Use_Keyboard",
                { type: "checkbox" },
                Checkbox
              )}
              {this.getWrapperField(
                "Station has a mouse",
                fieldPrefix + "_Use_Mouse",
                { tyhpe: "checkbox" },
                Checkbox
              )}
              {this.getWrapperField(
                "Screen edge application selection",
                fieldPrefix + "_Edge_Application",
                { type: "checkbox" },
                Checkbox
              )}
            </div>
            <CancelAndConfirm
              onConfirm={this.onConfirm}
              onCancel={this.onCancel}
            />
          </div>
        </Modal.Body>
      </Modal>
    );
  }
}
