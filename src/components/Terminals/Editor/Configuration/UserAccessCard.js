import React, { Fragment } from "react";
import { EditorField, ApplyAll } from "components/Card";
import RadioButton from "components/Form/RadioButton";
import SearchUser from "components/Other/SearchUser";

import { verifyAuthAdUser } from "actions/OtherActions";
import { clearAuthVerify } from "actions/TerminalActions";

import { LOADING, LOADED, FAILURE } from "const/DataLoaderState";
import {
  UserType,
  Domain,
  Password,
  Username,
  isAuthUserCompleted,
  UserAccessApplyAll,
} from "const/Terminals/TerminalFieldNames";

import { isInheritedFromParent } from "utils/Check";

export default class UserAccessCard extends React.Component {
  constructor(props) {
    super(props);
    const isInherited = isInheritedFromParent(
      props.parentTerminal.data,
      UserAccessApplyAll
    );
    props.dispatch(clearAuthVerify());
    this.state = {
      showAdUserModal: false,
      isInherited: isInherited,
    };
  }

  change = (e) => {
    let {
      props: { dispatch, isGroup, data, onChange },
    } = this;
    data[e.target.name] = e.target.value;
    if (e.target.name === UserType && e.target.value === "None") {
      data[Username] = "";
      data[Domain] = "";
      data[Password] = "";
      dispatch(clearAuthVerify());
    }
    const canApply = isAuthUserCompleted(data, isGroup);
    onChange(data, canApply);
  };

  openAdUserModal = () => {
    this.setState({
      showAdUserModal: true,
    });
  };
  onClose = () => {
    this.setState({ showAdUserModal: false });
  };
  onConfirm = (username, domain) => {
    let {
      props: { data, isGroup, onChange },
    } = this;
    data[Username] = username;
    data[Domain] = domain;
    data[Password] = "";
    data[UserType] = "Windows";
    const canApply = isAuthUserCompleted(data, isGroup);
    onChange(data, canApply);
    this.setState({ showAdUserModal: false });
  };
  verify = () => {
    let {
      props: { dispatch, data },
    } = this;
    if (!!dispatch) {
      dispatch(verifyAuthAdUser("terminals.verifyAuthUserResult", data));
    }
  };

  getWrapperField(title, name, options, Tag) {
    let {
      props: { isEditMode, data },
    } = this;
    return (
      <EditorField
        isEditMode={isEditMode}
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
        isLoaded,
        isEditMode,
        data,
        adUsers,
        parentTerminal,
        dispatch,
        isGroup,
        verifyAuthUserResult,
      },
      state: { isInherited, showAdUserModal },
    } = this;

    return (
      isLoaded && (
        <Fragment>
          {showAdUserModal && (
            <SearchUser
              dispatch={dispatch}
              onClose={this.onClose}
              onConfirm={this.onConfirm}
              data={adUsers}
              outSideData={data}
              SearchUser={showAdUserModal}
            />
          )}
          {isInherited && (
            <div
              className="modal-text-b"
              style={{
                position: "absolute",
                top: "16px",
                right: "80px",
              }}
            >
              Inherit from {parentTerminal.data["Name"]}
            </div>
          )}
          {isGroup && (
            <ApplyAll
              name={UserAccessApplyAll}
              isEditMode={isEditMode}
              value={data[UserAccessApplyAll]}
              onChange={this.change}
              disabled={!isEditMode || isInherited}
            />
          )}
          {!isEditMode && (
            <ul className="editor-content">
              {!isGroup &&
                this.getWrapperField("USER NAME", Username, {
                  required: true,
                })}
              {!isGroup &&
                this.getWrapperField("PASSWORD", Password, {
                  type: "password",
                  required: true,
                })}
              {this.getWrapperField("DOMAIN", Domain)}
            </ul>
          )}
          {isEditMode && (
            <div className="align-left">
              <label for="">
                Choose a method for automatically login into terminal.
              </label>
              {this.getWrapperField(
                "Windows Log In Information",
                UserType,
                {
                  value: data[UserType],
                  type: "radio",
                  selectedValue: "Windows",
                  checked: data[UserType] === "Windows" ? true : false,
                  disabled: isInherited,
                },
                RadioButton
              )}
              {data[UserType] == "Windows" && (
                <Fragment>
                  <div className="user-access-field">
                    {!this.props.isGroup &&
                      this.getWrapperField("Username", Username, {
                        required: true,
                      })}
                    {!isGroup && (
                      <Fragment>
                        {this.getWrapperField("Password", Password, {
                          type: "password",
                          required: true,
                        })}
                        {verifyAuthUserResult.state === LOADING && (
                          <span>Verifying...Please wait.</span>
                        )}
                        {verifyAuthUserResult.state === LOADED && (
                          <span className="msg">Verify Successful!</span>
                        )}
                        {verifyAuthUserResult.state === FAILURE && (
                          <span className="msg err">
                            {verifyAuthUserResult.data}
                          </span>
                        )}
                      </Fragment>
                    )}
                    {this.getWrapperField("Domain", Domain, {
                      disabled: isInherited,
                    })}
                  </div>
                  <div className="user-access-actions">
                    <button
                      className="primary-btn mt-24"
                      onClick={this.verify}
                      disabled={
                        data.Password === "" && data.UserType === "Windows"
                          ? "disabled"
                          : ""
                      }
                    >
                      VERIFY
                    </button>
                    <button
                      className="primary-btn"
                      onClick={this.openAdUserModal}
                    >
                      SEARCH FOR AD USER
                    </button>
                  </div>
                </Fragment>
              )}
              {this.getWrapperField(
                "None",
                UserType,
                {
                  value: data[UserType],
                  type: "radio",
                  selectedValue: "None",
                  checked: data[UserType] === "None" ? true : false,
                  disabled: isInherited,
                },
                RadioButton
              )}
              <span className="maximum-30-charactor">
                Require user to log on manually.
              </span>
            </div>
          )}
        </Fragment>
      )
    );
  }
}
