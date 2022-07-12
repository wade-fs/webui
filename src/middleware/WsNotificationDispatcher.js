import {
  WS_NOTIFICATION,
  WS_NOTIFICATION_TERMINAL,
  WS_NOTIFICATION_TERMINAL_LIST,
  WS_NOTIFICATION_TERMINAL_STATUS,
  WS_NOTIFICATION_RDS_SERVER_STATUS,
  WS_NOTIFICATION_APPLICATION_STATUS,
  WS_NOTIFICATION_PENDING_TERMINALS,
  SysOps,
} from "const/ActionType";

import {
  TERMINAL,
  TERMINAL_LIST,
  TERMINAL_STATUS,
  RDS_SERVER_STATUS,
  APPLICATION_STATUS,
  PENDING_TERMINALS,
} from "const/WsNotificationTypes";

export default (store) => (next) => (action) => {
  let state = store.getState();
  let { type, payload } = action;
  let rst = next(action);

  switch (type) {
    case WS_NOTIFICATION: {
      let { type: wsType, payload: wsPayload } = payload;
      switch (wsType) {
        case TERMINAL_STATUS: {
          store.dispatch({
            type: WS_NOTIFICATION_TERMINAL_STATUS,
            payload: wsPayload,
          });
          break;
        }
        case RDS_SERVER_STATUS: {
          store.dispatch({
            type: WS_NOTIFICATION_RDS_SERVER_STATUS,
            payload: wsPayload,
          });
          break;
        }
        case APPLICATION_STATUS: {
          store.dispatch({
            type: WS_NOTIFICATION_APPLICATION_STATUS,
            payload: wsPayload,
          });
          break;
        }
        case PENDING_TERMINALS: {
          store.dispatch({
            type: WS_NOTIFICATION_PENDING_TERMINALS,
            payload: wsPayload,
          });
          break;
        }
        case SysOps:
          store.dispatch({
            type: SysOps,
            payload: wsPayload,
          });
          break;
        default:
          break;
      }
    }
    default:
      break;
  }

  return rst;
};
