import React, { Fragment } from "react";
import { apiDownloadDatebase, apiUploadDatebase } from "api";

import { showInfoBar } from "actions/InfobarActions";

import { ALL, DATABASE, Q8_DATABASE } from "const/Consts";
import { MainCard, ExportAndImport } from "components/Card/SettingCard";
import { DatabaseTabs } from "const/Setting/Tab";

export default class Database extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tabFnMap: [],
      uploadDatabaseFile: undefined,
      uploadDatabaseResult: "",
    };
    this.fileDatabase = React.createRef();
  }

  componentDidMount() {
    const tabFnMap = DatabaseTabs.map((tab) => this.bindTabActions(tab));
    this.setState({ tabFnMap: tabFnMap });
  }

  bindTabActions = (tab) => {
    let content = { ...tab };
    let type;
    // only upload need to bind actions
    switch (tab.content) {
      case Q8_DATABASE:
        type = "Database";
        content.fileKey = `upload${type}File`;
        content.uploadResultKey = `upload${type}Result`;
        content.upload = this.uploadDatabase;
        content.download = this.downloadDatabase;
        break;
      default:
        break;
    }
    return content;
  };

  chooseDatabaseFile = () => {
    this.fileDatabase.current.click();
  };

  onFileChangeDatabase = (e) => {
    if (e.target.files.length !== 0) {
      this.setState({ uploadDatabaseFile: e.target.files });
    } else {
      this.setState({ uploadDatabaseFile: undefined });
    }
    this.setState({ uploadDatabaseResult: "" });
  };

  uploadDatabase = async () => {
    if (this.state.uploadDatabaseFile !== undefined) {
      const response = await apiUploadDatebase(this.state.uploadDatabaseFile);
      if (response.result === true) {
        this.setState({ uploadDatabaseResult: "Success" });
        this.props.dispatch(showInfoBar("Upload Success !!"));
      } else {
        this.setState({ uploadDatabaseResult: "Fail" });
        this.props.dispatch(showInfoBar(response.data, "error"));
      }
    }
  };
  downloadDatabase = async () => {
    const response = await apiDownloadDatebase();
    if (response.result === true) {
      this.props.dispatch(showInfoBar("Download Success !!"));
    } else {
      this.props.dispatch(showInfoBar(response.data, "error"));
    }
  };

  render() {
    let {
      props: { mainTab, tab },
      state: { tabFnMap, uploadDatabaseFile, uploadDatabaseResult },
    } = this;
    return (
      <Fragment>
        <input
          type="file"
          name="file"
          onChange={this.onFileChangeDatabase}
          ref={this.fileDatabase}
          accept=".db,"
          multiple
          style={{ display: "none" }}
        />
        {mainTab === ALL &&
          tabFnMap.map((tab) => (
            <MainCard
              key={tab.content}
              tab={tab}
              selectTab={this.chooseDatabaseFile}
              currentFiles={this.state[tab.fileKey]}
              uploadResult={this.state[tab.uploadResultKey]}
              upload={tab.upload}
              download={tab.download}
            />
          ))}
        {mainTab === DATABASE && (
          <div className="mask-1">
            <div className="database-page">
              <div className="setting-database-lg"></div>
              <div className="database-page-content">
                {uploadDatabaseResult !== "" &&
                  (uploadDatabaseResult === "Fail" ? (
                    <p className="fail-upload">Fail ! please import again</p>
                  ) : (
                    <p className="success-upload">
                      Success ! Below are import file info !
                    </p>
                  ))}
                <section>
                  {uploadDatabaseFile == null && uploadDatabaseResult === "" ? (
                    <h4>OPPS ! NO FILE </h4>
                  ) : (
                    <h4>{uploadDatabaseFile[0]?.name}</h4>
                  )}
                  <div className="flex">
                    {uploadDatabaseFile == null &&
                    uploadDatabaseResult === "" ? (
                      <p>there's no file, please upload</p>
                    ) : (
                      <div>
                        <p>Size : {uploadDatabaseFile[0].size}</p>
                        <p>Updated : {uploadDatabaseFile[0].type}</p>
                      </div>
                    )}
                  </div>
                  <ExportAndImport
                    onClick={this.chooseDatabaseFile}
                    currentFiles={uploadDatabaseFile}
                    uploadResult={uploadDatabaseResult}
                    upload={this.uploadDatabase}
                    download={this.downloadDatabase}
                  />
                </section>
              </div>
            </div>
          </div>
        )}
      </Fragment>
    );
  }
}
