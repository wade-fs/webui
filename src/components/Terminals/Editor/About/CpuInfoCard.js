import React from "react";
import { Title, AboutField } from "components/Card";
import {
  CpuCacheSize,
  CpuClockSpeed,
  CpuMips,
  CpuName,
  CpuLoadPercentage,
  CpuVendor,
} from "const/Terminals/TerminalFieldNames";

export default function CpuInfoCard({ data }) {
  return (
    <div className="wrap-960 wrap-33 wrap-bg-w">
      <Title title="CPU INFO" />
      <ul className="editor-content">
        <AboutField title="VENDOR" value={data[CpuVendor]} />
        <AboutField title="NAME" value={data[CpuName]} />
        <AboutField title="CLOCK SPEED" value={data[CpuClockSpeed]} />
        <AboutField title="CACHE SIZE" value={data[CpuCacheSize]} />
        <AboutField title="MIPS" value={data[CpuMips]} />
        <AboutField title="LOAD PERCENTAGE" value={data[CpuLoadPercentage]} />
      </ul>
    </div>
  );
}
