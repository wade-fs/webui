import { SysOps } from "const/ActionType";
import { update } from "lib/Util";

export default (state = { message: "" }, action) => {
  let { type, payload } = action;
  switch (type) {
    case SysOps: {
      return update(state, {
        type: { $set: type },
        message: { $set: payload.msg },
      });
    }

    default:
      return state;
  }
};
