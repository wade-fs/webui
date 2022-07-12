import {
  ADD_APPLICATION,
  CLOSE_APPLICATION_EDITOR,
  CLOSE_APPLICATION_WIZARD,
  OPEN_SUB_APP_EDITOR,
  CLOSE_SUB_APP_EDITOR,
  COPY_APPLICATION,
  DELETE_APPLICATION,
  GET_APPLICATION,
  LOAD_APPLICATIONS,
  LOAD_APPLICATION_GROUPS,
  LOAD_APPLICATIONS_AND_GROUPS,
  OPEN_APPLICATION_EDITOR,
  OPEN_APPLICATION_WIZARD,
  UPDATE_APPLICATION,
  UPDATE_APP_LIST,
  UPDATE_APP_GROUP_LIST,
} from "const/ActionType";

import { convertListToTree } from "utils/Tree";

import {
  // application
  apiGetAppList,
  apiGetAppGroupList,
  apiGetApp,
  apiGetAppGroup,
  apiAddApp,
  apiAddAppGroup,
  apiUpdateApp,
  apiUpdateAppGroup,
  apiDeleteApp,
  apiDeleteAppGroup,
} from "api";

// Application API bahavior
export function loadApplications() {
  return {
    type: LOAD_APPLICATIONS,
    payload: {
      path: "applications.applications",
      loader: apiGetAppList,
    },
  };
}

export function loadApplicationGroups() {
  return {
    type: LOAD_APPLICATION_GROUPS,
    payload: {
      path: "applications.applicationGroups",
      loader: apiGetAppGroupList,
    },
  };
}

export function loadApplicationsAndGroups() {
  return {
    type: LOAD_APPLICATIONS_AND_GROUPS,
    payload: {
      path: "applications.applications",
      loader: apiGetAppList,
      groupLoader: apiGetAppGroupList,
    },
  };
}

export function addApplication(data, isGroup) {
  return {
    type: ADD_APPLICATION,
    payload: {
      path: "applications.editingApplication",
      data: data,
      isGroup: isGroup,
      addApplicationLoader: isGroup === true ? apiAddAppGroup : apiAddApp,
    },
  };
}

export function getApplication(id, isGroup) {
  return {
    type: GET_APPLICATION,
    payload: {
      path: "applications.editingApplication",
      loader: isGroup === true ? apiGetAppGroup : apiGetApp,
      id: id,
      isGroup: isGroup,
    },
  };
}

export function updateApplication(id, data, isGroup, urlPath) {
  return {
    type: UPDATE_APPLICATION,
    payload: {
      path: "applications.editingApplication",
      updateApplicationLoader:
        isGroup === true ? apiUpdateAppGroup : apiUpdateApp,
      getApplicationLoader: isGroup === true ? apiGetAppGroup : apiGetApp,
      id: id,
      data: data,
      isGroup: isGroup,
      urlPath: urlPath,
    },
  };
}

export function deleteApplication(id, isGroup) {
  return {
    type: DELETE_APPLICATION,
    payload: {
      path: "applications.editingApplication",
      loader: isGroup === true ? apiDeleteAppGroup : apiDeleteApp,
      id: id,
      isGroup: isGroup,
    },
  };
}

export function copyApplication(id, name, parentId, isGroup) {
  return {
    type: COPY_APPLICATION,
    payload: {
      path: "applications.editingApplication",
      id: id,
      name: name,
      parentId: parentId,
      isGroup: isGroup,
      addApplicationLoader: isGroup === true ? apiAddAppGroup : apiAddApp,
      getApplicationLoader: isGroup === true ? apiGetAppGroup : apiGetApp,
    },
  };
}

// Application User Action
export function openApplicationEditor(id, isGroup) {
  return (dispatch) => {
    dispatch({
      type: OPEN_APPLICATION_EDITOR,
      payload: { id: id, isGroup: isGroup },
    });
  };
}

export function openSubAppEditor(id, isGroup) {
  return (dispatch) => {
    dispatch({
      type: OPEN_SUB_APP_EDITOR,
      payload: { id: id, isGroup: isGroup },
    });
  };
}

export function closeSubAppEditor() {
  return (dispatch) => {
    dispatch({
      type: CLOSE_SUB_APP_EDITOR,
    });
  };
}

export function closeApplicationEditor() {
  return (dispatch) => {
    dispatch({
      type: CLOSE_APPLICATION_EDITOR,
    });
  };
}

export function openApplicationWizard(isGroup) {
  return (dispatch) => {
    dispatch({
      type: OPEN_APPLICATION_WIZARD,
      payload: { isGroup: isGroup },
    });
  };
}

export function closeApplicationWizard() {
  return (dispatch) => {
    dispatch({
      type: CLOSE_APPLICATION_WIZARD,
    });
  };
}

export function updateAppList(appGroupList) {
  return async (dispatch) => {
    const response = await apiGetAppList();
    if (response.result === true) {
      let appList = response.data;
      let tree = convertListToTree(appList, appGroupList);
      dispatch({
        type: UPDATE_APP_LIST,
        payload: {
          list: appList,
          tree: tree,
        },
      });
    }
  };
}

export function updateAppGroupList(appList) {
  return async (dispatch) => {
    const response = await apiGetAppGroupList();
    if (response.result === true) {
      let appGroupList = response.data;
      let tree = convertListToTree(appList, appGroupList);
      dispatch({
        type: UPDATE_APP_GROUP_LIST,
        payload: {
          list: appGroupList,
          tree: tree,
        },
      });
    }
  };
}
