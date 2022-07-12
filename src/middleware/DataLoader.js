import { loadUsers, getUserInfo } from "actions/AuthActions";
import { showInfoBar } from "actions/InfobarActions";
import {
  initPendingTerminals,
  loadTerminalsAndGroups,
} from "actions/TerminalActions";
import { loadServersAndGroups } from "actions/ServerActions";
import { loadApplicationsAndGroups } from "actions/ApplicationActions";

import {
  GET_PRODUCT_INFO,
  GET_USER_INFO,
  GET_WATCHDOG,
  LOAD_REQUEST,
  LOAD_SUCCESS,
  LOAD_FAILURE,
  LOAD_AD_USERS,
  LOGIN,
  LOGOUT,
  LOAD_USERS,
  ADD_USER,
  DELETE_USER,
  VERIFY_AUTH_USER,
  UPDATE_USER,
} from "const/ActionType";
import { LOADING } from "const/DataLoaderState.js";

import { getObjectProperty } from "lib/Util";

const loadData = (path, loaderPromise, nextAction, options) => (dispatch) => {
  dispatch({ type: LOAD_REQUEST, payload: { path } });
  loaderPromise
    .then((value) => {
      if (value.result === false) {
        throw Error(value.data);
      }
      dispatch({ type: LOAD_SUCCESS, payload: { path, data: value.data } });
      if (options != null && options.onSuccess != null) {
        dispatch(options.onSuccess);
      }
      if (nextAction != null) {
        dispatch(nextAction);
      }
    })
    .catch((err) => {
      let errorMsg = err.message ?? `API fail`;
      if (options != null && options.onFailure != null) {
        dispatch(
          err.message === undefined
            ? options.onFailure
            : showInfoBar(errorMsg, "error")
        );
      }
      dispatch({
        type: LOAD_FAILURE,
        payload: { path, data: errorMsg },
      });

      // if (nextAction != null) {
      //   dispatch(nextAction);
      // }
    });
};

export default (store) => (next) => (action) => {
  let state = store.getState();
  let { type, payload } = action;
  let rst = next(action);

  switch (type) {
    case LOAD_AD_USERS: {
      let { path, loader, data } = payload;
      if (path && loader) {
        let loadingSate = getObjectProperty(state, `${path}.state`);
        if (loadingSate !== LOADING)
          store.dispatch((dispatch) => {
            dispatch({ type: LOAD_REQUEST, payload: { path } });
            loader(data)
              .then(async (value) => {
                if (value.result === false) {
                  throw Error(value.data);
                }
                dispatch({
                  type: LOAD_SUCCESS,
                  payload: { path, data: value.data },
                });
              })
              .catch((err) => {
                let errorMsg = err.message ?? `Get Ad Users failed !!`;
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
    case VERIFY_AUTH_USER: {
      let { path, loader, data } = payload;
      if (path && loader && data) {
        const authUser = {
          Username: data.Username,
          Password: data.Password,
          Domain: data.Domain,
        };
        let loadingSate = getObjectProperty(state, `${path}.state`);
        if (loadingSate !== LOADING)
          store.dispatch(loadData(path, loader(authUser)));
      }
      break;
    }
    case LOGIN: {
      let { path, loader, data } = payload;
      if (path && loader && data) {
        let loadingSate = getObjectProperty(state, `${path}.state`);
        if (loadingSate !== LOADING)
          store.dispatch((dispatch) => {
            dispatch({ type: LOAD_REQUEST, payload: { path } });
            loader(data)
              .then((value) => {
                if (value.result === false) {
                  throw Error(value.data);
                }
                dispatch(getUserInfo(value.data.Id));
                dispatch(loadTerminalsAndGroups());
                dispatch(loadServersAndGroups());
                dispatch(loadApplicationsAndGroups());
                dispatch(showInfoBar("Login success !!"));
                localStorage.setItem("loginStatus", "true");
                localStorage.setItem("loginId", value.data.Id);
                dispatch({
                  type: LOAD_SUCCESS,
                  payload: { path, data: value.data },
                });
              })
              .catch((err) => {
                const errorMsg = err.message ?? `Login fail !!`;
                dispatch(showInfoBar(errorMsg, "error"));
                localStorage.setItem("loginStatus", "false");
                localStorage.removeItem("loginId");
                dispatch({
                  type: LOAD_FAILURE,
                  payload: { path, data: errorMsg },
                });
              });
          });
      }
      break;
    }
    case LOGOUT: {
      let { path, loader, data } = payload;
      if (path && loader && data) {
        let loadingSate = getObjectProperty(state, `${path}.state`);
        if (loadingSate !== LOADING)
          store.dispatch((dispatch) => {
            dispatch({ type: LOAD_REQUEST, payload: { path } });
            loader(data)
              .then((value) => {
                if (value.result === false) {
                  throw Error(value.data);
                }
                dispatch(showInfoBar("Logout success"));
                localStorage.setItem("loginStatus", "false");
                localStorage.removeItem("loginId");
                dispatch({
                  type: LOAD_SUCCESS,
                  payload: { path, data: null },
                });
              })
              .catch((err) => {
                const errorMsg = err.message ?? `Logout fail !!`;
                dispatch(showInfoBar(errorMsg, "error"));
                dispatch({
                  type: LOAD_FAILURE,
                  payload: { path, data: errorMsg },
                });
              });
          });
      }
    }
    case GET_USER_INFO: {
      let { path, loader, id } = payload;
      if (path && loader && id) {
        let loadingSate = getObjectProperty(state, `${path}.state`);
        if (loadingSate !== LOADING)
          store.dispatch((dispatch) => {
            dispatch({ type: LOAD_REQUEST, payload: { path } });
            loader(id)
              .then(async (value) => {
                if (value.result === false) {
                  throw Error(value.data);
                }
                dispatch({
                  type: LOAD_SUCCESS,
                  payload: { path, data: { ...value.data } },
                });
              })
              .catch((err) => {
                const errorMsg = err.message ?? `Get User info failed!`;
                dispatch(showInfoBar(errorMsg, "error"));
                dispatch({
                  type: LOAD_FAILURE,
                  payload: { path, data: errorMsg },
                });
              });
          });
        break;
      }
    }
    case ADD_USER: {
      let { path, loader, getUserLoader, data } = payload;
      if (path && loader && getUserLoader && data) {
        let loadingSate = getObjectProperty(state, `${path}.state`);
        if (loadingSate !== LOADING)
          store.dispatch((dispatch) => {
            loader(data)
              .then((value) => {
                if (value.result === false) {
                  throw Error(value.data);
                }
                const newId = value.data;
                getUserLoader(newId)
                  .then((value) => {
                    if (value.result === false) {
                      throw Error(value.data);
                    }
                    dispatch({
                      type: LOAD_SUCCESS,
                      payload: { path, data: value.data },
                    });
                    dispatch(loadUsers());
                    dispatch(showInfoBar("New user has added!"));
                  })
                  .catch((err) => {
                    throw Error(err);
                  });
              })
              .catch((err) => {
                const errorMsg =
                  err.message ?? `New user added failed, please try again!`;
                dispatch(showInfoBar(errorMsg, "error"));
              });
          });
      }
      break;
    }
    case DELETE_USER: {
      let { path, loader, id } = payload;
      if (path && loader && id) {
        let loadingSate = getObjectProperty(state, `${path}.state`);
        if (loadingSate !== LOADING)
          store.dispatch(
            loadData(path, loader(id), loadUsers(), {
              onFailure: showInfoBar("Delete user failed."),
            })
          );
      }
      break;
    }
    case UPDATE_USER: {
      let { path, loader, getUserLoader, data } = payload;
      if (path && loader && getUserLoader && data) {
        let loadingSate = getObjectProperty(state, `${path}.state`);
        if (loadingSate !== LOADING)
          store.dispatch((dispatch) => {
            loader(data.Id, data)
              .then((value) => {
                if (value.result === false) {
                  throw Error(value.data);
                }
                getUserLoader(data.Id)
                  .then((value) => {
                    if (value.result === false) {
                      throw Error(value.data);
                    }
                    dispatch({
                      type: LOAD_SUCCESS,
                      payload: { path, data: value.data },
                    });
                    dispatch(loadUsers());
                    dispatch(showInfoBar("Update user Success!"));
                    if (data.Id === state.auths.userInfo?.data?.Id)
                      dispatch(getUserInfo(data.Id));
                  })
                  .catch((err) => {
                    throw Error(err);
                  });
              })
              .catch((err) => {
                const errorMsg = err.message ?? `Update user Failed.`;
                dispatch(showInfoBar(errorMsg, "error"));
              });
          });
      }
      break;
    }
    case LOAD_USERS: {
      let { path, loader } = payload;
      if (path && loader) {
        let loadingSate = getObjectProperty(state, `${path}.state`);
        if (loadingSate !== LOADING) store.dispatch(loadData(path, loader()));
      }
      break;
    }
    case GET_PRODUCT_INFO: {
      let { path, loader } = payload;
      if (path && loader) {
        let loadingSate = getObjectProperty(state, `${path}.state`);
        if (loadingSate !== LOADING)
          store.dispatch((dispatch) => {
            dispatch({ type: LOAD_REQUEST, payload: { path } });
            loader()
              .then((value) => {
                if (value.result === false) {
                  throw Error(value.data);
                }
                dispatch({
                  type: LOAD_SUCCESS,
                  payload: { path, data: value.data },
                });
                dispatch(initPendingTerminals());
              })
              .catch((err) => {
                let errorMsg = err.message ?? `Get Product info failed!!`;
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

    case GET_WATCHDOG: {
      let { path, loader } = payload;
      if (path && loader) {
        let loadingSate = getObjectProperty(state, `${path}.state`);
        if (loadingSate !== LOADING)
          store.dispatch((dispatch) => {
            dispatch({ type: LOAD_REQUEST, payload: { path } });
            loader()
              .then((value) => {
                if (value.result === false) {
                  throw Error(value.data);
                }
                dispatch({
                  type: LOAD_SUCCESS,
                  payload: { path, data: value.data },
                });
                dispatch(initPendingTerminals());
              })
              .catch((err) => {
                let errorMsg = err.message ?? `Get Watchdow failed`;
                dispatch(showInfoBar(errorMsg, "error"));
                dispatch({
                  type: LOAD_FAILURE,
                  payload: { path, data: errorMsg },
                });
              });
          });
      }
    }

    default: {
      break;
    }
  }

  return rst;
};
