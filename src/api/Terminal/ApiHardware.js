import { apiGet } from "..";

export async function apiGetDisplayOptions(manufacturer, model) {
  const url = `api/terminal/display/options/${manufacturer}/${model}`; // new api
  return apiGet(url);
}

export async function apiGetDisplayTermcap(manufacturer, model) {
  const url = `api/terminal/display/termcap/${manufacturer}/${model}`; // new api
  return apiGet(url);
}

export async function apiGetDisplayLimit(manufacturer, model) {
  const url = `api/terminal/display/limit/${manufacturer}/${model}`; // new api
  // return type { display: [maxPort, maxTotalWidth, maxTotalHeight] }
  return apiGet(url);
}
