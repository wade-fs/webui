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
  const isDisabled = disabled || status.indexOf("D") >= 0;
  const isBusy = editingId > 0 && (status.indexOf("R") >= 0 ||
			status.indexOf("T") >= 0 || status.indexOf("P") >= 0 ||
            status.indexOf("O") >= 0);

  const isOff = status == "" || status.indexOf("F") >= 0;
  const isOffBusy = status.indexOf("W") >= 0;
  const isOffDisabled = isOff && isDisabled;

  const isBooting = status.indexOf("B") >= 0 || status.indexOf("W") >= 0 || status.indexOf("C") >= 0;
  const isBootingDisabled = isBooting && isDisabled;

  const isActive = editingId > 0 &&
	(status.indexOf("A") >= 0 || status.indexOf("E") < 0 && status.indexOf("L") >= 0);
  const isActiveDisabled = (isActive || isNolic) && isDisabled;
  const isActiveNtr = isActive && isNtr;
  const isActiveDisabledNtr = isActive && isDisabled && isNtr;
  const isActiveBusy = isActive && isBusy;

  const isError = editingId > 0 && status.indexOf("E") >= 0;
  const isErrorDisabled = isError && isDisabled;
  const isErrorNtr = isError && isNtr;
  const isErrorDisabledNtr = isError && isDisabled && isNtr;
  const isErrorBusy = isError && isBusy;

  const isNolic = editingId > 0 && status.indexOf("I") >= 0;
  const isNolicDisabled = isNolic && isDisabled;
  const isNolicNtr = isNolic && isNtr;
  const isNolicDisabledNtr = isNolic && isDisabled && isNtr;
  const isNolicBusy = isNolic && (isBusy || isBooting);

  let c = `${type}-terminal-off`;
  if (isErrorBusy) c = `${type}-terminal-error-busy`;
  else if (isErrorDisabledNtr) c = `${type}-terminal-error-disabled-restart`;
  else if (isErrorDisabled) c = `${type}-terminal-error-disabled`;
  else if (isErrorNtr) c = `${type}-terminal-error-restart`;
  else if (isError) c = `${type}-terminal-error`;

  else if (isActiveBusy) c = `${type}-terminal-active-busy`;
  else if (isActiveDisabledNtr) c = `${type}-terminal-active-disabled-restart`;
  else if (isActiveDisabled) c = `${type}-terminal-active-disabled`;
  else if (isActiveNtr) c = `${type}-terminal-active-restart`;
  else if (isActive) c = `${type}-terminal-active`;

  else if (isNolicBusy) c = `${type}-terminal-nolic-busy`;
  else if (isNolicDisabledNtr) c = `${type}-terminal-nolic-disabled-restart`;
  else if (isNolicDisabled) c = `${type}-terminal-nolic-disabled`;
  else if (isNolicNtr) c = `${type}-terminal-nolic-restart`;
  else if (isNolic) c = `${type}-terminal-nolic`;

  else if (isOffDisabled) c = `${type}-terminal-off-disabled`;
  else if (isOffBusy) c = `${type}-terminal-off-busy`;

  else if (isBootingDisabled) c = `${type}-terminal-booting-disabled`;
  else if (isBooting) c = `${type}-terminal-booting`;
  else if (isBusy) c = `${type}-terminal-active-busy`;

//  if (mac != "" && status != "F") {
//    console.log("status '"+status+"' for "+type+" ("+mac+","+isOff+","+isBooting+","+isError+","+isActive+","+isNolic+","+isDisabled+","+isNtr+","+isBusy+") "+c);
//  }
  return c;
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
