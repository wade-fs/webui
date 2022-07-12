import React, { Fragment } from "react";
import { ItemField } from "components/Card";
import Spinner from "components/Other/Spinner";

import { LOADING, LOADED, FAILURE } from "const/DataLoaderState";
import { LicenseId } from "const/Setting/FieldName";

export default class LicenseIdInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = { data: {} };
    this.installedIdToCopy = React.createRef();
  }

  componentDidUpdate(prevProps) {
    if (this.props.license.installedId !== prevProps.license.installedId) {
      // this.setState({ data: {} });
    }
  }
  componentWillUnmount() {
    this.props.onCancel();
  }

  change = (e) => {
    let {
      state: { data },
    } = this;
    data[e.target.name] = e.target.value;
    this.setState({ data });
  };
  confirm = () => {
    let {
      props: { onConfirm },
      state: { data },
    } = this;
    onConfirm(data[LicenseId]);
  };
  copy = () => {
    let {
      props: { license },
    } = this;
    navigator.clipboard.writeText(license?.installedId?.data);
  };

  isRequestingLicense() {
    return this.props.license.installedId.state == LOADING;
  }

  sendMail = () => {
    let link =
      "mailto:me@arista.com" +
      "?subject=" +
      escape("InstalledId") +
      "&body=" +
      escape(`InstalledId = ${this.installedIdToCopy.current.value}`);
    window.location.href = link;
  };

  render() {
    let {
      props: { license, onCancel },
      state: { data },
    } = this;
    const installedId = license.installedId;
    const gotInstalledId =
      installedId.state == LOADED &&
      installedId.data != null &&
      installedId.data.toString().length > 0;
    const hasRequestError = installedId.state == FAILURE;
    let error = "";
    if (hasRequestError) {
      let errorResponse = installedId?.error?.response ?? null;
      if (errorResponse?.body?.message != null) {
        error = errorResponse.body.message;
      }
    }
    return (
      <Fragment>
        {/* {this.isRequestingLicense() && (
          <Spinner styles={{ marginLeft: "-24px" }} />
        )} */}
        <h4>STEP 1 - Generate License Request</h4>
        <p>
          Enter your License Id, to generate Install Id and send Install Id back
          to Arista to get License File.
        </p>
        <div className="license-step-content">
          <article>
            <div
              className={
                license?.installedId.data ? "step-circle" : "step-circle-active"
              }
            >
              1-1
            </div>
            <label>STEP 1-1 - License Id</label>
          </article>
          <div className="mt-8 ml-40">
            <ItemField
              title="STEP 1-1 - License Id"
              name={LicenseId}
              options={{
                value: data[LicenseId],
                type: "text",
                className: "w-280",
              }}
              onChange={this.change}
            />
            {license.installedId.state === LOADING && (
              <span>Waiting for Installed Id...</span>
            )}
            {license.installedId.state === LOADED && (
              <span>Get Installed Id Success</span>
            )}
          </div>
          <div className="setting-actions-btn" onClick={this.confirm}>
            CONFIRM
          </div>
        </div>
        {/* {gotInstalledId && ( */}
        <div className="license-step-content">
          <article>
            <div
              className={
                license?.installedId.data ? "step-circle-active" : "step-circle"
              }
            >
              1-2
            </div>
            <label>STEP 1-2 - Installed Id</label>
          </article>
          <div className="mt-8 ml-40">
            <input
              className="w-280"
              ref={this.installedIdToCopy}
              value={license.installedId.data ? license.installedId.data : ""}
              disabled={true}
            />
            <div className="actions">
              {license.installedId.data && (
                <Fragment>
                  <div className="list-action-copy" onClick={this.copy}></div>
                  <div
                    className="mr-8"
                    onClick={this.sendMail}
                    style={{
                      width: "24px",
                      height: "16px",
                      background: 'url("assets/images/Mail.svg")',
                      backgroundSize: "cover",
                      margin: "8px 10px",

                      cursor: "pointer",
                    }}
                  ></div>
                </Fragment>
              )}
            </div>
          </div>
        </div>
        {hasRequestError && (
          <div
            style={{
              marginBottom: "10px",
              marginTop: "10px",
              display: "block",
              color: "black",
              fontSize: "initial",
            }}
          >
            {error}
          </div>
        )}
      </Fragment>
    );
  }
}
