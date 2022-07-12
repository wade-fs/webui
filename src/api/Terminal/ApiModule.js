import { apiPost, apiGet, apiPut, apiDelete } from "..";

export async function apiGetModuleSettingList() {
  const url = `api/terminal/module/setting-list`; // new api
  return apiGet(url);
}

export async function apiGetModule(moduleId) {
  const url = `api/terminal/module/${moduleId}`; // new api
  return apiGet(url);
}

export async function apiAddModule(editingId, module) {
  const url = `api/terminal/module`; // new api
  // const url = "api/terminal/others/modulesetting"; // old api
  const moduleId = module["ModuleId"];
  const data = {
    ModuleId: moduleId,
    TerminalId: editingId,
    Options: module["Setting"],
  };

  return apiPost(url, data);
}

export async function apiUpdateModule(moduleId, module) {
  const url = `api/terminal/module/${moduleId}`; // new api
  // const url = "api/terminal/others/module/settings/" + moduleId; // old api
  let data = {
    Options: module["Setting"],
  };
  return apiPut(url, data);
}

export async function apiDeleteModule(moduleId) {
  const url = `api/terminal/module/${moduleId}`; // new api
  // const url = "api/terminal/others/modulesetting/" + moduleId; // old api
  return apiDelete(url);
}
