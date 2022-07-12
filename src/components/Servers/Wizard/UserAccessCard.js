import React, { Fragment } from "react";
import { WizardField } from "components/Card";
import RadioButton from "components/Form/RadioButton";
import SearchUser from "components/Other/SearchUser";

import { verifyAuthAdUser } from "actions/OtherActions";
import { clearAuthVerify } from "actions/ServerActions";

import { LOADING, LOADED, FAILURE } from "const/DataLoaderState";
import {
  UserType,
  Username,
  Password,
  Domain,
} from "const/Servers/ServerFieldNames";

export default class UserAccessCard extends React.Component {
  constructor(props) {
    props.dispatch(clearAuthVerify());
    super(props);
    this.state = {
      showSearchUser: false,
    };
  }

  change = (e) => {
    let {
      props: { data, onChange },
    } = this;
    if (e.target.name == UserType) {
      if (data[UserType] == "None") {
        data[Username] = "";
        data[Domain] = "";
        data[Password] = "";
      }
    }
    onChange(data);
  };
  verify = () => {
    let {
      props: { dispatch, data },
    } = this;
    if (!!dispatch) {
      dispatch(verifyAuthAdUser("servers.verifyAuthUserResult", data));
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

  openSearchUser = () => {
    this.setState({ showSearchUser: true });
  };
  closeSearchUser = () => {
    this.setState({ showSearchUser: false });
  };

  confirmSearchUser = (username, domain) => {
    let {
      props: { data, onChange },
    } = this;
    data[Username] = username;
    data[Domain] = domain;
    data[Password] = "";
    if (!!onChange) {
      onChange(data);
    }
    this.closeSearchUser();
  };

  render() {
    let {
      props: { dispatch, data, adUsers, verifyAuthUserResult },
      state: { showSearchUser },
    } = this;
    return (
      <Fragment>
        <div className="wrap01 wrap-bg-w clearfix pb-8">
          <h3 className=" border-bottom h-40">
            Application Server Administrative Access
          </h3>
          <div className=" align-left">
            {data[UserType] == "Windows" && (
              <div className="ml-30">
                {this.getWrapperField(Username, Username)}
                <div className="flex">
                  <button className="primary-btn" onClick={this.verify}>
                    Verify
                  </button>

                  <button className="primary-btn" onClick={this.openSearchUser}>
                    SEARCH FOR AD USER
                  </button>
                </div>
                <div
                  className="primary-btn"
                  style={{ marginLeft: "12px", fontSize: "12px" }}
                >
                  An administrator account is needed for Q8 Vista to obtain
                  information from ApplicationsServers
                </div>
                {this.getWrapperField(Password, Password, {
                  type: "password",
                })}
                {verifyAuthUserResult.state === LOADING && (
                  <span>Verifying...Please wait.</span>
                )}
                {verifyAuthUserResult.state === LOADED && (
                  <span className="msg">Verify Successful!</span>
                )}
                {verifyAuthUserResult.state === FAILURE && (
                  <span className="msg err">{verifyAuthUserResult.data}</span>
                )}
                {this.getWrapperField(Domain, Domain)}
              </div>
            )}
          </div>
        </div>
        {showSearchUser && (
          <SearchUser
            dispatch={dispatch}
            data={adUsers.data}
            onClose={this.closeSearchUser}
            onConfirm={this.confirmSearchUser}
          />
        )}
      </Fragment>
    );
  }
}
