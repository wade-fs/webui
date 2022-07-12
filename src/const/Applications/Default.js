const DefaultInfo = {
  Name: "",
  ParentId: 0,
};

const DefaultProperty = {
  AllowTile: true,
  IsMoveable: true,
  LinkedApp: "Desktop",
};

const DefaultConnection = {
  MaintainSession: false,
  StartSession: false,
  DisconnectInBackground: false,
  AllowAutoLogin: true,
};

const DefaultScalingResolution = {
  MaintainAspectRatio: false,
  ScaleDownOnly: false,
  UseScreenSize: true,
  SessionWidth: 1024,
  SessionHeight: 768,
};

const DefaultLoadBalance = {
  LoadBalanced: false,
  EnforcePrimary: false,
  InstantFailover: false,
  CPUWeight: 1,
  MemoryWeight: 1,
  SessionWeight: 1,
  MinQueueTime: 0,
  MaxQueueTime: 120,
  Infinite: false,
};

const DefaultServer = {
  IgnoreRDGatewayIfLocal: false,
  UseRDGateway: false,
  RdsServerIds: "",
};

export const DefaultApplication = {
  ...DefaultInfo,
  ...DefaultProperty,
  ...DefaultConnection,
  ...DefaultScalingResolution,
  ...DefaultLoadBalance,
  ...DefaultServer,
};

export const DefaultAppGroup = {
  ...DefaultInfo,
};
