import { LOAD_REQUEST, LOAD_SUCCESS, LOAD_FAILURE } from "const/ActionType";
import {
  ADD_APPLICATION,
  COPY_APPLICATION,
  DELETE_APPLICATION,
  GET_APPLICATION,
  LOAD_APPLICATIONS,
  LOAD_APPLICATION_GROUPS,
  LOAD_APPLICATIONS_AND_GROUPS,
  UPDATE_APPLICATION,
} from "const/ActionType";
import {
  loadApplications,
  loadApplicationGroups,
  loadApplicationsAndGroups,
  closeApplicationEditor,
  closeApplicationWizard,
  openApplicationEditor,
} from "actions/ApplicationActions";
import { showInfoBar } from "actions/InfobarActions";
import { LOADING, LOADED } from "const/DataLoaderState.js";
import { getObjectProperty } from "lib/Util";

import { convertListToTree } from "utils/Tree";

const loadData = (path, loaderPromise) => (dispatch) => {
  dispatch({ type: LOAD_REQUEST, payload: { path } });
  loaderPromise
    .then(({ data, response }) => {
      dispatch({ type: LOAD_SUCCESS, payload: { path, data } });
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
    case LOAD_APPLICATIONS_AND_GROUPS: {
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
                const apps = value.data.RDS;
                dispatch({
                  type: LOAD_SUCCESS,
                  payload: {
                    path: "applications.applications",
                    data: apps,
                  },
                });
                const vncs = value.data.VNC;
                dispatch({
                  type: LOAD_SUCCESS,
                  payload: {
                    path: "applications.vncs",
                    data: vncs,
                  },
                });
                groupLoader()
                  .then(async (value) => {
                    if (value.result === false) {
                      throw Error(value.data);
                    }
                    const appGroups = value.data.RDS;
                    dispatch({
                      type: LOAD_SUCCESS,
                      payload: {
                        path: "applications.applicationGroups",
                        data: appGroups,
                      },
                    });

                    const vncGroups = value.data.VNC;
                    dispatch({
                      type: LOAD_SUCCESS,
                      payload: {
                        path: "applications.vncGroups",
                        data: vncGroups,
                      },
                    });

                    const applicationMainTree = await convertListToTree(
                      apps,
                      appGroups
                    );
                    dispatch({
                      type: LOAD_SUCCESS,
                      payload: {
                        path: "applications.applicationMainTree",
                        data: applicationMainTree,
                      },
                    });

                    const vncMainTree = await convertListToTree(
                      vncs,
                      vncGroups
                    );
                    dispatch({
                      type: LOAD_SUCCESS,
                      payload: {
                        path: "applications.vncMainTree",
                        data: vncMainTree,
                      },
                    });
                  })
                  .catch((err) => {
                    throw Error(err);
                  });
              })
              .catch((err) => {
                const errorMsg = err.message ?? `Get Application list failed!!`;
                dispatch(showInfoBar(errorMsg, "error"));
                dispatch({ type: LOAD_FAILURE, payload: { path, data: null } });
              });
          });
      }
      break;
    }
    case LOAD_APPLICATIONS: {
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
                const apps = value.data.RDS;
                dispatch({
                  type: LOAD_SUCCESS,
                  payload: {
                    path: "applications.applications",
                    data: apps,
                  },
                });

                const vncs = value.data.VNC;
                dispatch({
                  type: LOAD_SUCCESS,
                  payload: {
                    path: "applications.vncs",
                    data: vncs,
                  },
                });

                // 從 state 取出資料, 重建樹
                const appGroups = state.applications.applicationGroups.data;
                const applicationMainTree = await convertListToTree(
                  apps,
                  appGroups,
                );
                dispatch({
                  type: LOAD_SUCCESS,
                  payload: {
                    path: "applications.applicationMainTree",
                    data: applicationMainTree,
                  },
                });

                const vncGroups = state.applications.vncGroups.data;
                const vncMainTree = await convertListToTree(
                  vncs,
                  vncGroups
                );
                dispatch({
                  type: LOAD_SUCCESS,
                  payload: {
                    path: "applications.vncMainTree",
                    data: vncMainTree,
                  },
                });
              })
              .catch((err) => {
                const errorMsg = err.message ?? `Get Application list failed!!`;
                dispatch(showInfoBar(errorMsg, "error"));
                dispatch({ type: LOAD_FAILURE, payload: { path, data: null } });
              });
          });
      }
      break;
    }
    case LOAD_APPLICATION_GROUPS: {
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
                const appGroups = value.data.RDS;
                const apps = state.applications.applications.data;
                const applicationMainTree = await convertListToTree(
                  apps,
                  appGroups
                );
                dispatch({
                  type: LOAD_SUCCESS,
                  payload: {
                    path: "applications.applicationMainTree",
                    data: applicationMainTree,
                  },
                });
                dispatch({
                  type: LOAD_SUCCESS,
                  payload: {
                    path: "applications.applicationGroups",
                    data: appGroups,
                  },
                });

                const vncGroups = value.data.VNC;
                const vncs = state.applications.vncs.data;
                const vncMainTree = await convertListToTree(
                  vncs,
                  vncGroups,
                );
                dispatch({
                  type: LOAD_SUCCESS,
                  payload: {
                    path: "applications.vncMainTree",
                    data: vncMainTree,
                  },
                });
                dispatch({
                  type: LOAD_SUCCESS,
                  payload: {
                    path: "applications.vncGroups",
                    data: vncGroups,
                  },
                });
              })
              .catch((err) => {
                const errorMsg =
                  err.message ?? `Get Application Group list failed!!`;
                dispatch(showInfoBar(errorMsg, "error"));
                dispatch({ type: LOAD_FAILURE, payload: { path, data: null } });
              });
          });
      }
      break;
    }
    case ADD_APPLICATION: {
      let { path, addApplicationLoader, data, isGroup } = payload;
      if (path && addApplicationLoader && data) {
        let loadingSate = getObjectProperty(state, `${path}.state`);
        if (loadingSate !== LOADING)
          store.dispatch((dispatch) => {
            const object =
              isGroup === true ? "application group" : "application";
            dispatch({ type: LOAD_REQUEST, payload: { path } });
            addApplicationLoader(data)
              .then((value) => {
                if (value.result === false) {
                  throw Error(value.data);
                }
                dispatch({
                  type: LOAD_SUCCESS,
                  payload: { path, data: {} },
                });
                isGroup
                  ? dispatch(loadApplicationGroups())
                  : dispatch(loadApplications());
                dispatch(closeApplicationWizard());
                dispatch(showInfoBar(`New ${object} has added!!`));
              })
              .catch((err) => {
                const errorMsg = err.message ?? `Add ${object} fail`;
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
    case GET_APPLICATION: {
      let { path, loader, id, isGroup } = payload;
      if (path && loader && id) {
        let loadingSate = getObjectProperty(state, `${path}.state`);
        if (loadingSate !== LOADING)
          store.dispatch((dispatch) => {
            const object =
              isGroup === true ? "application group" : "application";
            dispatch({ type: LOAD_REQUEST, payload: { path } });
            loader(id)
              .then((value) => {
                if (value.result === false) {
                  throw Error(value.data);
                }
                dispatch({
                  type: LOAD_SUCCESS,
                  payload: {
                    path,
                    data: value.data,
                  },
                });
              })
              .catch((err) => {
                const errorMsg = err.message ?? `Get ${object} failed`;
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
    case UPDATE_APPLICATION: {
      let {
        path,
        updateApplicationLoader,
        getApplicationLoader,
        id,
        data,
        isGroup,
        urlPath,
      } = payload;
      if (
        path &&
        updateApplicationLoader &&
        getApplicationLoader &&
        id &&
        data
      ) {
        let loadingSate = getObjectProperty(state, `${path}.state`);
        if (loadingSate !== LOADING)
          store.dispatch((dispatch) => {
            const object =
              isGroup === true ? "application group" : "application";
            dispatch({ type: LOAD_REQUEST, payload: { path } });
            updateApplicationLoader(id, data, urlPath)
              .then((value) => {
                if (value.result === false) {
                  throw Error(value.data);
                }
                getApplicationLoader(id)
                  .then((value) => {
                    if (value.result === false) {
                      throw Error(value.data);
                    }
                    dispatch({
                      type: LOAD_SUCCESS,
                      payload: { path, data: value.data },
                    });
                    isGroup
                      ? dispatch(loadApplicationsAndGroups())
                      : dispatch(loadApplications());
                    dispatch(showInfoBar(`Update ${object} success!!`));
                  })
                  .catch((err) => {
                    throw Error(err);
                  });
              })
              .catch((err) => {
                const errorMsg = err.message ?? `Update ${object} fail`;
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
    case DELETE_APPLICATION: {
      let { path, loader, id, isGroup } = payload;
      if (path && loader && id)
        store.dispatch((dispatch) => {
          const object = isGroup === true ? "application group" : "application";
          dispatch({ type: LOAD_REQUEST, payload: { path } });
          loader(id)
            .then((value) => {
              if (value.result === false) {
                throw Error(value.data);
              }
              dispatch({ type: LOAD_SUCCESS, payload: { path, data: {} } });
              if (state.applications.editorOpened) {
                dispatch(closeApplicationEditor());
              }
              isGroup
                ? dispatch(loadApplicationsAndGroups())
                : dispatch(loadApplications());
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
    case COPY_APPLICATION: {
      let {
        path,
        id,
        name,
        parentId,
        isGroup,
        addApplicationLoader,
        getApplicationLoader,
      } = payload;
      if (path && id && name && addApplicationLoader && getApplicationLoader) {
        let loadingState = getObjectProperty(state, `${path}.state`);
        if (loadingState !== LOADING)
          store.dispatch((dispatch) => {
            const object =
              isGroup === true ? "application group" : "application";
            dispatch({ type: LOAD_REQUEST, payload: { path } });
            getApplicationLoader(id)
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
                // Save new application
                addApplicationLoader(data)
                  .then((value) => {
                    if (value.result === false) {
                      throw Error(value.data);
                    }
                    const newApplicationId = value.data;
                    // Switch editor
                    if (newApplicationId != null) {
                      if (state.applications.editorOpened === true) {
                        getApplicationLoader(newApplicationId)
                          .then((value) => {
                            if (value.result === false) {
                              throw Error(value.data);
                            }
                            dispatch({
                              type: LOAD_SUCCESS,
                              payload: { path, data: value.data },
                            });
                            isGroup
                              ? dispatch(loadApplicationGroups())
                              : dispatch(loadApplications());
                            dispatch(
                              openApplicationEditor(newApplicationId, isGroup)
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
                          ? dispatch(loadApplicationGroups())
                          : dispatch(loadApplications());
                        dispatch(showInfoBar(`Copy ${object} success`));
                      }
                    } else {
                      const errorMsg = "New Application Id is null";
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
