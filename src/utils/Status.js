export function getTerminalStatus(type, data) {
  if (typeof type !== "string") type = "";
  const editingId = data?.Id ?? 0;
  const ip = data?.IpAddress ?? "";
  const mac = data?.MAC ?? "";
  const power = ip !== "";
  let status = data?.Status ?? "";
  status = status === "OFF" ? "F" : status;
  const disabled = data?.Disabled ?? false;
  const isNtr = editingId > 0 && status.indexOf("N") >= 0;
  const isNolic = editingId > 0 && status.indexOf("I") >= 0;
  const isBusy = editingId > 0 && status.indexOf("U") >= 0;
  const isDisabled = status.indexOf("D") >= 0;
  const isOff = status == "" || status.indexOf("F") >= 0;
  const isOffDisabled = isOff && isDisabled;
  const isActive = editingId > 0 && (status.indexOf("A") >= 0 || status.indexOf("L") >= 0);
  const isActiveDisabled = (isActive || isNolic) && isDisabled;
  const isActiveNtr = isActive && isNtr;
  const isActiveDisabledNtr = isActive && isDisabled && isNtr;
  const isActiveBusy = isBusy;
  const isBooting = status.indexOf("B") >= 0;
  const isBootingDisabled = isBooting && isDisabled;
  const isError = editingId > 0 && status.indexOf("E") >= 0;
  const isErrorDisabled = isError && isDisabled;
  const isErrorNtr = isError && isNtr;
  const isErrorDisabledNtr = isError && isDisabled && isNtr;
  console.log("status '"+status+"' for "+type+" ("+mac+","+isOff+","+isBooting+","+isError+","+isActive+","+isNolic+","+isDisabled+","+isNtr+","+isBusy+")");

  if (isActiveDisabled) return `${type}-terminal-active-disabled`;
  if (isOffDisabled) return `${type}-terminal-off-disabled`;
  if (isBootingDisabled) return `${type}-terminal-booting-disabled`;
  if (isBooting) return `${type}-terminal-booting`;
  if (isErrorDisabledNtr) return `${type}-terminal-error-disabled-restart`;
  if (isErrorDisabled) return `${type}-terminal-error-disabled`;
  if (isErrorNtr) return `${type}-terminal-error-restart`;
  if (isError) return `${type}-terminal-error`;
  if (isActiveDisabledNtr) return `${type}-terminal-active-disabled-restart`;
  if (isActiveNtr) return `${type}-terminal-active-restart`;
  if (isActiveBusy) return `${type}-terminal-active-busy`;
  if (isActive) return `${type}-terminal-active`;
  if (isNolic) return `${type}-terminal-booting-nolic`;
  return `${type}-terminal-off`;
}

export function getRdsServerStatus(type, data) {
  if (typeof type !== "string") type = "";
  if (data?.Error == null) return `${type}-rds-server`;
  switch (data?.Status ?? "") {
    case "":
      if (data["Error"] !== "") {
        return `${type}-rds-server-error`;
      }
      if (data.Disabled) {
        return `${type}-rds-server-disabled`;
      }
      return `${type}-rds-server`;
    default:
      return `${type}-rds-server`;
  }
}

export function getAppStatus(type, data) {
  if (typeof type !== "string") type = "";
  if (data?.Error == null) return `${type}-app`;
  switch (data?.Status ?? "") {
    case "":
      if (data["Error"] !== "") {
        return `${type}-app-error`;
      }
      return `${type}-app`;
    default:
      return `${type}-app`;
  }
}

export function checkExpandTitleError(data) {
  if (data?.Error == null) return "expand-list-card-title";
  if (data?.Error !== "") return "expand-list-card-title-error";
  return "expand-list-card-title";
}

export function checkExpandTerminalTitle(data) {
  if (data?.Error == null) return "expand-list-card-title";

  // TODO: 對各種圖示的判斷需要確認
  let status = data?.Status ?? "";
  let isOff = status == "" || status.indexOf("F") >= 0;
  let isBooting = status.indexOf("B") >= 0;
  let isError = status.indexOf("E") >= 0;
  let isActive = status.indexOf("A") >= 0;
  if (isOff) { return "expand-list-card-title"; }
  if (isBooting) { return "expand-list-card-title-booting"; }
  if (isError) { return "expand-list-card-title-error"; }
  if (isActive) { return "expand-list-card-title-active"; }

  return "expand-list-card-title";
}
