import { applyMiddleware, createStore } from "redux";
import reducer from "./reducers";
import thunk from "redux-thunk";
import promise from "redux-promise-middleware";

import ApplicationDataLoader from "./middleware/ApplicationDataLoader";
import DataLoader from "./middleware/DataLoader";
import ScheduleDataLoader from "./middleware/ScheduleDataLoader";
import ServerDataLoader from "./middleware/ServerDataLoader";
import TerminalDataLoader from "./middleware/TerminalDataLoader";
import SettingDataLoader from "./middleware/SettingDataLoader";
import WsNotificationDispatcher from "./middleware/WsNotificationDispatcher";

const middlewares = [
  promise,
  thunk,
  WsNotificationDispatcher,
  ApplicationDataLoader,
  DataLoader,
  ScheduleDataLoader,
  ServerDataLoader,
  SettingDataLoader,
  TerminalDataLoader,
];

//if (process.env.NODE_ENV === "production") {
//  const { createLogger } = require(`redux-logger`);
//  const logger = createLogger({
//    collapsed: true,
//    duration: true,
//    diff: true,
//  });
//  middlewares.push(logger);
//}
const middleware = applyMiddleware(...middlewares);
export default createStore(reducer, middleware);
