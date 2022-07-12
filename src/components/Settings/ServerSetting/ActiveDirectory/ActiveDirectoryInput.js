import React, { Fragment } from "react";
import { EditorField } from "components/Card";
import { CancelAndConfirm } from "components/Form/Button";

import { isNotEmptyObject, ipValid, nameValidator, nullValid } from "lib/Util";

import { DEFAULT_AD_SERVER } from "const/Setting/AdServer";

import { checkEdit } from "utils/Check";

export default class ActiveDirectoryInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data:
        props.adServerIdx !== -1
          ? { ...props.data[props.adServerIdx] }
          : DEFAULT_AD_SERVER,
      edited: false,
      errorFields: {},
    };
  }

  componentDidUpdate(prevProps) {
    let {
      props: { isEditMode, data, adServerIdx },
    } = this;

    if (
      prevProps.adServerIdx !== adServerIdx ||
      prevProps.isEditMode !== isEditMode ||
      prevProps.data !== data
    ) {
      if (adServerIdx === -1) {
        this.resetData({ ...DEFAULT_AD_SERVER });
      } else {
        this.resetData({ ...data[adServerIdx] });
      }
    }
  }

  change = (e) => {
    let {
      props: { adServerIdx, updateCanSwitch },
      state: { data, edited, errorFields },
    } = this;

    e.target.value = e.target.value.replace(/\s+/g, "");
    data[e.target.name] = e.target.value;
    if (this.props.adServerIdx !== -1) {
      edited = checkEdit(data, this.props.data[adServerIdx]);
    } else {
      edited = checkEdit(data, DEFAULT_AD_SERVER);
    }
    if (e.target.error) {
      errorFields[e.target.name] = e.target.error;
    } else {
      delete errorFields[e.target.name];
    }
    this.setState({ data, edited, errorFields });
    updateCanSwitch(!edited);
  };

  onCancel = () => {
    let {
      props: { data, adServerIdx, onCancel },
    } = this;
    this.setState(
      {
        data:
          adServerIdx === -1
            ? { ...DEFAULT_AD_SERVER }
            : { ...data[adServerIdx] },
        edited: false,
      },
      () => {
        onCancel();
      }
    );
  };

  resetData = (data) => {
    this.setState({
      data: { ...data },
      edited: false,
      errorFields: {},
    });
  };

  canApply = (hasError, edited) => {
    let {
      props: { adServerIdx },
      state: { data },
    } = this;
    let canConfirm = !hasError && edited;
    if (adServerIdx === -1) {
      canConfirm =
        data["Username"] !== "" &&
        data["Password"] !== "" &&
        data["Domain"] !== "" &&
        data["GUID"] !== "";
    }
    return canConfirm;
  };

  render() {
    let {
      props: { isEditMode, adServerIdx, onApply, onDelete, onEdit },
      state: { data, errorFields, edited },
    } = this;

    const hasError = isNotEmptyObject(errorFields);
    const canApply = this.canApply(hasError, edited);
    const ACTIVE_DIRECTORY_SETTING_LIST = [
      {
        name: "Username",
        title: "User Name",
        options: {
          type: "text",
          required: true,
          placeholder: "username",
          validator: nameValidator,
          error: errorFields["Username"],
        },
      },
      {
        name: "Password",
        title: "Password",
        options: {
          type: "password",
          required: true,
          placeholder: "password",
          validator: nullValid,
          error: errorFields["Password"],
        },
      },
      {
        name: "Domain",
        title: "Domain component",
        options: {
          type: "text",
          required: true,
          placeholder: "DC=devops,DC=local",
          error: errorFields["Domain"],
        },
      },
      {
        name: "GUID",
        title: "AD server IP address",
        options: {
          type: "text",
          required: true,
          placeholder: "192.168.0.1",
          validator: ipValid,
          error: errorFields["GUID"],
        },
      },
    ];

    return (
      <div className="setting-editor" data-view={!isEditMode}>
        <header className="title">
          <h3>
            {adServerIdx !== -1
              ? this.props.data[adServerIdx].Username
              : "Create New AD Server"}
          </h3>
          {!isEditMode && adServerIdx !== -1 && (
            <div className="flex">
              <div className="setting-delete-icon" onClick={onDelete}></div>
              <div className="setting-edit-icon" onClick={onEdit}></div>
            </div>
          )}
        </header>
        <div className="content">
          <ul>
            {ACTIVE_DIRECTORY_SETTING_LIST.map((item) => (
              <div key={item.name} className="mb-24">
                <EditorField
                  title={item.title}
                  name={item.name}
                  options={{
                    value: data[item.name] ?? "",
                    className: "wp-50",
                    ...item.options,
                  }}
                  isEditMode={isEditMode}
                  onChange={this.change}
                />
              </div>
            ))}
          </ul>
        </div>
        {isEditMode && (
          <CancelAndConfirm
            type="APPLY"
            canConfirm={canApply}
            onConfirm={() => onApply(data)}
            onCancel={this.onCancel}
          />
        )}
      </div>
    );
  }
}
