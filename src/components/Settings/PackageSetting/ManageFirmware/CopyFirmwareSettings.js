import React, { Fragment } from "react";
import { CancelAndConfirm } from "components/Form/Button";
import { ItemField } from "components/Card";
import { Modal } from "react-bootstrap";

export default class CopyFirmwareSettings extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isEditMode: true,
      data: {},
    };
  }
  getWrapperInput(title, name) {
    let {
      state: { isEditMode, data },
    } = this;
    return (
      <div className="mt-24">
        <label>Package Name</label>
        <ItemField
          isEditMode={isEditMode}
          title={title}
          name={name}
          options={{ value: data[name], ...options }}
          onChange={this.change}
        />
      </div>
    );
  }
  render() {
    let {
      props: { onCancel, onConfirm },
      state: { data },
    } = this;
    return (
      <Modal show={true}>
        <Modal.Body>
          <div className="pop-up-window ">
            <h2 className="mb-22">COPY TO NEW PACKAGE</h2>
            {this.getWrapperInput("Package Name", "Name")}
            <CancelAndConfirm
              canConfirm={data.Name != this.props.data.data.Name}
              onConfirm={() => onConfirm(data)}
              onCancel={onCancel}
            />
          </div>
        </Modal.Body>
      </Modal>
    );
  }
}
