import {
  EnforceBootPriorityApplyAll,
  AllowShadowApplyAll,
} from "const/Terminals/Properties";

export function getApplyAllProperties(editingTerminal) {
  if (editingTerminal === undefined) return {};
  let applyAllProperties = {};
  if (
    editingTerminal.ApplyAllProperties !== undefined &&
    editingTerminal.ApplyAllProperties !== ""
  ) {
    const applyAllArray = editingTerminal.ApplyAllProperties.split(",");
    applyAllArray.forEach((item) => {
      if (item === "EnforceBootPriority") {
        applyAllProperties[item] = [...EnforceBootPriorityApplyAll];
      } else if (item === "AllowShadow") {
        applyAllProperties[item] = [...AllowShadowApplyAll];
      } else if (
        item !== "BootPriority" &&
        item !== "BootPriorityMaxWait" &&
        item !== "RebootDependentTerminals" &&
        item !== "ShadowMode" &&
        item !== "AllowInteractiveShadow"
      ) {
        applyAllProperties[item] = [item];
      }
    });
  }
  return applyAllProperties;
}

export function getDisabledProperties(parentTerminal) {
  if (parentTerminal === undefined) return {};
  let disabledApplyAllProperties = {};
  if (
    parentTerminal.ApplyAllProperties !== undefined &&
    parentTerminal.ApplyAllProperties !== ""
  ) {
    const disabledApplyAllPropertiesArray =
      parentTerminal.ApplyAllProperties.split(",");
    disabledApplyAllPropertiesArray.forEach((item) => {
      if (item === "EnforceBootPriority") {
        disabledApplyAllProperties[item] = [...EnforceBootPriorityApplyAll];
      } else if (item === "AllowShadow") {
        disabledApplyAllProperties[item] = [...AllowShadowApplyAll];
      } else if (
        item !== "BootPriority" &&
        item !== "BootPriorityMaxWait" &&
        item !== "RebootDependentTerminals" &&
        item !== "ShadowMode" &&
        item !== "AllowInteractiveShadow"
      ) {
        disabledApplyAllProperties[item] = [item];
      }
    });
  }
  return disabledApplyAllProperties;
}
