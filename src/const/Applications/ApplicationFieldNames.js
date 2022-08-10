export const Id = "Id";
export const Name = "Name";
export const ParentId = "ParentId";
export const ParentName = "ParentName";
export const Tid = "Tid";
export const Screen = "Screen";
export const InfoFields = [Name, ParentId, Tid, Screen];

export const IsGroup = "IsGroup";

export const AllowTile = "AllowTile";
export const Alias = "Alias";
export const IsMoveable = "IsMoveable";
export const LinkedApp = "LinkedApp";
export const LinkedAppName = "LinkedAppName";
export const LinkedAppCommandOptions = "LinkedAppCommandOptions";
export const LinkedAppDirectory = "LinkedAppDirectory";
export const Path = "Path";
export const PathType = "PathType";
export const ApplicationOptionFields = [
  AllowTile,
  Alias,
  IsMoveable,
  LinkedApp,
  LinkedAppName,
  LinkedAppCommandOptions,
  LinkedAppDirectory,
];

export const MaintainSession = "MaintainSession";
export const StartSession = "StartSession";
export const DisconnectInBackground = "DisconnectInBackground";
export const AllowAutoLogin = "AllowAutoLogin";
export const ConnectionOptionFields = [
  MaintainSession,
  StartSession,
  DisconnectInBackground,
  AllowAutoLogin,
];

export const LoadBalanced = "LoadBalanced";
export const CPUWeight = "CPUWeight";
export const MemoryWeight = "MemoryWeight";
export const SessionWeight = "SessionWeight";
export const EnforcePrimary = "EnforcePrimary";
export const InstantFailover = "InstantFailover";
export const MinQueueTime = "MinQueueTime";
export const MaxQueueTime = "MaxQueueTime";
export const Infinite = "Infinite";

export const LoadBalanceFields = [
  LoadBalanced,
  CPUWeight,
  MemoryWeight,
  SessionWeight,
  EnforcePrimary,
  InstantFailover,
  MinQueueTime,
  MaxQueueTime,
  Infinite,
];

export const DisplayName = "DisplayName";

export const MaintainAspectRatio = "MaintainAspectRatio";
export const ScaleDownOnly = "ScaleDownOnly";
export const UseScreenSize = "UseScreenSize";
export const Resolution = "Resolution";
export const SessionWidth = "SessionWidth";
export const SessionHeight = "SessionHeight";
export const ResolutionOptions = [
  "Custom",
  "240 x 320",
  "640 x 360",
  "640 x 480",
  "750 x 1334",
  "800 x 480",
  "800 x 600",
  "856 x 480",
  "1024 x 576",
  "1024 x 600",
  "1024 x 768",
  "1080 x 1920",
  "1152 x 864",
  "1280 x 720",
  "1280 x 800",
  "1280 x 960",
  "1280 x 1024",
  "1334 x 750",
  "1360 x 768",
  "1366 x 768",
  "1368 x 768",
  "1400 x 1050",
  "1440 x 900",
  "1440 x 1050",
  "1600 x 900",
  "1600 x 1200",
  "1680 x 1050",
  "1920 x 1080",
  "1920 x 1200",
  "1920 x 1440",
  "2048 x 768",
  "2048 x 1536",
  "2160 x 1440",
  "2560 x 1080",
  "2560 x 1440",
  "2560 x 1600",
  "3360 x 1050",
  "3440 x 1440",
  "3840 x 1200",
  "3840 x 1440",
  "3840 x 1600",
  "3840 x 2160",
];
export const ScalingResolutionFields = [
  MaintainAspectRatio,
  ScaleDownOnly,
  UseScreenSize,
  Resolution,
  SessionWidth,
  SessionHeight,
];

export const UseRDGateway = "UseRDGateway";
export const IgnoreRDGatewayIfLocal = "IgnoreRDGatewayIfLocal";
export const RdsServerIds = "RdsServerIds";
export const ServerFields = [
  UseRDGateway,
  IgnoreRDGatewayIfLocal,
  RdsServerIds,
];

export const helpFields = [Resolution];

export const ColorDepth = "ColorDepth";
export const ColorDepthOptions = ["16M", "256", "64K"];

export function extractFields(application, fields) {
  if (application == null) return {};
  let extract = {};
  for (var field of fields) {
    if (application.hasOwnProperty(field)) {
      extract[field] = application[field];
    }
  }
  return extract;
}
