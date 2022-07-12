import { apiPost, apiGet, apiMultiUpload } from "..";

export async function apiLoadLicenses() {
  const url = `api/settings/license/list`;
  return apiGet(url);
}

export async function apiRequestLicense(licenseId) {
  const url = `api/settings/license/request/${licenseId}`; // new api
  // const url = `api/license/request/${licenseId}`;
  return apiPost(url, licenseId);
}

export async function apiUploadLicense(uploadData) {
  const url = `api/settings/license/upload`; // new api
  // const url = `api/upload/license`;
  return apiMultiUpload(url, uploadData);
}
