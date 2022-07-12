import React, { Fragment } from "react";
import { Modal } from "react-bootstrap";
import { EditorField } from "components/Card";
import Input from "components/Form/Input";
import Select from "components/Form/Select";
import { OverrideCheckbox } from "./OverrideItem";
import { CancelAndConfirm } from "components/Form/Button";
import SearchUser from "components/Other/SearchUser";

import { verifyAuthAdUser } from "actions/OtherActions";
import { clearAuthVerify } from "actions/TerminalActions";

import { positiveNumberValidator } from "lib/Util";

import { LOADING, LOADED, FAILURE } from "const/DataLoaderState";
import {
  ColorDepth,
  ColorDepthOptions,
  DisplayName,
  LinkedAppCommandOptions,
  Resolution,
  ResolutionOptions,
  SessionWidth,
  SessionHeight,
} from "const/Applications/ApplicationFieldNames";
import { Domain, Username, Password } from "const/Servers/ServerFieldNames";
import {
  DisplayNameOverride,
  UserAccessOverride,
  AppCommandOverride,
  VideoSettingOverride,
} from "const/Applications/OverrideNames";

export default class AppOverride extends React.Component {
  constructor(props) {
    super(props);
    const data = this.preProccess();
    this.state = {
      data: data,
      showAdUserModal: false,
    };
  }

  preProccess = () => {
    this.props.dispatch(clearAuthVerify());
    let data = Object.assign({}, this.props.data);
    if (data[Resolution] === undefined || data[Resolution] === "") {
      data[Resolution] = "1920 x 1080";
    }
    if (data[ColorDepth] === undefined || data[ColorDepth] === "") {
      data[ColorDepth] = "16M";
    }
    for (const resolution of ResolutionOptions) {
      if (data[Resolution] === resolution) {
        data[Resolution] = resolution;
      }
    }
    if (data[Resolution] !== "Custom") {
      let resolution = data[Resolution].split(" x ");
      data[SessionWidth] = parseInt(resolution[0]);
      data[SessionHeight] = parseInt(resolution[1]);
    }
    return data;
  };

  change = (e) => {
    let data = this.state.data;
    if (e.target.name == Resolution && e.target.value !== "Custom") {
      let width = e.target.value.split(" x ")[0];
      let height = e.target.value.split(" x ")[1];
      data[SessionWidth] = parseInt(width);
      data[SessionHeight] = parseInt(height);
    }
    data[e.target.name] = e.target.value;
    this.setState({ data });
  };
  cancel = () => {
    let {
      props: { onCancel },
    } = this;
    this.setState({ showAdUserModal: false }, () => {
      onCancel();
    });
  };
  confirm = () => {
    let {
      props: { onConfirm },
      state: { data },
    } = this;
    onConfirm(data);
  };

  onConfirm = (username, domain) => {
    const auth = {
      Username: username,
      Password: "",
      Domain: domain,
    };
    this.setState({
      data: { ...this.state.data, ...auth },
      showAdUserModal: false,
    });
  };

  openAdUserModal = () => {
    this.setState({
      showAdUserModal: true,
    });
  };
  closeAdUserModal = () => {
    this.setState({
      showAdUserModal: false,
    });
  };

  getWrapperField(title, name, options, isEditMode, Tag = Input) {
    return (
      <EditorField
        title={title}
        name={name}
        options={{ className: "w100percent", ...options }}
        Tag={Tag}
        isEditMode={isEditMode}
        onChange={this.change}
      />
    );
  }

  verify = () => {
    let {
      props: { dispatch },
      state: { data },
    } = this;
    if (!!dispatch) {
      dispatch(verifyAuthAdUser("terminals.verifyAuthUserResult", data));
    }
  };

  render() {
    let {
      props: { dispatch, adUsers, verifyAuthUserResult },
      state: { data, showAdUserModal },
    } = this;

    const canDisplayNameOverride =
      !data[DisplayNameOverride] ||
      (data[DisplayNameOverride] && data[DisplayName] !== "")
        ? true
        : false;
    const canUserAccessOverride =
      !data[UserAccessOverride] ||
      (data[UserAccessOverride] &&
        data[Username] !== "" &&
        data[Password] !== "")
        ? true
        : false;
    const canAppCommandOverride =
      !data[AppCommandOverride] ||
      (data[AppCommandOverride] && data[LinkedAppCommandOptions] !== "")
        ? true
        : false;

    return (
      <Modal id="override-modal" show={true}>
        <Modal.Body>
          <div
            className="pop-up-window "
            style={{
              height: "fit-content",
              maxHeight: "880px",
              padding: "0px 0px 20px 0px",
            }}
          >
            <div className="override-title">{`Override settings for '${data.Name}' Application`}</div>
            <article className="override-content">
              <section>
                <h4>APPLICATION NAME</h4>
                <p>{data.Name}</p>
              </section>
              <section>
                <h4>
                  DISPLAY NAME
                  <OverrideCheckbox
                    name={DisplayNameOverride}
                    data={data}
                    onChange={this.change}
                  />
                </h4>
                <ul className="editor-content">
                  {this.getWrapperField(
                    "DISPLAY NAME",
                    DisplayName,
                    {
                      type: "text",
                      value: data[DisplayName],
                    },
                    data[DisplayNameOverride]
                  )}
                </ul>
              </section>
              <section>
                <h4>
                  LOGIN SETTING
                  <OverrideCheckbox
                    name={UserAccessOverride}
                    data={data}
                    onChange={this.change}
                  />
                </h4>
                <div>
                  <button
                    className="override-button"
                    disabled={data[UserAccessOverride] === false}
                    onClick={
                      data[UserAccessOverride] === true ? this.verify : null
                    }
                  >
                    VERIFY
                  </button>
                  <button
                    className="override-button"
                    disabled={data[UserAccessOverride] === false}
                    onClick={
                      data[UserAccessOverride] === true
                        ? () => this.openAdUserModal()
                        : null
                    }
                  >
                    SEARCH FOR AD USER
                  </button>
                </div>
                <ul className="editor-content">
                  {this.getWrapperField(
                    "USERNAME",
                    Username,
                    {
                      type: "text",
                      value: data[Username],
                      required: true,
                    },
                    data[UserAccessOverride]
                  )}
                  {this.getWrapperField(
                    "PASSWORD",
                    Password,
                    {
                      type: "password",
                      value: data[Password],
                      required: true,
                    },
                    data[UserAccessOverride]
                  )}
                  {this.getWrapperField(
                    "DOMAIN",
                    Domain,
                    {
                      type: "text",
                      value: data[Domain],
                    },
                    data[UserAccessOverride]
                  )}
                </ul>
                {verifyAuthUserResult.state === LOADING && (
                  <span>Verifying...Please wait.</span>
                )}
                {verifyAuthUserResult.state === LOADED && (
                  <span className="msg">Verify Successful!</span>
                )}
                {verifyAuthUserResult.state === FAILURE && (
                  <span className="msg err">{verifyAuthUserResult.data}</span>
                )}
              </section>
              <section>
                <h4>
                  APPLINK COMMAND LINE
                  <OverrideCheckbox
                    name={AppCommandOverride}
                    data={data}
                    onChange={this.change}
                  />
                </h4>
                <ul className="editor-content">
                  {this.getWrapperField(
                    "COMMAND LINE OPTIONS",
                    LinkedAppCommandOptions,
                    {
                      type: "text",
                      value: data[LinkedAppCommandOptions],
                    },
                    data[AppCommandOverride]
                  )}
                </ul>
              </section>
              <section>
                <h4>
                  VIDEO SETTING
                  <OverrideCheckbox
                    name={VideoSettingOverride}
                    data={data}
                    onChange={this.change}
                  />
                </h4>
                <ul className="editor-content">
                  {this.getWrapperField(
                    "RESOLUTION",
                    Resolution,
                    {
                      type: "select",
                      value:
                        data[Resolution] !== undefined
                          ? data[Resolution]
                          : data[SessionWidth] !== "" &&
                            data[SessionHeight] !== ""
                          ? `${data[SessionWidth]} x ${data[SessionHeight]}`
                          : "Custom",
                      options: ResolutionOptions,
                    },
                    data[VideoSettingOverride],
                    Select
                  )}
                  {data[Resolution] === "Custom" &&
                    this.getWrapperField(
                      "WIDTH",
                      SessionWidth,
                      {
                        type: "number",
                        value: data[SessionWidth],
                        validator: (e) => positiveNumberValidator(e),
                        minNumber: 1,
                      },
                      data[VideoSettingOverride]
                    )}
                  {data[Resolution] === "Custom" &&
                    this.getWrapperField(
                      "HEIGHT",
                      SessionHeight,
                      {
                        type: "number",
                        value: data[SessionHeight],
                        validator: (e) => positiveNumberValidator(e),
                        minNumber: 1,
                      },
                      data[VideoSettingOverride]
                    )}
                  {this.getWrapperField(
                    "COLOR DEPTH",
                    ColorDepth,
                    {
                      type: "select",
                      value: data[ColorDepth],
                      options: ColorDepthOptions,
                    },
                    data[VideoSettingOverride],
                    Select
                  )}
                </ul>
              </section>
            </article>
            <CancelAndConfirm
              canConfirm={
                canDisplayNameOverride &&
                canUserAccessOverride &&
                canAppCommandOverride
              }
              onConfirm={this.confirm}
              onCancel={this.cancel}
            />
          </div>
          {showAdUserModal && (
            <SearchUser
              dispatch={dispatch}
              onClose={this.closeAdUserModal}
              onConfirm={this.onConfirm}
              data={adUsers}
            />
          )}
        </Modal.Body>
      </Modal>
    );
  }
}
