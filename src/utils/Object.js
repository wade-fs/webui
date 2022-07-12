import { Id } from "../const/Terminals/TerminalFieldNames";
import { onDispatch } from "../pages/layout";

import { loadTerminals } from "../actions/TerminalActions";
import { loadServers } from "../actions/ServerActions";
import { loadApplications } from "../actions/ApplicationActions";

import {
  apiDeleteTerminal,
  apiGetTerminalList,
  apiDeleteServer,
  apiGetServerList,
  apiDeleteApp,
  apiGetAppList,
} from "api";

export function getObjectById(id, list) {
  if (id == null || list == null || list.data == null) return;
  const object = list.data.find((item) => item[Id] == id);
  return object;
}

export async function deleteObjects([items, type]) {
  const selectedItems = Object.entries(items).reduce(
    (acc, [id, isSelected]) => {
      if (isSelected) acc[id] = isSelected;
      return acc;
    },
    {}
  );
  let promises = [];
  switch (type) {
    case "terminal":
      promises = Object.keys(selectedItems).map((id) => {
        return apiDeleteTerminal(id);
      });
      break;
    case "server":
      promises = Object.keys(selectedItems).map((id) => {
        return apiDeleteServer(id);
      });
      break;
    case "application":
      promises = Object.keys(selectedItems).map((id) => {
        return apiDeleteApp(id);
      });
      break;
    default:
      break;
  }
  return Promise.all(promises)
    .then(async (results) => {
      let failResults = results.filter((res) => res.result === false);
      if (failResults.length > 0) throw Error(failResults[0].data);
      // get new object list
      let response;
      switch (type) {
        case "terminal":
          onDispatch(loadTerminals());
          break;
        case "server":
          onDispatch(loadServers());
          break;
        case "application":
          onDispatch(loadApplications());
          break;
        default:
          break;
      }
    })
    .catch((err) => {
      throw Error(err);
    });
}

// The [data] pass to base card need to in format { data: {} }
export function getDataForBaseCard(data) {
  return { data };
}

export function getUpdatedIndex(list, newList, currentIdx) {
  let upadtedIdx;

  if (
    !Array.isArray(list) ||
    !Array.isArray(newList) ||
    !typeof currentIdx === "number"
  )
    return -1;

  if (newList.length > list.length) {
    upadtedIdx = newList.length - 1;
  } else if (newList.length < list.length) {
    if (currentIdx - 1 > 0) {
      upadtedIdx = currentIdx - 1;
    } else if (newList.length === 0) {
      upadtedIdx = -1;
    } else {
      upadtedIdx = newList.length - 1;
    }
  } else {
    upadtedIdx = currentIdx;
  }

  return upadtedIdx;
}
