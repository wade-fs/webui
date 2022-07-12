import React from "react";
import { Title, AboutField } from "components/Card";
import {
  IpAddress,
  IpAddressMethod,
  BootQ8Server,
  NetworkRouter,
  SubnetMask,
  PrimaryQ8Server,
  SecondaryQ8Server,
} from "const/Terminals/TerminalFieldNames";

export default function IpMenuSettingsInfoCard({ data }) {
  return (
    <div className="wrap-960 wrap-33 wrap-bg-w">
      <Title title="IP MENU SETTINGS" />
      <ul className="editor-content">
        <AboutField title="IP ADDRESS" value={data[IpAddress]} />
        <AboutField title="IP ADDRESS METHOD" value={data[IpAddressMethod]} />
        {/* <AboutField title="Q8 VISTA SERVER" value={data[BootQ8Server]} /> */}
        <AboutField title="NETWORK ROUTER" value={data[NetworkRouter]} />
        <AboutField title="SUBNET MASK" value={data[SubnetMask]} />
        {/* <AboutField
          title="PRIMARY Q8 VISTA SERVER"
          value={data[PrimaryQ8Server]}
        /> */}
        {/* <AboutField
          title="SECONDARY Q8 VISTA SERVER"
          value={data[SecondaryQ8Server]}
        /> */}
      </ul>
    </div>
  );
}
