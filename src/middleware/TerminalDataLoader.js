import {
  COPY_TERMINAL,
  LOAD_TERMINALS,
  LOAD_TERMINAL_GROUPS,
  LOAD_TERMINALS_AND_GROUPS,
  LOAD_REQUEST,
  LOAD_SUCCESS,
  LOAD_FAILURE,
  GET_TERMINAL,
  GET_TERMINAL_SETTING,
  GET_PARENT_TERMINAL_GROUP,
  ADD_TERMINAL,
  DELETE_TERMINAL,
  GET_DISPLAY_OPTIONS,
  GET_MODEL_MAP,
  GET_FIRMWARE_PACKAGE,
  LOAD_MODULES,
  LOAD_MODULE_SETTING,
  OPERATE_TERMINAL,
  UPDATE_TERMINAL,
} from "const/ActionType";
import {
  getTerminal,
  loadTerminals,
  loadTerminalGroups,
  loadTerminalsAndGroups,
  closeTerminalEditor,
  closeTerminalWizard,
  openTerminalEditor,
} from "actions/TerminalActions";
import { showInfoBar } from "actions/InfobarActions";
import { LOADING, LOADED } from "const/DataLoaderState.js";
import { getObjectProperty } from "lib/Util";

import { addModules } from "utils/Module";
import { convertListToTree } from "utils/Tree";
import { checkSchedule } from "utils/Schedule";

import { apiUpdateAppOverride } from "api";

const loadData = (state, path, loaderPromise) => (dispatch) => {
  dispatch({ type: LOAD_REQUEST, payload: { path } });
  loaderPromise
    .then((value) => {
      if (value.result === false) {
        throw Error(value.data);
      }
      dispatch({ type: LOAD_SUCCESS, payload: { path, data: value.data } });
    })
    .catch((err) => {
      // dispatch({ type: LOAD_FAILURE, payload: { path, data: err } });
      const errorMsg = err.message ?? `API fail`;
      const oriObject = getObjectProperty(state, path);
      dispatch({
        type: LOAD_FAILURE,
        payload: { path, data: oriObject.data },
      });
      dispatch(showInfoBar(errorMsg, "error"));
    });
};

export default (store) => (next) => (action) => {
  let state = store.getState();
  let { type, payload } = action;
  let rst = next(action);
  switch (type) {
    case LOAD_TERMINALS_AND_GROUPS: {
      let { path, loader, groupLoader } = payload;
      if (path && loader && groupLoader) {
        let loadingState = getObjectProperty(state, `${path}.state`);
        if (loadingState !== LOADING)
          store.dispatch((dispatch) => {
            dispatch({ type: LOAD_REQUEST, payload: { path } });
            loader()
              .then(async (value) => {
                if (value.result === false) {
                  throw Error(value.data);
                }
                const terminalList = value.data;
                groupLoader()
                  .then(async (value) => {
                    if (value.result === false) {
                      throw Error(value.data);
                    }
                    const terminalGroupList = value.data;
                    dispatch({
                      type: LOAD_SUCCESS,
                      payload: {
                        path: "terminals.terminalGroups",
                        data: terminalGroupList,
                      },
                    });
                    dispatch({
                      type: LOAD_SUCCESS,
                      payload: {
                        path: "terminals.terminals",
                        data: terminalList,
                      },
                    });
                    const terminalMainTree = await convertListToTree(
                      terminalList,
                      terminalGroupList
                    );
                    dispatch({
                      type: LOAD_SUCCESS,
                      payload: {
                        path: "terminals.terminalMainTree",
                        data: terminalMainTree,
                      },
                    });
                  })
                  .catch((err) => {
                    throw Error(err);
                  });
              })
              .catch((err) => {
                const errorMsg = err.message ?? `Get Terminal list failed!!`;
                dispatch(showInfoBar(errorMsg, "error"));
                dispatch({
                  type: LOAD_FAILURE,
                  payload: { path, data: null },
                });
              });
          });
      }
      break;
    }
    case LOAD_TERMINALS: {
      let { path, loader } = payload;
      if (path && loader) {
        let loadingState = getObjectProperty(state, `${path}.state`);
        if (loadingState !== LOADING)
          store.dispatch((dispatch) => {
            dispatch({ type: LOAD_REQUEST, payload: { path } });
            loader()
              .then(async (value) => {
                if (value.result === false) {
                  throw Error(value.data);
                }
                const terminalList = value.data;
                const terminalGroupList = state.terminals.terminalGroups.data;
                const terminalMainTree = await convertListToTree(
                  terminalList,
                  terminalGroupList
                );
                dispatch({
                  type: LOAD_SUCCESS,
                  payload: {
                    path: "terminals.terminalMainTree",
                    data: terminalMainTree,
                  },
                });
                dispatch({
                  type: LOAD_SUCCESS,
                  payload: {
                    path: path,
                    data: terminalList,
                  },
                });
              })
              .catch((err) => {
                const errorMsg = err.message ?? `Get Terminal list failed!!`;
                dispatch(showInfoBar(errorMsg, "error"));
                dispatch({
                  type: LOAD_FAILURE,
                  payload: { path, data: null },
                });
              });
          });
      }
      break;
    }
    case LOAD_TERMINAL_GROUPS: {
      let { path, loader } = payload;
      if (path && loader) {
        let loadingState = getObjectProperty(state, `${path}.state`);
        if (loadingState !== LOADING)
          store.dispatch((dispatch) => {
            dispatch({ type: LOAD_REQUEST, payload: { path } });
            loader()
              .then(async (value) => {
                if (value.result === false) {
                  throw Error(value.data);
                }
                const terminalGroupList = value.data;
                const terminalList = state.terminals.terminals.data;
                const terminalMainTree = await convertListToTree(
                  terminalList,
                  terminalGroupList
                );
                dispatch({
                  type: LOAD_SUCCESS,
                  payload: {
                    path: "terminals.terminalMainTree",
                    data: terminalMainTree,
                  },
                });
                dispatch({
                  type: LOAD_SUCCESS,
                  payload: {
                    path: path,
                    data: terminalGroupList,
                  },
                });
              })
              .catch((err) => {
                const errorMsg =
                  err.message ?? `Get Terminal Group list failed!!`;
                dispatch(showInfoBar(errorMsg, "error"));
                dispatch({
                  type: LOAD_FAILURE,
                  payload: { path, data: null },
                });
              });
          });
      }
      break;
    }
    case ADD_TERMINAL: {
      let {
        path,
        loader,
        updateTerminalLoader,
        addScheduleLoader,
        terminal,
        isGroup,
        schedules,
        modules,
        applications,
      } = payload;
      if (
        path &&
        loader &&
        updateTerminalLoader &&
        addScheduleLoader &&
        terminal &&
        schedules &&
        modules &&
        applications
      ) {
        let loadingState = getObjectProperty(state, `${path}.state`);
        if (loadingState !== LOADING)
          store.dispatch((dispatch) => {
            const object = isGroup === true ? "terminal group" : "terminal";
            dispatch({ type: LOAD_REQUEST, payload: { path } });
            // Save new terminal
            loader(terminal)
              .then(async (value) => {
                if (value.result === false) {
                  throw Error(value.data);
                }
                let newTerminalId = value.data;
                let moduleIds;
                try {
                  // update override
                  const response = await apiUpdateAppOverride(
                    applications,
                    newTerminalId
                  );
                  if (response.result === false) throw Error(response.data);
                  // Add modules
                  moduleIds = await addModules(newTerminalId, modules);
                } catch (err) {
                  const errorMsg = err.message;
                  throw Error(errorMsg);
                }
                // Add schedules
                let newSchedules = checkSchedule(schedules);
                let schedulePromise = newSchedules.map((schedule) => {
                  return addScheduleLoader(schedule).then((value) => {
                    if (value.result === false) {
                      throw Error(value.data);
                    }
                    return { id: value.data };
                  });
                });
                Promise.all(schedulePromise)
                  .then((values) => {
                    let scheduleIds = values.map((value) => value.id).join(",");
                    // update terminal
                    updateTerminalLoader(newTerminalId, {
                      Schedules: scheduleIds,
                      InstalledModules: moduleIds,
                    })
                      .then((value) => {
                        if (value.result === false) {
                          throw Error(value.data);
                        }
                        dispatch({
                          type: LOAD_SUCCESS,
                          payload: { path, data: {} },
                        });
                        dispatch(showInfoBar(`New ${object} has added!!`));
                        isGroup
                          ? dispatch(loadTerminalGroups())
                          : dispatch(loadTerminals());
                        dispatch(closeTerminalWizard());
                      })
                      .catch((err) => {
                        console.error(`Update ${object} failed: ${err}`);
                        throw Error(err);
                      });
                  })
                  .catch((err) => {
                    console.error(`Add schedules failed: ${err}`);
                    throw Error(err);
                  });
              })
              .catch((err) => {
                const errorMsg = err.message ?? `Add ${object} failed`;
                const oriObject = getObjectProperty(state, path);
                dispatch({
                  type: LOAD_FAILURE,
                  payload: { path, data: oriObject.data },
                });
                dispatch(showInfoBar(errorMsg, "error"));
              });
          });
      }
      break;
    }
    case UPDATE_TERMINAL: {
      let {
        path,
        updateTerminalLoader,
        id,
        data,
        isGroup,
        getTerminalLoader,
        urlPath,
      } = payload;
      // if (path && updateTerminalLoader && id && data && getTerminalLoader) {
      let loadingState = getObjectProperty(state, `${path}.state`);
      // if (loadingState !== LOADING)
      store.dispatch((dispatch) => {
        let object = isGroup === true ? "terminal group" : "terminal";
        dispatch({ type: LOAD_REQUEST, payload: { path } });
        updateTerminalLoader(id, data, urlPath)
          .then((value) => {
            if (value.result === false) {
              throw Error(value.data);
            }
            getTerminalLoader(id)
              .then((value) => {
                if (value.result === false) {
                  throw Error(value.data);
                }
                dispatch({
                  type: LOAD_SUCCESS,
                  payload: { path, data: value.data },
                });
                isGroup
                  ? dispatch(loadTerminalsAndGroups())
                  : dispatch(loadTerminals());
                dispatch(showInfoBar(`Update ${object} success!!`));
              })
              .catch((err) => {
                throw Error(err);
              });
          })
          .catch((err) => {
            const errorMsg = err.message ?? `Update ${object} failed!!`;
            const oriObject = getObjectProperty(state, path);
            dispatch({
              type: LOAD_FAILURE,
              payload: { path, data: oriObject.data },
            });
            dispatch(showInfoBar(errorMsg, "error"));
          });
      });
      // }
      break;
    }
    case DELETE_TERMINAL: {
      let { path, loader, id, isGroup } = payload;
      if (path && loader && id) {
        let loadingState = getObjectProperty(state, `${path}.state`);
        if (loadingState !== LOADING)
          store.dispatch((dispatch) => {
            let object = isGroup === true ? "terminal group" : "terminal";
            dispatch({ type: LOAD_REQUEST, payload: { path } });
            loader(id)
              .then((value) => {
                if (value.result === false) {
                  throw Error(value.data);
                }
                if (state.terminals.editorOpened) {
                  dispatch(closeTerminalEditor());
                }
                dispatch({ type: LOAD_SUCCESS, payload: { path, data: {} } });
                isGroup
                  ? dispatch(loadTerminalsAndGroups())
                  : dispatch(loadTerminals());
                dispatch(showInfoBar(`Delete ${object} success!!`));
              })
              .catch((err) => {
                const errorMsg = err.message ?? `Delete ${object} fail`;
                const oriObject = getObjectProperty(state, path);
                dispatch({
                  type: LOAD_FAILURE,
                  payload: { path, data: oriObject.data },
                });
                dispatch(showInfoBar(errorMsg, "error"));
              });
          });
      }
      break;
    }
    case COPY_TERMINAL: {
      let {
        path,
        id,
        name,
        parentId,
        isGroup,
        addTerminalLoader,
        getTerminalLoader,
      } = payload;
      if (path && id && name && addTerminalLoader && getTerminalLoader) {
        let loadingState = getObjectProperty(state, `${path}.state`);
        if (loadingState !== LOADING)
          store.dispatch((dispatch) => {
            const object = isGroup === true ? "terminal group" : "terminal";
            dispatch({ type: LOAD_REQUEST, payload: { path } });
            getTerminalLoader(id)
              .then((value) => {
                if (value.result === false) {
                  throw Error(value.data);
                }
                let data = value.data;
                data["Name"] = name;
                data["ParentId"] = parentId;
                data["SourceId"] = id;
                delete data["Id"];
                delete data["ModifiedTS"];
                delete data["Error"];
                delete data["Status"];
                // don't copy mac address
                if (data["MAC"] != null) data["MAC"] = "";
                // null ParentId will cause add "Fail"
                if (data["ParentId"] == null) {
                  data["ParentId"] = 0;
                }
                // Save new terminal
                addTerminalLoader(data)
                  .then((value) => {
                    if (value.result === false) {
                      throw Error(value.data);
                    }
                    const newTerminalId = value.data;
                    // Switch editor
                    if (newTerminalId != null) {
                      if (state.terminals.editorOpened === true) {
                        getTerminalLoader(newTerminalId)
                          .then((value) => {
                            if (value.result === false) {
                              throw Error(value.data);
                            }
                            dispatch({
                              type: LOAD_SUCCESS,
                              payload: { path, data: value.data },
                            });
                            isGroup
                              ? dispatch(loadTerminalGroups())
                              : dispatch(loadTerminals());
                            dispatch(
                              openTerminalEditor(newTerminalId, isGroup)
                            );
                          })
                          .catch((err) => {
                            throw Error(err);
                          });
                      } else {
                        dispatch({
                          type: LOAD_SUCCESS,
                          payload: { path, data: {} },
                        });
                        isGroup
                          ? dispatch(loadTerminalGroups())
                          : dispatch(loadTerminals());
                        dispatch(showInfoBar(`Copy ${object} success!!`));
                      }
                    } else {
                      const errorMsg = "New Terminal Id is null";
                      throw Error(errorMsg);
                    }
                  })
                  .catch((err) => {
                    const errorMsg = err.message ?? `Copy ${object} failed`;
                    const oriObject = getObjectProperty(state, path);
                    dispatch({
                      type: LOAD_FAILURE,
                      payload: { path, data: oriObject.data },
                    });
                    dispatch(showInfoBar(errorMsg, "error"));
                  });
              })
              .catch((err) => {
                const errorMsg = err.message ?? `Get copy ${object} failed`;
                const oriObject = getObjectProperty(state, path);
                dispatch({
                  type: LOAD_FAILURE,
                  payload: { path, data: oriObject.data },
                });
                dispatch(showInfoBar(errorMsg, "error"));
              });
          });
      }
      break;
    }
    case GET_PARENT_TERMINAL_GROUP: {
      let { path, loader, id } = payload;
      if (path && loader && id) {
        let loadingState = getObjectProperty(state, `${path}.state`);
        if (loadingState !== LOADING)
          store.dispatch(loadData(state, path, loader(id)));
      }
      break;
    }
    case GET_TERMINAL_SETTING: {
      let { path, loader, id } = payload;
      if (path && loader && id.toString()) {
        let loadingState = getObjectProperty(state, `${path}.state`);
        if (loadingState !== LOADING)
          store.dispatch((dispatch) => {
            dispatch({ type: LOAD_REQUEST, payload: { path } });
            loader(id)
              .then((value) => {
                if (value.result === false) {
                  throw Error(value.data);
                }
                let setting = {};
                if (value.data) {
                  if (Object.keys(value.data).length === 0) {
                    const errorMsg = `API success (200), but response data is null`;
                    throw Error(errorMsg);
                  } else {
                    Object.keys(value.data).map((key) => {
                      // TODO: use settings from this terminal, we should keep what fields
                      if (key !== "Name" && key !== "MAC") {
                        setting[key] = value.data[key];
                      }
                    });
                  }
                  dispatch({
                    type: LOAD_SUCCESS,
                    payload: { path, data: setting },
                  });
                } else {
                  const errorMsg = `API success (200), but response data is null`;
                  throw Error(errorMsg);
                }
              })
              .catch((err) => {
                const errorMsg = err.message ?? `Get terminal fail`;
                dispatch(showInfoBar(errorMsg, "error"));
                dispatch({
                  type: LOAD_FAILURE,
                  payload: { path, data: errorMsg },
                });
              });
          });
      }
      break;
    }
    case GET_FIRMWARE_PACKAGE: {
      let { path, loader } = payload;
      if (path && loader) {
        let loadingState = getObjectProperty(state, `${path}.state`);
        if (loadingState !== LOADING)
          store.dispatch(loadData(state, path, loader()));
      }
      break;
    }
    case LOAD_MODULES: {
      let { path, ids, moduleLoader } = payload;
      if (
        path &&
        moduleLoader // terminals.msIdWrappers
      ) {
        let loadingState = getObjectProperty(state, `${path}.state`);
        if (loadingState !== LOADING)
          store.dispatch((dispatch) => {
            dispatch({ type: LOAD_REQUEST, payload: { path } });
            // update terminals.msIdWrappers
            let idRelativePromises = ids.map((id) => {
              return moduleLoader(id).then((value) => {
                if (value.result === false) {
                  throw Error(value.data);
                }
                const idMapping = {
                  Id: value.data.Id,
                  ModuleId: value.data.ModuleId,
                  TerminalId: value.data.TerminalId,
                };
                const moduleSetting = value.data.Options;
                return {
                  id: value.data.Id,
                  idMapping: idMapping,
                  moduleSetting: moduleSetting,
                };
              });
            });
            Promise.all(idRelativePromises)
              .then((values) => {
                let idMappings = [];
                let modules = {};
                values.forEach((value) => {
                  idMappings.push(value.idMapping);
                  modules[value.idMapping.ModuleId] = value.moduleSetting;
                });
                dispatch({
                  type: LOAD_SUCCESS,
                  payload: {
                    path: "terminals.msIdWrappers",
                    data: idMappings,
                  },
                });
                dispatch({
                  type: LOAD_SUCCESS,
                  payload: {
                    path,
                    data: modules,
                  },
                });
              })
              .catch((err) => {
                const errorMsg = err.message ?? `Get modules fail`;
                dispatch(showInfoBar(errorMsg, "error"));
                dispatch({ type: LOAD_FAILURE, payload: { path, data: err } });
              });
          });
      }
      break;
    }
    case LOAD_MODULE_SETTING: {
      let { path, moduleLoader } = payload;
      if (
        path &&
        moduleLoader // terminals.modules
      ) {
        let loadingState = getObjectProperty(state, `${path}.state`);
        if (loadingState !== LOADING)
          store.dispatch((dispatch) => {
            dispatch({ type: LOAD_REQUEST, payload: { path } });
            // update terminals.modules
            moduleLoader()
              .then((value) => {
                if (value.result === false) {
                  throw Error(value.data);
                }
                let moduleSettings = [];
                let possibleModuleSettings = {};
                value.data.forEach((moduleSetting) => {
                  moduleSettings.push({
                    Id: moduleSetting.Id,
                    Name: moduleSetting.Name,
                    Type: moduleSetting.Type,
                  });
                  possibleModuleSettings[moduleSetting.Id] =
                    moduleSetting.Options;
                });
                dispatch({
                  type: LOAD_SUCCESS,
                  payload: { path, data: moduleSettings },
                });

                dispatch({
                  type: LOAD_SUCCESS,
                  payload: {
                    path: "terminals.possibleModuleSettings",
                    data: possibleModuleSettings,
                  },
                });
              })
              .catch((err) => {
                const errorMsg = err.message ?? `Get module settings fail`;
                dispatch(showInfoBar(errorMsg, "error"));
                dispatch({
                  type: LOAD_FAILURE,
                  payload: { path, data: errorMsg },
                });
              });
          });
      }
      break;
    }
    case GET_DISPLAY_OPTIONS: {
      let { path, loader, manufacturer, model } = payload;
      if (path && loader) {
        let loadingState = getObjectProperty(state, `${path}.state`);
        if (loadingState !== LOADING)
          store.dispatch(loadData(state, path, loader(manufacturer, model)));
      }
      break;
    }
    case GET_TERMINAL: {
      let { path, loader, isGroup, id } = payload;
      console.log("GET_TERMINAL "+id);
      if (path && loader && id) {
        let loadingState = getObjectProperty(state, `${path}.state`);
        console.log("GET_TERMINAL loadingState = "+loadingState);
        if (loadingState !== LOADING)
          store.dispatch((dispatch) => {
            dispatch({ type: LOAD_REQUEST, payload: { path } });
            loader(id)
              .then((value) => {
                if (value.result === false) {
                  throw Error(value.data);
                }
                const terminal = value.data;
                dispatch({
                  type: LOAD_SUCCESS,
                  payload: {
                    path: path,
                    data: terminal,
                  },
                });
              })
              .catch((err) => {
                const errorMsg = err.message ?? `Get Terminal failed!!`;
                dispatch(showInfoBar(errorMsg, "error"));
                dispatch({
                  type: LOAD_FAILURE,
                  payload: { path, data: null },
                });
              });
          });
      }
      break;
    }
    case OPERATE_TERMINAL: {
      let { path, loader, upadteLoader, getLoader, action, editingId, } = payload;
      console.log("OPERATE_TERMINAL "+editingId+","+action);
      if (path && loader && upadteLoader && getLoader && action && editingId) {
        let loadingState = getObjectProperty(state, `${path}.state`);
        if (loadingState !== LOADING)
          store.dispatch((dispatch) => {
            let updateData = {};
            dispatch({ type: LOAD_REQUEST, payload: { path: path }, });
			// TODO: 看不出有更新東西？
            if (action === "enable" || action === "disable") {
              updateData = { Disabled: action === "disable" ? true : false };
              // 這邊相當於執行 PUT
              upadteLoader(editingId, updateData).then((value) => {
                if (value.result === false) {
                  throw Error(value.data);
                }
              });
            }
            // 相當於執行 op
            loader(editingId, action)
              .then((value) => {
                if (value.result === false) {
                  throw Error(value.data);
                }
                dispatch({
                  type: LOAD_SUCCESS,
                  payload: { path, data: value.data },
                });
                dispatch(getTerminal(editingId, false));
              })
              .catch((err) => {
                const errorMsg = err.message ?? `Get module settings fail`;
                dispatch(showInfoBar(errorMsg, "error"));
                dispatch({
                  type: LOAD_FAILURE,
                  payload: { path, data: errorMsg },
                });
              });
          });
      }
      break;
    }
    case GET_MODEL_MAP: {
      let {
        supportDevicePath,
        manufacturerModelMapPath,
        supportDeviceLoader,
        firmwarePackageLoader,
      } = payload;
      if (
        (supportDevicePath,
        manufacturerModelMapPath,
        supportDeviceLoader,
        firmwarePackageLoader)
      ) {
        let loadingState = getObjectProperty(
          state,
          `${supportDevicePath}.state`
        );
        if (loadingState !== LOADING)
          store.dispatch((dispatch) => {
            dispatch({
              type: LOAD_REQUEST,
              payload: { path: supportDevicePath },
            });
            dispatch({
              type: LOAD_REQUEST,
              payload: { path: manufacturerModelMapPath },
            });
            supportDeviceLoader()
              .then((value) => {
                if (value.result === false) {
                  throw Error(value.data);
                }
                let supportDevices = value.data;
                let manufacturerModelMap = new Map();
                if (Array.isArray(supportDevices)) {
                  supportDevices.forEach((item) => {
                    let manufacturer = item["Manufacturer"];
                    if (!manufacturerModelMap.has(manufacturer)) {
                      manufacturerModelMap.set(manufacturer, new Set());
                    }
                    manufacturerModelMap.get(manufacturer).add(item["Model"]);
                  });
                } else {
                  [].forEach((item) => {
                    let manufacturer = item["Manufacturer"];
                    if (!manufacturerModelMap.has(manufacturer)) {
                      manufacturerModelMap.set(manufacturer, new Set());
                    }
                    manufacturerModelMap.get(manufacturer).add(item["Model"]);
                  });
                }
                dispatch({
                  type: LOAD_SUCCESS,
                  payload: { path: supportDevicePath, data: supportDevices },
                });
                dispatch({
                  type: LOAD_SUCCESS,
                  payload: {
                    path: manufacturerModelMapPath,
                    data: manufacturerModelMap,
                  },
                });
              })
              .catch((err) => {
                let manufacturerModelMap = new Map();
                const errorMsg = err.message ?? `Get hardware fail`;
                [].forEach((item) => {
                  let manufacturer = item["Manufacturer"];
                  if (!manufacturerModelMap.has(manufacturer)) {
                    manufacturerModelMap.set(manufacturer, new Set());
                  }
                  manufacturerModelMap.get(manufacturer).add(item["Model"]);
                });
                dispatch({
                  type: LOAD_FAILURE,
                  payload: { path: supportDevicePath, data: errorMsg },
                });
                dispatch({
                  type: LOAD_FAILURE,
                  payload: {
                    path: manufacturerModelMapPath,
                    data: manufacturerModelMap,
                  },
                });
                dispatch(showInfoBar(errorMsg, "error"));
              });
          });
      }
      break;
    }
    default: {
      break;
    }
  }
  return rst;
};
