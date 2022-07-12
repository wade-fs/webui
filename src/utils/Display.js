import {
  DefaultResolution,
  DefaultResolutionOption,
  DefaultRefreshRateOption,
  DefaultColorDepthOption,
  ScreenFields,
} from "../const/Terminals/Display";
import {
  MainMonitor,
  NumberOfMonitors,
  NumberOfScreens,
  VideoPortMapping,
} from "../const/Terminals/TerminalFieldNames";

async function deleteRedundantKey(data) {
  for await (const _ScreenIdx of [...Array(8).keys()]) {
    if (_ScreenIdx + 1 > data[NumberOfScreens]) {
      let screenKey = Object.keys(data).filter(
        (key) => key.indexOf(`Screen${_ScreenIdx + 1}_`) !== -1
      );
      for await (const _key of screenKey) {
        delete data[_key];
      }
    }
  }
  for await (const _MonitorIdx of [...Array(8).keys()]) {
    if (_MonitorIdx + 1 > data[NumberOfMonitors]) {
      let monitorKey = Object.keys(data).filter(
        (key) => key.indexOf(`Monitor${_MonitorIdx + 1}_`) !== -1
      );
      for await (const _key of monitorKey) {
        delete data[_key];
      }
    }
  }

  return data;
}

export function generateDefaultDisplay(hardwareInfo, data) {
  // set default add monitor resolution
  const resolutionIdx = hardwareInfo.data.findIndex(
    (item) => item.Res === DefaultResolution
  );
  const resolution =
    hardwareInfo.data[resolutionIdx]?.Res ?? hardwareInfo.data[0].Res;
  const [weight, height] = resolution.split("x");
  const hz = hardwareInfo.data[0].HzColors[0].Hz;
  const colors = hardwareInfo.data[0].HzColors[0].Colors[0];
  data["Monitor1_Video"] = `${resolution},${colors},${hz}`;
  data["Screen1_Width"] = parseInt(weight);
  data["Screen1_Height"] = parseInt(height);
  return data;
}

export function generateScreenOfAppIds(data) {
  let screenOfAppIds = "";
  for (let i = 0; i < data[NumberOfScreens]; i++) {
    if (i === data[NumberOfScreens] - 1) {
      screenOfAppIds += `${data[`Screen${i + 1}_Applications`]}`;
    } else {
      screenOfAppIds += `${data[`Screen${i + 1}_Applications`]};`;
    }
  }

  return screenOfAppIds;
}

// get data or key
export function getResolutionOptions(hardwareInfo) {
  let resolutionOptions = [];
  if (hardwareInfo === "null" || hardwareInfo === undefined) {
    resolutionOptions = DefaultResolutionOption;
  }
  if (
    hardwareInfo !== "null" &&
    hardwareInfo !== undefined &&
    hardwareInfo.length !== 0
  ) {
    hardwareInfo.forEach((item) => {
      resolutionOptions.push(item.Res);
    });
  }
  return [...resolutionOptions];
}

export function getColorDepthOptions(hardwareInfo, resIndex, hzIndex) {
  let colorDepthOptions = [];

  if (hardwareInfo === "null" || hardwareInfo === undefined) {
    colorDepthOptions = DefaultColorDepthOption;
  }
  if (
    hardwareInfo !== "null" &&
    hardwareInfo !== undefined &&
    hardwareInfo.length !== 0
  ) {
    colorDepthOptions = JSON.parse(
      JSON.stringify(hardwareInfo[resIndex].HzColors[hzIndex].Colors)
    );
  }
  return [...colorDepthOptions];
}

export function getRefreshOptions(hardwareInfo, resIndex) {
  let refreshOptions = [];
  if (hardwareInfo === "null" || hardwareInfo === undefined) {
    refreshOptions = DefaultRefreshRateOption;
  }
  if (
    hardwareInfo !== "null" &&
    hardwareInfo !== undefined &&
    hardwareInfo.length !== 0
  ) {
    hardwareInfo[resIndex].HzColors.forEach((item) => {
      refreshOptions.push(item.Hz);
    });
  }

  return [...refreshOptions];
}

export function getResolutionKey(monitorId) {
  return `Monitor${monitorId}_Resolution`;
}
export function getColorDepthKey(monitorId) {
  return `Monitor${monitorId}_ColorDepth`;
}
export function getRefreshRateKey(monitorId) {
  return `Monitor${monitorId}_RefreshRate`;
}
export function getVideoPortKey(monitorId) {
  return `Monitor${monitorId}_VideoPort`;
}
export function getScreenWidthKey(monitorId) {
  return `Screen${monitorId}_Height`;
}
export function getScreenHeightKey(monitorId) {
  return `Screen${monitorId}_Width`;
}
// get monitorId(string) from key field such like: Monitor1_Resolutsion, Monitor1_Video, Monitor1_XPosition
export function getMonitorIdFromKey(field) {
  let monitorId = field.substring("Monitor".length);
  monitorId = monitorId.substring(0, monitorId.indexOf("_"));
  return monitorId;
}
export function getScreenIdFromKey(field) {
  let screenId = field.substring("Screen".length);
  screenId = screenId.substring(0, screenId.indexOf("_"));
  return screenId;
}
export function getNumberOfMonitors(terminal) {
  // In default situation, number of monitors is 1
  if (
    terminal == null ||
    terminal[NumberOfMonitors] == null ||
    terminal[NumberOfMonitors] == 0
  )
    return 1;
  return parseInt(terminal[NumberOfMonitors]);
}
export function getNumberOfScreens(terminal) {
  // In default situation, number of screens is 1
  if (terminal == null) return 1;
  return parseInt(terminal[NumberOfScreens]);
}

// data convert
export function dataToServerData(data) {
  let terminal = {};
  let numberOfMonitors = getNumberOfMonitors(data);
  let numberOfScreens = getNumberOfScreens(data);
  terminal[NumberOfMonitors] = numberOfMonitors;
  terminal[NumberOfScreens] = numberOfScreens;
  let videoPortMapping = [];
  for (let i = 1; i <= numberOfMonitors; i++) {
    let key = `Monitor${i}_VideoPort`;
    if (data.hasOwnProperty(key)) {
      videoPortMapping.push(data[key]);
    } else {
      videoPortMapping.push("");
    }
  }
  terminal[VideoPortMapping] = videoPortMapping.join(",");
  terminal[MainMonitor] = data[MainMonitor];
  for (let i = 1; i <= numberOfMonitors; i++) {
    let resolutionKey = `Monitor${i}_Resolution`;
    let colorDepthKey = `Monitor${i}_ColorDepth`;
    let refreshRateKey = `Monitor${i}_RefreshRate`;
    if (
      data.hasOwnProperty(resolutionKey) &&
      data.hasOwnProperty(colorDepthKey) &&
      data.hasOwnProperty(refreshRateKey)
    ) {
      terminal[`Monitor${i}_Video`] =
        data[resolutionKey] +
        "," +
        data[colorDepthKey] +
        "," +
        data[refreshRateKey];
    }
    // Monitor X, Y position
    if (data.hasOwnProperty(`Monitor${i}_XPosition`)) {
      terminal[`Monitor${i}_XPosition`] = data[`Monitor${i}_XPosition`];
    }
    if (data.hasOwnProperty(`Monitor${i}_YPosition`)) {
      terminal[`Monitor${i}_YPosition`] = data[`Monitor${i}_YPosition`];
    }
    if (data.hasOwnProperty(`Monitor${i}_ScreenId`)) {
      terminal[`Monitor${i}_ScreenId`] = data[`Monitor${i}_ScreenId`];
    }
  }

  for (let i = 1; i <= numberOfScreens; i++) {
    for (let j = 0; j < ScreenFields.length; j++) {
      let key = `Screen${i}_${ScreenFields[j]}`;
      if (data.hasOwnProperty(key)) {
        terminal[key] = data[key];
      }
    }
    // Screen X, Y position
    if (data.hasOwnProperty(`Screen${i}_XPosition`)) {
      terminal[`Screen${i}_XPosition`] = data[`Screen${i}_XPosition`];
    }
    if (data.hasOwnProperty(`Screen${i}_YPosition`)) {
      terminal[`Screen${i}_YPosition`] = data[`Screen${i}_YPosition`];
    }
    if (data.hasOwnProperty(`Screen${i}_Width`)) {
      terminal[`Screen${i}_Width`] = data[`Screen${i}_Width`];
    }
    if (data.hasOwnProperty(`Screen${i}_Height`)) {
      terminal[`Screen${i}_Height`] = data[`Screen${i}_Height`];
    }
    if (data.hasOwnProperty(`Screen${i}_Applications`)) {
      terminal[`Screen${i}_Applications`] = data[`Screen${i}_Applications`];
    } else if (i < terminal[NumberOfScreens] + 1) {
      terminal[`Screen${i}_Applications`] = "";
    }
  }
  return terminal;
}

export async function dataToScreens(data) {
  let screens = {};
  let numberOfMonitors = data.NumberOfMonitors;
  let tempMonitors = {};
  // let monitorIdx = 0;
  for (const _monitorId of [...Array(numberOfMonitors).keys()]) {
    let _screenId = data[`Monitor${_monitorId + 1}_ScreenId`];
    let _size = data[`Monitor${_monitorId + 1}_Resolution`].split("x");
    let _width = parseInt(_size[0]);
    let _height = parseInt(_size[1]);

    // update screen
    if (screens[_screenId] === undefined) {
      screens[_screenId] = {};
      tempMonitors[_screenId] = {};
      screens[_screenId].displayScreenId = _screenId;
      screens[_screenId].x = data[`Screen${_screenId}_XPosition`];
      screens[_screenId].y = data[`Screen${_screenId}_YPosition`];
      screens[_screenId].w = data[`Screen${_screenId}_Width`];
      screens[_screenId].h = data[`Screen${_screenId}_Height`];
      screens[_screenId].monitors = [];
      // monitorIdx = 0;
    }
    // update monitor
    let _initPositionX =
      data[`Monitor${_monitorId + 1}_XPosition`] -
      data[`Screen${_screenId}_XPosition`];
    let _initPositionY =
      data[`Monitor${_monitorId + 1}_YPosition`] -
      data[`Screen${_screenId}_YPosition`];
    let _rowIdx = _initPositionY !== 0 ? _initPositionY / _height : 0;
    let _columnIdx = _initPositionX !== 0 ? _initPositionX / _width : 0;
    if (tempMonitors[_screenId][_rowIdx] === undefined) {
      tempMonitors[_screenId][_rowIdx] = {};
    }
    tempMonitors[_screenId][_rowIdx][_columnIdx] = {
      screenId: parseInt(_screenId),
      id: _monitorId + 1,
      x: data[`Monitor${_monitorId + 1}_XPosition`],
      y: data[`Monitor${_monitorId + 1}_YPosition`],
      resolutionW: _width,
      resolutionH: _height,
    };
  }
  // push tempMonitors to screens
  for (const _tempScreenId of Object.keys(tempMonitors)) {
    for (const _tempRow of Object.keys(tempMonitors[_tempScreenId])) {
      for (const _tempColumn of Object.keys(
        tempMonitors[_tempScreenId][_tempRow]
      )) {
        screens[_tempScreenId].monitors.push(
          tempMonitors[_tempScreenId][_tempRow][_tempColumn]
        );
      }
    }
  }

  return screens;
}

export function serverDataToTerminal(data) {
  let terminal = {};
  let numberOfMonitors = getNumberOfMonitors(data);
  let numberOfScreens = getNumberOfScreens(data);
  terminal[NumberOfMonitors] = numberOfMonitors;
  terminal[NumberOfScreens] = numberOfScreens;
  let videoPortMapping = [];
  for (let i = 1; i <= numberOfMonitors; i++) {
    videoPortMapping.push(i);
  }
  terminal[VideoPortMapping] = videoPortMapping.join(",");
  terminal[MainMonitor] = data[MainMonitor];
  for (let i = 1; i <= numberOfMonitors; i++) {
    let video = data[`Monitor${i}_Video`].split(",");
    let resolution = video[0];
    let colorDepth = video[1];
    let refreshRate = video[2];
    if (data.hasOwnProperty(`Monitor${i}_Video`)) {
      terminal[`Monitor${i}_VideoPort`] = i;
      terminal[`Monitor${i}_Resolution`] = resolution;
      terminal[`Monitor${i}_ColorDepth`] = colorDepth;
      terminal[`Monitor${i}_RefreshRate`] = refreshRate;
    }
    // Monitor X, Y position
    if (data.hasOwnProperty(`Monitor${i}_XPosition`)) {
      terminal[`Monitor${i}_XPosition`] = data[`Monitor${i}_XPosition`];
    }
    if (data.hasOwnProperty(`Monitor${i}_YPosition`)) {
      terminal[`Monitor${i}_YPosition`] = data[`Monitor${i}_YPosition`];
    }
    if (data.hasOwnProperty(`Monitor${i}_ScreenId`)) {
      terminal[`Monitor${i}_ScreenId`] = data[`Monitor${i}_ScreenId`];
    }
  }

  for (let i = 1; i <= numberOfScreens; i++) {
    for (let j = 0; j < ScreenFields.length; j++) {
      let key = `Screen${i}_${ScreenFields[j]}`;
      if (data.hasOwnProperty(key)) {
        terminal[key] = data[key];
      }
    }
    // Screen X, Y position
    if (data.hasOwnProperty(`Screen${i}_XPosition`)) {
      terminal[`Screen${i}_XPosition`] = data[`Screen${i}_XPosition`];
    }
    if (data.hasOwnProperty(`Screen${i}_YPosition`)) {
      terminal[`Screen${i}_YPosition`] = data[`Screen${i}_YPosition`];
    }
    if (data.hasOwnProperty(`Screen${i}_Width`)) {
      terminal[`Screen${i}_Width`] = data[`Screen${i}_Width`];
    }
    if (data.hasOwnProperty(`Screen${i}_Height`)) {
      terminal[`Screen${i}_Height`] = data[`Screen${i}_Height`];
    }
    if (data.hasOwnProperty(`Screen${i}_Applications`)) {
      terminal[`Screen${i}_Applications`] = data[`Screen${i}_Applications`];
    } else if (i < terminal[NumberOfScreens] + 1) {
      terminal[`Screen${i}_Applications`] = "";
    }
  }
  return terminal;
}

export function serverDataToScreens(data) {
  let screens = {};
  let numberOfMonitors = data.NumberOfMonitors;
  let tempMonitors = {};
  for (const _monitorId of [...Array(numberOfMonitors).keys()]) {
    let _screenId = data[`Monitor${_monitorId + 1}_ScreenId`];
    let _video =
      data[`Monitor${_monitorId + 1}_Video`] !== undefined
        ? data[`Monitor${_monitorId + 1}_Video`].split(",")
        : ["0x0", "", ""];
    let _size = _video[0].split("x");
    let _width = parseInt(_size[0]);
    let _height = parseInt(_size[1]);

    // update screen
    if (screens[_screenId] === undefined) {
      screens[_screenId] = {};
      tempMonitors[_screenId] = {};
      screens[_screenId].displayScreenId = _screenId;
      screens[_screenId].x = data[`Screen${_screenId}_XPosition`];
      screens[_screenId].y = data[`Screen${_screenId}_YPosition`];
      screens[_screenId].w = data[`Screen${_screenId}_Width`];
      screens[_screenId].h = data[`Screen${_screenId}_Height`];
      screens[_screenId].monitors = [];
    }
    // update monitor
    let _initPositionX =
      data[`Monitor${_monitorId + 1}_XPosition`] -
      data[`Screen${_screenId}_XPosition`];
    let _initPositionY =
      data[`Monitor${_monitorId + 1}_YPosition`] -
      data[`Screen${_screenId}_YPosition`];
    let _rowIdx = _initPositionY !== 0 ? _initPositionY / _height : 0;
    let _columnIdx = _initPositionX !== 0 ? _initPositionX / _width : 0;
    if (tempMonitors[_screenId][_rowIdx] === undefined) {
      tempMonitors[_screenId][_rowIdx] = {};
    }
    tempMonitors[_screenId][_rowIdx][_columnIdx] = {
      screenId: parseInt(_screenId),
      id: _monitorId + 1,
      x: data[`Monitor${_monitorId + 1}_XPosition`],
      y: data[`Monitor${_monitorId + 1}_YPosition`],
      resolutionW: _width,
      resolutionH: _height,
    };
  }
  // push tempMonitors to screens
  for (const _tempScreenId of Object.keys(tempMonitors)) {
    for (const _tempRow of Object.keys(tempMonitors[_tempScreenId])) {
      for (const _tempColumn of Object.keys(
        tempMonitors[_tempScreenId][_tempRow]
      )) {
        screens[_tempScreenId].monitors.push(
          tempMonitors[_tempScreenId][_tempRow][_tempColumn]
        );
      }
    }
  }

  return screens;
}

export async function screensToData(screens, oldData) {
  let data = { ...oldData };
  let numberOfMonitors = 0;
  let lastx = 0;
  let lastw = 0;
  for await (const _screenId of Object.keys(screens)) {
    let sid = parseInt(_screenId);
    if (sid == 0) {
      data[`Screen${_screenId}_XPosition`] = 0;
    } else {
      data[`Screen${_screenId}_XPosition`] = lastx + lastw;
    }
    lastx = data[`Screen${_screenId}_XPosition`];
    data[`Screen${_screenId}_YPosition`] = 0;
    data[`Screen${_screenId}_Width`] = screens[_screenId].w;
    data[`Screen${_screenId}_Height`] = screens[_screenId].h;
    lastw = screens[_screenId].w;
    if (data[`Screen${_screenId}_Applications`] === undefined) {
      data[`Screen${_screenId}_Applications`] = "";
    }
    for await (const _monitor of screens[_screenId].monitors) {
      data[`Monitor${_monitor.id}_`];
      data[`Monitor${_monitor.id}_XPosition`] = _monitor.x;
      data[`Monitor${_monitor.id}_YPosition`] = _monitor.y;
      data[`Monitor${_monitor.id}_VideoPort`] = _monitor.id;
      data[
        `Monitor${_monitor.id}_Resolution`
      ] = `${_monitor.resolutionW}x${_monitor.resolutionH}`;
      data[`Monitor${_monitor.id}_ColorDepth`] =
        oldData[`Monitor${_monitor.id}_ColorDepth`] !== undefined
          ? oldData[`Monitor${_monitor.id}_ColorDepth`]
          : "16M";
      data[`Monitor${_monitor.id}_RefreshRate`] =
        oldData[`Monitor${_monitor.id}_RefreshRate`] !== undefined
          ? oldData[`Monitor${_monitor.id}_RefreshRate`]
          : "60Hz";
      data[`Monitor${_monitor.id}_ScreenId`] = parseInt(_screenId);
      numberOfMonitors++;
    }
  }
  data[NumberOfScreens] = Object.keys(screens).length;
  data[NumberOfMonitors] = numberOfMonitors;
  data[MainMonitor] = oldData[MainMonitor];
  data = await deleteRedundantKey(data);

  return data;
}

export async function changeScreens(
  data,
  screens,
  numberOfScreens,
  selectedMonitorArray
)
{
  let videoPortMappingArray = [...Array(numberOfScreens).keys()].map(
    (idx) => idx + 1
  );
  data[NumberOfScreens] = numberOfScreens;
  data[NumberOfMonitors] = numberOfScreens;
  const [width, height] = DefaultResolution.split("x").map((size) =>
    parseInt(size)
  );
  // update screens
  for (let i = 1; i < numberOfScreens + 1; i++) {
    screens[i] = {};
    screens[i].displayScreenId = i;
    screens[i].x = (i - 1) * width;
    screens[i].y = 0;
    screens[i].w = width;
    screens[i].h = height;
    screens[i].monitors = [];
    screens[i].monitors[0] = {};
    screens[i].monitors[0].id = i;
    screens[i].monitors[0].screenId = i;
    screens[i].monitors[0].x = (i - 1) * width;
    screens[i].monitors[0].y = 0;
    screens[i].monitors[0].resolutionW = width;
    screens[i].monitors[0].resolutionH = height;
    // update data position
    data[`Monitor${i}_XPosition`] =
      i > 1 ? data[`Screen${i - 1}_XPosition`] + width : 0;
    data[`Monitor${i}_YPosition`] = 0;
    data[`Monitor${i}_VideoPort`] = i;
    data[`Monitor${i}_Resolution`] = DefaultResolution;
    data[`Monitor${i}_ColorDepth`] = "16M";
    data[`Monitor${i}_RefreshRate`] = "60Hz";
    data[`Monitor${i}_ScreenId`] = i;
    data[`Screen${i}_XPosition`] =
      i > 1 ? data[`Screen${i - 1}_XPosition`] + width : 0;
    data[`Screen${i}_YPosition`] = 0;
    data[`Screen${i}_Width`] = width;
    data[`Screen${i}_Height`] = height;
    data[`Screen${i}_Applications`] = data[`Screen${i}_Applications`] ?? "";
    data[`Screen${i}_EnableTiling`] = true;
    data[`Screen${i}_TileOnStartup`] = true;
    selectedMonitorArray[i - 1] = 1;
  }
  data[MainMonitor] = 1;
  data[VideoPortMapping] = videoPortMappingArray.join(",");
  data = await deleteRedundantKey(data);

  return [data, screens];
}

export async function changeMonitors(
  data,
  screens,
  numberOfMonitors,
  screenId,
  selectedMonitorArray
)
{
  let monitorX =
    screenId > 1 ? screens[screenId - 1].x + screens[screenId - 1].w : 0;
  const arrayToValue = (accumulator, currentValue) =>
    accumulator + currentValue;
  let selectedMonitors = selectedMonitorArray.reduce(arrayToValue);
  let videoPortMappingArray = [...Array(selectedMonitors).keys()].map(
    (idx) => idx + 1
  );

  // update screen(reset to row)
  let initMonitorId = 1;
  const [width, height] = data[
    `Monitor${screens[screenId].monitors[0].id}_Resolution`
  ]
    .split("x")
    .map((size) => parseInt(size));
  screens[screenId].monitors = [];
  for (const _screenId of [...Array(data[NumberOfScreens]).keys()]) {
    let _intScreenId = parseInt(_screenId) + 1;
    // < 的時候，位置不用調整
    if (_intScreenId < screenId) {
      for (const _monitorIdx of [...Array(screens[_intScreenId].monitors.length).keys(), ]) {
        screens[_intScreenId].monitors[_monitorIdx].id = initMonitorId;
        initMonitorId++;
      }
    // 改變數量一定是 1xN
    } else if (_intScreenId === screenId) {
      for (const _monitorIdx of [...Array(numberOfMonitors).keys()]) {
        screens[_intScreenId].monitors[_monitorIdx] = {};
        screens[_intScreenId].monitors[_monitorIdx].id = initMonitorId;
        screens[_intScreenId].monitors[_monitorIdx].screenId = _intScreenId;
        screens[_intScreenId].monitors[_monitorIdx].x = monitorX;
        screens[_intScreenId].monitors[_monitorIdx].y = 0;
        screens[_intScreenId].monitors[_monitorIdx].resolutionW = width;
        screens[_intScreenId].monitors[_monitorIdx].resolutionH = height;
        monitorX += width;
        initMonitorId++;
      }
    // > 的時候，x 要位移
    } else {
      let diffX = monitorX - screens[_intScreenId].monitors[0].x;
      for (const _monitorIdx of [...Array(screens[_intScreenId].monitors.length).keys(), ]) {
        screens[_intScreenId].monitors[_monitorIdx].id = initMonitorId;
		screens[_intScreenId].monitors[_monitorIdx].x += diffX;
        initMonitorId++;
      }
	}
  }
  screens[screenId].w = numberOfMonitors * width;
  screens[screenId].h = height;

  data = await screensToData(screens, data);
  data[NumberOfMonitors] = selectedMonitors;
  data[VideoPortMapping] = videoPortMappingArray.join(",");

  return [data, screens];
}
