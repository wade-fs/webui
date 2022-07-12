import { apiPost, apiGet, apiPut, apiDelete } from "..";

export async function apiGetDHCPList() {
  const url = `api/settings/server/dhcp/list`; // new api
  return apiGet(url);
}

export async function apiAddDHCP(data) {
  const url = `api/settings/server/dhcp`; // new api
  // const url = `api/dhcp/RangeSet`;
  return apiPost(url, data);
}

export async function apiGetDHCP(id) {
  const url = `api/settings/server/dhcp/${id}`; // new api
  // const url = `api/dhcp/RangeSet/${id}`;
  return apiPost(url, data);
}

export async function apiDeleteDHCP(id) {
  const url = `api/settings/server/dhcp/${id}`; // new api
  // const url = `api/dhcp/RangeSet/${id}`;
  return apiDelete(url);
}

export async function apiUpdateDHCPRangeSet(id, data) {
  const url = `api/settings/server/dhcp/${id}/range-set`; // new api
  // const url = `api/dhcp/RangeSet/${id}`;
  return apiPut(url, data);
}

export async function apiUpdateDHCPExclusion(id, data) {
  const url = `api/settings/server/dhcp/${id}/exclusions`; // new api
  // const url = `api/dhcp/Exclusions/${id}`;
  return apiPut(url, data);
}

export async function apiUpdateDHCPReservation(id, data) {
  const url = `api/settings/server/dhcp/${id}/reservations`; // new api
  // const url = `api/dhcp/Reservations/${id}`;
  return apiPut(url, data);
}

export async function apiGetDHCPStatus() {
  const url = `api/settings/server/dhcp/status`; // new api
  return apiGet(url);
}

export async function apiSwitchDHCPStatus(action) {
  const url = `api/settings/server/dhcp/status/${action}`; // new api
  // const url = `api/dhcp/enable/${action}`;
  return apiPost(url, null);
}
