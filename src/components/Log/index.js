import React, { Component } from "react";
import { connect } from "react-redux";
import { LogTable } from "./LogTable";

import { showInfoBar } from "actions/InfobarActions";

import {
  LOG_LEVEL_LIST,
  LOG_LEVEL_LIST2,
  LOG_SERVER_CLASS_LIST,
  LOG_TERMINAL_CLASS_LIST,
} from "const/Other/LogConsts";

import {
  apiGetServerLog,
  apiGetTerminalLog,
  apiDownloadServerLog,
  apiDownloadTerminalLog,
  apiDeleteServerLog,
  apiDeleteTerminalLog,
} from "api";

class Log extends Component {
  constructor(props) {
    super(props);
    const today = new Date().toLocaleString("en-us", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
    const dateArray = today.split("/");
    const date = [dateArray[2], dateArray[0], dateArray[1]].join("-");
    this.state = {
      logData: undefined,
      startDate: date,
      endDate: date,
      logLevel: "",
      logClass: "",
      isLoading: false,
      updateResult: undefined,
      error: {},
      currentPage: 1,
    };
  }

  onChangeDate = (e) => {
    if (e.target.id === "date_start") {
      let startDate = e.target.value.replace(/-/g, "");
      let endDate = this.state.endDate.replace(/-/g, "");
      if (endDate >= startDate) {
        this.setState({
          error: { startDateError: "" },
          startDate: e.target.value,
        });
      } else {
        this.setState(
          {
            error: { startDateError: "Start date too big" },
            startDate: e.target.value,
          },
          () => {
            // e.preventDefault();
          }
        );
      }
    } else {
      let startDate = this.state.startDate.replace(/-/g, "");
      let endDate = e.target.value.replace(/-/g, "");
      if (endDate >= startDate) {
        this.setState({ error: { endDateError: "" }, endDate: e.target.value });
      } else {
        this.setState(
          {
            error: { endDateError: "End date too small" },
            endDate: e.target.value,
          },
          () => {
            // e.preventDefault();
          }
        );
      }
    }
  };

  onChangelogLevel = (e) => {
    this.setState({ logLevel: e.target.value });
  };

  onChangeLogClass = (e) => {
    this.setState({ logClass: e.target.value });
  };

  searchServerLog = async () => {
    let {
      state: { startDate, endDate, logLevel, logClass },
    } = this;
    this.setState({ isLoading: true });
    const response = await apiGetServerLog(
      startDate,
      endDate,
      logLevel,
      logClass
    );
    if (response.result === true) {
      if (Array.isArray(response.data)) {
        this.props.dispatch(showInfoBar("Search server Log success"));

        this.setState({
          logData: response.data,
          isLoading: false,
          updateResult: true,
        });
      }
    } else {
      this.props.dispatch(showInfoBar(response.data, "error"));
      this.setState({
        logData: undefined,
        isLoading: false,
        updateResult: false,
      });
    }
  };
  searchTerminalLog = async () => {
    let {
      props: { terminalId },
      state: { startDate, endDate, logLevel, logClass },
    } = this;
    this.setState({ isLoading: true });
    const response = await apiGetTerminalLog(
      startDate,
      endDate,
      logLevel,
      logClass,
      terminalId
    );
    if (response.result === true) {
      this.props.dispatch(showInfoBar("Search terminal Log success"));
      if (Array.isArray(response.data)) {
        this.setState({
          logData: response.data,
          isLoading: false,
          updateResult: true,
        });
      }
    } else {
      this.props.dispatch(showInfoBar(response.data, "error"));
      this.setState({
        logData: undefined,
        isLoading: false,
        updateResult: false,
      });

      // this.setState({ logData: undefined, isLoading: false, updateResult: false });
    }
  };
  downloadServerLog = async () => {
    const response = await apiDownloadServerLog();
    if (response.result === true) {
      this.props.dispatch(showInfoBar("Download server Log success"));
    } else {
      this.props.dispatch(showInfoBar(response.data, "error"));
    }
  };
  downloadTerminalLog = async () => {
    let {
      props: { terminalId },
    } = this;
    const response = await apiDownloadTerminalLog(terminalId);
    if (response.result === true) {
      this.props.dispatch(showInfoBar("Download terminal Log success"));
    } else {
      this.props.dispatch(showInfoBar(response.data, "error"));
    }
  };
  deleteServerLog = async () => {
    const response = await apiDeleteServerLog();
    if (response.result === true) {
      this.props.dispatch(showInfoBar("Delete server Log success"));
      this.setState({
        logData: [],
      });
    } else {
      this.props.dispatch(showInfoBar(response.data, "error"));
    }
  };
  deleteTerminalLog = async () => {
    let {
      props: { terminalId },
    } = this;
    const response = await apiDeleteTerminalLog(terminalId);
    if (response.result === true) {
      this.props.dispatch(showInfoBar("Delete terminal Log success"));
      this.setState({
        logData: [],
      });
    } else {
      this.props.dispatch(showInfoBar(response.data, "error"));
    }
  };

  render() {
    let {
      props: { type, terminalId },
      state: { logLevel, logClass, error },
    } = this;
    const canSearch =
      !error.startDateError &&
      !error.endDateError &&
      this.state.logLevel !== "" &&
      (type === "terminal" || this.state.logClass !== "")
        ? true
        : false;
    const CLASS_LIST =
      type === "terminal" ? LOG_TERMINAL_CLASS_LIST : LOG_SERVER_CLASS_LIST;
    const LLL = type === "terminal" ? LOG_LEVEL_LIST2 : LOG_LEVEL_LIST;
    return (
      <div className="log-container">
        <div id="log_search_bar">
          <div className="inline-flex-column">
            <input
              type="date"
              id="date_start"
              style={{
                margin: "0px 10px",
                width: "130px",
              }}
              value={this.state.startDate}
              onChange={this.onChangeDate}
              data-date-format="YYYY-MM-DD"
              required
            />
            <span className="msg err ml-12">
              {error.startDateError !== "" ? error.startDateError : " "}
            </span>
          </div>
          ~
          <div className="inline-flex-column">
            <input
              type="date"
              id="date_end"
              style={{ margin: "0px 10px", width: "130px" }}
              value={this.state.endDate}
              onChange={this.onChangeDate}
              data-date-format="YYYY-MM-DD"
              required
            />
            <span className="msg err ml-12">
              {error.endDateError !== "" ? error.endDateError : " "}
            </span>
          </div>
          <select
            id="log_level"
            className="inline-flex"
            style={{
              width: "90px",
              margin: "0px 10px",
            }}
            onChange={this.onChangelogLevel}
            value={logLevel}
          >
            {LLL.map((item, idx) =>
              idx === 0 ? (
                <option key={item} value="" disabled>
                  {item}
                </option>
              ) : (
                <option key={item} value={item === "All" ? "*" : item}>
                  {item}
                </option>
              )
            )}
          </select>
          <select
            id="log_class"
            className="inline-flex"
            style={{
              width: "136px",
              margin: "0px 10px",
            }}
            onChange={this.onChangeLogClass}
            value={logClass}
          >
            {CLASS_LIST.map((item, idx) =>
              idx === 0 ? (
                <option key={item} value="" disabled>
                  {item}
                </option>
              ) : (
                <option key={item} value={item === "All" ? "*" : item}>
                  {item}
                </option>
              )
            )}
          </select>
          <div
            className="search-btn"
            disabled={!canSearch}
            onClick={
              canSearch
                ? type === "terminal"
                  ? this.searchTerminalLog
                  : this.searchServerLog
                : null
            }
          >
            SEARCH <div className="icon-search-sm"></div>
          </div>
          <div className="log-actions">
            <div
              className="list-action-download"
              onClick={
                type === "terminal"
                  ? this.downloadTerminalLog
                  : this.downloadServerLog
              }
            ></div>
            <div
              className="list-action-delete"
              onClick={
                type === "terminal"
                  ? () => this.deleteTerminalLog(terminalId)
                  : this.deleteServerLog
              }
            ></div>
          </div>
        </div>
        {Array.isArray(this.state.logData) && this.state.logData.length > 0 ? (
          <LogTable data={this.state.logData} type={type} />
        ) : this.state.updateResult ? (
          this.state.isLoading ? (
            <div className="log-result-content">
              <p>Loading</p>
            </div>
          ) : (
            <div className="log-result-content">
              <div className="icon-no-data"></div>
              <p>No items found</p>
            </div>
          )
        ) : this.state.isLoading ? (
          <div className="log-result-content">
            <p>Loading</p>
          </div>
        ) : null}
      </div>
    );
  }
}

export default connect((state) => {
  return { infobar: state.infobar };
})(Log);
