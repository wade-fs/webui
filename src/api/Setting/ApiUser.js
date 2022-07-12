import { apiPost, apiGet, apiPut, apiDelete } from "..";

export async function apiLoadUsers() {
  const url = `api/settings/admin/user/list`;
  return apiGet(url);
}

export async function apiGetUser(id) {
  const url = `api/settings/admin/user/${id}`; // new api
  return apiGet(url);
}

export async function apiAddUser(data) {
  const url = `api/settings/admin/user`; // new api
  const newData = { ...data };
  newData["IdleTimeout"] = parseInt(data["IdleTimeout"]);
  newData["SessionTimeout"] = parseInt(data["SessionTimeout"]);
  return apiPost(url, newData);
}

export async function apiDeleteUser(id) {
  const url = `api/settings/admin/user/${id}`; // new api
  return apiDelete(url);
}

export async function apiUpdateUser(id, data) {
  const url = `api/settings/admin/user/${id}`; // new api
  const newData = { ...data };
  newData["IdleTimeout"] = parseInt(data["IdleTimeout"]);
  newData["SessionTimeout"] = parseInt(data["SessionTimeout"]);
  return apiPut(url, newData);
}
