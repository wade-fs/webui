import { apiPost, apiGet, apiPut, apiDelete } from "..";
import { checkAppOverride } from "utils/Override";

export async function apiUpdateAppOverride(appOverrides, terminalId) {
  const url = `api/terminal/display/overrides/${terminalId}`; // new api
  const data = await checkAppOverride(appOverrides);
  return apiPut(url, data);
}

export async function apiGetAppOverride(terminalId) {
  const url = `api/terminal/display/overrides/${terminalId}`; // new api
  return apiGet(url);
}
