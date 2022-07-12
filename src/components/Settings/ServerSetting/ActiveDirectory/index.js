import React, { Fragment } from "react";
import ActiveDirectoryInput from "./ActiveDirectoryInput";
import TabSwitchAlert from "components/Alert/TabSwitchAlert";
import DeleteTableAlert from "components/Alert/DeleteTableAlert";
import { showInfoBar } from "actions/InfobarActions";

import {
  apiGetAdServerList,
  apiGetAdServer,
  apiAddAdServer,
  apiUpdateAdServer,
  apiDeleteAdServer,
} from "api";

const ACTIVE_DIRECTORY_TABLE_TITLES = ["AD SERVER IP", "USER NAME"];

export default class ActiveDirectory extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isEditMode: false,
      data: [],
      adServerIdx: -1,
      nextadServerIdx: -1,
      showDeleteAlert: false,
      showTabSwitchAlert: false,
      canSwitch: true,
    };
  }

  async componentDidMount() {
    await this.getAdServers();
  }

  updateCanSwitch = (flag) => {
    this.setState({ canSwitch: flag });
  };

  getAdServers = async (currentIdx = 0) => {
    const response = await apiGetAdServerList();
    if (response.result) {
      const adServers = response.data;
      let updateIdx = adServers.length > 0 ? currentIdx : -1;
      if (updateIdx === -1 && adServers.length > 0) updateIdx = 0;
      this.setState({
        adServerIdx: updateIdx,
        data: adServers,
      });
    }
    this.setState({
      isEditMode: false,
      showDeleteAlert: false,
      canSwitch: true,
    });
  };

  addAdServer = async (updated) => {
    let {
      props: { dispatch },
      state: { data },
    } = this;
    const response = await apiAddAdServer(updated);
    if (response.result === true) {
      await this.getAdServers(data.length);
    } else {
      dispatch(showInfoBar(response.data, "error"));
    }
    this.setState({ canSwitch: true });
  };
  updateServer = async (data) => {
    let {
      props: { dispatch },
    } = this;
    const response = await apiUpdateAdServer(data.Id, data);
    if (response.result === true) {
      await this.getAdServers(this.state.adServerIdx);
    } else {
      dispatch(showInfoBar(response.data, "error"));
    }
    this.setState({ canSwitch: true });
  };
  deleteAdServer = async () => {
    let {
      props: { dispatch },
      state: { data, adServerIdx },
    } = this;
    const response = await apiDeleteAdServer(data[adServerIdx].Id);
    const updateIdx = adServerIdx - 1 > 0 ? adServerIdx - 1 : -1;

    if (response.result === true) {
      await this.getAdServers(updateIdx);
    } else {
      dispatch(showInfoBar(response.data, "error"));
    }
    this.setState({ isEditMode: false });
  };

  apply = async (updated) => {
    let {
      state: { data, adServerIdx },
    } = this;
    if (adServerIdx !== -1) {
      updated.Id = data[adServerIdx].Id;
      await this.updateServer(updated);
    } else {
      delete updated["Id"];
      await this.addAdServer(updated);
    }
  };
  cancel = () => {
    let {
      state: { data, adServerIdx },
    } = this;
    this.setState({
      adServerIdx: adServerIdx === -1 && data.length > 0 ? 0 : adServerIdx,
      isEditMode: false,
      canSwitch: true,
    });
  };
  delete = () => {
    this.setState({ showDeleteAlert: true });
  };
  edit = () => {
    this.setState({ isEditMode: true });
  };
  add = () => {
    let {
      state: { canSwitch },
    } = this;

    if (canSwitch === true) {
      this.setState({ adServerIdx: -1, isEditMode: true });
    } else {
      this.openTabSwitchAlert(-1);
    }
  };
  select = (adServerIdx) => {
    if (this.state.canSwitch === false) {
      this.openTabSwitchAlert(adServerIdx);
    } else {
      this.setState({
        adServerIdx: adServerIdx,
        isEditMode: false,
      });
    }
  };

  confirmSwitch = () => {
    let {
      state: { data, nextadServerIdx },
    } = this;
    if (data[nextadServerIdx] !== -1) {
      this.setState({
        adServerIdx: nextadServerIdx,
        nextadServerIdx: -1,
        isEditMode: false,
      });
    } else {
      this.setState({
        adServerIdx: -1,
        nextadServerIdx: -1,
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
      nextadServerIdx: index,
      showTabSwitchAlert: true,
    });
  };
  closeTabSwitchAlert = () => {
    this.setState({
      showTabSwitchAlert: false,
    });
  };
  closeDeleteAlert = () => {
    this.setState({
      showDeleteAlert: false,
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
        data,
        adServerIdx,
        isEditMode,
        showDeleteAlert,
        showTabSwitchAlert,
        nextadServerIdx,
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
        <div className="setting-sidebar left-right mb-24">
          <h3 className="left-right">
            ACTIVE DIRECTORY
            <div
              className="editor-add"
              data-hidden={isEditMode}
              onClick={this.add}
            ></div>
          </h3>
          <ul className="dhcp-total-table left-right">
            <li>AD server IP</li>
            <li>User Name</li>
          </ul>
          <div className="dhcp-total-table-list-scroll">
            {Array.isArray(data) &&
              data.map((item, idx) => (
                <ul
                  key={idx}
                  className="dhcp-total-table-list"
                  style={
                    adServerIdx === idx ? { backgroundColor: "#80bc00" } : null
                  }
                  ref={adServerIdx === idx ? this.scrollTo : null}
                  onClick={adServerIdx !== idx ? () => this.select(idx) : null}
                >
                  {Object.keys(data[idx]).map((key) =>
                    key === "GUID" || key === "Username" ? (
                      <li key={key}>{item[key]}</li>
                    ) : null
                  )}
                </ul>
              ))}
          </div>
          {showDeleteAlert && (
            <DeleteTableAlert
              title="ACTIVE DIRETORY"
              tableLayout={getDeleteLayout(data[adServerIdx])}
              onConfirm={this.deleteAdServer}
              onClose={this.closeDeleteAlert}
            />
          )}
        </div>
        {Array.isArray(data) && (
          <ActiveDirectoryInput
            isEditMode={isEditMode}
            data={data}
            adServerIdx={adServerIdx}
            onDelete={this.delete}
            onEdit={this.edit}
            onCancel={this.cancel}
            onApply={this.apply}
            updateCanSwitch={this.updateCanSwitch}
          />
        )}
        {showTabSwitchAlert && (
          <TabSwitchAlert
            tab={
              nextadServerIdx === -1
                ? "create new ad server"
                : `${adServers[nextadServerIdx].GUID}`
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
          <li>AD server IP address</li>
          <li>Username</li>
        </ul>
        <ul className="dhcp-table-delete">
          <li>{deleteData?.GUID}</li>
          <li>{deleteData?.Username}</li>
        </ul>
      </Fragment>
    );
  }
}
