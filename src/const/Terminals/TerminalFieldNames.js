import { stringValid } from "../../lib/Util";
import {
  Action,
  Days,
  StartTime,
  EndTime,
  FrequencyInMinute,
} from "../../const/Other/ScheduleConsts";

export const Id = "Id";
export const AppId = "AppId";
export const Status = "Status";
export const Type = "Type";
export const IsGroup = "IsGroup";
export const Disabled = "Disabled";

// Apply all fields
export const ApplyAllProperties = "ApplyAllProperties";
export const ApplicationApplyAll = "ApplicationApplyAll";
export const UserAccessApplyAll = "UserAccessApplyAll";
export const ControlApplyAll = "ControlApplyAll";
export const ScheduleApplyAll = "ScheduleApplyAll";
export const ModuleApplyAll = "ModuleApplyAll";
export const EnabledSchedule = "EnabledSchedule";

// Auth user
export const Username = "Username";
export const Password = "Password";
export const VerifyPassword = "VerifyPassword";
export const Domain = "Domain";
export const AuthUserFields = [Username, Password, Domain, UserAccessApplyAll];
// Ui Assistant Fields
export const UserType = "UserType";

// Terminal info fields
export const Description = "Description";
export const Default = "Default";
export const Name = "Name";
export const ParentName = "ParentName";
export const ParentId = "ParentId";
export const TerminalInfoFields = [Name, Description, ParentId, Default];
export const TerminalInfoWizardFields = [Name, Description, ParentId];
// UI Assistant Field
export const CopySettingFrom = "CopySettingFrom"; // Default, Terminal, None
export const CopyTerminalId = "CopyTerminalId";

// Hardware fields
export const Manufacturer = "Manufacturer";
export const Model = "Model";
export const FirmwarePackage = "FirmwarePackage";
export const MAC = "MAC";
export const SecondaryMAC = "SecondaryMAC";
export const HardwareFields = [
  Manufacturer,
  Model,
  FirmwarePackage,
  MAC,
  SecondaryMAC,
];

// Terminal options
export const AllowShadow = "AllowShadow";
export const AllowInteractiveShadow = "AllowInteractiveShadow";
export const BootPriority = "BootPriority";
export const BootPriorityMaxWait = "BootPriorityMaxWait";
export const EnforceBootPriority = "EnforceBootPriority";
export const ForceAdminMode = "ForceAdminMode";
export const RebootDependentTerminals = "RebootDependentTerminals";
export const Replaceable = "Replaceable";
export const ShadowMode = "ShadowMode";
export const ShowDeviceStatusBar = "ShowDeviceStatusBar";
export const TerminalEffects = "TerminalEffects";
export const Schedules = "Schedules";
export const SetSchedule = "SetSchedule";

export const TerminalOptionsFields = [
  AllowShadow,
  AllowInteractiveShadow,
  BootPriority,
  BootPriorityMaxWait,
  EnforceBootPriority,
  ForceAdminMode,
  RebootDependentTerminals,
  Replaceable,
  ShadowMode,
  ShowDeviceStatusBar,
  TerminalEffects,
  ApplyAllProperties,
];

// Schedule
export const ScheduleFields = [
  Type,
  Days,
  StartTime,
  EndTime,
  Action,
  FrequencyInMinute,
];

// Monitors
export const NumberOfMonitors = "NumberOfMonitors";
export const NumberOfScreens = "NumberOfScreens";
export const UseMultistation = "UseMultistation";
export const VideoPortMapping = "VideoPortMapping";
export const MainMonitor = "MainMonitor";

export const AllowGroupMovement = "AllowGroupMovement";
export const AutoHideSelector = "AutoHideSelector";
export const EnableTiling = "EnableTiling";
export const OverrideMouseButtonMapping = "OverrideMouseButtonMapping";
export const SelectorSize = "SelectorSize";
export const ShowSelector = "ShowSelector";
export const TileInactiveTime = "TileInactiveTime";
export const TileInteractive = "TileInteractive";
export const TileOnGroupSelectorActivation = "TileOnGroupSelectorActivation";
export const TileOnStartup = "TileOnStartup";
export const TileShowGrid = "TileShowGrid";
export const TileWithMainMenu = "TileWithMainMenu";
export const ScreenSettingFields = [
  AllowGroupMovement,
  AutoHideSelector,
  EnableTiling,
  OverrideMouseButtonMapping,
  SelectorSize,
  ShowSelector,
  TileInactiveTime,
  TileInteractive,
  TileOnGroupSelectorActivation,
  TileOnStartup,
  TileShowGrid,
  TileWithMainMenu,
];

// Modules
export const InstalledModules = "InstalledModules";
export const ModuleId = "Id";
export const ModuleType = "Type";
export const ModuleName = "Name";
// Module server side format key
export const Value = "Value";
export const Key = "Key";
// UI Assistant Fields
export const Setting = "Setting";
export const PossibleModuleSetting = "PossibleModuleSetting";
export const Modules = [InstalledModules];

// Control
export const FullScreenHotkeyCode = "FullScreenHotkeyCode";
export const FullScreenHotkeyEnabled = "FullScreenHotkeyEnabled";
export const FullScreenHotkeyState = "FullScreenHotkeyState";
export const FullScreenHotkeyTitle = "Full screen";

export const GroupHotkeysEnabled = "GroupHotkeysEnabled";
export const GroupHotkeyNext = "GroupHotkeyNext";
export const GroupHotkeyNextTitle = "Go to next application";
export const GroupHotkeyPrev = "GroupHotkeyPrev";
export const GroupHotkeyState = "GroupHotkeyState";
export const GroupHotkeyPrevTitle = "Go to previous application";

export const MainMenuHotkeyCode = "MainMenuHotkeyCode";
export const MainMenuHotkeyEnabled = "MainMenuHotkeyEnabled";
export const MainMenuHotkeyState = "MainMenuHotkeyState";
export const MainMenuHotkeyTitle = "Main menu";

export const TileHotkeyCode = "TileHotkeyCode";
export const TileHotkeyEnabled = "TileHotkeyEnabled";
export const TileHotkeyState = "TileHotkeyState";
export const TileHotkeyTitle = "Tile";

export const SwapHotkeyCode = "SwapHotkeyCode";
export const SwapHotkeyEnabled = "SwapHotkeyEnabled";
export const SwapHotkeyState = "SwapHotkeyState";
export const SwapHotkeyTitle = "Swap";

export const IfHotkeyCode = "IFHotkeyCode";
export const IfHotkeyEnabled = "IFHotkeyEnabled";
export const IfHotkeyState = "IFHotkeyState";
export const IfHotkeyTitle = "If";

export const MouseButtonMapping = "MouseButtonMapping";
export const EnableHotkey = "EnableHotkey";

export const ControlFields = [
  FullScreenHotkeyCode,
  FullScreenHotkeyEnabled,
  FullScreenHotkeyState,

  GroupHotkeysEnabled,
  GroupHotkeyNext,
  GroupHotkeyPrev,
  GroupHotkeyState,

  MainMenuHotkeyCode,
  MainMenuHotkeyEnabled,
  MainMenuHotkeyState,

  TileHotkeyCode,
  TileHotkeyEnabled,
  TileHotkeyState,

  SwapHotkeyCode,
  SwapHotkeyEnabled,
  SwapHotkeyState,

  IfHotkeyCode,
  IfHotkeyEnabled,
  IfHotkeyState,

  MouseButtonMapping,
  EnableHotkey,

  ControlApplyAll,
];

export const Ctrl = "CTRL";
export const Alt = "ALT";
export const HotkeyStateOptions = [Ctrl, Alt];

export const KeyboardTitles = [
  TileHotkeyTitle,
  SwapHotkeyTitle,
  IfHotkeyTitle,
  FullScreenHotkeyTitle,
  GroupHotkeyNextTitle,
  GroupHotkeyPrevTitle,
  MainMenuHotkeyTitle,
];

export const titleToHotkeyState = {
  [TileHotkeyTitle]: TileHotkeyState,
  [SwapHotkeyTitle]: SwapHotkeyState,
  [IfHotkeyTitle]: IfHotkeyState,
  [FullScreenHotkeyTitle]: FullScreenHotkeyState,
  [GroupHotkeyNextTitle]: GroupHotkeyState,
  [GroupHotkeyPrevTitle]: GroupHotkeyState,
  [MainMenuHotkeyTitle]: MainMenuHotkeyState,
};
export const titleToHotkeyCode = {
  [TileHotkeyTitle]: TileHotkeyCode,
  [SwapHotkeyTitle]: SwapHotkeyCode,
  [IfHotkeyTitle]: IfHotkeyCode,
  [FullScreenHotkeyTitle]: FullScreenHotkeyCode,
  [GroupHotkeyNextTitle]: GroupHotkeyNext,
  [GroupHotkeyPrevTitle]: GroupHotkeyPrev,
  [MainMenuHotkeyTitle]: MainMenuHotkeyCode,
};

// Configuration
export const ConfigurationFields = [
  ...TerminalInfoFields,
  ...HardwareFields,
  ...TerminalOptionsFields,
  ...AuthUserFields,
  ...ControlFields,
];

export function extractConfiguration(terminal) {
  return {
    ...extractFields(terminal, ConfigurationFields),
    ...extractMonitors(terminal),
  };
}

// About Info Fields
export const IpAddress = "IpAddress";
export const FirmwareVersion = "FirmwareVersion";
export const HardwareBootRomVersion = "HardwareBootRomVersion";
export const BootLoaderVersion = "BootLoaderVersion";
export const UpTime = "UpTime";

export const CpuVendor = "CpuVendor";
export const CpuName = "CpuName";
export const CpuClockSpeed = "CpuClockSpeed";
export const CpuCacheSize = "CpuCacheSize";
export const CpuMips = "CpuMips";
export const CpuLoadPercentage = "CpuLoadPercentage";

export const TotalMemory = "TotalMemory";
export const FreeMemory = "FreeMemory";

export const IpAddressMethod = "IpAddressMethod";
export const NetworkRouter = "NetworkRouter";
export const BootQ8Server = "BootQ8Server";
export const SubnetMask = "SubnetMask";
export const PrimaryQ8Server = "PrimaryQ8Server";
export const SecondaryQ8Server = "SecondaryQ8Server";

export const VideoPCIID = "VideoPCIID";
export const NetworkPCIID = "NetworkPCIID";
export const NeedToRestart = "NeedToRestart";

export const TerminalAboutFields = [
  Id,
  Manufacturer,
  Model,

  IpAddress,
  FirmwareVersion,
  FirmwarePackage,
  HardwareBootRomVersion,
  BootLoaderVersion,
  UpTime,

  CpuVendor,
  CpuName,
  CpuClockSpeed,
  CpuCacheSize,
  CpuMips,
  CpuLoadPercentage,

  TotalMemory,
  FreeMemory,

  IpAddressMethod,
  NetworkRouter,
  BootQ8Server,
  SubnetMask,
  PrimaryQ8Server,
  SecondaryQ8Server,

  VideoPCIID,
  NetworkPCIID,
];

export const defaultMonitorData = {
  [NumberOfMonitors]: 1,
  [NumberOfScreens]: 1,
  [getMonitorYPositionField(1)]: 0,
  [getMonitorYPositionField(1)]: 0,
  [getScreenXPositionField(1)]: 0,
  [getScreenYPositionField(1)]: 0,
};

export const UiAssistantFields = [
  CopySettingFrom,
  CopyTerminalId,
  EnableHotkey,
];

export function isAuthUserCompleted(authUser, isGroup = false) {
  if (isGroup) {
    return true;
  } else {
    if (authUser[UserType] == "Windows") {
      // check undefined VerifyPassword data
      // if (authUser[VerifyPassword] === undefined) {
      //   authUser[VerifyPassword] = "";
      // }
      return stringValid(authUser[Username]) && stringValid(authUser[Password]);
    }
    if (authUser[UserType] == "None") {
      return (
        !stringValid(authUser[Domain]) &&
        !stringValid(authUser[Password]) &&
        !stringValid(authUser[Username])
      );
    }
  }
}

export function isTerminalInfoCompleted(terminalInfo) {
  if (terminalInfo.CopySettingFrom === "Terminal") {
    if (terminalInfo.CopyTerminalId === undefined) {
      return false;
    } else {
      return stringValid(terminalInfo[Name]);
    }
  }
  return stringValid(terminalInfo[Name]);
}

export function isHardwareCompleted(hardware, isDefault) {
  if (isDefault) {
    return (
      stringValid(hardware[Model]) &&
      stringValid(hardware[Manufacturer]) &&
      stringValid(hardware[FirmwarePackage])
    );
  }
  return (
    stringValid(hardware[Model]) &&
    stringValid(hardware[Manufacturer]) &&
    stringValid(hardware[FirmwarePackage])
  );
}

export function isTerminalOptionsCompleted(terminalInfo) {
  let res = true;
  if (terminalInfo[EnforceBootPriority]) {
    res =
      res &&
      stringValid(terminalInfo[BootPriority] + "") &&
      stringValid(BootPriorityMaxWait + "");
  }
  return res;
}

export function isMonitorCompleted(monitors) {
  let numberOfMonitors = parseInt(monitors[NumberOfMonitors]);
  let numberOfScreens = parseInt(monitors[NumberOfScreens]);
  let res = true;
  let screenRes = false;

  for (var i = 0; i < numberOfMonitors; i++) {
    res =
      res && hasFullMonitorVideoConfig(monitors[getMonitorVideoField(i + 1)]);
  }
  for (var j = 0; j < numberOfScreens; j++) {
    if (monitors[getScreenApplicationsField(j + 1)] !== "") {
      screenRes = true;
      break;
    }
  }
  res = res && screenRes;
  return res;
}

export function isApplicationCompleted(currentApplicationIds) {
  let res = true;
  if (currentApplicationIds === undefined) {
    res = false;
  }
  return res;
}

export function extractAuthUser(terminal) {
  if (terminal == null) return {};
  let { Username, Password, Domain, UserAccessApplyAll, UserType } = terminal;
  return {
    Username,
    Password,
    Domain,
    UserAccessApplyAll,
    UserType,
  };
}

export function extractTerminalInfo(terminal) {
  return extractFields(terminal, TerminalInfoFields);
}

export function extractTerminalInfoWizard(terminal) {
  return extractFields(terminal, TerminalInfoWizardFields);
}

export function extractHardware(terminal) {
  return extractFields(terminal, HardwareFields);
}

export function extractTerminalOptions(terminal) {
  return extractFields(terminal, TerminalOptionsFields);
}

export function extractControls(terminal) {
  return extractFields(terminal, ControlFields);
}

export function extractSchedule(terminal) {
  return extractFields(terminal, [
    Schedules,
    ScheduleApplyAll,
    EnabledSchedule,
  ]);
}

export function extractModule(terminal) {
  return extractFields(terminal, [InstalledModules, ModuleApplyAll]);
}

export function extractOtherApplyAll(terminal) {
  return extractFields(terminal, [ScheduleApplyAll, ModuleApplyAll]);
}

export function hasFullMonitorVideoConfig(video) {
  if (video == null || video === "") return false;
  let config;
  if (video.length > 1) {
    config = video.split(",");
    if (config.length < 3) return false;
    for (var i = 0; i < config.length; i++) {
      if (!stringValid(config[i])) return false;
    }
  } else {
    return false;
  }
  return true;
}

export function extractMonitors(terminal) {
  if (terminal != null) {
    let fields = getAllMonitorFields(
      terminal[NumberOfScreens],
      terminal[NumberOfMonitors]
    );
    return extractFields(terminal, fields);
  }
  return {};
}

export function getAllMonitorFields(numberOfScreens, numberOfMonitors) {
  let fields = [
    NumberOfScreens,
    NumberOfMonitors,
    MainMonitor,
    UseMultistation,
    VideoPortMapping,
  ];
  for (var i = 1; i <= numberOfMonitors; i++) {
    fields.push(getMonitorXPositionField(i));
    fields.push(getMonitorYPositionField(i));
    fields.push(getMonitorVideoField(i));
    fields.push(getMonitorScreenIdField(i));
  }
  for (var i = 1; i <= numberOfScreens; i++) {
    fields.push(getScreenXPositionField(i));
    fields.push(getScreenYPositionField(i));
    fields.push(getScreenWidth(i));
    fields.push(getScreenHeight(i));
    fields.push(getScreenApplicationsField(i));
    fields.push(getScreenMainMonitorField(i));
    ScreenSettingFields.forEach((field) => {
      fields.push(getScreenSettingField(i, field));
    });
  }
  return fields;
}

export function extractApplications(terminal) {
  if (terminal == null) {
    return [];
  }
  let fields = [
    ...getApplicationsFields(terminal[NumberOfScreens]),
    ApplicationApplyAll,
    NumberOfScreens,
  ];
  return extractFields(terminal, fields);
}

export function extractTerminalAbout(terminal) {
  return extractFields(terminal, TerminalAboutFields);
}

export function extractFields(terminal, fields) {
  if (terminal == null) return {};
  let extract = {};
  for (var field of fields) {
    if (terminal.hasOwnProperty(field)) {
      extract[field] = terminal[field];
    }
  }
  return extract;
}

export function getApplicationsFields(numberOfScreens) {
  let fields = [];
  for (var i = 1; i <= numberOfScreens; i++) {
    fields.push(getScreenApplicationsField(i));
  }
  return fields;
}

export function getMonitorXPositionField(index) {
  return `Monitor${index}_XPosition`;
}

export function getMonitorYPositionField(index) {
  return `Monitor${index}_YPosition`;
}

export function getScreenXPositionField(index) {
  return `Screen${index}_XPosition`;
}

export function getScreenYPositionField(index) {
  return `Screen${index}_YPosition`;
}

export function getScreenWidth(index) {
  return `Screen${index}_Width`;
}

export function getScreenHeight(index) {
  return `Screen${index}_Height`;
}

export function getMonitorVideoField(index) {
  return `Monitor${index}_Video`;
}

export function getMonitorScreenIdField(index) {
  return `Monitor${index}_ScreenId`;
}

export function getMonitorField(index) {
  return `Monitor${index}`;
}

export function getScreenField(index) {
  return `Screen${index}`;
}

export function getScreenApplicationsField(index) {
  return `Screen${index}_Applications`;
}

export function getScreenMainMonitorField(index) {
  return `Screen${index}_MainMonitor`;
}

export function getScreenSettingField(index, settingField) {
  return `Screen${index}_${settingField}`;
}
