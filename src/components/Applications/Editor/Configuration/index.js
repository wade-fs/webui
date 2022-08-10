import React, { Fragment } from "react";
import { EditorContainer, EditorSubTab } from "components/Card";
import Info from "./Info";
import Property from "./Property";
import Connection from "./Connection";
import LoadBalance from "./LoadBalance";
import ScalingResolution from "./ScalingResolution";
import Server from "./Server";

import { updateApplication } from "actions/ApplicationActions";
import { loadServers } from "actions/ServerActions";

import { LOADING, LOADED } from "const/DataLoaderState";
import {
  extractFields,
  InfoFields,
  ApplicationOptionFields,
  ConnectionOptionFields,
  ScalingResolutionFields,
  LoadBalanceFields,
  ServerFields,
} from "const/Applications/ApplicationFieldNames";
import {
  APPLICATION_INFO,
  APPLICATION_GROUP_INFO,
  APPLICATION_PROPERTIES,
  VNC_INFO,
  VNC_GROUP_INFO,
  VNC_PROPERTIES,
  CONNECTION_PROPERTIES,
  SCALING_RESOLUTION,
  LOAD_BALANCED,
  SERVER,
} from "const/Applications/ApplicationConsts";

import { checkEdit } from "utils/Check";
import { getDataForBaseCard } from "utils/Object";

export default class Configuration extends React.Component {
  constructor(props) {
    super(props);
    const subTabs =
      props.treeTab === "RDS" ?
        (props.data.isGroup === false
          ? [
            APPLICATION_INFO,
            APPLICATION_PROPERTIES,
            // CONNECTION_PROPERTIES,
            SCALING_RESOLUTION,
            // LOAD_BALANCED,
            SERVER,
          ]
          : [APPLICATION_GROUP_INFO]) :
        (props.data.isGroup === false
          ? [
            VNC_INFO,
            VNC_PROPERTIES,
            // CONNECTION_PROPERTIES,
            SCALING_RESOLUTION,
            // LOAD_BALANCED,
            // SERVER,
          ]
          : [VNC_GROUP_INFO])
    this.state = {
      editData: {},
      subTabs: subTabs,
      info: {},
      properties: {},
      connection: {},
      scaling: {},
      loadBalanced: {},
      server: {},
      canApply: true,
    };
    props.dispatch(loadServers());
  }
  componentDidUpdate(prevProps) {
    if (prevProps.tab !== this.props.tab) {
      this.resetTab(this.props.tab);
    }
    if (
      prevProps.data.editingApplication.data !==
      this.props.data.editingApplication.data
    ) {
      const [info, properties, connection, scaling, loadBalanced, server] =
        this.extractData();
      this.setState(
        {
          info: info,
          properties: properties,
          connection: connection,
          scaling: scaling,
          loadBalanced: loadBalanced,
          server: server,
        },
        () => this.resetTab(this.props.tab)
      );
    }
  }
  change = (data, canApply, ...otherEdited) => {
    let {
      props: { tab },
    } = this;
    const oriData = this.getOriData(tab);
    let edited = checkEdit(data, oriData);
    if (otherEdited.length > 0 && edited === false) {
      edited = otherEdited.some((value) => value === true);
    }
    canApply = canApply && edited;
    this.setState(
      { editData: data, canApply: canApply },
      this.props.onChangeEdit(edited)
    );
  };
  edit = () => {
    let {
      props: { onEdit },
    } = this;
    onEdit();
  };
  cancel = () => {
    const { tab, onCancel } = this.props;
    this.resetTab(tab);
    onCancel();
  };
  apply = async () => {
    let {
      props: {
        dispatch,
        data: { editingId, isGroup },
        tab,
        onCancel,
      },
      state: { editData },
    } = this;
    let urlPath;
    switch (tab) {
      case APPLICATION_INFO:
      case APPLICATION_GROUP_INFO:
        urlPath = "info";
        break;
      case APPLICATION_PROPERTIES:
        urlPath = "property";
        break;
      case CONNECTION_PROPERTIES:
        urlPath = "connection";
        break;
      case SCALING_RESOLUTION:
        urlPath = "scaling-resolution";
        break;
      case LOAD_BALANCED:
        urlPath = "load-balance";
        break;
      case SERVER:
        urlPath = "server";
        break;
      default:
        break;
    }
    delete editData["Resolution"];
    dispatch(updateApplication(editingId, editData, isGroup, urlPath));
    this.resetTab(tab);
    onCancel();
  };

  resetTab = (tab) => {
    let {
      state: { editData },
    } = this;
    const oriData = this.getOriData(tab);
    editData = { ...oriData };
    this.setState({ editData: editData });
  };

  getOriData = (tab) => {
    let {
      state: { info, properties, connection, scaling, loadBalanced, server },
    } = this;
    let oriData;
    switch (tab) {
      case APPLICATION_INFO:
      case APPLICATION_GROUP_INFO:
      case VNC_INFO:
      case VNC_GROUP_INFO:
        oriData = info;
        break;
      case APPLICATION_PROPERTIES:
      case VNC_PROPERTIES:
        oriData = properties;
        break;
      case CONNECTION_PROPERTIES:
        oriData = connection;
        break;
      case SCALING_RESOLUTION:
        oriData = scaling;
        break;
      case LOAD_BALANCED:
        oriData = loadBalanced;
        break;
      case SERVER:
        oriData = server;
        break;
      default:
        break;
    }
    return oriData;
  };

  extractData = () => {
    let {
      props: {
        isLoading,
        data: { isGroup, editingApplication },
      },
    } = this;
    if (!isLoading) {
      if (isGroup === false) {
        const info = getDataForBaseCard(
          extractFields(editingApplication.data, InfoFields)
        );
        const properties = getDataForBaseCard(
          extractFields(editingApplication.data, ApplicationOptionFields)
        );
        const connection = getDataForBaseCard(
          extractFields(editingApplication.data, ConnectionOptionFields)
        );
        const scaling = getDataForBaseCard(
          extractFields(editingApplication.data, ScalingResolutionFields)
        );
        const loadBalanced = getDataForBaseCard(
          extractFields(editingApplication.data, LoadBalanceFields)
        );
        const server = getDataForBaseCard(
          extractFields(editingApplication.data, ServerFields)
        );
        return [
          info.data,
          properties.data,
          connection.data,
          scaling.data,
          loadBalanced.data,
          server.data,
        ];
      } else {
        const info = getDataForBaseCard(
          extractFields(editingApplication.data, InfoFields)
        );
        return [info.data];
      }
    }
  };

  render() {
    let {
      props: {
        isLoading,
        isLoaded,
        isEditMode,
        isEdited,
        data,
        dispatch,
        tab,
        currentTab,
        editingId,
        servers,
        selectConfigTab,
        treeTab,
        terminalsData
      },
      state: { editData, subTabs, canApply },
    } = this;
    let {
      editingApplication,
      applicationMainTree,
      applications,
      applicationGroups,
      vncMainTree,
      vncs,
      vncGroups,
    } = data;

    return (
      <Fragment>
        {isLoading && <p className="wrap-960">Loading...</p>}
        {!isLoading && !isLoaded && (
          <div className="wrap-960 wrap-bg-w modal-content-edit">
            No data found...
          </div>
        )}
        {!isLoading && isLoaded && (
          <Fragment>
            {editingApplication.state == LOADING && !editingApplication.data && (
              <div className="wrap-960" style={{ paddingTop: "40px" }}>
                Loading...
              </div>
            )}
            {editingApplication.state != LOADING &&
              !editingApplication.data && (
                <div className="wrap-960 wrap-bg-w modal-content-edit">
                  No data found...
                </div>
              )}
            {editingApplication.data != null && (
              <Fragment>
                <EditorSubTab
                  tabWidth={160}
                  tabZIndex={6}
                  tabClass="sub-tab-md"
                  subTabs={subTabs}
                  currentTab={tab}
                  selectTab={selectConfigTab}
                />
                <EditorContainer
                  isEditMode={isEditMode}
                  title={tab}
                  edited={isEdited}
                  canApply={canApply}
                  onEdit={this.edit}
                  onCancel={this.cancel}
                  onApply={this.apply}
                >
                  {(tab === APPLICATION_INFO ||
                    tab === APPLICATION_GROUP_INFO ||
                    tab === VNC_INFO ||
                    tab === VNC_GROUP_INFO) && (
                      <Info
                        isLoaded={isLoaded}
                        isEditMode={isEditMode}
                        isGroup={data.isGroup}
                        subEditorOpened={data.subEditorOpened}
                        data={editData}
                        dispatch={dispatch}
                        applicationMainTree={applicationMainTree}
                        objects={applications}
                        objectGroups={applicationGroups}
                        vncMainTree={vncMainTree}
                        vncs={vncs}
                        vncGroups={vncGroups}
                        editingId={editingId}
                        onChange={this.change}
                        tab={tab}
                        currentTab={currentTab}
                        treeTab={treeTab}
                        terminalsData={terminalsData}
                      />
                    )}
                  {tab === APPLICATION_PROPERTIES && (
                    <Property
                      isLoaded={isLoaded}
                      isEditMode={isEditMode}
                      data={editData}
                      onChange={this.change}
                    />
                  )}
                  {currentTab == "RDS" && tab === CONNECTION_PROPERTIES && (
                    <Connection
                      isLoaded={isLoaded}
                      isEditMode={isEditMode}
                      data={editData}
                      onChange={this.change}
                    />
                  )}
                  {tab === SCALING_RESOLUTION && (
                    <ScalingResolution
                      isLoaded={isLoaded}
                      isEditMode={isEditMode}
                      data={editData}
                      onChange={this.change}
                    />
                  )}
                  {currentTab == "RDS" && tab === LOAD_BALANCED && (
                    <LoadBalance
                      isLoaded={isLoaded}
                      isEditMode={isEditMode}
                      data={editData}
                      onChange={this.change}
                    />
                  )}
                  {currentTab == "RDS" && tab === SERVER && (
                    <Server
                      isLoaded={isLoaded}
                      isEditMode={isEditMode}
                      data={editData}
                      servers={servers}
                      onChange={this.change}
                    />
                  )}
                </EditorContainer>
              </Fragment>
            )}
          </Fragment>
        )}
      </Fragment>
    );
  }
}
