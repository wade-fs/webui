import { TERMINAL_MAC_ERROR } from "../../const/Message";

export function nameValidator(str) {
  const errorDescription =
    "Head and tail can't be blank( ), and only include letters, numbers, blank( ), hyphen(-) and underscore(_).";
  const match =
    /^[0-9a-zA-Z\-\_]$|^[0-9a-zA-Z\-\_][0-9a-zA-Z\-\_\ ]*[0-9a-zA-Z\-\_]$/;
  if (!match.test(str)) return errorDescription;
  return null;
}

export function ipValid(ipAddress, require) {
  if (ipAddress != null && ipAddress !== "") {
    const errorDescription = "IP format is wrong";
    const regex =
      /^(1?[0-9]{1,2}|2[0-4][0-9]|25[0-5])\.(1?[0-9]{1,2}|2[0-4][0-9]|25[0-5])\.(1?[0-9]{1,2}|2[0-4][0-9]|25[0-5])\.(1?[0-9]{1,2}|2[0-4][0-9]|25[0-5])$/;
    const isValid = regex.test(ipAddress);
    const ipLength = (ipAddress.match(/\./g) || []).length;
    if (require) {
      if (ipLength > 2 && ipAddress[ipAddress.length - 1] !== ".") {
        if (!isValid) {
          return errorDescription;
        }
      } else {
        return "";
      }
    } else {
      if (!isValid && ipAddress !== "") {
        if (ipLength > 2 && ipAddress[ipAddress.length - 1] !== ".") {
          if (!isValid) {
            return errorDescription;
          }
        } else {
          return "";
        }
      }
    }
  }
  return null;
}

export function ipValidRealTime(ipAddress) {
  const errorDescription = "IP format is wrong";
  const regex =
    /^(1?[0-9]{1,2}|2[0-4][0-9]|25[0-5])\.(1?[0-9]{1,2}|2[0-4][0-9]|25[0-5])\.(1?[0-9]{1,2}|2[0-4][0-9]|25[0-5])\.(1?[0-9]{1,2}|2[0-4][0-9]|25[0-5])$/;
  const isValid = regex.test(ipAddress);

  if (!isValid) {
    return errorDescription;
  }
  return null;
}

export function macValidRealTime(MacAddress) {
  const errorDescription = "Mac Address format is wrong";
  const regex =
    /^((([a-fA-F0-9][a-fA-F0-9]+[-]){5}|([a-fA-F0-9][a-fA-F0-9]+[:]){5})([a-fA-F0-9][a-fA-F0-9])$)|(^([a-fA-F0-9][a-fA-F0-9][a-fA-F0-9][a-fA-F0-9]+[.]){2}([a-fA-F0-9][a-fA-F0-9][a-fA-F0-9][a-fA-F0-9]))$/;
  const isValid = regex.test(MacAddress);

  if (!isValid) {
    return errorDescription;
  }
  return null;
}

export function macValidator(str) {
  if (str.length > 12) {
    const formatMac = document.getElementById("uMAC");
    const subString = str.substr(0, str.length - 1);
    formatMac.value = subString;
    return TERMINAL_MAC_ERROR;
  }
  const match = /^[0-9A-Fa-f]{12}$/;
  if (str !== "" && str.length > 11) {
    if (!match.test(str)) return TERMINAL_MAC_ERROR;
    return null;
  } else {
    return null;
  }
}

export function macSecondValidator(str) {
  if (str.length > 12) {
    const formatMac = document.getElementById("uSecondaryMAC");
    const subString = str.substr(0, str.length - 1);
    formatMac.value = subString;
    return TERMINAL_MAC_ERROR;
  }
  const match = /^[0-9A-Fa-f]{12}$/;
  if (str !== "" && str.length > 11) {
    if (!match.test(str)) return TERMINAL_MAC_ERROR;
    return null;
  } else {
    return null;
  }
}

export function emailValid(EmailAddress) {
  const errorDescription = "Email Address format is wrong";
  const regex =
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  const isValid = regex.test(EmailAddress);

  if (!isValid) {
    return errorDescription;
  }
  return null;
}

export function nullValid(value) {
  const errorDescription = "Please input value";
  let isValid = value.length > 0 ? true : false;
  if (!isValid) {
    return errorDescription;
  }
  return null;
}

export function positiveNumberValidator(str) {
  const error = "Please input positive number!";
  // positive integer
  const re = /^[1-9]\d*$/;
  const spiltString = re.test(str);
  if (!spiltString) {
    return error;
  } else {
    return null;
  }
}

export function minuteHourValidator(str) {
  const error = "Please input 0 or above number!";
  if (str < 0) {
    return error;
  } else {
    return null;
  }
}
