import { combineReducers } from "redux";

import { pipeReducers } from "lib/Util";

import packages from "./PackageReducer";
import license from "./LicenseReducer";
import adServer from "./AdServerReducer";

export default pipeReducers(
  combineReducers({
    packages,
    license,
    adServer,
  })
);
