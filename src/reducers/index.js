import { combineReducers } from "redux";

import { pipeReducers } from "lib/Util";

import applications from "./ApplicationReducer";
import auths from "./AuthReducer";
import terminals from "./TerminalReducer";
import servers from "./ServerReducer";
import settings from "./SettingReducer";
import dataLoader from "./DataLoaderReducer";
import infobar from "./InfobarReducer";
import wsMessage from "./MessageReducer";

export default pipeReducers(
  combineReducers({
    wsMessage,
    applications,
    auths,
    terminals,
    servers,
    settings,
    infobar,

  }),
  dataLoader
);
