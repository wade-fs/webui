import React from "react";
import Alert from "../Alert";
import { Modal } from "react-bootstrap";

export default class TabSwitchAlert extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let {
      props: { tab, yes, no },
    } = this;
    let title = `SWITCH TO ${tab.toUpperCase()}`;
    let showModal = true;
    return (
      <Modal id="switch-alert-modal" show={showModal}>
        <Modal.Body>
          <Alert
            type="switch"
            title={title}
            description="Do you want to leave the page? All changes will not be saved."
            yes={() => yes(tab)}
            no={no}
          />
        </Modal.Body>
      </Modal>
    );
  }
}
