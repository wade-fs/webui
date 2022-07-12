import React, { Fragment } from "react";
import LicenseIdInput from "./LicenseIdInput";
import { MainCard, ConfirmAndUpload } from "components/Card/SettingCard";

import { showInfoBar } from "actions/InfobarActions";
import {
  loadLicenses,
  requestLicense,
  clearInstalledId,
} from "actions/SettingActions";

import {
  ALL,
  LICENSE_SETTING,
  LICENSE,
  UPLOAD_LICENSE,
  GENERATE_LICENSE_REQUEST,
} from "const/Consts";
import { Months } from "const/Other/ScheduleConsts";
import { LicenseTabs } from "const/Setting/Tab";

import { apiUploadLicense } from "api";

export default class License extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tabFnMap: [],
      uploadLicenseFile: undefined,
      uploadLicenseResult: "",
      selectedIdx: 0,
    };
    this.fileUpload = React.createRef();
    props.dispatch(loadLicenses());
  }

  componentDidMount() {
    const tabFnMap = LicenseTabs.map((tab) => this.bindTabActions(tab));
    this.setState({ tabFnMap: tabFnMap });
  }
  bindTabActions = (tab) => {
    let content = { ...tab };
    let type;
    // only upload need to bind actions
    switch (tab.content) {
      case UPLOAD_LICENSE:
        type = "License";
        content.fileKey = `upload${type}File`;
        content.uploadResultKey = `upload${type}Result`;
        content.upload = this.uploadLicense;
        break;
      default:
        break;
    }
    return content;
  };

  selectTab = (tab) => {
    let {
      props: { selectTab },
    } = this;
    if (tab === UPLOAD_LICENSE) {
      this.fileUpload.current.click();
    } else if (tab === GENERATE_LICENSE_REQUEST) {
      this.openLicenseIdInput();
    } else {
      selectTab(LICENSE, tab);
    }
  };

  select = (idx) => {
    this.setState({
      selectedIdx: idx,
    });
  };

  openLicenseIdInput = () => {
    this.setState({
      selectedIdx: null,
    });
  };
  closeLicenseIdInput = () => {
    this.setState({
      uploadLicenseResult: "",
      uploadLicenseFile: undefined,
    });
    this.props.dispatch(clearInstalledId());
  };

  onFileChangeLicense = (e) => {
    if (e.target.files.length !== 0) {
      this.setState({ uploadLicenseFile: e.target.files });
    } else {
      this.setState({ uploadLicenseFile: undefined });
    }
    this.setState({ uploadLicenseResult: "" });
  };
  uploadLicense = async () => {
    if (this.state.uploadLicenseFile !== undefined) {
      const response = await apiUploadLicense(this.state.uploadLicenseFile);
      if (response.result === true) {
        this.setState({ uploadLicenseResult: "Success" });
        this.props.dispatch(loadLicenses());
        this.props.dispatch(showInfoBar("Upload License Success!!"));
      } else {
        this.setState({ uploadLicenseResult: "Fail" });
        this.props.dispatch(showInfoBar(response.data, "error"));
      }
    }
  };

  getLicenseRequest = (licenseId) => {
    let {
      props: { dispatch, license },
    } = this;
    dispatch(requestLicense(licenseId));
  };

  scrollTo = (ref) => {
    if (ref /* + other conditions */) {
      ref.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  render() {
    let {
      props: { dispatch, mainTab, tab, license },
      state: { tabFnMap, uploadLicenseFile, uploadLicenseResult, selectedIdx },
    } = this;
    return (
      <Fragment>
        <input
          type="file"
          name="file"
          onChange={this.onFileChangeLicense}
          ref={this.fileUpload}
          accept=".lic,"
          multiple
          style={{ display: "none" }}
        />
        {mainTab === ALL &&
          tabFnMap.map((tab) => (
            <MainCard
              key={tab.content}
              tab={tab}
              selectTab={this.selectTab}
              currentFiles={this.state[tab.fileKey]}
              uploadResult={this.state[tab.uploadResultKey]}
              upload={tab.upload}
            />
          ))}
        {mainTab === LICENSE_SETTING && (
          <div className="mask-1">
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "space-between",
                height: "100%",
              }}
            >
              <div className="setting-sidebar left-right mb-12">
                <h3 className="left-right">
                  LICENSE
                  <div
                    className="editor-add"
                    data-hidden={selectedIdx == null}
                    onClick={this.openLicenseIdInput}
                  ></div>
                </h3>
                <ul className="dhcp-total-table left-right">
                  <li>License Id</li>
                </ul>
                <div className="dhcp-total-table-list-scroll">
                  {Array.isArray(license.licenseList.data) &&
                    license.licenseList.data.map((license, idx) => (
                      <div
                        key={license?.LicenseId}
                        className="dhcp-total-table-list"
                        onClick={() => this.select(idx)}
                        ref={idx === selectedIdx ? this.scrollTo : null}
                        style={
                          idx === selectedIdx
                            ? { backgroundColor: "#80bc00" }
                            : null
                        }
                      >
                        {license?.LicenseId}
                      </div>
                    ))}
                </div>
              </div>
              <div className="setting-editor" data-view={false}>
                <header className="title">
                  <h3>
                    {selectedIdx != null ? (
                      <Fragment>
                        <div className="icon-license-valid"></div>
                        {license.licenseList.data[selectedIdx]?.LicenseId}
                        {/* <div className="setting-delete-icon"></div> */}
                      </Fragment>
                    ) : (
                      "Import License"
                    )}
                  </h3>
                </header>
                {Array.isArray(license.licenseList.data) && (
                  <div className="inner-editing-area" style={{ height: "82%" }}>
                    {selectedIdx != null ? (
                      <Fragment>
                        {Array.isArray(license.licenseList.data) &&
                          license.licenseList.data[selectedIdx] != null && (
                            <LicenseCard
                              license={license.licenseList.data[selectedIdx]}
                            />
                          )}
                      </Fragment>
                    ) : (
                      <div className="license-content">
                        <div>
                          <LicenseIdInput
                            license={license}
                            selectTab={this.selectTab}
                            onConfirm={this.getLicenseRequest}
                            onCancel={this.closeLicenseIdInput}
                          />
                        </div>
                        <div>
                          <h4>STEP 2 - Upload License File</h4>
                          <p>
                            If you already get a License File, directly click
                            below to upload License File.
                          </p>
                          <div className="upload-license-file-area">
                            <div
                              className="icon-upload-file"
                              onClick={() => {
                                this.selectTab(UPLOAD_LICENSE);
                              }}
                            ></div>
                            {uploadLicenseFile == null ? (
                              <p className="mt-24">
                                Click to install License File.
                              </p>
                            ) : (
                              <ConfirmAndUpload
                                currentFiles={uploadLicenseFile}
                                uploadResult={uploadLicenseResult}
                                upload={this.uploadLicense}
                              />
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </Fragment>
    );
  }
}

function LicenseCard({ license }) {
  let unix_timestamp = license.Expiration;
  let date = new Date(unix_timestamp * 1000);
  const year = date.getFullYear();
  const month = Months[date.getMonth()];
  const day = date.getDate();
  const hours = date.getHours();
  const minutes = "0" + date.getMinutes();
  const seconds = "0" + date.getSeconds();

  // Will display time in 10:30:23 format
  const formattedTime = `${year} / ${month} / ${day}    ( ${hours} : ${minutes.substr(
    -2
  )} : ${seconds.substr(-2)} ) `;

  return (
    <Fragment>
      <div className="wp-100 mb-24 mr-30">
        <label>LICENSE ID</label>
        <p>{license?.LicenseId}</p>
      </div>
      <div className="wp-100 mb-24 mr-30">
        <label>NUMBER OF TERMINALS</label>
        <p>{license.MaxTerminals}</p>
      </div>
      <div className="wp-100 mb-24 mr-30">
        <label>EXPIRATION DATE</label>
        <p>{formattedTime}</p>
      </div>
      {/* <div className="license license-2">
          <p className="name"> PURCHASE DATE </p>
          <p className="number">
            {license.Purchased !== "" ? license.Purchased : "null"}
          </p>
        </div> */}
    </Fragment>
  );
}
