import React, { Fragment } from "react";
import { EditorField } from "components/Card";
import RadioButton from "components/Form/RadioButton";
import SearchUser from "components/Other/SearchUser";

import { stringValid } from "lib/Util";
import { verifyAuthAdUser } from "actions/OtherActions";
import { clearAuthVerify } from "actions/ServerActions";

import { LOADING, LOADED, FAILURE } from "const/DataLoaderState";
import {
  UserType,
  Domain,
  Password,
  VerifyPassword,
  Username,
  isAuthUserCompleted,
} from "const/Terminals/TerminalFieldNames";

export default class UserAccessCard extends React.Component {
  constructor(props) {
    super(props);
    props.dispatch(clearAuthVerify());
    this.state = {
      showAdUserModal: false,
      passwordNotMatchError: null,
    };
  }

  change = (e) => {
    let {
      props: { onChange },
      state: { data },
    } = this;
    data[e.target.name] = e.target.value;
    if (e.target.name === Password || e.target.name === VerifyPassword) {
      if (!checkResult && data[Password] !== data[VerifyPassword]) {
        this.setState({
          passwordNotMatchError: "Passwords do not match",
        });
      } else {
        this.setState({ passwordNotMatchError: null });
      }
    }
    if (e.target.name == UserType && e.target.value == "None") {
      data[Username] = "";
      data[Domain] = "";
      data[Password] = "";
      data[VerifyPassword] = "";
    }
    const canApply = isAuthUserCompleted(data, false);
    onChange(data, canApply);
  };

  verify = () => {
    let {
      props: { dispatch },
      state: { data },
    } = this;
    if (!!dispatch) {
      dispatch(verifyAuthAdUser("servers.verifyAuthUserResult", data));
    }
  };

  openAdUserModal() {
    this.setState({
      showAdUserModal: true,
    });
  }
  closeAdUserModal = () => {
    this.setState({
      showAdUserModal: false,
    });
  };
  onConfirm = (username, domain) => {
    let {
      props: { data, onChange },
    } = this;
    data[Username] = username;
    data[Domain] = domain;
    data[Password] = "";
    data[UserType] = "Windows";
    onChange(data, false);
    this.setState({
      showAdUserModal: false,
    });
  };

  getWrapperField(title, name, options = { type: "text" }, Tag) {
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
        dispatch,
        isLoaded,
        isEditMode,
        data,
        adUsers,
        verifyAuthUserResult,
      },
      state: { showAdUserModal, passwordNotMatchError },
    } = this;

    return (
      isLoaded && (
        <Fragment>
          {showAdUserModal && (
            <SearchUser
              dispatch={dispatch}
              onClose={this.closeAdUserModal}
              onConfirm={this.onConfirm}
              data={adUsers}
            />
          )}
          {!isEditMode &&
            stringValid(data[Username]) &&
            stringValid(data[Password]) && (
              <ul className="editor-content">
                {this.getWrapperField("USER NAME", Username)}
                {this.getWrapperField("PASSWORD", Password, {
                  type: "password",
                })}
                {this.getWrapperField("DOMAIN", Domain)}
              </ul>
            )}
          {isEditMode && (
            <Fragment>
              <div className=" align-left">
                {/* <label for="">
                    Choose a method for automatically login into terminal.
                  </label> */}
                {/* {this.getWrapperField(
                    "Windows Log In Information",
                    UserType,
                     {
                      type: "radio",
                      selectedValue: "Windows",
                    },
                    RadioButton
                  )} */}
                {data[UserType] == "Windows" && (
                  <div style={{ marginLeft: "30px" }}>
                    {this.getWrapperField("Username", Username, {
                      requied: true,
                    })}
                    <button
                      className="primary-btn mt-24"
                      disabled={
                        passwordNotMatchError === null ? "disabled" : ""
                      }
                      onClick={this.verify}
                    >
                      VERIFY
                    </button>
                    <button
                      className="primary-btn"
                      onClick={this.openAdUserModal}
                    >
                      SEARCH FOR AD USER
                    </button>
                    <div>
                      An administrator account is needed for Q8 Vista to obtain
                      information from ApplicationsServers
                    </div>
                    {this.getWrapperField("Password", "Password", {
                      type: "password",
                    })}
                    {this.getWrapperField("Verify Password", VerifyPassword, {
                      type: "password",
                      error: passwordNotMatchError,
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
                    {this.getWrapperField("Domain", Domain)}
                  </div>
                )}
                {/* {this.getWrapperField(
                    "None",
                    UserType,
                    {
                      type: "radio",
                      selectedValue: "None",
                    },
                    RadioButton
                  )} */}
                {/* <span className="maximum-30-charactor">
                    Require user to log on manually.
                  </span> */}
              </div>
            </Fragment>
          )}
        </Fragment>
      )
    );
  }
}
