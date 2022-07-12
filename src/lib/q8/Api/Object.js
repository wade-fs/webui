import ApiClient from "./ApiClient";
import { NeedToRestart } from "const/Terminals/TerminalFieldNames";

export function createObject(type, data, options = {}) {
  // verify the required parameter 'type' is set
  if (type === undefined || type === null) {
    throw new Error(
      "Missing the required parameter 'type' when calling createObject"
    );
  }
  // verify the required parameter 'type' is set
  if (data === undefined || data === null) {
    throw new Error(
      "Missing the required parameter 'data' when calling createObject"
    );
  }
  let pathParams = {
    type,
  };
  let queryParams = {};
  let headerParams = {};
  let { transactionId } = options;
  if (transactionId != null) {
    headerParams["tid"] = transactionId;
  }
  let formParams = {};
  let postBody = data;
  let contentType = "application/json";
  let accept = [];
  let returnType = "json";

  if (type === "terminal") {
    data[NeedToRestart] = false;
  }

  return ApiClient.callApi(
    "/object/{type}",
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

export function deleteObject(type, id) {
  // verify the required parameter 'type' is set
  if (type === undefined || type === null) {
    throw new Error(
      "Missing the required parameter 'type' when calling deleteObject"
    );
  }
  // verify the required parameter 'id' is set
  if (id == undefined || id == null) {
    throw new Error(
      "Missing the required parameter 'id' when calling deleteObject"
    );
  }

  let pathParams = {
    type,
    id,
  };
  let queryParams = {};
  let headerParams = {};
  let formParams = {};
  let postBody = null;
  let contentType = "application/json";
  let accept = "application/json";
  let returnType = "json";

  return ApiClient.callApi(
    "/object/{type}/{id}",
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

export function getObject(type, id) {
  // verify the required parameter 'type' is set
  if (type === undefined || type === null) {
    throw new Error(
      "Missing the required parameter 'type' when calling getObject"
    );
  }
  // verify the required parameter 'id' is set
  if (id == undefined || id == null) {
    throw new Error(
      "Missing the required parameter 'id' when calling getObject"
    );
  }

  let pathParams = {
    type,
    id,
  };
  let queryParams = {};
  let headerParams = {};
  let formParams = {};
  let postBody = null;
  let contentType = "application/json";
  let accept = "application/json";
  let returnType = "json";

  return ApiClient.callApi(
    "/object/{type}/{id}",
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

export function loadObjects(type) {
  // verify the required parameter 'type' is set
  if (type === undefined || type === null) {
    throw new Error(
      "Missing the required parameter 'type' when calling loadObjects"
    );
  }

  let pathParams = {
    type,
  };
  let queryParams = {};
  let headerParams = {};
  let formParams = {};
  let postBody = null;
  let contentType = "application/json";
  let accept = "application/json";
  let returnType = "json";

  return ApiClient.callApi(
    "/object/{type}",
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

export function updateObject(type, id, data, options = {}) {
  // verify the required parameter 'type' is set
  if (type === undefined || type === null) {
    throw new Error(
      "Missing the required parameter 'type' when calling updateObject"
    );
  }
  // verify the required parameter 'id' is set
  if (id == undefined || id == null) {
    throw new Error(
      "Missing the required parameter 'id' when calling updateObject"
    );
  }
  // verify the required parameter 'id' is set
  if (data == undefined || data == null) {
    throw new Error(
      "Missing the required parameter 'data' when calling updateObject"
    );
  }

  let { applyAll, transactionId } = options;
  let pathParams = {
    type,
    id,
  };
  let queryParams = {};
  if (applyAll != null) {
    queryParams["applyAll"] = applyAll;
  }
  let headerParams = {};
  if (transactionId != null) {
    headerParams["tid"] = transactionId;
  }
  let formParams = {};
  let postBody = data;
  let contentType = "application/json";
  let accept = "application/json";
  let returnType = "json";
  if (type === "terminal") {
    data[NeedToRestart] = false;
  }
  return ApiClient.callApi(
    "/object/{type}/{id}",
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
