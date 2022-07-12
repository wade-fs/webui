import React, { Fragment } from "react";
import { connect } from "react-redux";
import { MainCard } from "components/Card/SettingCard";
import UserInput from "./UserInput";
import DeleteObjectAlert from "components/Alert/DeleteObjectAlert";
import TabSwitchAlert from "components/Alert/TabSwitchAlert";

import {
  loadUsers,
  addUser,
  deleteUser,
  updateUser,
} from "actions/AuthActions";

import { LOADED, LOADING } from "const/DataLoaderState";
import { ALL, ADMIN_SETTING } from "const/Consts";
import { ADMIN } from "const/Setting/User";
import { AdminTabs } from "const/Setting/Tab";

import { getUpdatedIndex } from "../../../utils/Object";

class AdminSetting extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tabFnMap: [],
      data: { ...props.userInfo?.data },
      role: ADMIN,
      loginUserIdx: -1,
      selectedIdx: -1,
      nextUserIdx: -1,
      isEditMode: false,
      showDeleteAlert: false,
      showTabSwitchAlert: false,
      canSwitch: true,
    };
    props.dispatch(loadUsers());
  }

  componentDidMount() {
    const tabFnMap = AdminTabs.map((tab) => this.bindTabActions(tab));
    this.setState({
      tabFnMap: tabFnMap,
    });
  }
  componentDidUpdate(prevProps) {
    if (
      (prevProps.mainTab !== this.props.mainTab &&
        this.props.mainTab === ADMIN_SETTING) ||
      (this.props.userList.state === LOADED &&
        this.props.userList.data !== prevProps.userList.data)
    ) {
      const updatedIdx = getUpdatedIndex(
        prevProps.userList.data ?? [],
        this.props.userList.data,
        this.state.selectedIdx
      );
      this.setState({
        selectedIdx: updatedIdx,
        isEditMode: false,
        canSwitch: true,
      });
      if (this.state.loginUserIdx === -1) {
        const [selectedIdx, selectedUser] = this.getUser(
          this.props.userInfo,
          this.props.userList
        );
        this.setState({
          loginUserIdx: selectedIdx,
          selectedIdx: selectedIdx,
          data: selectedUser,
        });
      }
    }
  }

  bindTabActions = (tab) => {
    let content = { ...tab };
    let type;
    // only upload need to bind actions
    switch (tab.content) {
      case ADMIN:
        break;
      default:
        break;
    }
    return content;
  };

  selectTab = (tab) => {
    let {
      props: { dispatch, selectTab },
    } = this;
    dispatch(loadUsers());
    selectTab(ADMIN_SETTING, tab);
  };

  updateCanSwitch = (flag) => {
    this.setState({ canSwitch: flag });
  };

  apply = (user) => {
    let {
      props: { dispatch },
      state: { selectedIdx },
    } = this;

    if (selectedIdx === -1) {
      dispatch(addUser(user));
    } else {
      dispatch(updateUser(user));
    }
  };
  cancel = () => {
    const upadtedIdx =
      this.state.selectedIdx !== -1 ? this.state.selectedIdx : 0;
    this.setState({
      selectedIdx: upadtedIdx,
      isEditMode: false,
      canSwitch: true,
    });
  };
  delete = () => {
    this.setState({
      showDeleteAlert: true,
    });
  };
  edit = () => {
    this.setState({ isEditMode: true });
  };
  add = () => {
    if (this.state.canSwitch === true) {
      this.setState({ selectedIdx: -1, isEditMode: true });
    } else {
      this.openTabSwitchAlert(-1);
    }
  };
  select = (index) => {
    if (this.state.canSwitch === false) {
      this.openTabSwitchAlert(index);
    } else {
      this.setState({ selectedIdx: index, isEditMode: false });
    }
  };

  confirmDelete = (selectedUserId) => {
    let {
      props: { dispatch },
    } = this;
    if (selectedUserId !== 0) {
      dispatch(deleteUser(selectedUserId));
      this.closeDeleteAlert();
    }
  };
  confirmSwitch = () => {
    let {
      props: { userList },
      state: { nextUserIdx },
    } = this;
    if (userList?.data[nextUserIdx] !== -1) {
      this.setState({
        selectedIdx: nextUserIdx,
        nextadUserIdx: -1,
        isEditMode: false,
      });
    } else {
      this.setState({
        selectedIdx: -1,
        nextadUserIdx: -1,
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
      nextUserIdx: index,
      showTabSwitchAlert: true,
    });
  };
  closeTabSwitchAlert = () => {
    this.setState({
      showTabSwitchAlert: false,
    });
  };
  closeDeleteAlert = () => {
    this.setState({ showDeleteAlert: false });
  };

  getUser = (userInfo, userList) => {
    let selectedIdx;
    let selectedUser;
    const selectedUsername = userInfo.data?.Username ?? "admin";
    selectedIdx = userList?.data?.findIndex(
      (user) => user.Username == selectedUsername
    );
    selectedUser = { ...userList?.data[selectedIdx] };
    return [selectedIdx, selectedUser];
  };

  getUserItem(user, index) {
    let {
      props: { userList },
      state: { selectedIdx },
    } = this;
    return (
      <div
        key={user.Username}
        className="dhcp-total-table-list"
        style={
          user.Username === userList?.data[selectedIdx]?.Username
            ? { backgroundColor: "#80bc00", cursor: "pointer" }
            : { cursor: "pointer" }
        }
        ref={
          user.Username === userList?.data[selectedIdx]?.Username
            ? this.scrollTo
            : null
        }
        onClick={() => this.select(index)}
      >
        {user.Username}
      </div>
    );
  }

  scrollTo = (ref) => {
    if (ref /* + other conditions */) {
      ref.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  render() {
    let {
      props: { mainTab, userList, userInfo },
      state: {
        tabFnMap,
        data,
        role,
        loginUserIdx,
        selectedIdx,
        nextUserIdx,
        isEditMode,
        showTabSwitchAlert,
        showDeleteAlert,
      },
    } = this;

    return (
      <Fragment>
        {mainTab === ALL &&
          tabFnMap.map((tab) => (
            <MainCard key={tab.content} tab={tab} selectTab={this.selectTab} />
          ))}
        {mainTab === ADMIN_SETTING && (
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
                  <p
                    style={{
                      cursor: "pointer",
                    }}
                    onClick={() => this.select(loginUserIdx)}
                  >
                    Hello !
                    {userInfo.data !== undefined && userInfo.data.Username}
                    <div className="icon-smile"></div>
                  </p>
                  <div
                    className="editor-add"
                    data-hidden={isEditMode}
                    onClick={this.add}
                  ></div>
                </h3>
                <ul className="dhcp-total-table left-right">
                  <li>User Name</li>
                </ul>
                <div className="dhcp-total-table-list-scroll">
                  {Array.isArray(userList.data) &&
                    userList.data.map((user, index) =>
                      this.getUserItem(user, index)
                    )}
                </div>
              </div>
              {Array.isArray(userList.data) && (
                <div className="setting-editor" data-view={!isEditMode}>
                  <header className="title">
                    <h3>
                      {selectedIdx !== -1
                        ? userList?.data[selectedIdx]?.Username
                        : "Add New User"}
                    </h3>
                    {!isEditMode && data && (
                      <div className="flex">
                        {userList?.data[selectedIdx]?.Username !== "admin" && (
                          <div
                            className="setting-delete-icon"
                            onClick={this.delete}
                          ></div>
                        )}
                        <div
                          className="setting-edit-icon"
                          onClick={this.edit}
                        ></div>
                      </div>
                    )}
                  </header>
                  <UserInput
                    isEditMode={isEditMode}
                    data={userList?.data[selectedIdx]}
                    userList={userList}
                    userInfo={userInfo.data}
                    role={role}
                    selectedIdx={selectedIdx}
                    updateCanSwitch={this.updateCanSwitch}
                    onCancel={this.cancel}
                    onApply={this.apply}
                  />
                </div>
              )}
            </div>
            {showDeleteAlert && (
              <DeleteObjectAlert
                objectName={userList?.data[selectedIdx]?.Username}
                objectType="user"
                yes={() => this.confirmDelete(userList?.data[selectedIdx]?.Id)}
                no={this.closeDeleteAlert}
              />
            )}
            {showTabSwitchAlert && (
              <TabSwitchAlert
                tab={
                  nextUserIdx === -1
                    ? "create new user"
                    : `${userList?.data[nextUserIdx]?.Username}`
                }
                yes={this.confirmSwitch}
                no={this.closeTabSwitchAlert}
              />
            )}
          </div>
        )}
      </Fragment>
    );
  }
}

export default connect((state) => {
  return {
    userInfo: state.auths.userInfo,
  };
})(AdminSetting);
