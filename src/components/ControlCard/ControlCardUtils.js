import {
  KeyboardFields,
  MouseFields,
  MouseOptions,
  MouseButtonMapping,
  None,
} from "const/Consts";

export function getMouseOptions(field, data) {
  let options = [...MouseOptions];
  MouseFields.forEach((mouseField) => {
    if (
      mouseField != field &&
      data.hasOwnProperty(mouseField) &&
      data[mouseField] != ""
    ) {
      options.splice(options.indexOf(data[mouseField]), 1);
    }
  });
  return ["", ...options];
}

export function getUiMouseData(
  data,
  defaultMouseMapping,
  path = MouseButtonMapping
) {
  let uiData = {};
  if (data == null && defaultMouseMapping == null) return uiData;
  if (data.hasOwnProperty(path)) {
    data[path]
      .toString()
      .split(",")
      .forEach((action, index) => {
        if (action != None) {
          uiData[action] = MouseOptions[index];
        }
      });
  }
  MouseFields.forEach((field) => {
    if (!uiData.hasOwnProperty(field)) {
      if (
        defaultMouseMapping[field] != null &&
        defaultMouseMapping[field] != "" &&
        defaultMouseMapping[field] != "NONE"
      ) {
        uiData[field] = defaultMouseMapping[field];
      }
    }
  });
  return uiData;
}

export function getServerMouseData(data, path = MouseButtonMapping) {
  let mouseButtonMapping =
    data[path] != null && typeof data[path] === "string"
      ? data[path].split(",")
      : Array.from({ length: 12 }, () => None);
  MouseFields.forEach((field) => {
    if (data.hasOwnProperty(field)) {
      let index = MouseOptions.indexOf(data[field]);
      if (index != -1) {
        mouseButtonMapping[index] = field;
      } else if (data[field] != "") {
        mouseButtonMapping[index] = None;
      }
    }
  });
  const formattedData = {
    [path]: mouseButtonMapping.join(","),
  };
  return formattedData;
}
