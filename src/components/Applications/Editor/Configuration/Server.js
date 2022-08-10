import React, { Fragment } from "react";
import { EditorField } from "components/Card";
import ObjectPicker from "components/ObjectCommon/ObjectPicker";
import DeleteObjectAlert from "components/Alert/DeleteObjectAlert";
import Slider from "components/Form/Slider";

import { stringValid } from "lib/Util";

export default class Server extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showServerPicker: false,
      showServerDeleteAlert: false,
      deleteIdx: -1,
    };
  }

  change = (e) => {
    let {
      props: { data, onChange },
    } = this;
    data[e.target.name] = e.target.value;
    const canApply =
      stringValid(data.RdsServerIds) && data.RdsServerIds.length > 0;
    onChange(data, canApply);
  };

  addServer = (serverId) => {
    let {
      props: { data, onChange },
    } = this;
    data.RdsServerIds =
      data.RdsServerIds == null || data.RdsServerIds.length == 0
        ? `${serverId}`
        : `${data.RdsServerIds},${serverId}`;
    this.closeServerPicker();
    const canApply =
      stringValid(data.RdsServerIds) && data.RdsServerIds.length > 0;
    onChange(data, canApply);
  };
  removeServer = () => {
    let {
      props: { data, onChange },
      state: { deleteIdx },
    } = this;
    let serverArray = data.RdsServerIds.split(",");
    serverArray.splice(deleteIdx, 1);
    data.RdsServerIds = serverArray.join(",");
    this.closeServerDeleteAlert();
    const canApply =
      stringValid(data.RdsServerIds) && data.RdsServerIds.length > 0;
    onChange(data, canApply);
  };

  openServerPicker = () => {
    this.setState({
      showServerPicker: true,
    });
  };
  closeServerPicker = () => {
    this.setState({
      showServerPicker: false,
    });
  };
  openServerDeleteAlert = (idx) => {
    this.setState({
      deleteIdx: idx,
      showServerDeleteAlert: true,
    });
  };
  closeServerDeleteAlert = () => {
    this.setState({
      deleteIdx: -1,
      showServerDeleteAlert: false,
    });
  };

  getWrapperField(title, name, options, Tag) {
    let {
      props: { isEditMode, data },
    } = this;
    return (
      <EditorField
        title={title}
        name={name}
        options={{ value: data[name], ...options }}
        Tag={Tag}
        isEditMode={isEditMode}
        onChange={this.change}
      />
    );
  }

  getItem(server, index) {
    let {
      props: { isEditMode },
    } = this;
    return (
      <Fragment key={server.Id}>
        {!isEditMode && <p data-view>{server["Name"]}</p>}
        {isEditMode && (
          <div className="flex mt-8">
            <div
              className="action-delete-sm"
              onClick={() => this.openServerDeleteAlert(index)}
            ></div>
            <p> {server.Name}</p>
          </div>
        )}
      </Fragment>
    );
  }

  render() {
    let {
      props: { isLoaded, isEditMode, data, servers, rdss, rdsGroups, rdsMainTree, vncs, vncGroups, vncMainTree, currentTab },
      state: { showServerPicker, showServerDeleteAlert, deleteIdx },
    } = this;
    let rdsServers = [];
    if (
      data.RdsServerIds &&
      servers &&
      servers.servers &&
      servers.servers.data
    ) {
      rdsServers = data.RdsServerIds.split(",")
        .map((id) => servers.servers.data.find((server) => server.Id == id))
        .filter((server) => server);
    }
    return (
      isLoaded && (
        <Fragment>
          <ul className="editor-content">
            <li>
              <label>WORKSTATION LIST</label>
              {isEditMode && (
                <div
                  className="addnew-btn mb-26"
                  style={rdsServers.length < 1 ? {} : { display: "none" }}
                  onClick={this.openServerPicker}
                >
                  ＋ ADD NEW
                </div>
              )}
              {rdsServers.map((server, idx) => this.getItem(server, idx))}
            </li>
            {/* {this.getWrapperField(
              "USE RD GATEWAY SERVER",
              "UseRDGateway",
              {
                type: "slide",
                className: "slideline2 w-152",
              },
              Slider
            )}
            {this.getWrapperField(
              "BYPASS RD GATEWAY SERVER FOR LOCAL ADDRESSES",
              "IgnoreRDGatewayIfLocal",
              { type: "slide", className: "slideline2 w-152" },
              Slider
            )} */}
          </ul>
          {showServerPicker && (
            <ObjectPicker
              treeType="appServer"
              mainTree={servers.serverMainTree.data}
            rdss={rdss} rdsGroups={rdsGroups} rdsMainTree={rdsMainTree}
            vncs={vncs} vncGroups={vncGroups} vncMainTree={vncMainTree}
            currentTab={currentTab}
              pickerTitle="ADD RDS SERVER"
              onCancel={this.closeServerPicker}
              onConfirm={this.addServer}
            />
          )}
          {showServerDeleteAlert && (
            <DeleteObjectAlert
              isPermanently={false}
              description2="from the application?"
              objectType="server"
              objectName={deleteIdx != -1 ? rdsServers[deleteIdx].Name : ""}
              yes={this.removeServer}
              no={this.closeServerDeleteAlert}
            />
          )}
        </Fragment>
      )
    );
  }
}
