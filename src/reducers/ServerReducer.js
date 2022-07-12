import {
  CLEAR_AUTH_VERIFY,
  CLOSE_EDITOR,
  CLOSE_WIZARD,
  OPEN_EDITOR,
  OPEN_WIZARD,
  UPDATE_RDS_SERVER_LIST,
  UPDATE_RDS_SERVER_GROUP_LIST,
  WS_NOTIFICATION_RDS_SERVER_STATUS,
} from "const/ActionType";
import { defaultObject, defaultArray, update } from "lib/Util";

export default (
  state = {
    adUsers: defaultObject,
    authUser: defaultObject,
    editorOpened: false,
    editingId: "",
    isGroup: false,
    editingServer: defaultObject,
    originalEditingId: "",
    servers: defaultObject,
    serverGroups: defaultObject,
    serverMainTree: defaultObject,
    schedules: defaultObject,
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
    case OPEN_EDITOR: {
      return update(state, {
        editorOpened: { $set: true },
        editingId: { $set: payload.id },
        isGroup: { $set: payload.isGroup },
        originalEditingId: { $set: payload.id },
      });
    }
    case OPEN_WIZARD: {
      return update(state, {
        wizardOpened: { $set: true },
        isGroup: { $set: payload.isGroup },
      });
    }
    case CLOSE_EDITOR: {
      return update(state, {
        editorOpened: { $set: false },
        editingId: { $set: "" },
        originalEditingId: { $set: "" },
        editingServer: { $set: {} },
        schedules: { $set: {} },
        verifyAuthUserResult: { $set: defaultObject },
      });
    }
    case CLOSE_WIZARD: {
      return update(state, {
        wizardOpened: { $set: false },
        verifyAuthUserResult: { $set: defaultObject },
      });
    }
    case CLEAR_AUTH_VERIFY: {
      return update(state, { verifyAuthUserResult: { $set: defaultObject } });
    }
    case WS_NOTIFICATION_RDS_SERVER_STATUS: {
      let { Id, Status } = payload;
      return update(
        state,
        {
          $apply: (servers) => {
            if (servers) {
              const idx = servers.findIndex((t) => t.Id == Id);
              if (idx != -1)
                return update(servers, {
                  [idx]: { Status: { $set: Status } },
                });
            }
            return servers;
          },
        },
        "servers.data"
      );
    }
    case UPDATE_RDS_SERVER_LIST: {
      return update(state, {
        servers: { data: { $set: payload.list } },
        serverMainTree: { data: { $set: payload.tree } },
      });
    }
    case UPDATE_RDS_SERVER_GROUP_LIST: {
      return update(state, {
        serverGroups: { data: { $set: payload.list } },
        serverMainTree: { data: { $set: payload.tree } },
      });
    }
    default:
      return state;
  }
};
