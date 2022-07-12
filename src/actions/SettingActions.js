import {
  // Package actions.
  COPY_PACKAGE,
  DELETE_PACKAGE,
  DOWNLOAD_PACKAGE,
  LOAD_PACKAGES,
  LOCK_PACKAGE,
  RENAME_PACKAGE,

  // Firmware package settings
  LOAD_FIRMWARE_SETTINGS,
  UPDATE_FIRMWARE_SETTING,

  // License
  LOAD_LICENSES,
  REQUEST_LICENSE,
  CLEAR_INSTALLED_ID,
} from "const/ActionType";
import {
  // Package actions.
  copyPackage as apiCopyPackage,
  deletePackage as apiDeletePackage,
  downloadPackage as apiDownloadPackage,
  loadPackages as apiLoadPackages,
  lockPackage as apiLockPackage,
  renamePackage as apiRenamePackage,

  // Firmware package settings
  loadFirmwareSettings as apiLoadFirmwareSettings,
  updateFirmwareSettings as apiUpdateFirmwareSettings,
} from "lib/q8/Api";
import { apiLoadLicenses, apiRequestLicense } from "api";

// Package actions.
export function copyPackage(id, name) {
  return {
    type: COPY_PACKAGE,
    payload: {
      path: "settings.packages.packageList",
      loader: apiCopyPackage,
      id,
      name,
    },
  };
}

export function deletePackage(id) {
  return {
    type: DELETE_PACKAGE,
    payload: {
      path: "settings.packages.packageList",
      loader: apiDeletePackage,
      id,
    },
  };
}

export function downloadPackage(id) {
  return {
    type: DOWNLOAD_PACKAGE,
    payload: {
      path: "settings.packages.packageList", // what path shold use?
      loader: apiDownloadPackage,
      id,
    },
  };
}

export function loadPackages() {
  return {
    type: LOAD_PACKAGES,
    payload: {
      path: "settings.packages.packageList",
      loader: apiLoadPackages,
    },
  };
}

export function lockPackage(id, lock) {
  return {
    type: LOCK_PACKAGE,
    payload: {
      path: "settings.packages.packageList",
      loader: apiLockPackage,
      id,
      lock,
    },
  };
}

export function renamePackage(id, name) {
  return {
    type: RENAME_PACKAGE,
    payload: {
      path: "settings.packages.packageList",
      loader: apiRenamePackage,
      id,
      name,
    },
  };
}

// Firmware package settings
export function loadFirmwareSettings(manufacturer, model) {
  return {
    type: LOAD_FIRMWARE_SETTINGS,
    payload: {
      path: "settings.packages.firmwareSettings",
      loader: apiLoadFirmwareSettings,
      manufacturer,
      model,
    },
  };
}

export function updateFirmwareSettings(manufacturer, model, data) {
  return {
    type: UPDATE_FIRMWARE_SETTING,
    payload: {
      path: "settings.packages.firmwareSettings",
      loader: apiUpdateFirmwareSettings,
      manufacturer,
      model,
      data,
    },
  };
}

// License
export function loadLicenses() {
  return {
    type: LOAD_LICENSES,
    payload: {
      path: "settings.license.licenseList",
      loader: apiLoadLicenses,
    },
  };
}

export function requestLicense(licenseId) {
  return {
    type: REQUEST_LICENSE,
    payload: {
      path: "settings.license.installedId",
      loader: apiRequestLicense,
      licenseId,
    },
  };
}

export function clearInstalledId() {
  return {
    type: CLEAR_INSTALLED_ID,
    payload: {
      path: "settings.license.installedId",
    },
  };
}
