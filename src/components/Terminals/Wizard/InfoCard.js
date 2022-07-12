import React, { Fragment } from "react";
import { ItemField, WizardField } from "components/Card";
import Input from "components/Form/Input";
import Textarea from "components/Form/Textarea";
import RadioButton from "components/Form/RadioButton";
import AddObjectToGroup from "components/ObjectCommon/AddObjectToGroup";

import {
  getTerminalSetting,
  clearTerminalSetting,
} from "actions/TerminalActions";

import { nameValidator } from "lib/Util";

import {
  Name,
  Description,
  ParentId,
  CopySettingFrom,
  CopyTerminalId,
} from "const/Terminals/TerminalFieldNames";
import {
  NameLabel,
  GroupNameLabel,
  NameInfo,
  DescriptionLabel,
  GroupDescriptionLabel,
  DescriptionInfo,
  NameMaxCount,
  DescriptionMaxCount,
  BasicInfoTitle,
  UseSettingsFromTitle,
} from "const/Terminals/TerminalConsts";
import {
  TERMINAL_WIZARD_DEFAULT,
  TERMINAL_WIZARD_COPY,
  TERMINAL_WIZARD_NONE,
  DUPLICATE_NAME_ERROR,
} from "const/Message";

import { checkDuplicateName } from "utils/Check";
import { getObjectById } from "utils/Object";

export default class InfoCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      copyType: "None",
    };
  }

  change = (e) => {
    let {
      props: {
        dispatch,
        isGroup,
        data,
        errorFields,
        objects,
        objectGroups,
        onChange,
        handleErrorFields,
      },
    } = this;
    data[e.target.name] = e.target.value;
    if (e.target.name == CopySettingFrom) {
      this.setState({ copyType: e.target.value });
      if (e.target.value === "Default") {
        data[CopyTerminalId] = 0;
        delete data[ParentId];
        dispatch(getTerminalSetting(data[CopyTerminalId]));
      } else if (e.target.value === "None" || e.target.value === "Terminal") {
        delete data[CopyTerminalId];
        delete data[ParentId];
        dispatch(clearTerminalSetting());
      }
    } else if (e.target.name === CopyTerminalId) {
      if (data[CopySettingFrom] == "Terminal") {
        dispatch(getTerminalSetting(data[CopyTerminalId]));
      }
    } else if (e.target.name === Name || e.target.name === ParentId) {
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
    onChange(data);
    handleErrorFields(errorFields);
  };

  getWrapperField(title, name, options, Tag, description) {
    let {
      props: { data },
    } = this;
    return (
      <WizardField
        title={title}
        name={name}
        options={{ value: data[name], ...options }}
        Tag={Tag}
        // description={description}
        onChange={this.change}
      />
    );
  }

  basicInfoCard() {
    let {
      props: { isGroup, data, errorFields, objectGroups, terminalMainTree },
    } = this;
    const nameLabel = isGroup ? GroupNameLabel : NameLabel;
    const disabled =
      (data.CopyTerminalId === 0 || data.CopyTerminalId == null) &&
      data.CopySettingFrom === "Terminal"
        ? true
        : false;
    const nameOptions = {
      max: NameMaxCount,
      showCharacterCounter: true,
      type: "input",
      validator: nameValidator,
      required: true,
      error: errorFields[Name],
    };

    const descriptionLabel = isGroup ? GroupDescriptionLabel : DescriptionLabel;
    const descriptionOptions = {
      max: DescriptionMaxCount,
      showCharacterCounter: true,
      type: "textarea",
    };

    const parentName = getObjectById(data[ParentId], objectGroups)?.Name;

    return (
      <div className="wrap01 mt-12 wrap-bg-w">
        <h3 className="border-bottom">{BasicInfoTitle}</h3>
        <div className="mt-12">
          {this.getWrapperField(nameLabel, Name, nameOptions, Input, NameInfo)}
        </div>
        <div className="mt-12">
          {this.getWrapperField(
            descriptionLabel,
            Description,
            descriptionOptions,
            Textarea,
            DescriptionInfo
          )}
        </div>
        <div className="mt-12">
          <label> Terminal Group </label>
          <AddObjectToGroup
            isGroup={isGroup}
            mainTree={terminalMainTree}
            objectGroups={objectGroups}
            treeType="terminalGroup"
            disabled={disabled}
            selectGroupName={parentName}
            onConfirm={this.change}
            pickerTitle="CHOOSE EXISTING GROUP"
          />
        </div>
      </div>
    );
  }
  copySettings() {
    let {
      props: { data, objects, objectGroups, terminalMainTree },
      state: { copyType },
    } = this;
    const fromDefaultTerminal = `1. ${TERMINAL_WIZARD_DEFAULT}`;
    let fromOtherTerminal = `2. ${TERMINAL_WIZARD_COPY}`;
    let fromNone = `3. ${TERMINAL_WIZARD_NONE}`;
    let hasDefault = false;
    let copyName = getObjectById(data[CopyTerminalId], objects)?.Name;
    objects.data.forEach((item) => {
      if (item.Default) {
        hasDefault = true;
      }
    });
    if (!hasDefault) {
      fromOtherTerminal = `1. ${TERMINAL_WIZARD_COPY}`;
      fromNone = `2. ${TERMINAL_WIZARD_NONE}`;
    }
    return (
      <div className="wrap01 wrap-bg-w mt-12">
        <h3 className="border-bottom h-40">{UseSettingsFromTitle}</h3>
        <div className="flex space-evenly pt-24 pl-24 pr-24">
          {hasDefault && (
            <div className="flex wp-100 border-right pl-12">
              <ItemField
                title={fromDefaultTerminal}
                name={CopySettingFrom}
                options={{
                  value: data[CopySettingFrom],
                  type: "radio",
                  selectedValue: "Default",
                }}
                onChange={this.change}
                Tag={RadioButton}
              />
            </div>
          )}
          <div className="flex-column wp-100 border-right pl-12">
            <ItemField
              title={fromOtherTerminal}
              name={CopySettingFrom}
              options={{
                value: data[CopySettingFrom],
                type: "radio",
                selectedValue: "Terminal",
              }}
              onChange={this.change}
              Tag={RadioButton}
            />
            {(copyType === "Terminal" ||
              data.CopySettingFrom === "Terminal") && (
              <AddObjectToGroup
                outerClass="mt-16"
                pickerTitle="COPY SETTINGS FROM TERMINAL"
                treeType="terminal"
                mainTree={terminalMainTree}
                objects={objects}
                objectGroups={objectGroups}
                field={CopyTerminalId}
                selectGroupName={copyName}
                onConfirm={this.change}
              />
            )}
          </div>
          <div className="flex wp-100 pl-12">
            <ItemField
              title={fromNone}
              name={CopySettingFrom}
              options={{
                value: data[CopySettingFrom],
                type: "radio",
                selectedValue: "None",
              }}
              onChange={this.change}
              Tag={RadioButton}
            />
          </div>
        </div>
      </div>
    );
  }

  render() {
    let {
      props: { isGroup },
    } = this;
    return (
      <Fragment>
        {!isGroup && this.copySettings()}
        {this.basicInfoCard()}
      </Fragment>
    );
  }
}
