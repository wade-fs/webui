import { apiMultiUpload } from "..";

export async function apiUploadCertificate(uploadDatas) {
  const url = `api/settings/server/upload/certificate`; // new api
  return apiMultiUpload(url, uploadDatas);
}
