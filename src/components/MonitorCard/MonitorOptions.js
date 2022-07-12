import React from "react";
import RadioButton from "../../components/Form/RadioButton";
import Select from "../../components/Form/Select";
import { EditorField } from "../../components/Card";

import { MainMonitor } from "../../const/Terminals/TerminalFieldNames";

import { toLetter } from "../../utils/String";
import {
  getResolutionOptions,
  getColorDepthOptions,
  getRefreshOptions,
  getResolutionKey,
  getColorDepthKey,
  getRefreshRateKey,
  getVideoPortKey,
} from "../../utils/Display";

export default function MonitorOptions({
  isEditMode,
  isWizard,
  data,
  screens,
  hardwareInfo,
  change,
  applyAllScreen,
  allMonitorSetting,
  monitorId,
  screenId,
  resIndex,
  hzIndex,
  colorIndex,
  disabled,
}) {
  const getWrapperField = (title, name, options, Tag, outerClass) => {
    return (
      <EditorField
        isEditMode={isEditMode}
        title={title}
        name={name}
        options={{ value: data[name], ...options }}
        Tag={Tag}
        outerClass={outerClass}
        onChange={change}
      />
    );
  };
  const resolutionKey = getResolutionKey(monitorId);
  const colorDepthKey = getColorDepthKey(monitorId);
  const refreshRateKey = getRefreshRateKey(monitorId);
  const portKey = getVideoPortKey(monitorId);
  let videoOptionsDisabled = true;
  let resolutionOptions = [];
  let colorDepthOptions = [];
  let refreshRateOptions = [];
  if (
    data.hasOwnProperty(portKey) &&
    data[portKey] != null &&
    data[portKey] != ""
  ) {
    videoOptionsDisabled = false;
    resolutionOptions = getResolutionOptions(hardwareInfo);
    refreshRateOptions = getRefreshOptions(hardwareInfo, resIndex);
    colorDepthOptions = getColorDepthOptions(hardwareInfo, resIndex, hzIndex);
  }

  return (
    <div key={`${screenId}_${monitorId}`} className="display-monitor-content">
      <div className={`display-monitor-screen screen-${screenId}`}>
        {toLetter(screenId)}
      </div>
      <div className="display-monitor-options">
        <div className="inline-flex">
          <div className="display-content-title">{`MONITOR ${monitorId}`}</div>
          {getWrapperField(
            " ",
            MainMonitor,
            {
              type: "radio",
              labelClass: "display-main-monitor",
              selectedValue: monitorId,
              style: { marginLeft: "12px", marginRight: "12px" },
              disabled: disabled,
            },
            RadioButton
          )}
        </div>
        <ul className="display-monitor-select editor-content ">
          {getWrapperField(
            "RESOLUTION",
            resolutionKey,
            {
              type: "select",
              className: `${isWizard ? "w-120" : "w-180"} mb-8`,
              options: resolutionOptions,
              value:
                allMonitorSetting === undefined
                  ? data[`Monitor${monitorId}_Resolution`] !== undefined
                    ? data[`Monitor${monitorId}_Resolution`]
                    : resolutionOptions[resIndex]
                  : allMonitorSetting.resolution,
              disabled: disabled || videoOptionsDisabled,
            },
            Select
          )}
          {getWrapperField(
            "REFRESH RATE",
            refreshRateKey,
            {
              type: "select",
              className: `${isWizard ? "w-120" : "w-180"} mb-8`,
              options: refreshRateOptions,
              value:
                allMonitorSetting === undefined
                  ? data[`Monitor${monitorId}_RefreshRate`] !== undefined
                    ? data[`Monitor${monitorId}_RefreshRate`]
                    : refreshRateOptions[hzIndex]
                  : allMonitorSetting.refreshRate,
              disabled: disabled || videoOptionsDisabled,
            },
            Select
          )}
          {getWrapperField(
            "COLOR DEPTH",
            colorDepthKey,
            {
              type: "select",
              className: `${isWizard ? "w-120" : "w-180"} mb-8`,
              options: colorDepthOptions,
              value:
                allMonitorSetting === undefined
                  ? data[`Monitor${monitorId}_ColorDepth`] !== undefined
                    ? data[`Monitor${monitorId}_ColorDepth`]
                    : colorDepthOptions[colorIndex]
                  : allMonitorSetting.colorDepth,
              disabled: disabled || videoOptionsDisabled,
            },
            Select
          )}
        </ul>
      </div>
    </div>
  );
}
