import { apiGet, apiDelete, apiDownload } from "..";

export async function apiGetServerLog(startDate, endDate, logLevel, logClass) {
  const url = `api/log/server/${startDate}/${endDate}/${logLevel}/${logClass}`;
  return apiGet(url);
}

export async function apiGetTerminalLog(
  startDate,
  endDate,
  logLevel,
  logClass,
  id
) {
  const url = `api/log/terminal/${startDate}/${endDate}/${logLevel}/${logClass}/${id}`;
  return apiGet(url);
}

export async function apiDownloadServerLog() {
  const url = "api/log/server/download";
  return apiDownload(url);
}

export async function apiDownloadTerminalLog(id) {
  const url = `api/log/terminal/download/${id}`;
  return apiDownload(url);
}

export async function apiDeleteServerLog() {
  const url = "api/log/server";
  return apiDelete(url);
}

export async function apiDeleteTerminalLog(id) {
  const url = `api/log/terminal/${id}`;
  return apiDelete(url);
}
