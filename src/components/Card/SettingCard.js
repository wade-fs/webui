import React, { Fragment } from "react";
import {
  ALL,
  DHCP,
  TERMCAP,
  ADMIN,
  ACTIVE_DIRECTORY,
  PACKAGE_SETTING,
  SERVER_SETTING,
  ADMIN_SETTING,
//  FIRMWARE_PACKAGE,
  DATABASE,
  Q8_DATABASE,
//  INSTALL_DRIVERS,
  INSTALL_SYSTEM,
  SERVER_CERTIFICATE,
  UPDATE_SERVER_AND_CERTIFICATE,
  LICENSE_SETTING,
  UPLOAD_LICENSE,
} from "const/Consts";

import {
  BrowserRouter,
  Routes,
  Route,
  HashRouter,
  Link,
} from "react-router-dom";

export function MainCard({ tab, selectTab, ...others }) {
  return (
    <div className="setting-card">
      <div className="setting-card-header"> </div>
      <div className="setting-card-body">
        {(tab.content === UPLOAD_LICENSE ||
          tab.content === INSTALL_SYSTEM ||
/*          tab.content === INSTALL_DRIVERS ||
          tab.content === TERMCAP || */
          tab.content === UPDATE_SERVER_AND_CERTIFICATE) && (
          <InstallButton onClick={() => selectTab(tab.content)} {...others} />
        )}
        {(/*tab.content === FIRMWARE_PACKAGE ||*/
          tab.content === ADMIN ||
          tab.content === DHCP ||
          tab.content === ACTIVE_DIRECTORY) && (
          <MoreButton tab={tab} onClick={() => selectTab(tab.content)} />
        )}
        {tab.content === Q8_DATABASE && (
          <ExportAndImport onClick={() => selectTab(tab.content)} {...others} />
        )}
        {tab.content === LICENSE_SETTING && (
          <div className="license-notification">
            <div className="icon-notification"></div>
            <div className="license-warning">EXPIRE SOON</div>
          </div>
        )}
      </div>
      <div className="setting-card-text-with-icon">
        <div className={tab.iconClass}></div>
        <dl style={{ width: "70%" }}>
          <dt className="setting-card-category">{tab.name}</dt>
          <dd className="setting-card-content"> {tab.content}</dd>
        </dl>
      </div>
    </div>
  );
}

function MoreButton({ onClick, tab }) {
  return (
    // <Link to={"/setting/" + tab.content}>
    <div className="more-btn" onClick={onClick}>
      MORE
      <div className="more-dot"></div>
    </div>
    // </Link>
  );
}

function InstallButton({ onClick, ...others }) {
  return (
    <Fragment>
      <ConfirmAndUpload {...others} />
      <div className="install-btn" onClick={onClick}>
        INSTALL
        <div className="install-icon"></div>
      </div>
    </Fragment>
  );
}

export function ExportAndImport({
  onClick,
  currentFiles,
  download,
  ...others
}) {
  return (
    <Fragment>
      <ConfirmAndUpload currentFiles={currentFiles} {...others} />
      <div className="export-btn" onClick={download}>
        EXPORT
        <div className="export-icon"></div>
      </div>
      <div className="install-btn" onClick={onClick}>
        IMPORT
        <div className="install-icon"></div>
      </div>
    </Fragment>
  );
}

export function ConfirmAndUpload({ currentFiles, uploadResult, upload }) {
  return (
    currentFiles != null && (
      <div className="upload-flies-content mt-12">
        <ul>
          {[...currentFiles].map((file) => (
            <li key={file.name}>
              <div className="icon-document"></div>
              <p>{file.name}</p>
            </li>
          ))}
        </ul>
        {uploadResult === "" && (
          <div className="setting-actions-btn" onClick={upload}>
            CONFIRM
          </div>
        )}
        <div className="upload-result">
          {uploadResult !== "" &&
            (uploadResult === "Fail" ? (
              <div className="result-fail"></div>
            ) : (
              <div className="result-success"></div>
            ))}
        </div>
      </div>
    )
  );
}
