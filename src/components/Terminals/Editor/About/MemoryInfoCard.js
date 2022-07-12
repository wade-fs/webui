import React from "react";
import { Title, AboutField } from "components/Card";
import { TotalMemory, FreeMemory } from "const/Terminals/TerminalFieldNames";

export default function CpuInfoCard({ data }) {
  return (
    <div className="wrap-960 wrap-33 wrap-bg-w">
      <Title title="MEMORY INFO" />
      <ul className="editor-content">
        <AboutField title="TOTAL MEMORY" value={data[TotalMemory]} />
        <AboutField title="FREE MEMORY" value={data[FreeMemory]} />
      </ul>
    </div>
  );
}
