export const Action = "Action";
export const Days = "Days";
export const Type = "Type";
export const EndTime = "EndTime";
export const StartTime = "StartTime";
export const FrequencyInMinute = "FrequencyInMinute";

export const Hour = "Hour";
export const Minute = "Minute";
export const StartDate = "StartDate";
export const EndDate = "EndDate";

export const NeverRepeat = "Never Repeat";
export const TimeInterval = "Time Interval";
export const Everyday = "Every Day";
export const EveryWeek = "Every Week";
export const EveryMonth = "Every Month";
export const EveryYear = "Every Year";
export const OnceOnly = "Once";

export const Enable = "Enable";
export const Disable = "Disable";
export const Reboot = "Reboot";
export const PowerOn = "Power on";
export const PowerOff = "Power off";
export const CalibrateTouchScreen = "Calibrate Touch Screen";
export const Restart = "Restart";

export const MON = "MON";
export const TUE = "TUE";
export const WED = "WED";
export const THU = "THU";
export const FRI = "FRI";
export const SAT = "SAT";
export const SUN = "SUN";
export const WEEK = [SUN, MON, TUE, WED, THU, FRI, SAT];
export const MONTH = "MONTH";
export const YEAR = "YEAR";
export const MONTHS = [
  "",
  "JAN",
  "FEB",
  "MAR",
  "APR",
  "MAY",
  "JUN",
  "JUL",
  "AUG",
  "SEP",
  "OCT",
  "NOV",
  "DEC",
];

export const Months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export const terminalActions = [
  Enable,
  Disable,
  Reboot,
  PowerOn,
  PowerOff,
  Restart,
  CalibrateTouchScreen,
];
export const serverActions = [Enable, Disable, Reboot];
export const allRepeatModels = [
  TimeInterval,
  Everyday,
  EveryWeek,
  EveryMonth,
  EveryYear,
  OnceOnly,
];
export const enableDisableRepeatModels = [
  Everyday,
  EveryWeek,
  EveryMonth,
  EveryYear,
  OnceOnly,
];
