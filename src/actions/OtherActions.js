import {
  ERROR_LOADER,
  GET_PRODUCT_INFO,
  GET_WATCHDOG,
  LOAD_AD_USERS,
  UPDATE_WS_APP_LIST, // apps mapping by id
  UPDATE_WS_TERMINAL_LIST, // terminals mapping by id
  VERIFY_AUTH_USER,
  WS_NOTIFICATION,
} from "const/ActionType";

import {
  apiLoadAdUsers,
  apiVerifyAuthAdUser,
  apiGetProductInfo,
  apiGetWatchdog,
} from "api";

export function loadAdUsers(path, data) {
  return {
    type: LOAD_AD_USERS,
    payload: {
      path: path,
      loader: apiLoadAdUsers,
      data: data,
    },
  };
}

export function verifyAuthAdUser(path, data) {
  return {
    type: VERIFY_AUTH_USER,
    payload: {
      path: path,
      loader: apiVerifyAuthAdUser,
      data: data,
    },
  };
}

export function getProductInfo() {
  return {
    type: GET_PRODUCT_INFO,
    payload: {
      path: "auths.productInfo",
      loader: apiGetProductInfo,
    },
  };
}

export function getWatchdog() {
  return {
    type: GET_WATCHDOG,
    payload: {
      path: "auths.isWatchdogAlive",
      loader: apiGetWatchdog,
    },
  };
}

export function wsNotification(payload) {
  return {
    type: WS_NOTIFICATION,
    payload,
  };
}

export function productInfo(
  MaxTerminals,
  LicenseId,
  Terminals,
  Purchased,
  Expiration,
  q8version
) {
  return (dispatch) => {
    dispatch({
      type: actiontypes.PRODUCT_INFO,
      MaxTerminals,
      LicenseId,
      Terminals,
      Purchased,
      Expiration,
      q8version,
    });
  };
}
