import { apiPost } from "..";

export async function apiLogin(data) {
  const url = `api/auth/login`;
  return apiPost(url, data);
}

export async function apiLogout(data) {
  const url = `api/auth/logout`;
  return apiPost(url, data);
}
