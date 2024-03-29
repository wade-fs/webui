import { DefaultAppOverride, DefaultVncOverride, DefaultOverride } from "const/Terminals/Override";

import { apiGetAppList, apiGetAppOverride } from "api";

export async function getAppOverride(editingId = 0) {
  const res = await apiGetAppList();
  const appList = Array.isArray(res.data.RDS) ? res.data.RDS.concat(res.data.VNC) : res.data.VNC;
 
  let mappingData = appList.reduce((acc, cur) => {
    acc[cur.Id] = {};
    acc[cur.Id] = convertAppToOverride(cur);
    acc[cur.Id].Id = 0;
    return acc;
  }, {});

  if (editingId !== 0) {
    const response = await apiGetAppOverride(editingId);
    if (Array.isArray(response.data) && response.data.length > 0) {
      const overrideList = response.data;
      for await (const item of overrideList) {
        mappingData[item.AppId] = item;
      }
    }
  }
  const appData = {
    appData: mappingData,
  };
  return appData;
}

function convertAppToOverride(app) {
  if (app.GroupType === "RDS") {
    const res = Object.keys(DefaultAppOverride).reduce((acc, key) => {
      if (key === "AppId") {
        acc[key] = app.Id;
      } else if (app[key] != null) {
        acc[key] = app[key];
      } else {
        acc[key] = DefaultAppOverride[key];
      }
      return acc;
    }, {});
    return res;
  } else {
    const res = Object.keys(DefaultVncOverride).reduce((acc, key) => {
      if (key === "AppId") {
        acc[key] = app.Id;
      } else if (app[key] != null) {
        acc[key] = app[key];
      } else {
        acc[key] = DefaultVncOverride[key];
      }
      return acc;
    }, {});
    return res;
  }
}

export function findOverrideById(terminal, applications) {
  const appOverrides = Array.from(
    Array(terminal.NumberOfScreens).keys()
  ).reduce((acc, sId) => {
    terminal[`Screen${sId + 1}_Applications`].split(",").forEach((appId) => {
      const item = applications[appId];
      if (item !== undefined) {
        acc.push(item);
      }
    });
    return acc;
  }, []);
  return appOverrides;
}

export async function checkAppOverride(appOverrides) {
  return appOverrides;
/*
  let updateData = JSON.parse(JSON.stringify(appOverrides));
  let idx = 0;
  
  for await (const item of appOverrides) {
    Object.keys(DefaultOverride).forEach((key) => {
      if (item[key] === undefined) {
        updateData[idx][key] = DefaultOverride[key];
      }
    });
    delete updateData[idx]["IsGroup"];
    delete updateData[idx]["Favorite"];
    delete updateData[idx]["ModifiedTS"];
    delete updateData[idx]["ParentId"];
    delete updateData[idx]["Resolution"];

    idx++;
  }
  return updateData;
*/
}
