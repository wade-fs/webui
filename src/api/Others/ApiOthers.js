import { apiPost, apiGet } from "..";

export async function apiGetProductInfo() {
  const url = "api/other/product/version";
  return apiGet(url);
}

export async function apiGetSupportDevices() {
  const url = "api/other/terminal/support-devices";
  return apiGet(url);
}

export async function apiLoadAdUsers(data) {
  const url = `api/other/aduser/list`;
  return apiPost(url, data);
}

export async function apiVerifyAuthAdUser(data) {
  const url = `api/other/aduser/verify`;
  return apiPost(url, data);
}

export async function apiGetWatchdog() {
  const url = "api/other/system/watch-dog";
  return apiGet(url);
}
