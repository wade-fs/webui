import React from "react";
import { WizardField } from "components/Card";
import Input from "components/Form/Input";
import AddObjectToGroup from "components/ObjectCommon/AddObjectToGroup";

import { nameValidator, ipValid } from "lib/Util";

import { Name, ParentId, IPAddress } from "const/Servers/ServerFieldNames";
import { NameInfo } from "const/Terminals/TerminalConsts";
import { DUPLICATE_NAME_ERROR } from "const/Message";

import { checkDuplicateName } from "utils/Check";
import { getObjectById } from "utils/Object";

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
      console.log("SWI name", e.target.name, "error", e.target.error);
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
    } else if (e.target.name === IPAddress) {
      if (e.target.error == null) {
        delete errorFields[e.target.name];
      }
    }
    this.setState({
      errorFields,
    });
    onChange(data);
    this.props.handleErrorFields(errorFields);
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

  render() {
    let {
      props: { isGroup, data, objectGroups, serverMainTree },
      state: { errorFields },
    } = this;

    const parentName = getObjectById(data[ParentId], objectGroups)?.Name;

    return (
      <div
        className="wrap01 mt-12 wrap-bg-w"
        style={{ height: "50vh", overflowY: "auto" }}
      >
        <h3 className=" border-bottom ">BASIC INFO</h3>
        <div className="mt-12">
          {this.getWrapperField(
            isGroup ? "Server Group Name" : "Server Name",
            Name,
            {
              showCharacterCounter: true,
              max: 20,
              validator: nameValidator,
              required: true,
              error: errorFields[Name],
            },
            Input,
            NameInfo
          )}
        </div>
        <div className="mt-12">
          <label>Server Group</label>
          <AddObjectToGroup
            isGroup={isGroup}
            objectGroups={objectGroups}
            selectGroupName={parentName}
            mainTree={serverMainTree}
            treeType="appServerGroup"
            onConfirm={this.change}
            pickerTitle="CHOOSE EXISTING GROUP"
          />
        </div>
        <div className="mt-12 pb-24">
          {!isGroup &&
            this.getWrapperField(
              "IP Address",
              IPAddress,
              {
                showCharacterCounter: false,
                type: "text",
                validator: ipValid,
                required: true,
                error: errorFields[IPAddress],
              },
              Input,
              "Only enter the IP Address if you are not using a DNS Server."
            )}
        </div>
      </div>
    );
  }
}
