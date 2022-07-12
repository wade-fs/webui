import { apiDownload, apiMultiUpload } from "..";

export async function apiUploadDatebase(uploadData) {
  const url = `api/settings/database/upload`; // new api
  return apiMultiUpload(url, uploadData);
}

export async function apiDownloadDatebase() {
  const url = `api/settings/database/download`; // new api
  return apiDownload(url);
}
