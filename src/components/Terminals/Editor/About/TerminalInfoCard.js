import React from "react";
import { Title, AboutField } from "components/Card";
import {
  BootLoaderVersion,
  FirmwarePackage,
  FirmwareVersion,
  HardwareBootRomVersion,
  Id,
  IpAddress,
  Manufacturer,
  Model,
  UpTime,
} from "const/Terminals/TerminalFieldNames";

export default function TerminalInfoCard({ data }) {
  return (
    <div className="wrap-960 wrap-33 wrap-bg-w">
      <Title title="TERMINAL INFO" />
      <ul className="editor-content">
        {/* <AboutField title="IP ADDRESS" value={data[IpAddress]} /> */}
        <AboutField title="TERMINAL ID" value={data[Id]} />
        <AboutField title="FIRMWARE VERSION" value={data[FirmwareVersion]} />
        <AboutField title="FIRMWARE PACKAGE" value={data[FirmwarePackage]} />
        <AboutField
          title="HARDWARE MODEL"
          value={data[Manufacturer] + " " + data[Model]}
        />
        <AboutField
          title="HARDWARE BOOT ROM VERSION"
          value={data[HardwareBootRomVersion]}
        />
        {/* <AboutField
          title="BOOT LOADER VERSION"
          value={data[BootLoaderVersion]}
        /> */}
        <AboutField title="UP TIME" value={data[UpTime]} />
      </ul>
    </div>
  );
}
