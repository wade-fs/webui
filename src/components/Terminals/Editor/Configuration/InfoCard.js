import React, { Fragment } from "react";
import { EditorField } from "components/Card";
import Textarea from "components/Form/Textarea";
import AddObjectToGroup from "components/ObjectCommon/AddObjectToGroup";
import Slider from "components/Form/Slider";

import { isDefaultObject, nameValidator } from "lib/Util";

import { DUPLICATE_NAME_ERROR } from "const/Message";
import {
  Name,
  Description,
  ParentId,
  Default,
  isTerminalInfoCompleted,
} from "const/Terminals/TerminalFieldNames";
import {
  NameMaxCount,
  DescriptionMaxCount,
} from "const/Terminals/TerminalConsts";

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
      props: { isGroup, data, objects, objectGroups, onChange, editingId },
      state: { errorFields },
    } = this;
    data[e.target.name] = e.target.value;

    if (e.target.error) {
      console.log("TECI name", e.target.name, "error", e.target.error);
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
        errorFields[e.target.name] = DUPLICATE_NAME_ERROR;
      } else {
        if (e.target.name === ParentId) {
          const isNameValid = nameValidator(data[Name]);
          if (isNameValid == null) delete errorFields[Name];
        } else {
          delete errorFields[Name];
        }
      }
    }
    const canApply =
      isTerminalInfoCompleted(data) && isDefaultObject(errorFields);
    this.setState({ errorFields }, () => {
      onChange(data, canApply);
    });
  };

  getWrapperField(title, name, options, Tag, style) {
    let {
      props: { isEditMode, data },
    } = this;
    return (
      <EditorField
        title={title}
        name={name}
        options={{ value: data[name], ...options }}
        Tag={Tag}
        isEditMode={isEditMode}
        style={style}
        onChange={this.change}
      />
    );
  }

  render() {
    let {
      props: {
        isLoaded,
        isGroup,
        isEditMode,
        data,
        editingId,
        terminalMainTree,
        objectGroups,
      },
      state: { errorFields },
    } = this;
    const nameOptions = {
      value: data[Name],
      max: NameMaxCount,
      showCharacterCounter: true,
      type: "input",
      validator: nameValidator,
      error: errorFields[Name],
      required: true,
    };
    const descriptionOptions = {
      value: data[Description],
      max: DescriptionMaxCount,
      showCharacterCounter: true,
      type: "textarea",
      wrap: true,
    };
    const nameLabel = isGroup ? "TERMINAL GROUP NAME" : "TERMINAL NAME";
    const descriptionLabel = isGroup
      ? "TERMINAL GROUP DESCRIPTION"
      : "TERMINAL DESCRIPTION";

    let parentName = "";
    const parentId = parseInt(data.ParentId);
    if (parentId != null && parentId != 0) {
      parentName = objectGroups.data.find((item) => item.Id === parentId).Name;
    }

    return (
      isLoaded && (
        <ul className="editor-content">
          {this.getWrapperField(nameLabel, Name, nameOptions)}
          <li>
            <label>TERMINAL GROUP</label>
            {!isEditMode && (
              <div>
                <p data-view>{parentName}</p>
              </div>
            )}
            {isEditMode && terminalMainTree?.data != null && (
              <AddObjectToGroup
                isGroup={isGroup}
                editingId={editingId}
                objectGroups={objectGroups}
                mainTree={terminalMainTree}
                treeType="terminalGroup"
                selectGroupName={parentName}
                onConfirm={this.change}
                pickerTitle="CHOOSE EXISTING GROUP"
              />
            )}
          </li>
          {this.getWrapperField(
            descriptionLabel,
            Description,
            descriptionOptions,
            Textarea,
            { width: "fit-content", height: "80px" }
          )}
          {!isGroup &&
            (this.getWrapperField("SET AS DEFAULT TERMINAL", Default, {
              value: data[Default],
              type: "slider",
            }),
            Slider)}
        </ul>
      )
    );
  }
}
