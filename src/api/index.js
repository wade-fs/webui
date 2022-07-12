import { apiGetWatchdog } from "../api/Others/ApiOthers";
import { API_SERVER_DOWN } from "../const/Message";
import { apiUrl } from "../const/Env";
export * from "./Application";
export * from "./Auth";
export * from "./Others";
export * from "./RDS-Server";
export * from "./Setting";
export * from "./Terminal";

export async function apiResponse(response) {
  try {
    if (response.status !== 200) {
      const errorUrl = response.url.split("/api/")[1];
      if (response?.data === API_SERVER_DOWN) {
      }
      throw Error(`API Fail: ${response?.data ?? errorUrl}`);
    }
    const result = await response.json();
    return { result: response.ok, data: result };
  } catch (err) {
    return { result: response.ok, data: err.message };
  }
}

export async function apiPost(url, data) {
  const jsonData = data !== null ? JSON.stringify(data) : null;
  const requestOptions = {
    method: "POST",
    body: jsonData,
    redirect: "follow",
  };
  try {
    if (url.startsWith("/")) {
      url = apiUrl+url;
    } else {
      url = apiUrl+"/"+url;
    }
    const res = await fetch(url, requestOptions);
    return apiResponse(res);
  } catch (e) {
    const res = {
      ok: false,
      status: 503,
      url: `/${url}`,
      data: "server is down",
    };
    return apiResponse(res);
  }
}

export async function apiGet(url) {
  const requestOptions = {
    method: "GET",
    redirect: "follow",
  };
  try {
    if (url.startsWith("/")) {
      url = apiUrl+url;
    } else {
      url = apiUrl+"/"+url;
    }
    const res = await fetch(url, requestOptions);
    return apiResponse(res);
  } catch (e) {
    const res = {
      ok: false,
      status: 503,
      url: `/${url}`,
      data: "server is down",
    };
    return apiResponse(res);
  }
}

export async function apiPut(url, data) {
  const jsonData = JSON.stringify(data);
  let myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  const requestOptions = {
    method: "PUT",
    headers: myHeaders,
    body: jsonData,
    redirect: "follow",
  };
  try {
    if (url.startsWith("/")) {
      url = apiUrl+url;
    } else {
      url = apiUrl+"/"+url;
    }
    const res = await fetch(url, requestOptions);
    return apiResponse(res);
  } catch (e) {
    const res = {
      ok: false,
      status: 503,
      url: `/${url}`,
      data: "server is down",
    };
    return apiResponse(res);
  }
}

export async function apiDelete(url) {
  const requestOptions = {
    method: "DELETE",
    redirect: "follow",
  };
  try {
    if (url.startsWith("/")) {
      url = apiUrl+url;
    } else {
      url = apiUrl+"/"+url;
    }
    const res = await fetch(url, requestOptions);
    return apiResponse(res);
  } catch (e) {
    const res = {
      ok: false,
      status: 503,
      url: `/${url}`,
      data: "server is down",
    };
    return apiResponse(res);
  }
}

export async function apiDownload(url) {
  const requestOptions = {
    method: "GET",
    redirect: "follow",
  };
  try {
    if (url.startsWith("/")) {
      url = apiUrl+url;
    } else {
      url = apiUrl+"/"+url;
    }
    const res = await fetch(url, requestOptions);
    try {
      const disposition = res.headers.get("content-disposition");
      const result = await res.blob();
      const fileName = disposition.split(";")[1].split("=")[1];
      let a = document.createElement("a");
      a.href = URL.createObjectURL(result);
      a.setAttribute("download", fileName);
      a.click();
      return { result: res.ok, data: fileName };
    } catch (err) {
      const errorUrl = res.url.split("/api/")[1];
      return { result: res.ok, data: `API Fail: ${errorUrl}` };
    }
  } catch (e) {
    const res = {
      ok: false,
      status: 503,
      url: `/${url}`,
      data: "server is down",
    };
    return apiResponse(res);
  }
}

export async function apiUpload(url, uploadData) {
  let data = new FormData();
  data.append("file", uploadData);
  const requestOptions = {
    method: "POST",
    body: data,
    redirect: "follow",
  };
  try {
    if (url.startsWith("/")) {
      url = apiUrl+url;
    } else {
      url = apiUrl+"/"+url;
    }
    const res = await fetch(url, requestOptions);
    return apiResponse(res);
  } catch (e) {
    const res = {
      ok: false,
      status: 503,
      url: `/${url}`,
      data: "server is down",
    };
    return apiResponse(res);
  }
}

export async function apiMultiUpload(url, uploadDatas) {
  let data = new FormData();
  Object.values(uploadDatas).forEach((file) => {
    data.append("files", file);
  });
  const requestOptions = {
    method: "POST",
    body: data,
    redirect: "follow",
  };
  try {
    if (url.startsWith("/")) {
      url = apiUrl+url;
    } else {
      url = apiUrl+"/"+url;
    }
    const res = await fetch(url, requestOptions);
    return apiResponse(res);
  } catch (e) {
    const res = {
      ok: false,
      status: 503,
      url: `/${url}`,
      data: "server is down",
    };
    return apiResponse(res);
  }
}
