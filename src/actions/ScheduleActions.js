import { UPDATE_SCHEDULES, LOAD_SCHEDULES } from "const/ActionType";

import {
  apiAddSchedule,
  apiGetSchedule,
  apiUpdateSchedule,
  apiDeleteSchedule,
  // terminal
  apiGetTerminal,
  apiGetTerminalGroup,
  apiUpdateTerminal,
  apiUpdateTerminalGroup,
} from "api";

export function loadSchedules(scheduleIds, path) {
  return {
    type: LOAD_SCHEDULES,
    payload: {
      scheduleIds: scheduleIds,
      loader: apiGetSchedule,
      path: path,
      isGroup: false,
    },
  };
}

export function updateSchedules(
  editingId,
  oriIds,
  schedules,
  isEnable,
  isApplyAll,
  path,
  isGroup
) {
  return {
    type: UPDATE_SCHEDULES,
    payload: {
      editingId: editingId,
      data: schedules,
      oriIds: oriIds,
      isEnable: isEnable,
      isApplyAll: isApplyAll,
      getScheduleLoader: apiGetSchedule,
      getTerminalLoader:
        isGroup === true ? apiGetTerminalGroup : apiGetTerminal,
      updateTerminalLoader:
        isGroup === true ? apiUpdateTerminalGroup : apiUpdateTerminal,
      path: path,
      isGroup: isGroup,
    },
  };
}
