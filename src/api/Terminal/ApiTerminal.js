import { apiPost, apiGet, apiPut, apiDelete } from "..";

import { generateScreenOfAppIds } from "../../utils/Display";

export async function apiGetTerminalGroup(id) {
  const url = `api/terminal/group/${id}`; // new api
  return apiGet(url);
}

export async function apiGetTerminalAbout(id) {
  const url = `api/terminal/about/${id}`; // new api
  return apiGet(url);
}

// api update
export async function apiUpdateTerminal(id, updateData, type) {
  const url =
    type === undefined ? `api/terminal/${id}` : `api/terminal/${type}/${id}`; // new api
  // update ScreenOfAppIds
  const hasScreenIds = Object.keys(updateData).includes("_Applications");
  if (hasScreenIds)
    updateData["ScreenOfAppIds"] = generateScreenOfAppIds(updateData);
  if (updateData.hasOwnProperty("MAC"))
    updateData["MAC"] = updateData["MAC"]?.toUpperCase() ?? "";
  return apiPut(url, updateData);
}

export async function apiUpdateTerminalGroup(id, updateData, type) {
  const url =
    type === undefined
      ? `api/terminal/group/${id}`
      : `api/terminal/group/${type}/${id}`; // new api
  return apiPut(url, updateData);
}

// api add
export async function apiAddTerminal(data) {
  const url = "api/terminal"; // new api;
  // add ScreenOfAppIds
  data["ScreenOfAppIds"] = generateScreenOfAppIds(data);
  if (data.hasOwnProperty("MAC"))
    data["MAC"] = data["MAC"]?.toUpperCase() ?? "";
  return apiPost(url, data);
}

export async function apiAddTerminalGroup(data) {
  const url = "api/terminal/group"; // new api;
  return apiPost(url, data);
}

// api delete
export async function apiDeleteTerminal(id) {
  const url = `api/terminal/${id}`; // new api
  return apiDelete(url);
}

export async function apiDeleteTerminalGroup(id) {
  const url = `api/terminal/group/${id}`; // new api
  return apiDelete(url);
}

// api get
export async function apiGetTerminal(id) {
  const url = `api/terminal/${id}`; // new api
  return await apiGet(url);
}

// api operate
export async function apiOperateTerminal(id, action) {
  if (action === "poweroff") action = "power-off";
  if (action === "poweron") action = "power-on";
  const url = `api/terminal/operate/${action}/${id}`; // new api
  return await apiPost(url, null);
}
