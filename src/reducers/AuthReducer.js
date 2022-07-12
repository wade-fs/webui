import {
  LOGIN,
  LOGOUT,
  WS_NOTIFICATION_SESSION_WILL_EXPIRE,
  CLEARE_EXPIRE_TIME,
} from "const/ActionType";
import { defaultObject, update } from "lib/Util";

export default (
  state = {
    productInfo: defaultObject,
    token: defaultObject,
    userList: defaultObject,
    userInfo: defaultObject,
    isWatchdogAlive: { data: "OK" },
  },
  action
) => {
  let { type, payload } = action;
  switch (type) {
    case WS_NOTIFICATION_SESSION_WILL_EXPIRE: {
      return update(state, { expires: { $set: payload.time } });
    }
    case CLEARE_EXPIRE_TIME: {
      return update(state, { expires: { $set: null } });
    }
    default:
      return state;
  }
};
