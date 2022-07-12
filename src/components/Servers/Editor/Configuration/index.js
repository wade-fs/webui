import React, { Fragment } from "react";
import { EditorContainer, EditorSubTab } from "components/Card";
import InfoCard from "./InfoCard";
import LoadBalanceCard from "./LoadBalanceCard";
import DataGatheringCard from "./DataGatheringCard";
import UserAccessCard from "./UserAccessCard";

import { updateServer } from "actions/ServerActions";

import {
  RdsServerTabs,
  RdsServerGroupTabs,
  RDS_SERVER_INFO,
  RDS_SERVER_GROUP_INFO,
  USER_ACCESS,
  DATA_GATHERING,
  LOAD_BALANCE,
  SCHEDULE,
} from "const/Servers/ServerConsts";
import {
  InfoFields,
  LoadBalancedFields,
  DataGatheringFields,
  extractFields,
  extractAuthUser,
} from "const/Servers/ServerFieldNames";

import { checkEdit } from "utils/Check";
import { getDataForBaseCard } from "utils/Object";

export default class Configuration extends React.Component {
  constructor(props) {
    super(props);
    const subTabs =
      props.data.isGroup === false ? RdsServerTabs : RdsServerGroupTabs;
    this.state = {
      editData: {},
      subTabs: subTabs,
      info: {},
      dataGathering: {},
      loadBalanced: {},
      authUser: {},
      canApply: true,
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.tab !== this.props.tab) {
      this.resetTab(this.props.tab);
    }
    if (
      prevProps.data.editingServer.data !== this.props.data.editingServer.data
    ) {
      const [info, loadBalanced, dataGathering, authUser] = this.extractData();
      this.setState(
        {
          info: info,
          dataGathering: dataGathering,
          loadBalanced: loadBalanced,
          authUser: authUser,
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
    let edtied = checkEdit(data, oriData);
    if (otherEdited.length > 0 && edtied === false) {
      edtied = otherEdited.some((value) => value === true);
    }
    canApply = canApply && edtied;
    this.setState(
      { editData: data, canApply: canApply },
      this.props.onChangeEdit(edtied)
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
      case RDS_SERVER_INFO:
      case RDS_SERVER_GROUP_INFO:
        urlPath = "info";
        break;
      case DATA_GATHERING:
        urlPath = "data-gathering";
        break;
      case LOAD_BALANCE:
        urlPath = "property";
        break;
      case USER_ACCESS:
        urlPath = "user-access";
        break;
      default:
        break;
    }
    dispatch(updateServer(editingId, editData, isGroup, urlPath));
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
      state: { info, loadBalanced, dataGathering, authUser },
    } = this;
    let oriData;
    switch (tab) {
      case RDS_SERVER_INFO:
      case RDS_SERVER_GROUP_INFO:
        oriData = info;
        break;
      case DATA_GATHERING:
        oriData = dataGathering;
        break;
      case LOAD_BALANCE:
        oriData = loadBalanced;
        break;
      case USER_ACCESS:
        oriData = authUser;
        break;
      default:
        break;
    }
    return oriData;
  };

  extractData = () => {
    let {
      props: {
        data: { editingServer },
      },
    } = this;
    const info = getDataForBaseCard(
      extractFields(editingServer.data, InfoFields)
    );
    const loadBalanced = getDataForBaseCard(
      extractFields(editingServer.data, LoadBalancedFields)
    );
    const dataGathering = getDataForBaseCard(
      extractFields(editingServer.data, DataGatheringFields)
    );
    const authUser = getDataForBaseCard(extractAuthUser(editingServer.data));

    return [info.data, loadBalanced.data, dataGathering.data, authUser.data];
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
        selectConfigTab,
      },
      state: { editData, subTabs, canApply },
    } = this;
    let {
      isGroup,
      editingId,
      servers,
      serverGroups,
      serverMainTree,
      adUsers,
      editingServer,
      verifyAuthUserResult,
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
            <EditorSubTab
              tabWidth={190}
              tabZIndex={6}
              tabClass="sub-tab-lg"
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
              {(tab === RDS_SERVER_INFO || tab === RDS_SERVER_GROUP_INFO) && (
                <InfoCard
                  dispatch={dispatch}
                  isLoaded={isLoaded}
                  isEditMode={isEditMode}
                  isGroup={isGroup}
                  data={editData}
                  editingId={editingId}
                  serverMainTree={serverMainTree}
                  objects={servers}
                  objectGroups={serverGroups}
                  onChange={this.change}
                />
              )}
              {/* {tab === LOAD_BALANCE
                    ? !isGroup && (
                        <LoadBalanceCard
                          dispatch={dispatch}
                          isLoaded={isLoaded}
                          isEditMode={isEditMode}
                          isGroup={isGroup}
                          data={editData}
                          onChange={this.change}
                        />
                      )
                    : null} */}
              {tab === DATA_GATHERING && !isGroup && (
                <DataGatheringCard
                  dispatch={dispatch}
                  isLoaded={isLoaded}
                  isEditMode={isEditMode}
                  isGroup={isGroup}
                  data={editData}
                  onChange={this.change}
                />
              )}
              {/* {tab === USER_ACCESS && !isGroup && (
                    <UserAccessCard
                      dispatch={dispatch}
                      isLoaded={isLoaded}
                      isEditMode={isEditMode}
                      data={editData}
                      adUsers={adUsers}
                      verifyAuthUserResult={verifyAuthUserResult}
                      onChange={this.change}
                    />
                  )} */}
            </EditorContainer>
          </Fragment>
        )}
      </Fragment>
    );
  }
}
