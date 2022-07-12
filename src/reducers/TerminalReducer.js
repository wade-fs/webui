import {
  CLEAR_AUTH_VERIFY,
  CLEAR_PARENT_TERMINAL_GROUP,
  CLEAR_TERMINAL_SETTING,
  CLOSE_TERMINAL_EDITOR,
  CLOSE_TERMINAL_WIZARD,
  GET_DEFAULT_KEYBOARD_MAPPING,
  GET_DEFAULT_MOUSE_MAPPING,
  INITIAL_PENDING_TERMINALS,
  LOAD_SUCCESS,
  OPEN_TERMINAL_EDITOR,
  OPEN_TERMINAL_WIZARD,
  UPDATE_TERMINAL_LIST,
  UPDATE_TERMINAL_GROUP_LIST,
  WS_NOTIFICATION,
  WS_NOTIFICATION_TERMINAL,
  WS_NOTIFICATION_TERMINAL_LIST,
  WS_NOTIFICATION_TERMINAL_STATUS,
  WS_NOTIFICATION_PENDING_TERMINALS,
} from "const/ActionType";

import { defaultObject, defaultArray, update } from "lib/Util";

export default (
  state = {
    authUser: defaultObject,
    adUsers: defaultObject,
    applications: defaultObject,
    defaultTerminal: null,
    defaultKeyboardMapping: defaultObject,
    defaultMouseMapping: defaultObject,
    editingId: "",
    editorOpened: false,
    editingTerminal: defaultObject,
    firmwarePackage: defaultObject,
    hardwareInfo: defaultObject,
    isGroup: false,
    modules: defaultObject, // [{Id, Type, Name, Version}] list of module that containing module information
    msIdWrappers: defaultObject, // [{Id, ModuleId, TerminalId}] list of msId infomation that containing msId,moduleId,terminalId
    moduleSettings: defaultObject, // {MsId: [{Key,Value}, {Key, Value}]}
    newModuleSetting: defaultObject,
    newModuleSettingId: defaultObject,
    schedules: defaultObject,
    supportDevices: defaultObject,
    manufacturerModelMap: defaultObject,
    operate: defaultObject,
    originalEditingId: "",
    parentTerminal: defaultObject,
    pendingTerminals: defaultArray,
    possibleModuleSettings: defaultObject, // {ModuleId: [{Key,Value}, {Key,Value}]}
    terminals: defaultObject,
    terminalGroups: defaultObject,
    terminalMainTree: defaultObject,
    terminalSetting: defaultObject,
    verifyAuthUserResult: defaultObject,
    wizardOpened: false,
    user: {
      selectedTags: defaultArray,
      searchText: null,
    },
  },
  action
) => {
  let { type, payload } = action;
  switch (type) {
    case CLOSE_TERMINAL_WIZARD: {
      return update(state, {
        wizardOpened: { $set: false },
        parentTerminal: { $set: {} },
        defaultTerminal: { $set: null },
        verifyAuthUserResult: { $set: defaultObject },
        terminalSetting: { $set: defaultObject },
      });
    }
    case CLOSE_TERMINAL_EDITOR: {
      return update(state, {
        editorOpened: { $set: false },
        editingId: { $set: "" },
        originalEditingId: { $set: "" },
        schedules: { $set: {} },
        editingTerminal: { $set: {} },
        parentTerminal: { $set: {} },
        modules: { $set: {} },
        moduleSettings: { $set: {} },
        msIdWrappers: { $set: {} },
        verifyAuthUserResult: { $set: defaultObject },
      });
    }
    case CLEAR_AUTH_VERIFY: {
      return update(state, { verifyAuthUserResult: { $set: defaultObject } });
    }
    case CLEAR_TERMINAL_SETTING: {
      return update(state, { terminalSetting: { $set: defaultObject } });
    }
    case CLEAR_PARENT_TERMINAL_GROUP: {
      return update(state, { parentTerminal: { $set: defaultObject } });
    }
    case GET_DEFAULT_KEYBOARD_MAPPING: {
      return update(state, {
        defaultKeyboardMapping: { data: { $set: payload } },
      });
    }
    case GET_DEFAULT_MOUSE_MAPPING: {
      return update(state, {
        defaultMouseMapping: { data: { $set: payload } },
      });
    }
    case INITIAL_PENDING_TERMINALS: {
      return update(state, {
        pendingTerminals: { $set: defaultArray },
      });
    }
    case LOAD_SUCCESS: {
      let { path, data } = payload;
      let Id = data.Id;
      if (path === "terminals.editingTerminal") {
        let NeedToRestart = data.NeedToRestart;
        let Disabled = data.Disabled;
        if (typeof NeedToRestart !== "undefined" || typeof Disabled !== "undefined") {
          return update(
            state,
            {
              $apply: (terminals) => {
                if (terminals) {
                  const idx = terminals.findIndex((t) => t.Id == Id);
                  if (idx != -1) {
                    if (typeof NeedToRestart !== "undefined" && typeof Disabled !== "undefined") {
                      console.log("LOAD with NeedToRestart: "+NeedToRestart + " Disabled: "+Disabled);
                      return update(terminals, {
                        [idx]: { NeedToRestart: { $set: NeedToRestart },
                                 Disabled: { $set: Disabled } }
                      });
                    } else if (typeof NeedToRestart !== "undefined") {
                      console.log("LOAD with NeedToRestart: "+NeedToRestart);
                      return update(terminals, {
                        [idx]: { NeedToRestart: { $set: NeedToRestart } }
                      });
                    } else {
                      console.log("LOAD with Disabled: "+Disabled);
                      return update(terminals, {
                        [idx]: { Disabled: { $set: Disabled } }
                      });
                    }
                  }
                }
                return terminals;
              },
            },
            "terminals.data"
          );
        }
      }
      return state;
    }
    case OPEN_TERMINAL_EDITOR: {
      return update(state, {
        editorOpened: { $set: true },
        editingId: { $set: payload.id },
        isGroup: { $set: payload.isGroup },
        originalEditingId: { $set: payload.id },
      });
    }
    case OPEN_TERMINAL_WIZARD: {
      return update(state, {
        wizardOpened: { $set: true },
        isGroup: { $set: payload.isGroup },
        defaultTerminal: { $set: payload.defaultTerminal },
        schedules: { $set: {} },
        modules: { $set: {} },
        moduleSettings: { $set: {} },
        msIdWrappers: { $set: {} },
      });
    }
    case UPDATE_TERMINAL_LIST: {
      return update(state, {
        terminals: { data: { $set: payload.list } },
        terminalMainTree: { data: { $set: payload.tree } },
      });
    }
    case UPDATE_TERMINAL_GROUP_LIST: {
      return update(state, {
        terminalGroups: { data: { $set: payload.list } },
        terminalMainTree: { data: { $set: payload.tree } },
      });
    }
    case WS_NOTIFICATION: {
      return state;
    }
    case WS_NOTIFICATION_PENDING_TERMINALS: {
      return update(state, {
        pendingTerminals: { $set: payload },
      });
    }
    case WS_NOTIFICATION_TERMINAL: {
      let { Id, term } = payload;
      return update(
        state,
        {
          $apply: (terminals) => {
            if (terminals) {
              const idx = terminals.findIndex((t) => t.Id == Id);
              if (idx != -1)
                return update(terminals, {
                  [idx]: { data: { $set: term } },
                });
            }
            return terminals;
          },
        },
        "terminals.data"
      );
    }
    case WS_NOTIFICATION_TERMINAL_LIST: {
      return update(state, {
        terminals: { data: { $set: payload.list } },
      });
    }
    case WS_NOTIFICATION_TERMINAL_STATUS: {
      let { Id, Status } = payload;
      return update(
        state,
        {
          $apply: (terminals) => {
            if (terminals) {
              const idx = terminals.findIndex((t) => t.Id == Id);
              if (idx != -1)
                return update(terminals, {
                  [idx]: { Status: { $set: Status } },
                });
            }
            return terminals;
          },
        },
        "terminals.data"
      );
    }
    default: // 這邊就多了
      // console.log("Terminal reducer type "+type+" " + JSON.stringify(payload, null, 4));
      return state;
  }
};
