import React, { Fragment } from "react";
import { ContextMenu, MenuItem, ContextMenuTrigger } from "react-contextmenu";
import { TerminalObject, ServerObject, ApplicationObject } from "const/Consts";

import { toLetter } from "../../utils/String";

import {
  copyTerminal,
  operateTerminal,
  deleteTerminal,
  updateTerminal,
  getTerminal,
  loadTerminalsAndGroups,
} from "actions/TerminalActions";

import { copyServer, deleteServer, updateServer } from "actions/ServerActions";

import {
  copyApplication,
  deleteApplication,
  updateApplication,
} from "actions/ApplicationActions";

import { showInfoBar } from "actions/InfobarActions";
import CopyObjectAlert from "components/Alert/CopyObjectAlert";
import DeleteObjectAlert from "components/Alert/DeleteObjectAlert";

import {
  getTerminalStatus,
  getRdsServerStatus,
  getAppStatus,
  checkExpandTitleError,
  checkExpandTerminalTitle,
} from "utils/Status";

import { apiRestartTerminals } from "api";

export default class ObjectTitles extends React.Component {
  state = {
    showCopyAlert: false,
    showDeleteAlert: false,
    showActionList: false,
    actionListIdx: undefined,
    objectId: undefined,
    objectType: undefined,
    treeType: undefined,
  };

  componentDidMount() {
    switch (this.props.object) {
      case "terminal":
        this.setState({ objectType: "Terminal", treeType: "terminalGroup" });
        break;
      case "server":
        this.setState({ objectType: "Server", treeType: "appServerGroup" });
        break;
      case "application":
        this.setState({ objectType: "Application", treeType: "appGroup" });
        break;
      default:
        break;
    }
  }
  componentDidUpdate(prevProps) {
    // check wizard or editor open
    if (
      prevProps.editorOpened !== this.props.editorOpened ||
      prevProps.wizardOpened !== this.props.wizardOpened
    ) {
      this.setState({ showActionList: false, actionListIdx: undefined });
    }
  }

  openDeleteAlert = (id) => {
    this.setState({
      showDeleteAlert: true,
      objectId: id,
    });
  };
  closeDeleteAlert = () => {
    this.setState({ showDeleteAlert: false });
  };
  openCopyAlert = (id, parentId) => {
    this.setState({
      showCopyAlert: true,
      objectId: id,
      parentId: parentId,
    });
  };
  closeCopyAlert = () => {
    this.setState({
      showCopyAlert: false,
    });
  };

  click = (id, isGroup) => {
    let {
      props: { click },
    } = this;
    this.setState({ showActionList: false, actionListIdx: undefined }, () => {
      if (click != null) click(id, isGroup);
    });
  };
  select = (event, Id) => {
    let {
      props: { select },
    } = this;
    event.stopPropagation();
    event.nativeEvent.stopImmediatePropagation();
    select(Id);
  };
  operateAction = (editingId, operateType) => {
    let {
      props: { dispatch },
    } = this;
    dispatch(operateTerminal(editingId, operateType));
  };

  delete = () => {
    let {
      props: { dispatch, object, editingId },
      state: { objectId },
    } = this;
    if (editingId !== objectId) {
      switch (object) {
        case "terminal":
          dispatch(deleteTerminal(objectId, false));
          break;
        case "server":
          dispatch(deleteServer(objectId, false));
          break;
        case "application":
          dispatch(deleteApplication(objectId, false));
          break;
        default:
          break;
      }
    }
    this.setState({
      showDeleteAlert: false,
      objectId: undefined,
    });
  };
  copy = (newData) => {
    let {
      props: { dispatch, object },
      state: { objectId },
    } = this;
    switch (object) {
      case "terminal":
        dispatch(
          copyTerminal(objectId, newData["Name"], newData["ParentId"], false)
        );
        break;
      case "server":
        dispatch(
          copyServer(objectId, newData["Name"], newData["ParentId"], false)
        );
        break;
      case "application":
        dispatch(
          copyApplication(objectId, newData["Name"], newData["ParentId"], false)
        );
        break;
      default:
        break;
    }
    this.setState({
      showCopyAlert: false,
      objectId: undefined,
      parentId: undefined,
    });
  };
  favorite = (objectId, favorite) => {
    let {
      props: { dispatch, object },
    } = this;
    const data = {
      Favorite: !favorite,
    };
    switch (object) {
      case "terminal":
        // TODO: 怎麼updateTerminal() 的參數跟定義不同？
        dispatch(updateTerminal(objectId, data, false));
        break;
      case "server":
        dispatch(updateServer(objectId, data, false));
        break;
      case "application":
        dispatch(updateApplication(objectId, data, false));
        break;
      default:
        break;
    }
  };
  restartTerimnals = async (rdsId, expandData) => {
    const terminalIds = expandData
      .reduce((acc, cur) => {
        acc.push(cur.terminal.id);
        return acc;
      }, [])
      .join();
    const data = { TerminalIds: terminalIds };
    const response = await apiRestartTerminals(rdsId, data);
    if (response.result === true) {
      this.props.dispatch(showInfoBar("Refresh terminals success !!"));
    } else {
      let errMsg = response.data ?? "Refresh terminals fail !!";
      this.props.dispatch(showInfoBar(errMsg, "error"));
    }
  };

  toggleActionList = (idx) => {
    let {
      state: { showActionList, actionListIdx },
    } = this;
    if (actionListIdx === idx) {
      this.setState({ showActionList: false, actionListIdx: undefined });
    } else if (actionListIdx !== idx && showActionList) {
      this.setState({ actionListIdx: idx });
    } else {
      this.setState({ showActionList: true, actionListIdx: idx });
    }
  };

  toggleExtand = (e) => {
    let parentNode = this.getParentNode(e.target, 0);
    if (parentNode != null) {
      if (parentNode.getAttribute("data-expand") === "false") {
        parentNode.setAttribute("data-expand", "true");
      } else {
        parentNode.setAttribute("data-expand", "false");
      }
    }
  };

  terminalExpand(idx) {
    let {
      props: { data, currentTab, applications, rdss, vncs, servers },
    } = this;
    const screenOfAppIds = data[idx]?.ScreenOfAppIds?.split(";");
    const expandData = screenOfAppIds?.map((appIds) => {
      const appIdsArray = appIds.split(",");
      return appIdsArray.map((id) => {
        const app = rdss?.data?.find((app) => app.Id === parseInt(id));
        const vnc = vncs?.find((vnc) => vnc.Id === parseInt(id));
        if (app) {
          const RdsServerIdsArray = app?.RdsServerIds?.split(",") ?? [];
          const rdsServers = RdsServerIdsArray.map((serverId) => {
            let server = servers.data.find(
              (server) => server.Id === parseInt(serverId)
            );
            return {
              id: server === undefined ? null : server.Id,
              name: server === undefined ? null : server.Name,
            };
          });
          return {
            app: { id: app?.Id, name: app?.Name },
            rdsServers: rdsServers,
          };
        }
        if (vnc) {
          return {
            app: { id: vnc?.Id, name: vnc?.Name },
            rdsServers: "",	// TODO 應該與卡拉討論，資料也要修正成 Input Source
          };
        }
      });
    });

    function expandServersInApp(e) {
      if (e.target.getAttribute("data-expand") === "false") {
        e.target.setAttribute("data-expand", "true");
      } else {
        e.target.setAttribute("data-expand", "false");
      }
    }
    return expandData?.map((screen, screenIdx) => (
      <div key={screenIdx + 1} className="expand-list-card">
        <div className="expand-list-card-title">
          Screen{" "}
          <div className="expand-title-screen">{toLetter(screenIdx + 1)}</div>
        </div>
        <ul className="expand-list-card-content">
          {expandData[screenIdx].map((detail, appIdx) => (
            <li key={detail.app?.id+"-"+detail.app?.name}>
              {detail.app?.name != null && (
                <div className="card-content-left">
                  <div
                    className={`${getAppStatus(
                      "item",
                      applications.find((a) => a.Id === detail.app.id)
                    )} mr-8`}
                  ></div>
                  {detail.app?.name}
                </div>
              )}
              {detail.rdsServers[0]?.name != null && (
                <Fragment>
                  <div
                    className="list-expand"
                    style={{ top: "0px" }}
                    data-expand={false}
                    onClick={(e) => expandServersInApp(e)}
                  ></div>
                  <div className="card-contend-right" style={{ top: "-6px" }}>
                    <ul className="single-item">
                      <li key={detail.rdsServers[0]?.id}>
                        <div
                          className={`${getRdsServerStatus(
                            "item",
                            servers.data.find(
                              (s) => s.Id === detail.rdsServers[0]?.id
                            )
                          )} mr-8`}
                        ></div>
                        {detail.rdsServers[0]?.name}
                      </li>
                    </ul>
                    <ul className="multi-item">
                      {detail.rdsServers.map((item) => (
                        <li key={item.id+"-"+item.name}>
                          <div
                            className={`${getRdsServerStatus(
                              "item",
                              servers.data.find((s) => s.Id === item.id)
                            )} mr-8`}
                          ></div>
                          {item.name}
                        </li>
                      ))}
                    </ul>
                  </div>
                </Fragment>
              )}
            </li>
          ))}
        </ul>
      </div>
    ));
  }
  rdsServerExpand(idx) {
    let {
      props: { data, terminals, objects, applications, vncs},
    } = this;
    const expandData = terminals?.data
      ?.filter((terminal) =>
        terminal.ScreenOfAppIds?.split(";").some((appId) =>
          applications.data
            ?.find((app) => app.Id === parseInt(appId))
            ?.RdsServerIds.split(",")
            .includes(data[idx].Id.toString())
        )
      )
      .map((filterTerminal) => ({
        terminal: { id: filterTerminal.Id, name: filterTerminal.Name },
        apps: filterTerminal.ScreenOfAppIds?.split(";")
          .filter((appId) =>
            applications.data?.find(
              (app) =>
                app.Id === parseInt(appId) &&
                app.RdsServerIds.split(",").includes(data[idx].Id.toString())
            )
          )
          .map((appId) => {
            let app = applications.data.find(
              (app) => app.Id === parseInt(appId)
            );
            return {
              id: app.Id,
              name: app.Name,
            };
          }),
      }));

    return (
      <div className="flex-column">
        <div
          className="ellipse-btn-lg"
          onClick={() => this.restartTerimnals(data[idx].Id, expandData)}
        >
          <div className="icon-refresh"></div>
          RESTART TERMINAL(S)
        </div>
        <div className="inline-flex">
          {expandData?.map((rdsServerDetail) => (
            <div key={rdsServerDetail.terminal.id} className="expand-list-card">
              <div
                className={checkExpandTerminalTitle(
                  terminals.data.find(
                    (t) => t.Id === rdsServerDetail.terminal.id
                  )
                )}
              >
                {rdsServerDetail.terminal.name}
              </div>
              <ul className="expand-list-card-content">
                {rdsServerDetail?.apps?.map((app) => (
                  <li key={app.id+"-"+app.name}>
                    <div
                      className={`${getAppStatus(
                        "item",
                        applications.data.find((a) => a.Id === app.id)
                      )} mr-8`}
                    ></div>
                    {app.name}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    );
  }
  applicationExpand(idx) {
    let {
      props: { data, terminals, servers },
    } = this;
    const expandData = data[idx]?.RdsServerIds !== '' && data[idx]?.RdsServerIds.split(",").map((rdsServerId) => {
      const rdsServer = servers.data.find(
        (server) => server.Id === parseInt(rdsServerId)
      );
      return {
        rdsServer: {
          id: rdsServer.Id,
          name: rdsServer.Name,
        },
        terminals: terminals?.data
          .filter(
            (terminal) =>
              terminal.ScreenOfAppIds?.split(";").indexOf(
                data[idx].Id.toString()
              ) !== -1
          )
          .map((item) => ({
            id: item.Id,
            name: item.Name,
          })),
      };
    });
    if (expandData !== false) {
      return expandData?.map((appDetail) => (
        <div
          key={appDetail?.rdsServer.id}
          className={`expand-list-card${expandData.length === 1 ? "-lg" : ""}`}
        >
          <div
            className={checkExpandTitleError(
              servers.data.find((s) => s.Id === appDetail.rdsServer.id)
            )}
          >
            {appDetail?.rdsServer.name}
          </div>
          <ul className="expand-list-card-content">
            {appDetail?.terminals?.map((item) => (
              <li key={item.id+"-"+item.name}>
                <div
                  className={`${getTerminalStatus(
                    "item",
                    terminals.data.find((t) => t.Id === item.id)
                  )} mr-8`}
                ></div>
                {item.name}
              </li>
            ))}
          </ul>
        </div>
      ));
    }
  }

  getParentName(original, ParentId) {
    if (ParentId == 0 || ParentId == null || original[ParentId] == null)
      return "";
    else return " (" + original[ParentId].Name + ") ";
  }

  getParentNode = (node, count) => {
    if (node.className === "main-page-list") return node;
    // max boundary is 3
    if (count > 3) return null;
    count++;
    return this.getParentNode(node.parentNode, count);
  };

  render() {
    let {
      props: {
        state, data, inEditor,
        applications, objects, objectGroups, mainTree,
        rdss, rdsGroups, rdsMainTree,
        vncs, vncGroups, vncMainTree,
        currentTab,
        original, isGroup, showExpand, hasItems, selected, object, showRightClick,
      },
      state: {
        showCopyAlert, showDeleteAlert, showActionList, actionListIdx, objectType, objectId, treeType, parentId,
      },
    } = this;
    let groupOriginal;

    if (treeType == "appGroup") {
      if (currentTab == "RDS") {
        groupOriginal = rdsGroups.data == null ||
          (Array.isArray(rdsGroups.data) && rdsGroups.data.length === 0)
          ? {}
          : rdsGroups.data.reduce((map, object) => {
            map[object.Id] = object;
            return map;
          }, {});
      } else {
        groupOriginal = vncGroups.data == null ||
          (Array.isArray(vncGroups.data) && vncGroups.data.length === 0)
          ? {}
          : vncGroups.data.reduce((map, object) => {
            map[object.Id] = object;
            return map;
          }, {});
  	  }
    } else {
      groupOriginal = objectGroups.data == null ||
        (Array.isArray(objectGroups.data) && objectGroups.data.length === 0)
        ? {}
        : objectGroups.data.reduce((map, object) => {
          map[object.Id] = object;
          return map;
        }, {});
    }

    return (
      <ul className="main-page-content">
        {showCopyAlert && (
          <CopyObjectAlert
            objectName={original[objectId].Name}
            objects={objects}
            objectGroups={objectGroups}
            mainTree={mainTree}
            rdss={rdss} rdsGroups={rdsGroups} rdsMainTree={rdsMainTree}
            vncs={vncs} vncGroups={vncGroups} vncMainTree={vncMainTree}
            currentTab={currentTab}
            objectType={objectType}
            treeType={treeType}
            isGroup={isGroup}
            parentId={parentId}
            pickerTitle="CHOOSE EXISTING GROUP"
            confirm={this.copy}
            cancel={this.closeCopyAlert}
          />
        )}
        {showDeleteAlert && (
          <DeleteObjectAlert
            objectName={original[objectId].Name}
            objectType={objectType}
            yes={this.delete}
            no={this.closeDeleteAlert}
          />
        )}
        {state !== undefined && (data === "null" || data == null ||
            (data != null && data.length === 0)) ? (
          <div className="no-list-item">
            {state === "LOADING" ? ( <p>Loading...</p>) : (
              <div>
                <div className="list-action-add-disable"></div>
                <p>
                  {`No ${object !== ApplicationObject ? object.toUpperCase().charAt(0) +
                    object.slice(1, object.length) : currentTab
                    } found.`}
                </p>
                {object === "server" && hasItems === false && (
                  <p>
                    Create <span style={{ color: "#80bc00" }}>App Server </span>
                    to unlock App.
                  </p>
                )}
                {object === "application" && hasItems === false && (
                  <p>
                    Create <span style={{ color: "#80bc00" }}>App </span> to
                    unlock Terminal.
                  </p>
                )}
              </div>
            )}
          </div>
        ) : (
          data !== null &&
          data?.map((object, idx) => {
            let {
              Name,
              Id,
              ParentId,
              Favorite,
              Status,
              Error,
              Disabled,
              DeviceControl,
              ConfigLock,
              NeedToRestart,
              RdsServerIds,
              ...others
            } = object;
            const checked = selected === null
              ? null
              : selected[Id] === null
                ? false
                : selected[Id];
            let status = object.Status ?? "";
            status = status === "OFF" ? "F" : status;
            const editingId = Id ?? 0;
            const disabled = Disabled ?? false;

  const isNtr = editingId > 0 && status.indexOf("N") >= 0;
  const isDisabled = Disabled || status.indexOf("D") >= 0;
  const isBusy = editingId > 0 && (status.indexOf("R") >= 0 ||
            status.indexOf("T") >= 0 || status.indexOf("P") >= 0 ||
            status.indexOf("O") >= 0);

  const isOff = status == "" || status.indexOf("F") >= 0;
  const isOffBusy = status.indexOf("W") >= 0;
  const isOffDisabled = isOff && isDisabled;

  const isBooting = status.indexOf("B") >= 0 || status.indexOf("W") >= 0 || status.indexOf("C") >= 0;
  const isBootingDisabled = isBooting && isDisabled;

  const isActive = editingId > 0 &&
    (status.indexOf("A") >= 0 || status.indexOf("E") < 0 && status.indexOf("L") >= 0);
  const isActiveDisabled = (isActive || isNolic) && isDisabled;
  const isActiveNtr = isActive && isNtr;
  const isActiveDisabledNtr = isActive && isDisabled && isNtr;
  const isActiveBusy = isBusy;

  const isError = editingId > 0 && status.indexOf("E") >= 0;
  const isErrorDisabled = isError && isDisabled;
  const isErrorNtr = isError && isNtr;
  const isErrorDisabledNtr = isError && isDisabled && isNtr;
  const isErrorBusy = isError && isBusy;

  const isNolic = editingId > 0 && status.indexOf("I") >= 0;
  const isNolicDisabled = isNolic && isDisabled;
  const isNolicNtr = isNolic && isNtr;
  const isNolicDisabledNtr = isNolic && isDisabled && isNtr;
  const isNolicBusy = isNolic && (isBusy || isBooting);


            return (
              <li key={Id+"-"+Name} className="main-page-list" data-expand={showExpand}>
                <Fragment>
                  <div className="main-page-list-header">
                    <div
                      className="list-expand"
                      onClick={(e) => this.toggleExtand(e)}
                    ></div>
                    <input
                      className="main-page-list-checkbox"
                      type="checkbox"
                      checked={checked}
                      onChange={(event) => this.select(event, Id)}
                    ></input>
                    <div
                      className="list-item-title"
                      onClick={(e) => this.toggleExtand(e)}
                    >
                      {objectType === "Terminal" && (
                        <div
                          className={getTerminalStatus("list", object)}
                        ></div>
                      )}
                      {objectType === "Server" && (
                        <div
                          className={getRdsServerStatus("list", object)}
                        ></div>
                      )}
                      {objectType === "Application" && (
                        <div className={getAppStatus("list", object)}></div>
                      )}
                      <p className="list-name">{`${Name} ${this.getParentName(
                        groupOriginal,
                        ParentId
                      )}`}</p>
                    </div>
                    <div className="list-actions">
                      {Favorite ? (
                        <div
                          className="list-action-favorite-active"
                          onClick={
                            state === "LOADING"
                              ? null
                              : () => this.favorite(Id, object.Favorite)
                          }
                        ></div>
                      ) : (
                        <div
                          className="list-action-favorite"
                          onClick={
                            state === "LOADING"
                              ? null
                              : () => this.favorite(Id, object.Favorite)
                          }
                        ></div>
                      )}
                      <div
                        className="list-action-copy"
                        onClick={
                          state === "LOADING"
                            ? null
                            : () => this.openCopyAlert(Id, ParentId)
                        }
                      ></div>
                      {isOff ? (
                        <div
                          className="list-action-delete"
                          onClick={
                            state === "LOADING"
                              ? null
                              : () => this.openDeleteAlert(Id)
                          }
                        ></div>
                      ) : (
                        <div className="list-action-delete-disabled"></div>
                      )}
                      {inEditor && (
                        <div
                          className="list-action-setting"
                          onClick={
                            state === "LOADING"
                              ? null
                              : () => this.click(Id, false)
                          }
                        ></div>
                      )}

                      {this.props.object === TerminalObject &&
                        (showActionList && idx === actionListIdx ? (
                          <div className="home-operate-list">
                            {isActive||isError? (
                              <div
                                className="operate-calibrate"
                                onClick={
                                  state === "LOADING"
                                    ? null
                                    : () => this.operateAction(Id, "calibrate")
                                }
                              ></div>
                            ) : (
                              <div className="operate-calibrate-disabled"></div>
                            )}
                            {(isActive||isError||isNolic) && !(isBooting||isBusy) ? (
                              <div
                                className="operate-reboot"
                                onClick={
                                  state === "LOADING"
                                    ? null
                                    : () => this.operateAction(Id, "reboot")
                                }
                              ></div>
                            ) : (
                              <div className="operate-reboot-disabled"></div>
                            )}
                            {(isActive||isError||isNolic) && !(isBooting||isBusy) ? (
                              <div
                                className={isNtr && isActive
                                  ? "operate-restart-alert"
                                  : "operate-restart"
                                }
                                onClick={
                                  state === "LOADING"
                                    ? null
                                    : () => this.operateAction(Id, "restart")
                                }
                              ></div>
                            ) : (
                              <div className="operate-restart-disabled"></div>
                            )}
                            {isDisabled ? (
                              <div
                                className="operate-enable"
                                onClick={
                                  state === "LOADING"
                                    ? null
                                    : () => this.operateAction(Id, "enable")
                                }
                              ></div>
                            ) : (
                              <div
                                className="operate-disable"
                                onClick={
                                  state === "LOADING"
                                    ? null
                                    : () => this.operateAction(Id, "disable")
                                }
                              ></div>
                            )}
                            {isOff ? (
                              <div
                                className="operate-power-on"
                                onClick={
                                  state === "LOADING"
                                    ? null
                                    : () => this.operateAction(Id, "poweron")
                                }
                              ></div>
                            ) : (isActive || isError || isNolic ? (
                              <div
                                className="operate-power-off"
                                onClick={
                                  state === "LOADING"
                                    ? null
                                    : () => this.operateAction(Id, "poweroff")
                                }
                              ></div>
                            ) : (
                              <div className="operate-power-disabled"></div>
                            ))}
                            <div
                              className="operate-close"
                              onClick={() => this.toggleActionList(idx)}
                            ></div>
                          </div>
                        ) : (
                          <div
                            className="list-action-operates"
                            onClick={
                              state === "LOADING"
                                ? null
                                : () => this.toggleActionList(idx)
                            }
                          >
                            {(isDisabled || isNtr) && (
                              <div
                                className="list-action-operates-alert"
                                onClick={
                                  state === "LOADING"
                                    ? null
                                    : () => this.toggleActionList(idx)
                                }
                              ></div>
                            )}
                          </div>
                        ))}
                    </div>
                  </div>
                </Fragment>
                <div className="main-page-list-expand">
                  {objectType === "Terminal" && this.terminalExpand(idx)}
                  {objectType === "Server" && this.rdsServerExpand(idx)}
                  {objectType === "Application" && this.applicationExpand(idx)}
                </div>
              </li>
            );
          })
        )}
      </ul>
    );
  }
}

class ContextMenuItemData {
  constructor(label, operate) {
    this.label = label;
    this.operate = operate;
  }
}
