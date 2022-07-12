import React from "react";
import { Modal } from "react-bootstrap";
import { CancelAndConfirm } from "components/Form/Button";
import MouseCard from "components/ControlCard/MouseCard";

export default class MouseButtonMapSettings extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: props.data,
    };
  }

  change = (e) => {
    let {
      state: { data },
    } = this;
    data[e.target.name] = e.target.value;
    this.setState({ data });
  };

  render() {
    let {
      props: { defaultMouseMapping, path, onCancel, onConfirm },
      state: { data },
    } = this;
    return (
      <Modal id="display-mouse-mapping" show={true}>
        <Modal.Body style={{ backgroundColor: "transparent" }}>
          <div className="pop-up-window " style={{ height: "700px" }}>
            <h2 className="mb-22">MOUSE BUTTON MAP SETTINGS</h2>
            <MouseCard
              isEditMode={true}
              format="editor"
              data={data}
              path={path}
              defaultMouseMapping={defaultMouseMapping}
              style={{ maxHeight: "550px", overflow: "auto" }}
              onChange={this.change}
            />
            <CancelAndConfirm
              onConfirm={() => onConfirm(data)}
              onCancel={onCancel}
            />
          </div>
        </Modal.Body>
      </Modal>
    );
  }
}
