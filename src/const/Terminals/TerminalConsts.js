import { ABOUT, CONFIGURATION } from "const/Consts";
// Wizard Sidebar Tab
export const TERMINAL = "TERMINAL";
export const TERMINAL_INFO = "TERMINAL INFO";
export const TERMINAL_GROUP_INFO = "TERMINAL GROUP INFO";
export const TERMINAL_SCREEN = "TERMINAL SCREEN";
export const HARDWARE = "HARDWARE";
export const TERMINAL_PROPERTIES = "PROPERTIES";
export const PROPERTIES = "PROPERTIES";
export const DISPLAY = "DISPLAY";
export const APPLICATION = "APPLICATION";
export const USER_ACCESS = "USER ACCESS";
export const TOUCH = "TOUCH";
export const MODULE = "MODULE";
export const CONTROL = "CONTROL";

export const TerminalGroupTabs = [
  TERMINAL_GROUP_INFO,
  TERMINAL_PROPERTIES,
  DISPLAY,
  APPLICATION,
  USER_ACCESS,
  TOUCH,
  MODULE,
  // CONTROL,
];
export const TerminalTabs = [
  TERMINAL_INFO,
  HARDWARE,
  TERMINAL_PROPERTIES,
  DISPLAY,
  APPLICATION,
  USER_ACCESS,
  TOUCH,
  MODULE,
  // CONTROL,
];

// Editor Topbar Tab
export const SHADOW = "SHADOW";
export const SCHEDULE = "SCHEDULE";
export const LOG = "LOG";

export const EditorGroupTabs = [ABOUT, CONFIGURATION, MODULE, SCHEDULE];
export const EditorTabs = [ABOUT, CONFIGURATION, MODULE, SHADOW, SCHEDULE, LOG];

export const EditorConfigTabs = [
  TERMINAL_INFO,
  HARDWARE,
  PROPERTIES,
  DISPLAY,
  USER_ACCESS,
  TOUCH,
  // CONTROL,
];
export const EditorGroupConfigTabs = [
  TERMINAL_INFO,
  PROPERTIES,
  DISPLAY,
  USER_ACCESS,
  TOUCH,
  // CONTROL,
];

// Label
export const NameLabel = "Terminal Name";
export const NameInfo =
  "Maximum 20 characters, can only include letters, numbers, hyphens(-) and underscore(_)";
export const GroupNameLabel = "Terminal Group Name";

export const DescriptionLabel = "Terminal Description";
export const GroupDescriptionLabel = "Terminal Group Description";
export const DescriptionInfo = "Maximum 200 characters";

export const BasicInfoTitle = "BASIC INFO";
export const UseSettingsFromTitle = "USE SETTING FORM";

export const AskFirst = "Ask first";
export const WarnFirst = "Warn first";
export const ShadowOptions = ["YES", AskFirst, WarnFirst, "NO"];
export const VendorOptions = ["eGalax"];

export const NameMaxCount = 20;
export const DescriptionMaxCount = 200;
