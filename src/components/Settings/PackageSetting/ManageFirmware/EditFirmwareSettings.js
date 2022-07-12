import React, { Fragment } from "react";
import { ItemField } from "components/Card";
import { Modal } from "react-bootstrap";
import { CancelAndConfirm } from "components/Form/Button";

export default class EditFirmwareSettings extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isEditMode: true,
      data: {},
    };
  }

  getWrapperField(title, name) {
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
      props: { onCancel, onConfirm, index },
      state: { data },
    } = this;
    return (
      <Modal show={true}>
        <Modal.Body>
          <div className="pop-up-window ">
            <h2 className="mb-22">RENAME PACKAGE</h2>
            {this.getWrapperField("Package Name", "Name")}
            <CancelAndConfirm
              canConfirm={data.Name != this.props.data.data.Name}
              onConfirm={() => onConfirm(data, index)}
              onCancel={onCancel}
            />
          </div>
        </Modal.Body>
      </Modal>
    );
  }
}
