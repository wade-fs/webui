import {
  LOGIN,
  LOGOUT,
  LOAD_USERS,
  ADD_USER,
  DELETE_USER,
  CLEARE_EXPIRE_TIME,
  GET_USER_INFO,
  UPDATE_USER,
} from "const/ActionType";

import {
  apiLogin,
  apiLogout,
  apiLoadUsers,
  apiGetUser,
  apiAddUser,
  apiUpdateUser,
  apiDeleteUser,
} from "api";

export function login(data) {
  return {
    type: LOGIN,
    payload: {
      path: "auths.token",
      loader: apiLogin,
      data: data,
    },
  };
}

export function logout(data) {
  return {
    type: LOGOUT,
    payload: {
      path: "auths.token",
      loader: apiLogout,
      data: data,
    },
  };
}

export function loadUsers() {
  return {
    type: LOAD_USERS,
    payload: {
      path: "auths.userList",
      loader: apiLoadUsers,
    },
  };
}

export function getUserInfo(id) {
  return {
    type: GET_USER_INFO,
    payload: {
      path: "auths.userInfo",
      loader: apiGetUser,
      id: id,
    },
  };
}

export function addUser(data) {
  return {
    type: ADD_USER,
    payload: {
      path: "auths.editingUser",
      loader: apiAddUser,
      getUserLoader: apiGetUser,
      data,
    },
  };
}

export function deleteUser(id) {
  return {
    type: DELETE_USER,
    payload: {
      path: "auths.editingUser",
      loader: apiDeleteUser,
      id,
    },
  };
}

export function updateUser(data) {
  return {
    type: UPDATE_USER,
    payload: {
      path: "auths.editingUser",
      loader: apiUpdateUser,
      getUserLoader: apiGetUser,
      data,
    },
  };
}

export function resetExpireTime() {
  return {
    type: CLEARE_EXPIRE_TIME,
  };
}
