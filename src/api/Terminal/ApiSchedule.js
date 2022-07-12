import { apiPost, apiGet, apiPut, apiDelete } from "..";

export async function apiGetSchedule(id) {
  const url = `api/terminal/schedule/${id}`; // new api
  // const url = `api/object/schedulesetting/${id}`; //old api
  return apiGet(url);
}

export async function apiAddSchedule(schedule) {
  const url = `api/terminal/schedule`; // new api
  // const url = "api/object/schedulesetting/" + editingId; // old api
  return apiPost(url, schedule);
}

export async function apiUpdateSchedule(id, schedule) {
  const url = `api/terminal/schedule/${id}`; // new api
  // const url = "api/object/schedulesetting/" + editingId; // old api
  return apiPut(url, schedule);
}

export async function apiDeleteSchedule(id) {
  const url = `api/terminal/schedule/${id}`; // new api
  // const url = "api/object/schedulesetting/" + editingId; // old api
  return apiDelete(url);
}
