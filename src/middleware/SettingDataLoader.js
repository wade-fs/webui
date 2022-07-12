import { getObjectProperty } from "lib/Util";

import { showInfoBar } from "actions/InfobarActions";
import { loadPackages } from "actions/SettingActions";

import { LOAD_REQUEST, LOAD_SUCCESS, LOAD_FAILURE } from "const/ActionType";
import {
  // Package actions.
  COPY_PACKAGE,
  DELETE_PACKAGE,
  DOWNLOAD_PACKAGE,
  LOAD_PACKAGES,
  LOCK_PACKAGE,
  RENAME_PACKAGE,
  // Firmware package settings
  LOAD_FIRMWARE_SETTINGS,
  UPDATE_FIRMWARE_SETTING,
  // License
  LOAD_LICENSES,
  REQUEST_LICENSE,
} from "const/ActionType";
import { LOADING } from "const/DataLoaderState.js";

const loadData = (path, loaderPromise, nextAction, options) => (dispatch) => {
  dispatch({ type: LOAD_REQUEST, payload: { path } });
  loaderPromise
    .then(({ data, response }) => {
      dispatch({ type: LOAD_SUCCESS, payload: { path, data } });
      if (options && options.onSuccess) {
        dispatch(options.onSuccess);
      }
      if (nextAction != null) {
        dispatch(nextAction);
      }
    })
    .catch((err) => {
      if (options != null && options.onFailure != null) {
        dispatch(options.onFailure);
      }
      dispatch({ type: LOAD_FAILURE, payload: { path, data: err } });
    });
};

export default (store) => (next) => (action) => {
  let state = store.getState();
  let { type, payload } = action;
  let rst = next(action);

  switch (type) {
    // Package actions.
    case COPY_PACKAGE: {
      let { path, loader, id, name } = payload;
      if (path && loader && id && name) {
        let loadingSate = getObjectProperty(state, `${path}.state`);
        if (loadingSate !== LOADING)
          store.dispatch(loadData(path, loader(id, name), loadPackages()));
      }
      break;
    }
    case DELETE_PACKAGE: {
      let { path, loader, id } = payload;
      if (path && loader && id) {
        let loadingSate = getObjectProperty(state, `${path}.state`);
        if (loadingSate !== LOADING)
          store.dispatch(loadData(path, loader(id), loadPackages()));
      }
      break;
    }
    case DOWNLOAD_PACKAGE: {
      let { path, loader, id } = payload;
      if (path && loader && id) {
        let loadingSate = getObjectProperty(state, `${path}.state`);
        if (loadingSate !== LOADING) store.dispatch(loadData(path, loader(id)));
      }
      break;
    }
    case LOAD_PACKAGES: {
      let { path, loader } = payload;
      if (path && loader) {
        let loadingSate = getObjectProperty(state, `${path}.state`);
        if (loadingSate !== LOADING) store.dispatch(loadData(path, loader()));
      }
      break;
    }
    case LOCK_PACKAGE: {
      let { path, loader, id, lock } = payload;
      if (path && loader && id && lock != null) {
        let loadingSate = getObjectProperty(state, `${path}.state`);
        if (loadingSate !== LOADING)
          store.dispatch(loadData(path, loader(id, lock), loadPackages()));
      }
      break;
    }
    case RENAME_PACKAGE: {
      let { path, loader, id, name } = payload;
      if (path && loader && id && name) {
        let loadingSate = getObjectProperty(state, `${path}.state`);
        if (loadingSate !== LOADING)
          store.dispatch(loadData(path, loader(id, name), loadPackages()));
      }
      break;
    }
    // Firmware package settings
    case LOAD_FIRMWARE_SETTINGS: {
      let { path, loader, manufacturer, model } = payload;
      if (path && loader && manufacturer && model) {
        let loadingSate = getObjectProperty(state, `${path}.state`);
        if (loadingSate !== LOADING)
          store.dispatch(loadData(path, loader(manufacturer, model)));
      }
      break;
    }
    case UPDATE_FIRMWARE_SETTING: {
      let { path, loader, manufacturer, model, data } = payload;
      if (path && loader && manufacturer && model && data) {
        let loadingSate = getObjectProperty(state, `${path}.state`);
        if (loadingSate !== LOADING)
          store.dispatch(loadData(path, loader(manufacturer, model, data)));
      }
      break;
    }
    // License
    case LOAD_LICENSES: {
      let { path, loader } = payload;
      if (path && loader) {
        let loadingSate = getObjectProperty(state, `${path}.state`);
        if (loadingSate !== LOADING) store.dispatch(loadData(path, loader()));
      }
      break;
    }
    case REQUEST_LICENSE: {
      let { path, loader, licenseId } = payload;
      if (path && loader && licenseId) {
        let loadingSate = getObjectProperty(state, `${path}.state`);
        if (loadingSate !== LOADING)
          store.dispatch(
            loadData(path, loader(licenseId), null, {
              onSuccess: showInfoBar("Get Installed Id Success!!"),
              onFailure: showInfoBar("Get Installed Id Fail!!"),
            })
          );
      }
      break;
    }
    default: {
      break;
    }
  }
  return rst;
};
