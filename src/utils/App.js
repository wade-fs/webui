import {
  SessionWidth,
  SessionHeight,
  ResolutionOptions,
} from "const/Applications/ApplicationFieldNames";

export function getAppResolution(data) {
  const dataResolution = `${data[SessionWidth]} x ${data[SessionHeight]}`;
  let resolution;
  for (const option of ResolutionOptions) {
    if (dataResolution === option) {
      resolution = option;
      break;
    }
  }
  return resolution ?? dataResolution;
}
