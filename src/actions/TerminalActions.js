import {
  // operations
  CLOSE_TERMINAL_EDITOR,
  CLOSE_TERMINAL_WIZARD,
  OPEN_TERMINAL_EDITOR,
  OPEN_TERMINAL_WIZARD,
  // terminals
  ADD_TERMINAL,
  CLEAR_AUTH_VERIFY,
  CLEAR_PARENT_TERMINAL_GROUP,
  DELETE_TERMINAL,
  GET_TERMINAL,
  GET_PARENT_TERMINAL_GROUP,
  LOAD_TERMINALS,
  LOAD_TERMINAL_GROUPS,
  LOAD_TERMINALS_AND_GROUPS,
  UPDATE_TERMINAL,
  UPDATE_TERMINAL_LIST,
  UPDATE_TERMINAL_GROUP_LIST,
  // modules
  LOAD_MODULES,
  LOAD_MODULE_SETTING,
  // others
  COPY_TERMINAL,
  CLEAR_TERMINAL_SETTING,
  GET_DEFAULT_KEYBOARD_MAPPING,
  GET_DEFAULT_MOUSE_MAPPING,
  GET_TERMINAL_SETTING,
  GET_FIRMWARE_PACKAGE,
  GET_DISPLAY_OPTIONS,
  GET_MODEL_MAP,
  OPERATE_TERMINAL,
  // new hardware type
  MODEL,
  // pending terminals
  INITIAL_PENDING_TERMINALS,
} from "const/ActionType";

import { DEFAULT_KEYBOARD, DEFAULT_MOUSE } from "const/Terminals/Control.js";

import { convertListToTree } from "utils/Tree";

import {
  // termianl
  apiGetTerminalList,
  apiGetTerminalGroupList,
  apiGetTerminal,
  apiGetTerminalGroup,
  apiAddTerminal,
  apiAddTerminalGroup,
  apiUpdateTerminal,
  apiUpdateTerminalGroup,
  apiDeleteTerminal,
  apiDeleteTerminalGroup,
  apiGetAppList,
  // display
  apiGetDisplayOptions,
  // module
  apiGetModuleSettingList,
  apiGetModule,
  apiAddModule,
  // other
  apiGetSupportDevices,
  apiAddSchedule,
  apiOperateTerminal,
  apiGetFirmwarePackage,
} from "api";

export function loadTerminals() {
  return {
    type: LOAD_TERMINALS,
    payload: {
      path: "terminals.terminals",
      loader: apiGetTerminalList,
    },
  };
}

export function loadTerminalGroups() {
  return {
    type: LOAD_TERMINAL_GROUPS,
    payload: {
      path: "terminals.terminalGroups",
      loader: apiGetTerminalGroupList,
    },
  };
}

export function addTerminal(
  terminal,
  schedules,
  modules,
  applications,
  isGroup
) {
  return {
    type: ADD_TERMINAL,
    payload: {
      path: "terminals.editingTerminal",
      terminal: terminal,
      isGroup: isGroup,
      schedules: schedules,
      modules: modules,
      applications: applications,
      loader: isGroup === true ? apiAddTerminalGroup : apiAddTerminal,
      updateTerminalLoader:
        isGroup === true ? apiUpdateTerminalGroup : apiUpdateTerminal,
      addScheduleLoader: apiAddSchedule,
      addModuleLoader: apiAddModule,
    },
  };
}

export function updateTerminal(id, data, isGroup, urlPath) {
  return {
    type: UPDATE_TERMINAL,
    payload: {
      path: "terminals.editingTerminal",
      updateTerminalLoader:
        isGroup === true ? apiUpdateTerminalGroup : apiUpdateTerminal,
      getTerminalLoader:
        isGroup === true ? apiGetTerminalGroup : apiGetTerminal,
      id: id,
      data: data,
      isGroup: isGroup,
      urlPath: urlPath,
    },
  };
}

export function deleteTerminal(id, isGroup) {
  return {
    type: DELETE_TERMINAL,
    payload: {
      path: "terminals.editingTerminal",
      loader: isGroup === true ? apiDeleteTerminalGroup : apiDeleteTerminal,
      id: id,
      isGroup: isGroup,
    },
  };
}

export function copyTerminal(id, name, parentId, isGroup) {
  return {
    type: COPY_TERMINAL,
    payload: {
      path: "terminals.editingTerminal",
      id: id,
      name: name,
      parentId: parentId,
      isGroup: isGroup,
      addTerminalLoader:
        isGroup === true ? apiAddTerminalGroup : apiAddTerminal,
      getTerminalLoader:
        isGroup === true ? apiGetTerminalGroup : apiGetTerminal,
    },
  };
}

export function getParentTerminal(id) {
  return {
    type: GET_PARENT_TERMINAL_GROUP,
    payload: {
      path: "terminals.parentTerminal",
      loader: apiGetTerminalGroup,
      id: id,
    },
  };
}

export function clearParentTerminal() {
  return (dispatch) => {
    dispatch({
      type: CLEAR_PARENT_TERMINAL_GROUP,
    });
  };
}

export function getTerminalSetting(id) {
  return {
    type: GET_TERMINAL_SETTING,
    payload: {
      path: "terminals.terminalSetting",
      loader: apiGetTerminal,
      id: id,
    },
  };
}

export function clearAuthVerify() {
  return (dispatch) => {
    dispatch({
      type: CLEAR_AUTH_VERIFY,
    });
  };
}

export function clearTerminalSetting() {
  return (dispatch) => {
    dispatch({
      type: CLEAR_TERMINAL_SETTING,
    });
  };
}

// Modules
// Get all modules information ({Id,Name,Version,Type}) for this hardware
export function loadModules(ids) {
  return {
    type: LOAD_MODULES,
    payload: {
      path: "terminals.modules",
      ids: ids,
      moduleLoader: apiGetModule,
    },
  };
}

export function loadModuleSettings() {
  return {
    type: LOAD_MODULE_SETTING,
    payload: {
      path: "terminals.moduleSettings",
      moduleLoader: apiGetModuleSettingList,
    },
  };
}

export function getDefaultKeyboardMapping() {
  return {
    type: GET_DEFAULT_KEYBOARD_MAPPING,
    payload: DEFAULT_KEYBOARD,
  };
}

export function getDefaultMouseMapping() {
  return {
    type: GET_DEFAULT_MOUSE_MAPPING,
    payload: DEFAULT_MOUSE,
  };
}

export function getDisplayOptions(manufacturer, model) {
  return (dispatch) => {
    dispatch({
      type: GET_DISPLAY_OPTIONS,
      payload: {
        path: "terminals.hardwareInfo",
        loader: apiGetDisplayOptions,
        manufacturer: manufacturer,
        model: model,
      },
    });
  };
}

export function getFirmwarePackage() {
  return {
    type: GET_FIRMWARE_PACKAGE,
    payload: {
      path: "terminals.firmwarePackage",
      loader: apiGetFirmwarePackage,
    },
  };
}

export function getModelMap() {
  return {
    type: GET_MODEL_MAP,
    payload: {
      supportDevicePath: "terminals.supportDevices",
      manufacturerModelMapPath: "terminals.manufacturerModelMap",
      supportDeviceLoader: apiGetSupportDevices,
      firmwarePackageLoader: apiGetFirmwarePackage,
    },
  };
}

export function loadTerminalsAndGroups() {
  return {
    type: LOAD_TERMINALS_AND_GROUPS,
    payload: {
      path: "terminals.terminals",
      loader: apiGetTerminalList,
      groupLoader: apiGetTerminalGroupList,
    },
  };
}

export function getTerminal(id, isGroup) {
  return async (dispatch) => await dispatch({
    type: GET_TERMINAL,
    payload: {
      path: "terminals.editingTerminal",
      loader: apiGetTerminal,
      id: id,
      isGroup: isGroup,
    },
  });
}

export function operateTerminal(editingId, action) {
  return async (dispatch) => await dispatch({
    type: OPERATE_TERMINAL,
    payload: {
      path: "terminals.editingTerminal",
      action,
      editingId,
      loader: apiOperateTerminal,
      upadteLoader: apiUpdateTerminal,
      getLoader: apiGetTerminal,
    },
  });
}

// Operations
export function openTerminalEditor(id, isGroup) {
  return (dispatch) => {
    dispatch({
      type: OPEN_TERMINAL_EDITOR,
      payload: {
        id: id,
        isGroup: isGroup,
      },
    });
  };
}

export function openTerminalWizard(isGroup, defaultTerminal) {
  return (dispatch) => {
    dispatch({
      type: OPEN_TERMINAL_WIZARD,
      payload: {
        isGroup: isGroup,
        defaultTerminal,
      },
    });
  };
}

export function closeTerminalWizard() {
  return (dispatch) => {
    dispatch({
      type: CLOSE_TERMINAL_WIZARD,
    });
  };
}

export function closeTerminalEditor() {
  return (dispatch) => {
    dispatch({
      type: CLOSE_TERMINAL_EDITOR,
    });
  };
}

export function initPendingTerminals() {
  return (dispatch) => {
    dispatch({
      type: INITIAL_PENDING_TERMINALS,
    });
  };
}

export function updateTerminalList(terminalGroupList) {
  return async (dispatch) => {
    const response = await apiGetTerminalList();
    if (response.result === true) {
      let terminalList = response.data;
      let tree = await convertListToTree(terminalList, terminalGroupList);
      dispatch({
        type: UPDATE_TERMINAL_LIST,
        payload: {
          list: terminalList,
          tree: tree,
        },
      });
    }
  };
}

export function updateTerminalGroupList(terminalList) {
  return async (dispatch) => {
    const response = await apiGetTerminalGroupList();
    if (response.result === true) {
      let terminalGroupList = response.data;
      let tree = await convertListToTree(terminalList, terminalGroupList);
      dispatch({
        type: UPDATE_TERMINAL_GROUP_LIST,
        payload: {
          list: terminalGroupList,
          tree: tree,
        },
      });
    }
  };
}
