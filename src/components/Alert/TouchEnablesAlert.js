import React from "react";
import Alert from "components/Alert";
import { Modal } from "react-bootstrap";

export default class TouchEnablesAlert extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let {
      props: { tab, yes, no },
    } = this;
    let title = 'Reboot now?';
    let showModal = true;
    return (
      <Modal id="switch-alert-modal" show={showModal}>
        <Modal.Body>
          <Alert
            type="reboot"
            title={title}
            description="Your settings have changed, Please reboot your computer for these changes to take effect."
            yes={() => yes(tab)}
            no={no}
          />
        </Modal.Body>
      </Modal>
    );
  }
}
