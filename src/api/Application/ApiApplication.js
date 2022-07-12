import { apiPost, apiGet, apiPut, apiDelete } from "..";

// api get
export async function apiGetApp(id) {
  const url = `api/application/${id}`; // new api
  return apiGet(url);
}

export async function apiGetAppGroup(id) {
  const url = `api/application/group/${id}`; // new api
  return apiGet(url);
}

// api add
export async function apiAddApp(data) {
  const url = `api/application`; // new api
  return apiPost(url, data);
}

export async function apiAddAppGroup(data) {
  const url = `api/application/group`; // new api
  data["Favorite"] = false;
  return apiPost(url, data);
}

// api update
export async function apiUpdateApp(id, data, type) {
  const url =
    type === undefined
      ? `api/application/${id}`
      : `api/application/${type}/${id}`; // new api
  return apiPut(url, data);
}

export async function apiUpdateAppGroup(id, data, type) {
  const url =
    type === undefined
      ? `api/application/group/${id}`
      : `api/application/group/${type}/${id}`; // new api
  return apiPut(url, data);
}

// api delete
export async function apiDeleteApp(id) {
  const url = `api/application/${id}`; // new api
  return apiDelete(url);
}

export async function apiDeleteAppGroup(id) {
  const url = `api/application/group/${id}`; // new api
  return apiDelete(url);
}
