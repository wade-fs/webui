import { apiGet } from "..";

export async function apiGetList(type) {
  const url = `api/${type}/list`;
  return apiGet(url);
}

export async function apiGetTerminalList() {
  return apiGetList("terminal");
}

export async function apiGetTerminalGroupList() {
  return apiGetList("terminal/group"); // new api
}

export async function apiGetServerList() {
  return apiGetList("rds-server"); // new api
}

export async function apiGetServerGroupList() {
  return apiGetList("rds-server/group"); // new api
}

export async function apiGetAppList() {
  return apiGetList("application");
}

export async function apiGetAppGroupList() {
  return apiGetList("application/group"); // new api
}
