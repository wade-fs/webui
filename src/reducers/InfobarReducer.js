import { SHOW_INFO_BAR, HIDE_INFO_BAR } from "const/ActionType";
import { update } from "lib/Util";

export default (
  state = {
    infoBarTitle: null,
    infoType: "",
    showInfoBar: false,
  },
  action
) => {
  let { type, payload } = action;
  switch (type) {
    case SHOW_INFO_BAR: {
      return update(state, {
        showInfoBar: { $set: true },
        infoType: { $set: payload.infoType },
        infoBarTitle: { $set: payload.title },
      });
    }
    case HIDE_INFO_BAR: {
      return update(state, { showInfoBar: { $set: false } });
    }
    default:
      return state;
  }
};
