export const ABOUT = "ABOUT";
export const CONFIGURATION = "CONFIGURATION";

export const IP = "IP";
export const MAC_ADDRESS = "MAC Address";

// Settings
export const ALL = "ALL";
export const LICENSE_SETTING = "LICENSE SETTING";
export const LICENSE = "LICENSE";
export const UPLOAD_LICENSE = "UPLOAD LICENSE";
export const GENERATE_LICENSE_REQUEST = "GENERATE LICENSE REQUEST";

export const PACKAGE_SETTING = "PACKAGE SETTING";
export const FIRMWARE_PACKAGE = "FIRMWARE PACKAGE";
export const INSTALL_SYSTEM = "INSTALL SYSTEM";
export const INSTALL_DRIVERS = "INSTALL DRIVERS";
export const TERMCAP = "TERMCAP";

export const ADMIN_SETTING = "ADMIN";
export const ADMIN = "ADMIN";

export const SERVER_SETTING = "SERVER SETTING";
export const DHCP = "DHCP";
export const ACTIVE_DIRECTORY = "ACTIVE DIRECTORY";
export const SERVER_CERTIFICATE = "SERVER CERTIFICATE";
export const UPDATE_SERVER_AND_CERTIFICATE = "UPDATE SERVER CERTIFICATE";

export const DATABASE = "DATABASE";
export const Q8_DATABASE = "Q8 DATABASE";
export const UPLOAD_DATABASE = "UPLOAD_DATABASE";

export const CHAIN_LOADER = "CHAIN LOADER";

export const keyToClassNameMap = {
  Action: "event-type",
  Date: "date",
  Time: "time",
};

export const Firmware = "Firmware";
export const Package = "Package";
export const ChainLoader = "Chainloader";
export const TerminalCap = "TerminalCap";

export const MonitorSettings = "MONITORS";
export const ScreenSettings = "SCREEN";
export const ApplicationSettings = "APPLICATIONS";

export const F1 = "F1";
export const F2 = "F2";
export const F3 = "F3";
export const F4 = "F4";
export const F5 = "F5";
export const F6 = "F6";
export const F7 = "F7";
export const F8 = "F8";
export const F9 = "F9";
export const F10 = "F10";
export const F11 = "F11";
export const F12 = "F12";
export const End = "End";
export const Tab = "Tab";
export const Alt = "ALT";
export const A = "A";
export const B = "B";
export const C = "C";
export const D = "D";
export const E = "E";
export const F = "F";
export const G = "G";
export const H = "H";
export const I = "I";
export const J = "J";
export const K = "K";
export const L = "L";
export const M = "M";
export const N = "N";
export const O = "O";
export const P = "P";
export const Q = "Q";
export const R = "R";
export const S = "S";
export const T = "T";
export const U = "U";
export const V = "V";
export const W = "W";
export const X = "X";
export const Y = "Y";
export const Z = "Z";
export const Functions = [F1, F2, F3, F4, F5, F6, F7, F8, F9, F10, F11, F12];
export const Letters = [
  A,
  B,
  C,
  D,
  E,
  F,
  G,
  H,
  I,
  J,
  K,
  L,
  M,
  N,
  O,
  P,
  Q,
  R,
  S,
  T,
  U,
  V,
  W,
  X,
  Y,
  Z,
];
export const KeyNumbers = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
export const PageUp = "PageUp";
export const PageDown = "PageDown";
export const UpArrow = "UP";
export const DownArrow = "DOWN";
export const LeftArrow = "LEFT";
export const RightArrow = "RIGHT";
export const KeyOptions = [
  ...Functions,
  ...KeyNumbers,
  ...Letters,
  End,
  Tab,
  UpArrow,
  DownArrow,
  LeftArrow,
  RightArrow,
  PageUp,
  PageDown,
];

export const LeftButton = "LEFT";
export const RightButton = "RIGHT";
export const MiddleButton = "MIDDLE";
export const ScrollUp = "SCROLLUP";
export const ScrollDown = "SCROLLDOWN";
export const MouseNumbers = [
  "Button 1",
  "Button 2",
  "Button 3",
  "Button 4",
  "Button 5",
  "Button 6",
  "Button 7",
  "Button 8",
  "Button 9",
  "Button 10",
  "Button 11",
  "Button 12",
];
export const MouseOptions = [
  LeftButton,
  RightButton,
  MiddleButton,
  ScrollUp,
  ScrollDown,
  ...MouseNumbers,
];
export const MouseOptionToDisplayName = {};
MouseNumbers.forEach((key) => {
  MouseOptionToDisplayName[key] = key;
});
MouseOptionToDisplayName[LeftButton] = "Left Button";
MouseOptionToDisplayName[RightButton] = "Right Button";
MouseOptionToDisplayName[ScrollUp] = "Scroll Up";
MouseOptionToDisplayName[ScrollDown] = "ScrollDown";
MouseOptionToDisplayName[MiddleButton] = "Middle Button";

// API Key fields
// Hotkey mapping Part
export const TileHotkeyCode = "TileHotkeyCode";
export const SwapHotkeyCode = "SwapHotkeyCode";
export const FullScreenHotkeyCode = "FullScreenHotkeyCode";
export const GroupHotkeyNext = "GroupHotkeyNext";
export const GroupHotkeyPrev = "GroupHotkeyPrev";
export const MainMenuHotkeyCode = "MainMenuHotkeyCode";
export const KeyboardFields = [
  TileHotkeyCode,
  SwapHotkeyCode,
  FullScreenHotkeyCode,
  GroupHotkeyNext,
  GroupHotkeyPrev,
  MainMenuHotkeyCode,
];

export const TouchScreenMouse = "CalibrateTouchScreen";
export const TileMouse = "Tile";
export const SwapMouse = "Swap";
export const FullScreenMouse = "FullScreen";
export const GroupMouseNext = "DisplayNext";
export const GroupMousePrev = "DisplayPrev";
export const LogOnRelevanceUserMouse = "LogOnRelevanceUser";
export const MainMenuMouse = "MainMenu";
export const LeftMouseButtonMouse = "LeftMouseButton";
export const RightMouseButtonMouse = "RightMouseButton";
export const ScrollUpMouse = "ScrollUp";
export const ScrollDownMouse = "ScrollDown";
export const VituralKeyboardMouse = "Virtualkeyboard";
export const DisableButtonMouse = "DisableButton";
export const DisplayClient = "DisplayClient";
export const MouseFields = [
  TouchScreenMouse,
  TileMouse,
  SwapMouse,
  FullScreenMouse,
  GroupMouseNext,
  GroupMousePrev,
  // LogOnRelevanceUserMouse, // remove this one  since Relevance is not supported
  MainMenuMouse,
  LeftMouseButtonMouse,
  RightMouseButtonMouse,
  ScrollUpMouse,
  ScrollDownMouse,
  VituralKeyboardMouse,
  DisableButtonMouse,
  DisplayClient,
];
export const MouseFieldToTitle = {};
MouseFieldToTitle[TouchScreenMouse] = "Calibrate Touchscreen";
MouseFieldToTitle[TileMouse] = "Tile";
MouseFieldToTitle[SwapMouse] = "Swap";
MouseFieldToTitle[FullScreenMouse] = "Full Screen";
MouseFieldToTitle[GroupMouseNext] = "Go to next application";
MouseFieldToTitle[GroupMousePrev] = "Go to previous application";
MouseFieldToTitle[LogOnRelevanceUserMouse] = "Log on Relevance User";
MouseFieldToTitle[MainMenuMouse] = "Main Menu";
MouseFieldToTitle[LeftMouseButtonMouse] = "Left Mouse Button";
MouseFieldToTitle[RightMouseButtonMouse] = "Right Mouse Button";
MouseFieldToTitle[ScrollUpMouse] = "Scroll Up";
MouseFieldToTitle[ScrollDownMouse] = "Scroll Down";
MouseFieldToTitle[VituralKeyboardMouse] = "Virtual Keyboard";
MouseFieldToTitle[DisableButtonMouse] = "Disable Button";
MouseFieldToTitle[DisplayClient] = "Application";

export const MouseButtonMapping = "MouseButtonMapping";
export const None = "None";

export const TerminalObject = "terminal";
export const ServerObject = "server";
export const ApplicationObject = "application";

export const FirmwareSettingFields = ["AllowChainLoader", "DefaultPackageId"];
export const modelFixOptions = [
  "BoxPC-138-G01",
  "ARP-2200-G01",
  "BoxPC-203-G01",
  "G01_Series",
  "AP-3500-H01",
  "ARP-3600-E01",
  "MicroBox-7824-E01",
  "MicroBox-7824-E02",
  "E01_Series",
  "AP-3500-E01",
  "ARP-3600-H01",
  "MicroBox-7824-H01",
  "H01_Series",
];
export const terminalScreenOptions = ["A", "B", "C", "D", "E", "F", "G", "H"]
