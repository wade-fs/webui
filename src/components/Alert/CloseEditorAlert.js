import React from "react";
import { Modal } from "react-bootstrap";

import Alert from "../Alert";

const title = "EXIT EDITOR";
const description = "Are you sure you want to exit the editor without saving?";
export default class CloseEditorAlert extends React.Component {
  render() {
    let { yes, no } = this.props;
    return (
      <Modal id="close-alert-modal" show={true}>
        <Modal.Body style={{ backgroundColor: "transparent" }}>
          <Alert
            type="exit"
            title={title}
            description={description}
            yes={yes}
            no={no}
          />
        </Modal.Body>
      </Modal>
    );
  }
}
