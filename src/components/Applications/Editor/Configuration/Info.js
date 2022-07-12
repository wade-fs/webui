import React, { Fragment } from "react";
import { Title, EditorField } from "components/Card";
import AddObjectToGroup from "components/ObjectCommon/AddObjectToGroup";

import { isDefaultObject, nameValidator } from "lib/Util";

import { Name, ParentId } from "const/Applications/ApplicationFieldNames";
import {
  APPLICATION_NAME,
  APPLICATION_GROUP_NAME,
} from "const/Applications/ApplicationConsts";

import { DUPLICATE_NAME_ERROR } from "const/Message";

import { checkDuplicateName } from "utils/Check";

export default class Info extends React.Component {
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
    if (e.target.name === Name || e.target.name === ParentId) {
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
        isGroup,
        data,
        editingId,
        objectGroups,
        applicationMainTree,
        subEditorOpened,
      },
      state: { errorFields },
    } = this;

    const nameTitle = isGroup ? APPLICATION_GROUP_NAME : APPLICATION_NAME;
    const parentId = data[ParentId];
    let parentName = "";
    if (parentId != null && parentId != 0) {
      parentName = objectGroups.data.find((item) => item.Id === parentId).Name;
    }

    return (
      isLoaded && (
        <ul className="editor-content">
          {this.getWrapperField(nameTitle, Name, {
            type: "text",
            error: errorFields[Name],
            required: true,
            max: 20,
            showCharacterCounter: true,
            validator: nameValidator,
          })}
          {!subEditorOpened && (
            <li>
              <label>APPLICATION GROUP</label>
              {!isEditMode && (
                <div>
                  <p>{parentName}</p>
                </div>
              )}
              {isEditMode && applicationMainTree?.data != null && (
                <AddObjectToGroup
                  isGroup={isGroup}
                  editingId={editingId}
                  objectGroups={objectGroups}
                  mainTree={applicationMainTree}
                  treeType="appGroup"
                  selectGroupName={parentName}
                  onConfirm={this.change}
                  pickerTitle="CHOOSE EXISTING GROUP"
                />
              )}
            </li>
          )}
        </ul>
      )
    );
  }
}
