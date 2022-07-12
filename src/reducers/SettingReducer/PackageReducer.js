import { defaultObject, defaultArray, update } from "lib/Util";

export default (
  state = {
    packageList: {},
    backup: {},
    firmwareSettings: {},
  },
  action
) => {
  let { type, payload } = action;
  switch (type) {
    default:
      return state;
  }
};
