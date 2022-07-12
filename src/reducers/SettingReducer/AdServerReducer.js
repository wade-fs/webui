import { defaultObject, defaultArray, update } from "lib/Util";

export default (
  state = {
    user: {},
  },
  action
) => {
  let { type, payload } = action;
  switch (type) {
    default:
      return state;
  }
};
