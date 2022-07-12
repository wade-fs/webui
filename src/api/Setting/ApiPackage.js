import { apiGet, apiMultiUpload } from "..";

export async function apiUploadModules(uploadData) {
  const url = `api/upload/drivers`;
  return apiMultiUpload(url, uploadData);
}

export async function apiUploadSystem(uploadData) {
  const url = `api/upload/system`;
  return apiMultiUpload(url, uploadData);
}

export async function apiUploadTermcap(uploadData) {
  const url = `api/upload/termcap`;
  return apiMultiUpload(url, uploadData);
}

export async function apiGetFirmwarePackage() {
  const url = `api/settings/package/firmware-package/list`; // new api
  return apiGet(url);
}
