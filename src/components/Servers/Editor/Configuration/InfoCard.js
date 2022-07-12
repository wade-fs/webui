import React, { Fragment } from "react";
import { EditorField } from "components/Card";
import AddObjectToGroup from "components/ObjectCommon/AddObjectToGroup";

import { isDefaultObject, ipValid, nameValidator } from "lib/Util";

import { DUPLICATE_NAME_ERROR } from "const/Message";
import { Name, ParentId, IPAddress } from "const/Servers/ServerFieldNames";

import { checkDuplicateName } from "utils/Check";

export default class InfoCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      errorFields: {},
    };
  }
  change = (e) => {
    let {
      props: { isGroup, data, objects, objectGroups, onChange },
      state: { errorFields },
    } = this;
    data[e.target.name] = e.target.value;
    const hasDuplicateName = checkDuplicateName(
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
    if (e.target.error) {
      errorFields[e.target.name] = e.target.error;
    }
    const canApply = data[Name] !== "" && isDefaultObject(errorFields);
    this.setState({ errorFields }, () => {
      onChange(data, canApply);
    });
  };

  getWrapperField(title, name, options) {
    let {
      props: { isEditMode, data },
    } = this;
    return (
      <EditorField
        isEditMode={isEditMode}
        title={title}
        name={name}
        options={{ value: data[name], ...options }}
        onChange={this.change}
      />
    );
  }

  render() {
    let {
      props: {
        isLoaded,
        isEditMode,
        data,
        isGroup,
        editingId,
        serverMainTree,
        objectGroups,
      },
      state: { errorFields },
    } = this;
    const nameOptions = {
      max: 20,
      showCharacterCounter: true,
      type: "text",
      validator: nameValidator,
      required: true,
      error: errorFields[Name],
    };
    const ipOptions = {
      showCharacterCounter: false,
      type: "text",
      validator: (e) => ipValid(e, false),
      required: false,
    };
    const parentId = data.ParentId;
    let parentName = "";
    if (parentId != null && parentId != 0) {
      parentName = objectGroups.data.find((item) => item.Id === parentId).Name;
    }

    return (
      isLoaded && (
        <ul className="editor-content">
          {this.getWrapperField("SERVER NAME", Name, nameOptions)}
          <li>
            <label>SERVER GROUP</label>
            {!isEditMode && (
              <div>
                <p data-view>{parentName}</p>
              </div>
            )}
            {isEditMode && serverMainTree?.data != null && (
              <AddObjectToGroup
                isGroup={isGroup}
                editingId={editingId}
                objectGroups={objectGroups}
                mainTree={serverMainTree}
                treeType="appServerGroup"
                selectGroupName={parentName}
                onConfirm={this.change}
                pickerTitle="CHOOSE EXISTING GROUP"
              />
            )}
          </li>
          {!isGroup && this.getWrapperField("IP ADDRESS", IPAddress, ipOptions)}
        </ul>
      )
    );
  }
}
