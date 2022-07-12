export const DefaultInfo = {
  Name: "",
  ParentId: 0,
  IPAddress: "",
};
export const DefaultGroupInfo = {
  Name: "",
  ParentId: 0,
};
export const DefaultDataGathering = {
  IntervalMode: "Fast",
  ProcessUpdate: 5,
  SessionUpdate: 8,
};
export const DefaultLoadBalanced = {};
export const DefaultAuthUser = {
  UserType: "None",
  Username: "",
  Password: "",
  Domain: "",
};
export const DefaultSchedules = [];

export const DefaultRdsServer = {
  ...DefaultInfo,
  ...DefaultDataGathering,
};

export const DefaultRdsServerGroup = {
  ...DefaultGroupInfo,
};
