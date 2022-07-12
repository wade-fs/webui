import { apiPost, apiGet, apiPut, apiDelete } from "..";

export async function apiGetAdServerList() {
  const url = `api/settings/server/ad-server/list`; // new api
  return apiGet(url);
}

export async function apiAddAdServer(data) {
  const url = `api/settings/server/ad-server`; // new api
  // const url = `api/other/adserver`;
  return apiPost(url, data);
}

export async function apiGetAdServer(id) {
  const url = `api/settings/server/ad-server/${id}`; // new api
  // const url = `api/other/adserver/${id}`;
  return apiGet(url);
}

export async function apiUpdateAdServer(id, data) {
  const url = `api/settings/server/ad-server/${id}`; // new api
  // const url = `api/other/adserver/${id}`;
  return apiPut(url, data);
}

export async function apiDeleteAdServer(id) {
  const url = `api/settings/server/ad-server/${id}`; // new api
  // const url = `api/other/adserver/${id}`;
  return apiDelete(url);
}
