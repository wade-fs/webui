import { LOAD_REQUEST, LOAD_SUCCESS, LOAD_FAILURE } from "const/ActionType";
import { LOADING, LOADED, FAILURE } from "const/DataLoaderState.js";
import {
  defaultObject,
  defaultArray,
  getObjectProperty,
  update,
} from "lib/Util";

/*
{
   state: null|loading|loaded|error,
   time: null,
   error: string,
   raw:[]
}
*/
export default (state, action) => {
  let { type, payload } = action;
  const matches = /(LOAD_REQUEST|LOAD_SUCCESS|LOAD_FAILURE)/.exec(type);
  if (!matches) return state;

  let { path, data } = payload;
  let target = getObjectProperty(state, path);

  if (target === defaultObject || target == null) target = {};
  switch (type) {
    case LOAD_REQUEST: {
      target = update(target, { state: { $set: LOADING } });
      break;
    }
    case LOAD_SUCCESS: {
      target = update(target, {
        state: { $set: LOADED },
        time: { $set: new Date().getTime() },
        data: { $set: data },
      });
      break;
    }
    case LOAD_FAILURE: {
      target = update(target, {
        state: { $set: FAILURE },
        time: { $set: new Date().getTime() },
        data: { $set: data },
      });
      break;
    }
	default:
      return;
  }
  return update(state, { $set: target }, path);
};
