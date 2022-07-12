import { LOAD_REQUEST, LOAD_SUCCESS, LOAD_FAILURE } from "const/ActionType";
import {
  ADD_SERVER,
  COPY_SERVER,
  DELETE_SERVER,
  GET_SERVER,
  LOAD_SERVERS,
  LOAD_SERVER_GROUPS,
  LOAD_SERVERS_AND_GROUPS,
  UPDATE_SERVER,
} from "const/ActionType";
import {
  loadServers,
  loadServerGroups,
  loadServersAndGroups,
  closeWizard as closeServerWizard,
  closeEditor as closeServerEditor,
  openEditor,
} from "actions/ServerActions";
import { showInfoBar } from "actions/InfobarActions";
import { LOADING, LOADED } from "const/DataLoaderState.js";
import { getObjectProperty } from "lib/Util";

import { convertListToTree } from "utils/Tree";

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
    case LOAD_SERVERS_AND_GROUPS: {
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
                const serverList = value.data;
                groupLoader()
                  .then(async (value) => {
                    if (value.result === false) {
                      throw Error(value.data);
                    }
                    const serverGroupList = value.data;
                    dispatch({
                      type: LOAD_SUCCESS,
                      payload: {
                        path: "servers.serverGroups",
                        data: serverGroupList,
                      },
                    });
                    dispatch({
                      type: LOAD_SUCCESS,
                      payload: {
                        path: "servers.servers",
                        data: serverList,
                      },
                    });
                    const serverMainTree = await convertListToTree(
                      serverList,
                      serverGroupList
                    );
                    dispatch({
                      type: LOAD_SUCCESS,
                      payload: {
                        path: "servers.serverMainTree",
                        data: serverMainTree,
                      },
                    });
                  })
                  .catch((err) => {
                    throw Error(err);
                  });
              })
              .catch((err) => {
                const errorMsg = err.message ?? `Get RDS Server list failed!!`;
                dispatch(showInfoBar(errorMsg, "error"));
                dispatch({ type: LOAD_FAILURE, payload: { path, data: null } });
              });
          });
      }
      break;
    }
    case LOAD_SERVERS: {
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
                const serverList = value.data;
                const serverGroupList = state.servers.serverGroups.data;
                const serverMainTree = await convertListToTree(
                  serverList,
                  serverGroupList
                );
                dispatch({
                  type: LOAD_SUCCESS,
                  payload: {
                    path: "servers.serverMainTree",
                    data: serverMainTree,
                  },
                });
                dispatch({
                  type: LOAD_SUCCESS,
                  payload: {
                    path: path,
                    data: serverList,
                  },
                });
              })
              .catch((err) => {
                const errorMsg = err.message ?? `Get RDS Server list failed!!`;
                dispatch(showInfoBar(errorMsg, "error"));
                dispatch({ type: LOAD_FAILURE, payload: { path, data: null } });
              });
          });
      }
      break;
    }
    case LOAD_SERVER_GROUPS: {
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
                const serverGroupList = value.data;
                const serverList = state.servers.servers.data;
                const serverMainTree = await convertListToTree(
                  serverList,
                  serverGroupList
                );
                dispatch({
                  type: LOAD_SUCCESS,
                  payload: {
                    path: "servers.serverMainTree",
                    data: serverMainTree,
                  },
                });
                dispatch({
                  type: LOAD_SUCCESS,
                  payload: {
                    path: path,
                    data: serverGroupList,
                  },
                });
              })
              .catch((err) => {
                const errorMsg =
                  err.message ?? `Get RDS Server Group list failed!!`;
                dispatch(showInfoBar(errorMsg, "error"));
                dispatch({ type: LOAD_FAILURE, payload: { path, data: null } });
              });
          });
      }
      break;
    }
    case ADD_SERVER: {
      let { path, data, schedules, addServerLoader, isGroup } = payload;
      if (path && data && schedules && addServerLoader) {
        let loadingSate = getObjectProperty(state, `${path}.state`);
        if (loadingSate !== LOADING)
          store.dispatch((dispatch) => {
            const object = isGroup === true ? "rds-server group" : "rds-server";
            dispatch({ type: LOAD_REQUEST, payload: { path } });
            addServerLoader(data)
              .then((value) => {
                if (value.result === false) {
                  throw Error(value.data);
                }
                dispatch({
                  type: LOAD_SUCCESS,
                  payload: { path, data: {} },
                });
                isGroup
                  ? dispatch(loadServerGroups())
                  : dispatch(loadServers());
                dispatch(closeServerWizard());
                dispatch(showInfoBar(`New ${object} has added!!`));
              })
              .catch((err) => {
                const errorMsg = err.message ?? `Add ${object}　failed!`;
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
    case GET_SERVER: {
      let { path, loader, id } = payload;
      if (path && loader && id) {
        let loadingSate = getObjectProperty(state, `${path}.state`);
        if (loadingSate !== LOADING)
          store.dispatch(loadData(state, path, loader(id)));
      }
      break;
    }
    case UPDATE_SERVER: {
      let {
        path,
        updateServerLoader,
        getServerLoader,
        id,
        data,
        isGroup,
        urlPath,
      } = payload;
      if (path && updateServerLoader && getServerLoader && id && data) {
        let loadingSate = getObjectProperty(state, `${path}.state`);
        if (loadingSate !== LOADING)
          store.dispatch((dispatch) => {
            const object = isGroup === true ? "rds-server group" : "rds-server";
            dispatch({ type: LOAD_REQUEST, payload: { path } });
            updateServerLoader(id, data, urlPath)
              .then((value) => {
                if (value.result === false) {
                  throw Error(value.data);
                }
                getServerLoader(id)
                  .then((value) => {
                    if (value.result === false) {
                      throw Error(value.data);
                    }
                    dispatch({
                      type: LOAD_SUCCESS,
                      payload: { path, data: value.data },
                    });
                    isGroup
                      ? dispatch(loadServersAndGroups())
                      : dispatch(loadServers());
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
      }
      break;
    }
    case DELETE_SERVER: {
      let { path, loader, id, isGroup } = payload;
      if (path && loader && id)
        store.dispatch((dispatch) => {
          const object = isGroup === true ? "rds-server group" : "rds-server";
          dispatch({ type: LOAD_REQUEST, payload: { path } });
          loader(id)
            .then((value) => {
              if (value.result === false) {
                throw Error(value.data);
              }
              dispatch({ type: LOAD_SUCCESS, payload: { path, data: {} } });
              if (state.servers.editorOpened) {
                dispatch(closeServerEditor());
              }
              isGroup ? dispatch(loadServersAndGroups()) : dispatch(loadServers());
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
      break;
    }
    case COPY_SERVER: {
      let {
        path,
        id,
        name,
        parentId,
        isGroup,
        addServerLoader,
        getServerLoader,
      } = payload;
      if (path && id && name && addServerLoader && getServerLoader) {
        let loadingState = getObjectProperty(state, `${path}.state`);
        if (loadingState !== LOADING)
          store.dispatch((dispatch) => {
            const object = isGroup === true ? "rds-server group" : "rds-server";
            dispatch({ type: LOAD_REQUEST, payload: { path } });
            getServerLoader(id)
              .then((value) => {
                if (value.result === false) {
                  throw Error(value.data);
                }
                let data = value.data;
                data["Name"] = name;
                data["ParentId"] = parentId;
                delete data["Id"];
                delete data["ModifiedTS"];
                delete data["Error"];
                delete data["Status"];
                // null ParentId will cause add "Fail"
                if (data["ParentId"] == null) {
                  data["ParentId"] = 0;
                }
                // Save new server
                addServerLoader(data)
                  .then((value) => {
                    if (value.result === false) {
                      throw Error(value.data);
                    }
                    const newServerId = value.data;
                    // Switch editor
                    if (newServerId != null) {
                      if (state.servers.editorOpened === true) {
                        getServerLoader(newServerId)
                          .then((value) => {
                            if (value.result === false) {
                              throw Error(value.data);
                            }
                            dispatch({
                              type: LOAD_SUCCESS,
                              payload: { path, data: value.data },
                            });
                            isGroup
                              ? dispatch(loadServerGroups())
                              : dispatch(loadServers());
                            dispatch(openEditor(newServerId, isGroup));
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
                          ? dispatch(loadServerGroups())
                          : dispatch(loadServers());
                        dispatch(showInfoBar(`Copy ${object} success`));
                      }
                    } else {
                      const errorMsg = "New Rds-Server Id is null";
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
    default: {
      break;
    }
  }
  return rst;
};
