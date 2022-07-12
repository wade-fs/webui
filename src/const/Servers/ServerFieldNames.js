import { stringValid } from "lib/Util";

// Info
export const Id = "Id";
export const Name = "Name";

export const IsGroup = "IsGroup";
export const ParentId = "ParentId";
export const Type = "Type";
export const IPAddress = "IPAddress";
export const InfoFields = [Name, ParentId, IPAddress];

export function extractServerInfo(server) {
  return extractFields(server, InfoFields);
}

// RDS server properties
export const LoadBalanced = "LoadBalanced";
export const CPUMin = "CPUMin";
export const CPUMax = "CPUMax";
export const MemMin = "MemMin";
export const MemMax = "MemMax";
export const LoadBalancedFields = [
  LoadBalanced,
  CPUMax,
  CPUMin,
  MemMax,
  MemMin,
];

// Data gathering
export const ServerUpdate = "ServerUpdate";
export const ProcessUpdate = "ProcessUpdate";
export const SessionUpdate = "SessionUpdate";
// UI Assistant fields
export const IntervalMode = "IntervalMode";

export const DataGatheringFields = [ServerUpdate, ProcessUpdate, SessionUpdate];
export function extractDataGathering(server) {
  return extractFields(server, DataGatheringFields);
}

// Auth user
export const Username = "Username";
export const Password = "Password";
export const VerifyPassword = "VerifyPassword";
export const Domain = "Domain";
// UI Assistant fields
export const UserType = "UserType";
export const AuthUserFields = [UserType, Username, Password, Domain];

export function extractAuthUser(server) {
  let extract = extractFields(server, AuthUserFields);
  if (stringValid(server[Username]) && stringValid(server[Password])) {
    extract[UserType] = "Windows";
  } else {
    extract[UserType] = "None";
  }
  return extract;
}

// Schedule
export const Schedules = "Schedules";

// About fields
export const UpTime = "UpTime";

export function extractFields(server, fields) {
  if (server == null) return {};
  let extract = {};

  fields.forEach((field) => {
    if (server.hasOwnProperty(field)) {
      extract[field] = server[field];
    }
  });
  return extract;
}
