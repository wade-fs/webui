import React, { Fragment } from "react";
import DeleteObjectAlert from "components/Alert/DeleteObjectAlert";

import {
  loadTerminalsAndGroups,
  getTerminal,
  operateTerminal
} from "actions/TerminalActions";

export class Tab {
  constructor(label) {
    this.label = label;
  }
}

export default class EditorTopbar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showAlert: false,
      showActionList: false,
    };
  }

  clickTrash = () => {
    this.setState({ showAlert: true });
  };
  close = () => {
    let {
      props: { close },
    } = this;
    if (close != null) close();
  };
  trash = () => {
    let {
      props: { trash },
    } = this;
    if (trash != null) trash();
  };
  notTrash = () => {
    this.setState({ showAlert: false });
  };

  copy = (e) => {
    let {
      props: { editType, copy, onCancel },
    } = this;
    if (editType === "terminal") {
      onCancel();
    }
    if (copy != null) copy(e);
  };
  lock = () => {
    let {
      props: { editType, lock, onCancel },
    } = this;
    if (editType === "terminal") {
      onCancel();
    }
    if (lock != null) lock();
  };
  favorite = () => {
    let {
      props: { editType, favorite, onCancel },
    } = this;
    if (editType === "terminal") {
      onCancel();
    }
    if (favorite != null) favorite();
  };
  toggleActionList = () => {
    this.setState({ showActionList: !this.state.showActionList });
  };
  operateAction = (operateType) => {
    if (editType === "terminal") {
      onCancel();
    }
    let {
      props: { dispatch, editType, status, editingId, onCancel },
    } = this;
    if (status.indexOf("F") >= 0) return;
    dispatch(operateTerminal(editingId, operateType));
  };

  render() {
    let {
      props: {
        isLoaded,
        editType,
        editingId,
        title = "",
        name,
        isGroup,
        isFavorite,
        tabs,
        selectedTabIndex,
        onSelect,
        showCopy = true,
        showEnable = true,
        showLock = true,
        status,
        disabled = false,
        mac = "",
        isNtr = false,
        isBooting = false,
        isActive = false,
		isError = false,
        isBusy = false,
        isOff = false,
        isNolic = false,
        showOp = false,
        showTrash = true,
        showPower = true,
        copy,
        close,
      },
      state: { showAlert, showActionList },
    } = this;

    const selectedTab = tabs[selectedTabIndex];

    return (
      <Fragment>
        {showAlert && (
          <DeleteObjectAlert
            objectName={name}
            objectType={editType}
            yes={this.trash}
            no={this.notTrash}
          />
        )}
        <div className="editor-menu">
          <ul>
            {tabs.map((tab, idx) => (
              <li
                key={idx}
                className={
                  selectedTab.label == tab.label
                    ? tab.label === "CONFIGURATION"
                      ? "menu-config-click"
                      : "menu-click"
                    : "menu-btn"
                }
                onClick={() => onSelect(idx)}
              >
                {tab.label}
              </li>
            ))}
          </ul>
          {isLoaded && (
            <div className="editor-actions">
              <div
                className={
                  isFavorite ? "editor-favorite-active" : "editor-favorite"
                }
                onClick={this.favorite}
              ></div>
              {showCopy && (
                <div className="editor-copy" onClick={this.copy}></div>
              )}
              {showTrash ? (
                <div className="editor-delete" onClick={this.clickTrash}></div>
              ) : (
                <div className="editor-delete-disabled"></div>
              )}
              {editType === "terminal" &&
                !isGroup &&
                (showActionList ? (
                  <div className="editor-operate-list">
                    {!isGroup && (
                      <Fragment>
                        {isActive||isError||isNolic? (
                          <div
                            className="editor-operate-calibrate"
                            onClick={() => this.operateAction("calibrate")}
                          ></div>
                        ) : (
                          <div className="editor-operate-calibrate-disabled"></div>
                        )}
                        {isActive||isError||isNolic ? (
                          <div
                            className="editor-operate-reboot"
                            onClick={() => this.operateAction("reboot")}
                          ></div>
                        ) : (
                          <div className="editor-operate-reboot-disabled"></div>
                        )}
                        {isActive||isError||isNolic ? (
                          <div
                            className={
                              isNtr
                                ? "editor-operate-restart-alert"
                                : "editor-operate-restart"
                            }
                            onClick={() => this.operateAction("restart")}
                          ></div>
                        ) : (
                          <div className="editor-operate-restart-disabled"></div>
                        )}
                        {!disabled ? (
                            <div
                              className="editor-operate-disable"
                              onClick={() => this.operateAction("disable")}
                            ></div>
                          ) : (
                            <div
                              className="editor-operate-enable"
                              onClick={() => this.operateAction("enable")}
                            ></div>
                          )}
                        {!isBusy ? (
                          isOff ? (
                            <div
                              className="editor-operate-power-on"
                              onClick={() => this.operateAction("poweron")}
                            ></div>
                          ) : (
                            <div
                              className="editor-operate-power-off"
                              onClick={() => this.operateAction("poweroff")}
                            ></div>
                          )
                        ) : (
                          <div className="editor-operate-power-disabled"></div>
                        )}
                        <div
                          className="editor-operate-close"
                          onClick={() => this.toggleActionList()}
                        ></div>
                      </Fragment>
                    )}
                  </div>
                ) : (
                  <div
                    className="editor-operate-actions"
                    onClick={() => this.toggleActionList()}
                  >
                    {(disabled || (isActive && isNtr)) && (
                      <div className="editor-operate-actions-alert"></div>
                    )}
                  </div>
                ))}
              {/* <div
                      onClick={close}
                      className="close"
                      style={{ marginRight: "16px", marginBottom: "16px" }}
                      data-dismiss="modal"
                      aria-label="Close"
                    ></div> */}
            </div>
          )}
        </div>
      </Fragment>
    );
  }
}
