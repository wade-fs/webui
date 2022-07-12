export const RangeIpStart = "RangeIpStart";
export const RangeIpEnd = "RangeIpEnd";
export const SubnetMask = "SubnetMask";
export const RouterIP = "RouterIP";
export const ExStartIp = "ExStartIp";
export const ExEndIp = "ExEndIp";
export const MacAddress = "MacAddress";
export const SubMacAddress = "SubMacAddress";
export const StaticIp = "StaticIp";

export const DHCP = "DHCP";
export const SUBNET_MASK = "Subnet Mask";
export const STATIC_IP = "Static IP";
export const DEFAULT_DHCP = {
  Exclusions: [],
  RangeSet: {
    RangeIpStart: "",
    RangeIpEnd: "",
    SubnetMask: "",
    RouterIP: "",
  },
  Reservations: [],
};
