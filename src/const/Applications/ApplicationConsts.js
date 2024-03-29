import { CONFIGURATION } from "const/Consts";

export const RDS_APP_INFO = "APP INFO";
export const APPLICATION_INFO = "APPLICATION INFO";
export const APPLICATION_GROUP_INFO = "APP GROUP INFO";
export const VNC_INFO = "VNC INFO";
export const VNC_GROUP_INFO = "VNC GROUP INFO";
export const RDS_APP_GROUP_INFO = "RDS APP GROUP INFO";
export const APPLICATION_PROPERTIES = "PROPERTIES";
export const VNC_PROPERTIES = "PROPERTIES";
export const CONNECTION_PROPERTIES = "CONNECTION";
export const SCALING_RESOLUTION = "SCALING RESOLUTION";
export const LOAD_BALANCED = "LOAD BALANCED";
export const SERVER = "SERVER";

export const RDS_SERVER = "RDS SERVER";
export const CONNECTION_OPTIONS = "CONNECTION";
export const SESSION_OPTIONS = "SCAILING RESOLUTION";
export const LOAD_BALANCE = "LOAD BALANCE";
export const TERMINAL = "TERMINAL";

export const EditorGroupTabs = [CONFIGURATION];
export const EditorTabs = [CONFIGURATION];

export const AppGroupTabs = [APPLICATION_GROUP_INFO];
export const AppTabs = [
  APPLICATION_INFO,
  APPLICATION_PROPERTIES,
  // CONNECTION_OPTIONS,
  // SESSION_OPTIONS,
  // LOAD_BALANCE,
  RDS_SERVER,
];

export const APPLICATION_GROUP_NAME = "APPLICATION GROUP NAME";
export const APPLICATION_NAME = "APPLICATION NAME";
export const VNC_GROUP_NAME = "VNC GROUP NAME";
export const VNC_NAME = "VNC NAME";

export const VncGroupTabs = [VNC_GROUP_INFO];
export const VncTabs = [
  VNC_INFO,
  VNC_PROPERTIES,
];
