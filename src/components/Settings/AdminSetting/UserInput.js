import React, { Fragment } from "react";
import { CancelAndConfirm } from "components/Form/Button";
import { EditorField } from "components/Card";

import { stringValid, isDefaultObject } from "lib/Util";

import {
  Id,
  Username,
  FirstName,
  LastName,
  Password,
  Role,
  Email,
  SessionTimeout,
  IdleTimeout,
  VerifyPassword,
  NewPassword,
  DEFAULT_USER,
} from "const/Setting/User";
import {
  DUPLICATE_NAME_ERROR,
  PasswordNotMatch,
  ValueTooSmall,
  ValueTooLarge,
} from "const/Message";
import { checkDuplicateName, checkEdit } from "utils/Check";

export default class UserInput extends React.Component {
  constructor(props) {
    super(props);
    const data = { ...props.data };
    this.state = {
      data: data,
      showChangePassword: false,
      edited: false,
      errorFields: {},
    };
  }

  componentDidMount() {
    if (this.props.selectedIdx === -1) {
      this.resetData({ ...DEFAULT_USER });
    } else {
      let data = { ...this.props.userList.data[this.props.selectedIdx] };
      this.resetData(data);
    }
  }
  componentDidUpdate(prevProps) {
    if (
      prevProps.selectedIdx !== this.props.selectedIdx ||
      prevProps.userList !== this.props.userList ||
      prevProps.isEditMode !== this.props.isEditMode
    ) {
      if (this.props.selectedIdx === -1) {
        this.resetData({ ...DEFAULT_USER });
      } else {
        let data = { ...this.props.userList.data[this.props.selectedIdx] };
        this.resetData(data);
      }
    }
  }

  change = (e) => {
    let {
      props: { userList, selectedIdx, updateCanSwitch },
      state: { data, edited, errorFields },
    } = this;

    data[e.target.name] = e.target.value;
    if (selectedIdx !== -1) {
      edited = checkEdit(data, userList.data[selectedIdx]);
    } else {
      edited = checkEdit(data, DEFAULT_USER);
    }
    updateCanSwitch(!edited);
    if (e.target.name == Username) {
      const hasDuplicateName = checkDuplicateName(
        data[Username],
        undefined,
        userList
      );
      if (hasDuplicateName) {
        errorFields[Username] = DUPLICATE_NAME_ERROR;
      } else {
        if (errorFields[Username] == DUPLICATE_NAME_ERROR) {
          delete errorFields[Username];
        }
      }
    } else if (
      e.target.name == NewPassword ||
      e.target.name == VerifyPassword
    ) {
      // error check
      if (data[NewPassword] !== data[VerifyPassword]) {
        errorFields[VerifyPassword] = PasswordNotMatch;
      } else {
        if (errorFields[VerifyPassword] === PasswordNotMatch) {
          delete errorFields[VerifyPassword];
        }
      }
    } else if (e.target.name == SessionTimeout) {
      if (e.target.value < 5) {
        errorFields[SessionTimeout] = ValueTooSmall;
      } else if (e.target.value > 9999999) {
        errorFields[SessionTimeout] = ValueTooLarge;
      } else {
        if (errorFields[SessionTimeout] == ValueTooLarge || ValueTooSmall) {
          delete errorFields[SessionTimeout];
        }
      }
    } else if (e.target.name == IdleTimeout) {
      if (e.target.value < 5) {
        errorFields[IdleTimeout] = ValueTooSmall;
      } else if (e.target.value > 9999999) {
        errorFields[IdleTimeout] = ValueTooLarge;
      } else {
        if (errorFields[IdleTimeout] == ValueTooLarge || ValueTooSmall) {
          delete errorFields[IdleTimeout];
        }
      }
    }
    this.setState({ data, edited, errorFields });
  };

  onCancel = () => {
    let {
      props: { userList, selectedIdx, onCancel },
    } = this;
    this.setState(
      {
        data: { ...userList?.[selectedIdx ?? 0] },
        edited: false,
      },
      () => {
        onCancel();
      }
    );
  };

  openChangePassword = () => {
    const data = { ...this.state.data };
    data[NewPassword] = "";
    data[VerifyPassword] = "";
    this.setState({ data: data, edited: false, showChangePassword: true });
  };

  resetData = (data) => {
    this.setState({
      data: { ...data },
      edited: false,
      showChangePassword: false,
      errorFields: {},
    });
  };

  canApply = () => {
    let { data, edited, errorFields } = this.state;
    const isValid = stringValid(data[SessionTimeout]);
    return (
      edited &&
      isDefaultObject(errorFields) &&
      stringValid(data[Username]) &&
      stringValid(data[FirstName]) &&
      // stringValid(data[LastName]) &&
      stringValid(parseInt(data[SessionTimeout])) &&
      stringValid(parseInt(data[IdleTimeout])) &&
      (data[VerifyPassword] == null ||
        data[NewPassword] === data[VerifyPassword] ||
        stringValid(data[Password])) &&
      data[SessionTimeout] <= 9999999 &&
      data[SessionTimeout] >= 5 &&
      data[IdleTimeout] <= 9999999 &&
      data[IdleTimeout] >= 5
    );
  };

  getWrapperField(title, name, options) {
    let {
      props: { isEditMode },
      state: { data },
    } = this;
    return (
      <div className="wp-30 mb-24 mr-30">
        <EditorField
          isEditMode={isEditMode}
          title={title}
          name={name}
          options={{ value: data[name] ?? "", ...options }}
          onChange={this.change}
        />
      </div>
    );
  }

  passwordValid = (value, otherPassword) => {
    if (value !== otherPassword) return "password not match";
    return null;
  };

  render() {
    let {
      props: { userInfo, userList, selectedIdx, isEditMode, onApply },
      state: { data, showChangePassword, errorFields },
    } = this;
    const canApply = this.canApply();
    return (
      <Fragment>
        <div
          className="inner-editing-area"
          style={{ height: !isEditMode ? "82%" : null }}
        >
          <h2 style={{ marginBottom: "25px", fontSize: "18px" }}>USER INFO</h2>
          <div style={{ display: "flex", justifyContent: "start" }}>
            {this.getWrapperField("User Name", Username, {
              type: "text",
              className: "w100percent",
              disabled: selectedIdx !== -1,
              error:
                errorFields?.Username &&
                errorFields?.Username === DUPLICATE_NAME_ERROR &&
                DUPLICATE_NAME_ERROR,
              required: true,
            })}

            {this.getWrapperField("First Name", FirstName, {
              type: "text",
              className: "w100percent ",
              required: true,
            })}

            {this.getWrapperField("Last Name", LastName, {
              type: "text",
              className: "w100percent ",
              required: false,
            })}
          </div>
          {/* {this.getWrapperField("Email", "Email", {
              type: "text",
              className: "w100percent ",
              required: true,
            })} */}
          <div style={{ display: "flex" }}>
            <h2 style={{ marginBottom: "25px", fontSize: "18px" }}>PASSWORD</h2>
            {selectedIdx !== -1 && isEditMode && (
              <div
                className="change-password"
                style={{
                  backgroundColor: showChangePassword ? "#dddddd" : null,
                }}
                onClick={this.openChangePassword}
              >
                CHANGE PASSWORD
              </div>
            )}
          </div>
          <div style={{ display: "flex", justifyContent: "start" }}>
            {selectedIdx !== -1 &&
              this.getWrapperField("Original Password", Password, {
                type: "password",
                className: "w100percent",
                disabled: true,
                // required: true,
              })}
            {(selectedIdx === -1 || (isEditMode && showChangePassword)) && (
              <Fragment>
                {this.getWrapperField("Set New Password", NewPassword, {
                  type: "password",
                  className: "w100percent",
                  required: true,
                })}
                {this.getWrapperField("Verify New Password", VerifyPassword, {
                  type: "password",
                  className: "w100percent",
                  required: true,
                  error: errorFields[VerifyPassword],
                })}
              </Fragment>
            )}
          </div>
          <h2 style={{ marginBottom: "25px", fontSize: "18px" }}>SESSION</h2>
          {userInfo?.Username !== userList?.data[selectedIdx]?.Username &&
            isEditMode &&
            selectedIdx !== -1 && (
              <p>Only can edit session for logged in user.</p>
            )}
          <div style={{ display: "flex", justifyContent: "start" }}>
            {(userInfo?.Username === userList?.data[selectedIdx]?.Username ||
              !isEditMode ||
              selectedIdx === -1) &&
              this.getWrapperField("Session Timeout", SessionTimeout, {
                type: "number",
                className: "w100percent ",
                placeholder: "5~9999999",
                required: true,
                minNumber: 5,
                maxNumber: 9999999,
                error: errorFields?.SessionTimeout,
              })}
            {(userInfo?.Username === userList?.data[selectedIdx]?.Username ||
              !isEditMode ||
              selectedIdx === -1) &&
              this.getWrapperField("Idle Timeout", IdleTimeout, {
                type: "number",
                className: "w100percent ",
                placeholder: "5~9999999",
                required: true,
                minNumber: 5,
                maxNumber: 9999999,
                error: errorFields?.IdleTimeout,
              })}
          </div>
        </div>
        {isEditMode && (
          <CancelAndConfirm
            type="APPLY"
            canConfirm={canApply}
            onConfirm={() => onApply(data)}
            onCancel={this.onCancel}
          />
        )}
      </Fragment>
    );
  }
}
