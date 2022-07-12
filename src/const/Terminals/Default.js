import {
  getMonitorVideoField,
  getMonitorXPositionField,
  getMonitorYPositionField,
  getMonitorScreenIdField,
  getScreenXPositionField,
  getScreenYPositionField,
  getScreenWidth,
  getScreenHeight,
  getScreenApplicationsField,
} from "const/Terminals/TerminalFieldNames";

export const DefaultTerminalInfo = {
  CopySettingFrom: "None",
  Name: "",
  Description: "",
  ParentId: 0,
};
export const DefaultMonitor = {
  NumberOfMonitors: 1,
  NumberOfScreens: 1,
  [getMonitorVideoField(1)]: "",
  [getMonitorXPositionField(1)]: 0,
  [getMonitorYPositionField(1)]: 0,
  [getMonitorScreenIdField(1)]: 1,
  [getScreenXPositionField(1)]: 0,
  [getScreenYPositionField(1)]: 0,
  [getScreenWidth(1)]: 0,
  [getScreenHeight(1)]: 0,
  [getScreenApplicationsField(1)]: "",
  Screen1_EnableTiling: true,
  Screen1_TileOnStartup: true,
  MainMonitor: 1,
};
export const DefaultTerminaProperties = {
  AllowShadow: true,
  AllowInteractiveShadow: true,
  ShadowMode: "YES",
  Replaceable: true,
  BootPriority: 0,
  BootPriorityMaxWait: 0,
  EnforceBootPriority: false,
  ForceAdminMode: false,
  RebootDependentTerminals: false,
  ShowDeviceStatusBar: false,
  TerminalEffects: false,
};
export const DefaultAuthUser = {
  UserType: "None",
  Username: "",
  Password: "",
  Domain: "",
};

export const DefaultOtherApplyAll = {
  ModuleApplyAll: false,
  ScheduleApplyAll: false,
};

export const DefaultSchedule = {
  Id: 0,
  Action: "Enable",
  Type: "Every Day",
  Days: "",
  StartDate: "",
  StartTime: "",
  FrequencyInMinute: 0,
};
