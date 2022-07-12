import ApiClient from "./ApiClient";

export function copyPackage(id, Name) {
  let pathParams = { id };
  let queryParams = {};
  let headerParams = {};
  let formParams = {};
  let postBody = { Name };
  let contentType = "application/json";
  let accept = "application/json";
  let returnType = "json";

  return ApiClient.callApi(
    "/settings/installedpackage/{id}",
    "POST",
    pathParams,
    queryParams,
    headerParams,
    formParams,
    postBody,
    contentType,
    accept,
    returnType
  );
}

export function deletePackage(id) {
  let pathParams = { id };
  let queryParams = {};
  let headerParams = {};
  let formParams = {};
  let postBody = {};
  let contentType = "application/json";
  let accept = "application/json";
  let returnType = "json";

  return ApiClient.callApi(
    "/settings/installedpackage/{id}",
    "DELETE",
    pathParams,
    queryParams,
    headerParams,
    formParams,
    postBody,
    contentType,
    accept,
    returnType
  );
}

export function downloadPackage(id) {
  let pathParams = { id };
  let queryParams = {};
  let headerParams = {};
  let formParams = {};
  let postBody = {};
  let contentType = "application/json";
  let accept = "application/json";
  let returnType = "json"; // TODO return type need to change?

  return ApiClient.callApi(
    "/settings/installedpackage/{id}",
    "GET",
    pathParams,
    queryParams,
    headerParams,
    formParams,
    postBody,
    contentType,
    accept,
    returnType
  );
}

export function loadPackages() {
  let pathParams = {};
  let queryParams = {};
  let headerParams = {};
  let formParams = {};
  let postBody = {};
  let contentType = "application/json";
  let accept = "application/json";
  let returnType = "json";

  return ApiClient.callApi(
    "/settings/installedpackage",
    "GET",
    pathParams,
    queryParams,
    headerParams,
    formParams,
    postBody,
    contentType,
    accept,
    returnType
  );
}

export function lockPackage(id, lock) {
  let pathParams = { id, lock };
  let queryParams = {};
  let headerParams = {};
  let formParams = {};
  let postBody = {};
  let contentType = "application/json";
  let accept = "application/json";
  let returnType = "json";

  return ApiClient.callApi(
    "/settings/installedpackage/{id}/{lock}",
    "PUT",
    pathParams,
    queryParams,
    headerParams,
    formParams,
    postBody,
    contentType,
    accept,
    returnType
  );
}

export function renamePackage(id, Name) {
  let pathParams = { id };
  let queryParams = {};
  let headerParams = {};
  let formParams = {};
  let postBody = { Name };
  let contentType = "application/json";
  let accept = "application/json";
  let returnType = "json";

  return ApiClient.callApi(
    "/settings/installedpackage/{id}",
    "PUT",
    pathParams,
    queryParams,
    headerParams,
    formParams,
    postBody,
    contentType,
    accept,
    returnType
  );
}

// Firmware package settings
export function loadFirmwareSettings(manufacturer, model) {
  let pathParams = { manufacturer, model };
  let queryParams = {};
  let headerParams = {};
  let formParams = {};
  let postBody = {};
  let contentType = "application/json";
  let accept = "application/json";
  let returnType = "json";

  return ApiClient.callApi(
    "/settings/{manufacturer}/{model}",
    "GET",
    pathParams,
    queryParams,
    headerParams,
    formParams,
    postBody,
    contentType,
    accept,
    returnType
  );
}
export function updateFirmwareSettings(manufacturer, model, data) {
  let pathParams = { manufacturer, model };
  let queryParams = {};
  let headerParams = {};
  let formParams = {};
  let postBody = data;
  let contentType = "application/json";
  let accept = "application/json";
  let returnType = "json";

  return ApiClient.callApi(
    "/settings/{manufacturer}/{model}",
    "PUT",
    pathParams,
    queryParams,
    headerParams,
    formParams,
    postBody,
    contentType,
    accept,
    returnType
  );
}
