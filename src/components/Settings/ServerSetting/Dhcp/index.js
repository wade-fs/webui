import React, { Component, Fragment } from "react";
import DhcpInput from "./DhcpInput";
import DeleteTableAlert from "components/Alert/DeleteTableAlert";
import TabSwitchAlert from "components/Alert/TabSwitchAlert";

import { showInfoBar } from "actions/InfobarActions";

import { DHCP } from "const/Consts";
import {
  RangeIpStart,
  RangeIpEnd,
  SubnetMask,
  RouterIP,
  DEFAULT_DHCP,
} from "const/Setting/DHCP";

import {
  apiGetDHCPList,
  apiAddDHCP,
  apiGetDHCP,
  apiDeleteDHCP,
  apiUpdateDHCPRangeSet,
  apiUpdateDHCPExclusion,
  apiUpdateDHCPReservation,
  apiGetDHCPStatus,
  apiSwitchDHCPStatus,
} from "api";

export default class Dhcp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dhcpData: [],
      status: undefined,
      dhcpIdx: 0,
      nextdhcpIdx: null,
      isEditMode: false,
      showTabSwitchAlert: false,
      showDeleteAlert: false,
      canSwitch: true,
    };
  }

  async componentDidMount() {
    await this.getStatus();
    await this.getDHCP();
  }

  updateCanSwitch = (flag) => {
    this.setState({ canSwitch: flag });
  };

  getDHCP = async () => {
    const response = await apiGetDHCPList();
    if (response.result === true) {
      this.setState({
        dhcpData: [...response.data],
        dhcpIdx: 0,
      });
    }
    this.setState({
      isEditMode: false,
      showDeleteAlert: false,
      showTabSwitchAlert: false,
      canSwitch: true,
    });
  };

  deleteDHCP = async () => {
    let {
      props: { dispatch },
      state: { dhcpData, dhcpIdx },
    } = this;
    let id = dhcpData[dhcpIdx].RangeSet.Id;
    const response = await apiDeleteDHCP(id);
    if (response.result === true) {
      await this.getDHCP();
    } else {
      dispatch(showInfoBar(response.data, "error"));
    }
  };
  addDHCP = async (data) => {
    let {
      props: { dispatch },
    } = this;
    if (data.RangeSet.Id == null) data.RangeSet.Id = 0;
    const response = await apiAddDHCP(data);
    if (response.result === true) {
      await this.getDHCP();
    } else {
      dispatch(showInfoBar(response.data, "error"));
    }
    this.setState({ canSwitch: true });
  };
  updateDHCP = async (updateTypes, data) => {
    let {
      props: { dispatch },
    } = this;
    let promises = updateTypes.map((type) => {
      let upadteData;
      if (type === "RangeSet") upadteData = data.RangeSet;
      if (type === "Exclusions") upadteData = data.Exclusions;
      if (type === "Reservations") upadteData = data.Reservations;
      return this.updateSingleDHCP(type, upadteData);
    });
    Promise.all(promises)
      .then(async (results) => {
        const hasError = results.some((item) => item.result === false);
        if (hasError) throw Error("Update Error");
        await this.getDHCP();
        this.setState({ canSwitch: true });
      })
      .catch((err) => {
        dispatch(showInfoBar(err.message, "error"));
        this.setState({ canSwitch: true });
      });
  };
  updateSingleDHCP = async (updateType, data) => {
    let response;
    switch (updateType) {
      case "RangeSet":
        response = await apiUpdateDHCPRangeSet(data.Id, data.RangeSet);
        break;
      case "Exclusions":
        response = await apiUpdateDHCPExclusion(data.Id, data.Exclusions);
        break;
      case "Reservations":
        response = await apiUpdateDHCPReservation(data.Id, data.Reservations);
        break;
      default:
        break;
    }
    return response;
  };

  async getStatus() {
    const response = await apiGetDHCPStatus();
    if (response.result === true) {
      const status = response.data;
      if (typeof response.data === "string") {
        let dhcpCheck = document.getElementById("dhcp-enable-checkbox");
        if (response.status === "start") {
          dhcpCheck.defaultChecked = true;
        } else {
          dhcpCheck.defaultChecked = false;
        }

        this.setState({ status: status });
      } else {
        this.setState({ status: undefined });
      }
    } else {
      this.setState({ status: undefined });
    }
  }

  setStatus = async () => {
    let {
      state: { status },
    } = this;

    let action;
    if (status === "start") {
      action = "stop";
    } else if (status === "stop") {
      action = "start";
    }
    const response = await apiSwitchDHCPStatus(action);
    if (response.result === true) {
      if (typeof result.data === "string") {
        this.setState({ status: result.data });
      } else {
        this.setState({ status: undefined });
      }
    } else {
      this.setState({ status: undefined });
    }
  };

  apply = async (
    data,
    rangeSetEdited,
    exclutionsEdited,
    reservationsEdited
  ) => {
    let {
      state: { dhcpIdx },
    } = this;
    if (dhcpIdx == null) {
      await this.addDHCP(data);
    } else {
      let updateTypes = [];
      if (rangeSetEdited === true) updateTypes.push("RangeSet");
      if (exclutionsEdited === true) updateTypes.push("Exclusions");
      if (reservationsEdited === true) updateTypes.push("Reservations");
      await this.updateDHCP(updateTypes, data);
    }
  };
  cancel = () => {
    this.setState({
      dhcpIdx: this.state.dhcpIdx ?? 0,
      isEditMode: false,
      canSwitch: true,
    });
  };
  add = () => {
    if (this.state.canSwitch === true) {
      this.setState({
        dhcpIdx: null,
        nextdhcpIdx: null,
        isEditMode: true,
      });
    } else {
      this.openTabSwitchAlert(null);
    }
  };
  edit = () => {
    this.setState({ isEditMode: true });
  };
  select = (dhcpIdx) => {
    if (this.state.canSwitch === false) {
      this.openTabSwitchAlert(dhcpIdx);
    } else {
      this.setState({
        dhcpIdx: dhcpIdx,
        isEditMode: false,
      });
    }
  };

  openDeleteAlert = () => {
    this.setState({ showDeleteAlert: true });
  };
  closeDeleteAlert = () => {
    this.setState({ showDeleteAlert: false });
  };

  confirmSwitch = () => {
    let {
      state: { dhcpData, nextdhcpIdx },
    } = this;
    if (dhcpData[nextdhcpIdx] != null) {
      this.setState({
        dhcpIdx: nextdhcpIdx,
        nextdhcpIdx: null,
        isEditMode: false,
      });
    } else {
      this.setState({
        dhcpIdx: null,
        nextdhcpIdx: null,
        isEditMode: true,
      });
    }
    this.setState({
      showTabSwitchAlert: false,
      canSwitch: true,
    });
  };

  openTabSwitchAlert = (index) => {
    this.setState({
      nextdhcpIdx: index,
      showTabSwitchAlert: true,
    });
  };
  closeTabSwitchAlert = () => {
    this.setState({
      showTabSwitchAlert: false,
    });
  };

  scrollTo = (ref) => {
    if (ref /* + other conditions */) {
      ref.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  render() {
    let {
      state: {
        dhcpData,
        isEditMode,
        dhcpIdx,
        nextdhcpIdx,
        showDeleteAlert,
        status,
        showTabSwitchAlert,
      },
    } = this;

    return (
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          height: "100%",
        }}
      >
        <div className="setting-sidebar">
          <div className="dhcp-checkbox">
              <input
                id="dhcp-enable-checkbox"
                type="checkbox"
                onClick={status !== undefined ? this.setStatus : null}
                style={
                  status !== undefined
                    ? {
                        cursor: "pointer",
                      }
                    : { cursor: "not-allowed" }
                }
                disabled={status !== undefined ? false : true}
              />
              Enable DHCP
              <div
                style={{
                  fontSize: "14px",
                  fontWeight: "500",
                  margin: "10px 0",
                }}
              >
                {status !== undefined
                  ? `Status: 
            ${status}`
                  : "Status: Loading"}
              </div>
            </div>
          <h3 className="left-right">
            IP Range
            <div
              className="editor-add"
              data-hidden={isEditMode}
              onClick={this.add}
            ></div>
          </h3>
          {Array.isArray(dhcpData) && (
            <Fragment>
              <ul className="dhcp-total-table-list-scroll">
                {dhcpData.map((item, idx) => (
                  <li
                    key={idx}
                    className="dhcp-total-table-list"
                    style={
                      dhcpIdx === idx ? { backgroundColor: "#80bc00" } : null
                    }
                    ref={
                      dhcpIdx === idx && dhcpIdx != null ? this.scrollTo : null
                    }
                    onClick={() => this.select(idx)}
                  >
                    <span className="list">{item.RangeSet[RangeIpStart]}</span>
                    <div className="dhcp-arrow-white-icon"></div>
                    <span className="list">{item.RangeSet[RangeIpEnd]}</span>
                  </li>
                ))}
              </ul>
            </Fragment>
          )}
        </div>
        {Array.isArray(dhcpData) &&
          (dhcpData[dhcpIdx] != null || dhcpIdx == null) && (
            <DhcpInput
              isEditMode={isEditMode}
              dhcpData={dhcpData}
              dhcpIdx={dhcpIdx}
              onEdit={this.edit}
              onDelete={this.openDeleteAlert}
              onCancel={this.cancel}
              onApply={this.apply}
              updateCanSwitch={this.updateCanSwitch}
            />
          )}
        {showDeleteAlert && (
          <DeleteTableAlert
            title={DHCP}
            tableLayout={getDeleteLayout(dhcpData[dhcpIdx])}
            onConfirm={this.deleteDHCP}
            onClose={this.closeDeleteAlert}
          />
        )}
        {showTabSwitchAlert && (
          <TabSwitchAlert
            tab={
              nextdhcpIdx === undefined
                ? "create new dhcp"
                : `${dhcpData[nextdhcpIdx].RangeSet.RangeIpStart} to ${dhcpData[nextdhcpIdx].RangeSet.RangeIpEnd}`
            }
            yes={this.confirmSwitch}
            no={this.closeTabSwitchAlert}
          />
        )}
      </div>
    );
  }
}

function getDeleteLayout(deleteData) {
  if (deleteData !== undefined) {
    return (
      <Fragment>
        <ul className="dhcp-table-delete">
          <li>Starting IP Address </li>
          <li>Ending IP Address </li>
        </ul>
        <ul className="dhcp-table-delete">
          <li>{deleteData.RangeSet[RangeIpStart]}</li>
          <li>{deleteData.RangeSet[RangeIpEnd]}</li>
        </ul>
      </Fragment>
    );
  }
}
