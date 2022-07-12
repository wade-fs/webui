import {
  CLOSE_APPLICATION_EDITOR,
  CLOSE_APPLICATION_WIZARD,
  OPEN_APPLICATION_EDITOR,
  OPEN_APPLICATION_WIZARD,
  OPEN_SUB_APP_EDITOR,
  CLOSE_SUB_APP_EDITOR,
  UPDATE_APP_LIST,
  UPDATE_APP_GROUP_LIST,
  WS_NOTIFICATION_APPLICATION_STATUS,
} from "const/ActionType";
import { defaultObject, defaultArray, update } from "lib/Util";

export default (
  state = {
    editorOpened: false,
    subEditorOpened: false,
    editingId: "",
    editingApplication: defaultObject,
    applications: defaultObject,
    applicationGroups: defaultObject,
    applicationMainTree: defaultObject,
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
    case OPEN_APPLICATION_EDITOR: {
      return update(state, {
        editorOpened: { $set: true },
        editingId: { $set: payload.id },
        isGroup: { $set: payload.isGroup },
      });
    }
    case OPEN_SUB_APP_EDITOR: {
      return update(state, {
        subEditorOpened: { $set: true },
        editingId: { $set: payload.id },
        isGroup: { $set: payload.isGroup },
      });
    }
    case OPEN_APPLICATION_WIZARD: {
      return update(state, {
        wizardOpened: { $set: true },
        isGroup: { $set: payload.isGroup },
      });
    }
    case CLOSE_APPLICATION_EDITOR: {
      return update(state, {
        editorOpened: { $set: false },
        editingId: { $set: "" },
        editingApplication: { $set: {} },
      });
    }
    case CLOSE_SUB_APP_EDITOR: {
      return update(state, {
        subEditorOpened: { $set: false },
        editingId: { $set: "" },
        editingApplication: { $set: {} },
      });
    }
    case CLOSE_APPLICATION_WIZARD: {
      return update(state, { wizardOpened: { $set: false } });
    }
    case WS_NOTIFICATION_APPLICATION_STATUS: {
      let { Id, Status } = payload;
      return update(
        state,
        {
          $apply: (applications) => {
            if (applications) {
              const idx = applications.findIndex((t) => t.Id == Id);
              if (idx != -1)
                return update(applications, {
                  [idx]: { Status: { $set: Status } },
                });
            }
            return applications;
          },
        },
        "applications.data"
      );
    }
    case UPDATE_APP_LIST: {
      return update(state, {
        applications: { data: { $set: payload.list } },
        applicationMainTree: { data: { $set: payload.tree } },
      });
    }
    case UPDATE_APP_GROUP_LIST: {
      return update(state, {
        applicationGroups: { data: { $set: payload.list } },
        applicationMainTree: { data: { $set: payload.tree } },
      });
    }
    default:
      return state;
  }
};
