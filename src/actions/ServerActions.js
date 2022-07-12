import {
  ADD_SERVER,
  CLEAR_AUTH_VERIFY,
  CLOSE_EDITOR,
  CLOSE_WIZARD,
  COPY_SERVER,
  DELETE_SERVER,
  GET_SERVER,
  LOAD_SERVERS,
  LOAD_SERVER_GROUPS,
  LOAD_SERVERS_AND_GROUPS,
  OPEN_EDITOR,
  OPEN_WIZARD,
  UPDATE_SERVER,
  UPDATE_RDS_SERVER_LIST,
  UPDATE_RDS_SERVER_GROUP_LIST,
} from "const/ActionType";

import { convertListToTree } from "utils/Tree";

import {
  // rds-server
  apiGetServerList,
  apiGetServerGroupList,
  apiGetServer,
  apiGetServerGroup,
  apiAddServer,
  apiAddServerGroup,
  apiUpdateServer,
  apiUpdateServerGroup,
  apiDeleteServer,
  apiDeleteServerGroup,
} from "api";

// RDS Server
export function loadServers() {
  return {
    type: LOAD_SERVERS,
    payload: {
      path: "servers.servers",
      loader: apiGetServerList,
    },
  };
}

export function loadServerGroups() {
  return {
    type: LOAD_SERVER_GROUPS,
    payload: {
      path: "servers.serverGroups",
      loader: apiGetServerGroupList,
    },
  };
}

export function loadServersAndGroups() {
  return {
    type: LOAD_SERVERS_AND_GROUPS,
    payload: {
      path: "servers.servers",
      loader: apiGetServerList,
      groupLoader: apiGetServerGroupList,
    },
  };
}

export function addServer(data, schedules, isGroup) {
  return {
    type: ADD_SERVER,
    payload: {
      path: "servers.editingServer",
      data: data,
      isGroup: isGroup,
      schedules: schedules,
      addServerLoader: isGroup === true ? apiAddServerGroup : apiAddServer,
    },
  };
}

export function getServer(id, isGroup) {
  return {
    type: GET_SERVER,
    payload: {
      path: "servers.editingServer",
      loader: isGroup === true ? apiGetServerGroup : apiGetServer,
      id: id,
      isGroup: isGroup,
    },
  };
}

export function updateServer(id, data, isGroup, urlPath) {
  return {
    type: UPDATE_SERVER,
    payload: {
      path: "servers.editingServer",
      updateServerLoader:
        isGroup === true ? apiUpdateServerGroup : apiUpdateServer,
      getServerLoader: isGroup === true ? apiGetServerGroup : apiGetServer,
      id: id,
      data: data,
      isGroup: isGroup,
      urlPath: urlPath,
    },
  };
}

export function deleteServer(id, isGroup) {
  return {
    type: DELETE_SERVER,
    payload: {
      path: "servers.editingServer",
      loader: isGroup === true ? apiDeleteServerGroup : apiDeleteServer,
      id: id,
      isGroup: isGroup,
    },
  };
}

export function copyServer(id, name, parentId, isGroup) {
  return {
    type: COPY_SERVER,
    payload: {
      path: "servers.editingServer",
      id: id,
      name: name,
      parentId: parentId,
      isGroup: isGroup,
      addServerLoader: isGroup === true ? apiAddServerGroup : apiAddServer,
      getServerLoader: isGroup === true ? apiGetServerGroup : apiGetServer,
    },
  };
}

// Terminal Server Behavior
export function openEditor(id, isGroup) {
  return (dispatch) => {
    dispatch({
      type: OPEN_EDITOR,
      payload: { id: id, isGroup: isGroup },
    });
  };
}

export function closeEditor() {
  return (dispatch) => {
    dispatch({
      type: CLOSE_EDITOR,
    });
  };
}

export function openWizard(isGroup) {
  return (dispatch) => {
    dispatch({
      type: OPEN_WIZARD,
      payload: { isGroup: isGroup },
    });
  };
}

export function closeWizard() {
  return (dispatch) => {
    dispatch({
      type: CLOSE_WIZARD,
    });
  };
}

export function clearAuthVerify() {
  return (dispatch) => {
    dispatch({
      type: CLEAR_AUTH_VERIFY,
    });
  };
}

export function updateServerList(serverGroupList) {
  return async (dispatch) => {
    const response = await apiGetServerList();
    if (response.result === true) {
      let serverList = response.data;
      let tree = await convertListToTree(serverList, serverGroupList);
      dispatch({
        type: UPDATE_RDS_SERVER_LIST,
        payload: {
          list: serverList,
          tree: tree,
        },
      });
    }
  };
}

export function updateServerGroupList(serverList) {
  return async (dispatch) => {
    const response = await apiGetServerGroupList();
    if (response.result === true) {
      let serverGroupList = response.data;
      let tree = await convertListToTree(serverList, serverGroupList);
      dispatch({
        type: UPDATE_RDS_SERVER_GROUP_LIST,
        payload: {
          list: serverGroupList,
          tree: tree,
        },
      });
    }
  };
}
