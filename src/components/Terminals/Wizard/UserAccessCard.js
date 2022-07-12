import React, { Fragment } from "react";
import { ApplyAll, WizardField } from "components/Card";
import RadioButton from "components/Form/RadioButton";
import SearchUser from "components/Other/SearchUser";

import { verifyAuthAdUser } from "actions/OtherActions";
import { clearAuthVerify } from "actions/TerminalActions";

import { LOADING, LOADED, FAILURE } from "const/DataLoaderState";
import {
  Domain,
  Name,
  Username,
  Password,
  UserType,
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
      isInherited: isInherited,
      showSearchUser: false,
    };
  }

  change = (e) => {
    let {
      props: { data, onChange },
    } = this;

    data[e.target.name] = e.target.value;
    if (e.target.name === UserType && e.target.value === "None") {
      data[Username] = "";
      data[Domain] = "";
      data[Password] = "";
      this.props.dispatch(clearAuthVerify());
    }
    onChange(data);
  };

  openSearchUser = () => {
    this.setState({ showSearchUser: true });
  };
  closeSearchUser = () => {
    this.setState({ showSearchUser: false });
  };
  confirmSearchUser = (username, domain) => {
    let { data, onChange } = this.props;
    data[Username] = username;
    data[Domain] = domain;
    data[Password] = "";
    if (!!onChange) {
      onChange(data);
    }
    this.closeSearchUser();
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
      props: { data },
    } = this;
    return (
      <WizardField
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
        isGroup,
        data,
        adUsers,
        parentTerminal,
        verifyAuthUserResult,
      },
      state: { isInherited, showSearchUser },
    } = this;
    return (
      <Fragment>
        <div className="wrap01 wrap-bg-w clearfix pb-8">
          <h3 className=" border-bottom h-50">
            USER ACCESS
            {isInherited && (
              <span style={{ float: "right" }}>
                Inherit from {parentTerminal.data[Name]}
              </span>
            )}
            {isGroup && (
              <ApplyAll
                name={UserAccessApplyAll}
                isEditMode={true}
                value={data[UserAccessApplyAll]}
                onChange={this.change}
                disabled={isInherited}
              />
            )}
          </h3>
          <div className="align-left">
            <label for="">
              Choose a method for automatically login into terminal.
            </label>
            {this.getWrapperField(
              "Windows Log In Information",
              UserType,
              {
                type: "radio",
                selectedValue: "Windows",
                disabled: isInherited,
              },
              RadioButton
            )}
            {data[UserType] == "Windows" && (
              <div className="flex start">
                <div className="w-240 ml-30">
                  {!isGroup && (
                    <Fragment>
                      {this.getWrapperField("Username", Username, {
                        required: true,
                      })}
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
                    type: "text",
                    disabled: isInherited,
                  })}
                </div>
                <div className="flex">
                  <button
                    className="primary-btn"
                    disabled={
                      data.Password === "" && data.UserType === "Windows"
                        ? "disabled"
                        : ""
                    }
                    onClick={this.verify}
                  >
                    Verify
                  </button>
                  {!isInherited && (
                    <button
                      className="primary-btn"
                      onClick={this.openSearchUser}
                    >
                      SEARCH FOR AD USER
                    </button>
                  )}
                </div>
              </div>
            )}
            {this.getWrapperField(
              "None",
              UserType,
              {
                type: "radio",
                selectedValue: "None",
                disabled: isInherited,
              },
              RadioButton
            )}
            <span className="maximum-30-charactor">
              Require user to log on manually.
            </span>
          </div>
        </div>
        {showSearchUser && (
          <SearchUser
            dispatch={dispatch}
            data={adUsers}
            onClose={this.closeSearchUser}
            onConfirm={this.confirmSearchUser}
            outSideData={data}
          />
        )}
      </Fragment>
    );
  }
}
