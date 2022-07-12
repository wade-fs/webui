import { apiPost, apiGet, apiPut, apiDelete } from "..";

// api get
export async function apiGetServer(id) {
  const url = `api/rds-server/${id}`; // new api
  return apiGet(url);
}

export async function apiGetServerGroup(id) {
  const url = `api/rds-server/group/${id}`; // new api
  return apiGet(url);
}

// api update
export async function apiUpdateServer(id, data, type) {
  const url =
    type === undefined
      ? `api/rds-server/${id}`
      : `api/rds-server/${type}/${id}`; // new api
  return apiPut(url, data);
}

export async function apiUpdateServerGroup(id, data, type) {
  const url =
    type === undefined
      ? `api/rds-server/group/${id}`
      : `api/rds-server/group/${type}/${id}`; // new api
  return apiPut(url, data);
}

// api add
export async function apiAddServer(data) {
  const url = `api/rds-server`; // new api
  // check data
  data.Favorite = data.Favorite ?? false;
  data.Disabled = data.Disabled ?? false;
  return apiPost(url, data);
}

export async function apiAddServerGroup(data) {
  const url = `api/rds-server/group`; // new api
  data.Favorite = data.Favorite ?? false;
  return apiPost(url, data);
}

// api delete
export async function apiDeleteServer(id) {
  const url = `api/rds-server/${id}`; // new api
  return apiDelete(url);
}

export async function apiDeleteServerGroup(id) {
  const url = `api/rds-server/group/${id}`; // new api
  return apiDelete(url);
}

export async function apiRestartTerminals(id, data) {
  const url = `api/rds-server/operate/refresh-terminals/${id}`; // new api
  return apiPost(url, data);
}
