import { objectEqual, stringValid } from "lib/Util";
import { Name, ParentId } from "const/Terminals/TerminalFieldNames";
import { LOADING } from "const/DataLoaderState.js";

export function checkEdit(data, oriData) {
  if (oriData == null) return true;
  if (Object.keys(data).length !== Object.keys(oriData).length) return true;
  const edited = Object.keys(oriData).some(
    (key) => key !== "Id" && oriData[key] != data[key]
  );
  return edited;
}

export function checkListEdit(list, oriList) {
  if (oriList == null) return true;
  if (list.length !== oriList.length) return true;
  const listEdit = list.some((item, index) =>
    Object.keys(item).some(
      (key) => key !== "Id" && list[index][key] !== oriList[index][key]
    )
  );
  return listEdit;
}

export function checkDuplicateName(name, parentId, list) {
  if (!stringValid(name)) return false;
  let noDuplicate;
  if (parentId != null) {
    noDuplicate = list.data
      .filter((item) => item[ParentId] === parentId)
      .every((item) => item[Name] != name);
  } else {
    noDuplicate = list.data.every((item) => item[Name] != name);
  }
  return !noDuplicate;
}

export function isDataUpdated(data, oriData) {
  return (
    data.state != LOADING && data.data != null && !objectEqual(data, oriData)
  );
}

export function isInheritedFromParent(parentTerminal, key) {
  if (parentTerminal == null) return false;
  if (parentTerminal[key] === true) return true;
  return false;
}
