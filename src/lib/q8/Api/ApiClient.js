import { ApiDelay, ApiEndpoint, Timeout } from "const/Env";

import store from "store";

import superagent from "superagent";
import querystring from "querystring";

class ApiClient {
  constructor() {
    this.basePath = `${ApiEndpoint}`.replace(/\/+$/, "");
    this.defaultHeaders = {};
    this.timeout = Timeout;
    this.cache = true;
  }

  buildUrl(path, pathParams) {
    if (!path.match(/^\//)) {
      path = "/" + path;
    }

    const url = this.basePath + path;
    url = url.replace(/\{([\w-]+)\}/g, (fullMatch, key) => {
      let value;
      if (pathParams.hasOwnProperty(key)) {
        value = ApiClient.paramToString(pathParams[key]);
      } else {
        value = fullMatch;
      }

      return encodeURIComponent(value);
    });

    return url;
  }
  /**
   * Invokes the REST service using the supplied settings and parameters.
   * @param {String} path The base URL to invoke.
   * @param {String} httpMethod The HTTP method to use.
   * @param {Object.<String, String>} pathParams A map of path parameters and their values.
   * @param {Object.<String, Object>} queryParams A map of query parameters and their values.
   * @param {Object.<String, Object>} headerParams A map of header parameters and their values.
   * @param {Object.<String, Object>} formParams A map of form parameters and their values.
   * @param {Object} bodyParam The value to pass as the request body.
   * @param {Array.<String>} contentType request MIME type.
   * @param {Array.<String>} accepts An array of acceptable response MIME types.
   * @param {(String|Array|ObjectFunction)} returnType The required type to return; can be a string for simple types or the
   * constructor for a complex type.
   * @returns {Promise} A {@link https://www.promisejs.org/|Promise} object.
   */
  callApi(
    path,
    httpMethod,
    pathParams,
    queryParams,
    headerParams,
    formParams,
    bodyParam,
    contentType,
    accepts,
    returnType
  ) {
    const url = this.buildUrl(path, pathParams);
    let request = superagent(httpMethod, url);
    let states = store.getState();
    let token = states.auths.token.data;
    if (token != null) {
      headerParams["t"] = token;
    }

    // set query parameters
    if (httpMethod.toUpperCase() === "GET" && this.cache === false) {
      queryParams["_"] = new Date().getTime();
    }

    request.query(ApiClient.normalizeParams(queryParams));

    // set header parameters
    request
      .set(this.defaultHeaders)
      .set(ApiClient.normalizeParams(headerParams));

    // set request timeout
    request.timeout(this.timeout);

    if (contentType) {
      // Issue with superagent and multipart/form-data (https://github.com/visionmedia/superagent/issues/746)
      if (contentType != "multipart/form-data") {
        request.type(contentType);
      }
    } else if (!request.header["Content-Type"]) {
      request.type("application/json");
    }

    if (contentType === "application/x-www-form-urlencoded") {
      request.send(querystring.stringify(this.normalizeParams(formParams)));
    } else if (contentType == "multipart/form-data") {
      let _formParams = ApiClient.normalizeParams(formParams);
      for (let key in _formParams) {
        if (_formParams.hasOwnProperty(key)) {
          if (ApiClient.isFileParam(_formParams[key])) {
            // file field
            request.attach(key, _formParams[key]);
          } else {
            request.field(key, _formParams[key]);
          }
        }
      }
    } else if (bodyParam) {
      request.send(bodyParam);
    }
    return new Promise((resolve, reject) => {
      request.end((error, response) => {
        if (error) {
          setTimeout(() => {
            reject(error);
          }, ApiDelay);
        } else {
          try {
            let data = ApiClient.deserialize(response, returnType);
            setTimeout(() => {
              resolve({
                data,
                response,
              });
            }, ApiDelay);
          } catch (err) {
            setTimeout(() => {
              reject(err);
            }, ApiDelay);
          }
        }
        if (error) {
          console.error("api %s with "+error);
        }
      });
    });
  }

  static paramToString(param) {
    if (param == undefined || param == null) return "";
    if (param instanceof Date) return param.toJSON();

    return param.toString();
  }

  static parseDate(str) {
    return new Date(str.replace(/T/i, " "));
  }

  static isFileParam(param) {
    // Blob in browser
    if (typeof Blob === "function" && param instanceof Blob) {
      return true;
    }

    // File in browser (it seems File object is also instance of Blob, but keep this for safe)
    if (typeof File === "function" && param instanceof File) {
      return true;
    }

    return false;
  }

  static convertToType(data, type) {
    if (data === null || data === undefined) return data;

    switch (type) {
      case "Json":
        return JSON.parse(data);
      case "Boolean":
        return Boolean(data);
      case "Integer":
        return parseInt(data, 10);
      case "Number":
        return parseFloat(data);
      case "String":
        return String(data);
      case "Date":
        return ApiClient.parseDate(String(data));
      case "Blob":
        return data;
      default:
        if (type === Object) {
          return data;
        } else if (typeof type === "function") {
          return type(data);
        } else if (Array.isArray(type)) {
          // for array type like: ['String']
          let itemType = type[0];
          return data.map((item) => {
            return ApiClient.convertToType(item, itemType);
          });
        } else if (typeof type === "object") {
          // for plain object type like: {'String': 'Integer'}
          var keyType, valueType;
          for (var k in type) {
            if (type.hasOwnProperty(k)) {
              keyType = k;
              valueType = type[k];
              break;
            }
          }

          var result = {};
          for (var k in data) {
            if (data.hasOwnProperty(k)) {
              var key = ApiClient.convertToType(k, keyType);
              var value = ApiClient.convertToType(data[k], valueType);
              result[key] = value;
            }
          }
          return result;
        } else {
          return data;
        }
    }
  }

  static constructFromObject(data, obj, itemType) {
    if (Array.isArray(data)) {
      for (var i = 0; i < data.length; i++) {
        if (data.hasOwnProperty(i))
          obj[i] = ApiClient.convertToType(data[i], itemType);
      }
    } else {
      for (var k in data) {
        if (data.hasOwnProperty(k))
          obj[k] = ApiClient.convertToType(data[k], itemType);
      }
    }
  }

  static normalizeParams(params) {
    let newParams = {};
    for (let key in params) {
      if (
        params.hasOwnProperty(key) &&
        params[key] != undefined &&
        params[key] != null
      ) {
        let value = params[key];
        if (ApiClient.isFileParam(value) || Array.isArray(value)) {
          newParams[key] = value;
        } else {
          newParams[key] = ApiClient.paramToString(value);
        }
      }
    }

    return newParams;
  }

  static deserialize(response, returnType) {
    if (response == null || returnType == null || response.status == 204) {
      return null;
    }

    // Rely on SuperAgent for parsing response body.
    // See http://visionmedia.github.io/superagent/#parsing-response-bodies
    var data = response.body;
    if (
      data == null ||
      (typeof data === "object" &&
        typeof data.length === "undefined" &&
        !Object.keys(data).length)
    ) {
      // SuperAgent does not always produce a body; use the unparsed response as a fallback
      data = response.text;
    }

    return ApiClient.convertToType(data, returnType);
  }
}

// this is a singleton
export default new ApiClient();
