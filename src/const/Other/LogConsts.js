export const DATE = "Date";
export const LEVEL = "Level";
export const CLASS = "Class";
export const CONTENT = "Content";

export const INFO = "Info";
export const FATAL = "Fatal";
export const ERROR = "Error";
export const WARNING = "Warning";
export const ALL = "All";

export const TEMERGENCY = "emergency";
export const TALERT = "alert";
export const TCRITICAL = "critical";
export const TERR = "err";
export const TWARNING = "warning";
export const TNOTICE = "notice";
export const TINFO = "info";
export const TDEBUG = "debug";

export const LOG_LEVEL_LIST = [LEVEL, INFO, WARNING, ERROR, FATAL, ALL];
export const LOG_LEVEL_LIST2 = [LEVEL, TEMERGENCY, TALERT, TCRITICAL, TERR, TWARNING, TNOTICE, TINFO, TDEBUG, ALL];

export const AD_SERVER = "ads";
export const AD_USER = "aduser";
export const APPLICATION = "app";
export const AUTH = "auth";				// add
export const DHCP = "dhcp";
export const FILE = "file";				// add
export const LICENSE = "license";
export const MODULE = "module";			// add
export const OPERATE = "operate";		// add
export const OTHERS = "others";			// add
export const RDS_SERVER = "rds";
export const SCHEDULE = "schedule";
export const TERMINAL = "term";
export const WS = "ws";					// add
export const TFTP = "tftp";
export const Q8C_FILEOP = "q8c-fileop";	// add
export const Q8C_TERM = "q8c-term";		// add

export const LOG_SERVER_CLASS_LIST = [
  CLASS,
  AD_SERVER,
  AD_USER,
  APPLICATION,
  AUTH,
  DHCP,
  FILE,
  LICENSE,
  MODULE,
  OPERATE,
  RDS_SERVER,
  SCHEDULE,
  TERMINAL,
  WS,
  TFTP,
  Q8C_FILEOP,
  Q8C_TERM,
  OTHERS,
  ALL,
];

export const TLSHW = "lshw";
export const TQ8CLIENT = "q8client";
export const TXORG = "xorg";
export const TDMESG = "dmesg";
export const TOTHERS = "others";

export const LOG_TERMINAL_CLASS_LIST = [
  CLASS,
  TLSHW,
  TQ8CLIENT,
  TXORG,
  TDMESG,
  TOTHERS,
  ALL,
];
