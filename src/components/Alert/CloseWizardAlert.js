import React from "react";
import Alert from "../Alert";
import { Modal } from "react-bootstrap";

export default class CloseWizardAlert extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let {
      props: { yes, no },
    } = this;
    const title = "EXIT WIZARD";
    const description =
      "Are you sure you want to exit the wizard without saving?";
    return (
      <Modal show={true}>
        <Modal.Body style={{ backgroundColor: "transparent" }}>
          <Alert
            type="exit"
            title={title}
            description={description}
            yes={yes}
            no={no}
            style={{ backgroundColor: "#C9CACA" }}
          />
        </Modal.Body>
      </Modal>
    );
  }
}
