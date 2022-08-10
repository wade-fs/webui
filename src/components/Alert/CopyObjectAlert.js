import React, { Fragment } from "react";
import { Modal } from "react-bootstrap";
import { CancelAndConfirm } from "components/Form/Button";
import { WizardField } from "components/Card";
import AddObjectToGroup from "../ObjectCommon/AddObjectToGroup";

import { stringValid, isDefaultObject, nameValidator } from "lib/Util";

import { Name, ParentId } from "const/Terminals/TerminalFieldNames";
import { DUPLICATE_NAME_ERROR } from "const/Message";

import { checkDuplicateName } from "utils/Check";
import { getObjectById } from "utils/Object";

export default class CopyObjectAlert extends React.Component {
  constructor(props) {
    const data = {
      ParentId: props.parentId,
    };
    super(props);
    this.state = {
      data: data,
      errorFields: {},
    };
  }
  change = (e) => {
    let {
      props: { isGroup, objects, objectGroups, editingId },
      state: { data, errorFields },
    } = this;
    data[e.target.name] = e.target.value;

    if (e.target.error) {
      console.log("AC name", e.target.name, "error", e.target.error);
      errorFields[e.target.name] = e.target.error;
    } else {
      delete errorFields[e.target.name];
    }
    if (e.target.name === Name || e.target.name === ParentId) {
      const hasDuplicateName = checkDuplicateName(
        editingId,
        data[Name],
        data[ParentId],
        isGroup === false ? objects : objectGroups
      );
      if (hasDuplicateName) {
        errorFields[Name] = DUPLICATE_NAME_ERROR;
      } else {
        if (e.target.name === ParentId) {
          const isNameValid = nameValidator(data[Name]);
          if (isNameValid == null) delete errorFields[Name];
        } else {
          delete errorFields[Name];
        }
      }
    }
    this.setState({ data, errorFields });
  };
  confirm = () => {
    let {
      props: { confirm },
      state: { data },
    } = this;

    if (!stringValid(data[Name])) return;
    if (!!confirm) {
      let newObject = { Name: data[Name] };
      if (data.hasOwnProperty(ParentId)) {
        newObject[ParentId] = data[ParentId];
      }
      confirm(newObject);
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
      props: {
        treeType,
        objectType,
        objectName,
        objects,
        objectGroups,
        mainTree,
        vncMainTree,
        cancel,
        pickerTitle,
        isGroup,
      },
      state: { data, errorFields },
    } = this;
    const parentName = getObjectById(data[ParentId], objectGroups)?.Name;
    const canConfirm = isDefaultObject(errorFields) && stringValid(data[Name]);
    return (
      <Modal id="copy-modal" show={true}>
        <Modal.Body style={{ backgroundColor: "transparent" }}>
          <div className="pop-up-window">
            <h2 className="mb-22">COPY FROM {objectName}</h2>
            {this.getWrapperField(
              `New ${objectType}${isGroup ? " Group" : ""} Name`,
              Name,
              {
                type: "text",
                className: "w-240",
                validator: nameValidator,
                max: 20,
                required: true,
                showCharacterCounter: true,
                error: errorFields[Name],
              }
            )}
            <div className="pt-24 pb-24">
              <label>
                {isGroup ? "Parent " : ""}
                {objectType} Group
              </label>
              <AddObjectToGroup
                mainTree={mainTree}
                vncMainTree={vncMainTree}
                objects={objects}
                objectGroups={objectGroups}
                treeType={treeType}
                pickerTitle={pickerTitle}
                selectGroupName={parentName}
                onConfirm={this.change}
              />
            </div>
            <CancelAndConfirm
              canConfirm={canConfirm}
              onConfirm={this.confirm}
              onCancel={cancel}
            />
          </div>
        </Modal.Body>
      </Modal>
    );
  }
}
