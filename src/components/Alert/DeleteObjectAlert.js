import React from "react";
import Alert from "../Alert";
import { Modal } from "react-bootstrap";

export default class DeleteObjectAlert extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let {
      props: {
        isPermanently = true,
        description = "Are you sure to delete ",
        description2 = isPermanently === true
          ? "This action will not be able to revert!"
          : "",
        objectName,
        objectType,
        yes,
        no,
      },
    } = this;
    const title = `DELETE ${objectType.toUpperCase()}`;
    return (
      <Modal show={true} backdrop={true}>
        <Modal.Body style={{ backgroundColor: "transparent" }}>
          <Alert
            isPermanently={isPermanently}
            title={title}
            description={description}
            description2={description2}
            name={objectName}
            yes={yes}
            no={no}
            style={{ backgroundColor: "#C9CACA" }}
          />
        </Modal.Body>
      </Modal>
    );
  }
}
