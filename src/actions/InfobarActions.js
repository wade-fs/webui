import { SHOW_INFO_BAR, HIDE_INFO_BAR } from "const/ActionType";

export function showInfoBar(infoMessage, infoType = "info") {
  // prevent type error
  let title = typeof infoMessage === "string" ? infoMessage : "";
  return {
    type: SHOW_INFO_BAR,
    payload: { title, infoType },
  };
}

export function hideInfoBar() {
  return {
    type: HIDE_INFO_BAR,
  };
}
