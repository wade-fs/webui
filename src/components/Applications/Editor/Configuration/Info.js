import React, { Fragment } from "react";
import { Title, EditorField } from "components/Card";
import Select from "components/Form/Select";
import AddObjectToGroup from "components/ObjectCommon/AddObjectToGroup";

import { isDefaultObject, nameValidator } from "lib/Util";

import { Name, ParentId, Tid, Screen } from "const/Applications/ApplicationFieldNames";
import { terminalScreenOptions } from "const/Consts";
import {
  APPLICATION_NAME,
  APPLICATION_GROUP_NAME,
  VNC_NAME,
  VNC_GROUP_NAME
} from "const/Applications/ApplicationConsts";
import { TERMINAL, TERMINAL_SCREEN } from "const/Terminals/TerminalConsts"

import { DUPLICATE_NAME_ERROR } from "const/Message";

import { checkDuplicateName } from "utils/Check";
import { getObjectById } from "utils/Object";

import {
  getTerminalSetting,
  clearTerminalSetting,
} from "actions/TerminalActions";
export default class Info extends React.Component {
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
      console.log("AEC name", e.target.name, "error", e.target.error);
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
    const canApply = data[Name] !== "" && isDefaultObject(errorFields);
    this.setState({ errorFields }, () => {
      onChange(data, canApply);
    });
  };

  changeTerminal = (e) => {
    let {
      props: { data, onChange },
      state: { errorFields }
    } = this;
    data[Tid] = e.target.value;
    this.props.dispatch(getTerminalSetting(data[Tid]));
    if (e.target.error) {
      errorFields[e.target.name] = e.target.error;
    }
    const canApply = data[Name] !== "" && isDefaultObject(errorFields);
    this.setState({ errorFields }, () => {
      onChange(data, canApply);
    });
  }

  getWrapperField(title, name, options, Tag) {
    let {
      props: { isEditMode, data },
    } = this;
    const value = name === "PathType" ? appType : data[name];
    return (
      <EditorField
        isEditMode={isEditMode}
        title={title}
        name={name}
        options={{ value: value, ...options }}
        Tag={Tag}
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
        objects,
        objectGroups,
        applicationMainTree,
        vncs,
        vncGroups,
        vncMainTree,
        subEditorOpened,
        treeTab,
        tab,
        terminalsData
      },
      state: { errorFields },
    } = this;
    const nameTitle = treeTab === 'RDS' ? (isGroup ? APPLICATION_GROUP_NAME : APPLICATION_NAME) : (isGroup ? VNC_GROUP_NAME : VNC_NAME)
    const terminalScreenTitle = TERMINAL_SCREEN;
    const parentId = data[ParentId];
    let parentName = "";
    if (parentId != null && parentId != 0) {
      if (treeTab == "VNC") {
        parentName = vncGroups.data.find((item) => item.Id === parentId).Name;
      } else {
        parentName = objectGroups.data.find((item) => item.Id === parentId).Name;
      }
    }
    let terminalParentName = getObjectById(data[Tid], terminalsData?.terminals)?.Name;
    let mainTree = {};
    if (treeTab !== '') {
      mainTree.data = applicationMainTree.data.filter(item => item.GroupType === treeTab || item.Id === 0);
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
              <label>{treeTab === 'RDS' ? 'APPLICATION GROUP' : 'VNC GROUP'}</label>
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
                  vncGroups={vncGroups}
                  mainTree={mainTree}
                  treeType="appGroup"
                  selectGroupName={parentName}
                  onConfirm={this.change}
                  pickerTitle="CHOOSE EXISTING GROUP"
                />
              )}
            </li>
          )}
          {!subEditorOpened && treeTab === 'VNC' && tab === 'VNC INFO' && (
            <li>
              <label>{TERMINAL}</label>
              {!isEditMode && (
                <div>
                  <p>{terminalParentName}</p>
                </div>
              )}
              {isEditMode && terminalsData?.terminalMainTree?.data != null && (
                <AddObjectToGroup
                  isGroup={isGroup}
                  editingId={editingId}
                  objectGroups={terminalsData?.terminalGroups}
                  mainTree={terminalsData?.terminalMainTree}
                  treeType="terminal"
                  selectTerminalName={terminalParentName}
                  onConfirm={this.changeTerminal}
                  pickerTitle="CHOOSE EXISTING GROUP"
                />
              )}
            </li>
          )}
          {treeTab === 'VNC' && tab === 'VNC INFO' &&
            this.getWrapperField(
              terminalScreenTitle,
              Screen,
              {
                type: "select",
                value: data.Screen ?? '',
                options: terminalScreenOptions,
                required: true
              },
              Select)}
        </ul>
      )
    );
  }
}
