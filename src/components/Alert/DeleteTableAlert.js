import React, { Fragment } from "react";
import { Modal } from "react-bootstrap";
import Alert from "components/Alert";

export default function DeleteTableAlert({
  title,
  tableLayout,
  onClose,
  onConfirm,
}) {
  return (
    <Modal show={true} id="table-alert">
      <Modal.Body>
        <Alert
          title={`DELETE ${title.toUpperCase()}`}
          description={tableLayout}
          yes={onConfirm}
          no={onClose}
        ></Alert>
      </Modal.Body>
    </Modal>
  );
}
