import { defaultObject, defaultArray, update } from "lib/Util";
import { CLEAR_INSTALLED_ID } from "const/ActionType";

export default (
  state = {
    licenseList: {},
    installedId: {},
  },
  action
) => {
  let { type, payload } = action;
  switch (type) {
    case CLEAR_INSTALLED_ID: {
      return update(state, { installedId: { $set: defaultObject } });
    }
    default:
      return state;
  }
};
