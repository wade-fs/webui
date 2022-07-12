import {
  ALL,
  LICENSE_SETTING,
  LICENSE,
  UPLOAD_LICENSE,
//  INSTALL_DRIVERS,
  INSTALL_SYSTEM,
  PACKAGE_SETTING,
//  FIRMWARE_PACKAGE,
//  TERMCAP,
  SERVER_SETTING,
  DHCP,
  ACTIVE_DIRECTORY,
  SERVER_CERTIFICATE,
  UPDATE_SERVER_AND_CERTIFICATE,
  ADMIN_SETTING,
  ADMIN,
  DATABASE,
  Q8_DATABASE,
} from "const/Consts";

export const MainTabs = [
  [ALL, []],
  [LICENSE_SETTING, []],
  [
    PACKAGE_SETTING,
    [ INSTALL_SYSTEM ], /* [INSTALL_SYSTEM, INSTALL_DRIVERS, FIRMWARE_PACKAGE], */
  ],
  [ADMIN_SETTING, []],
  [SERVER_SETTING, [DHCP, ACTIVE_DIRECTORY, SERVER_CERTIFICATE]],
  [DATABASE, []],
];

export const LicenseTabs = [
  { name: LICENSE, content: UPLOAD_LICENSE, iconClass: "setting-license" },
];
export const PackageTabs = [
  {
    name: INSTALL_SYSTEM,
    content: INSTALL_SYSTEM,
    iconClass: "setting-system",
  },
/*
  {
    name: INSTALL_DRIVERS,
    content: INSTALL_DRIVERS,
    iconClass: "setting-drivers",
  },
  {
    name: FIRMWARE_PACKAGE,
    content: FIRMWARE_PACKAGE,
    iconClass: "setting-package",
  },
*/
  // { name: TERMCAP, content: TERMCAP, iconClass: "setting-termcap" },
];
export const AdminTabs = [
  { name: ADMIN, content: ADMIN, iconClass: "setting-admin" },
];
export const ServerTabs = [
  { name: DHCP, content: DHCP, iconClass: "setting-dhcp" },
  {
    name: ACTIVE_DIRECTORY,
    content: ACTIVE_DIRECTORY,
    iconClass: "setting-server",
  },
  {
    name: SERVER_CERTIFICATE,
    content: UPDATE_SERVER_AND_CERTIFICATE,
    iconClass: "setting-certificate",
  },
];
export const DatabaseTabs = [
  { name: DATABASE, content: Q8_DATABASE, iconClass: "setting-database " },
];
