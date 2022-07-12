import React from "react";
import { Title, AboutField } from "components/Card";
import { VideoPCIID, NetworkPCIID } from "const/Terminals/TerminalFieldNames";

export default function PciInfoCard({ data }) {
  return (
    <div className="wrap-960 wrap-33 wrap-bg-w">
      <Title title="PCI INFO" />
      <ul className="editor-content">
        <AboutField title="VIDEO PCI ID" value={data[VideoPCIID]} />
        <AboutField title="NETWORK PCI ID" value={data[NetworkPCIID]} />
      </ul>
    </div>
  );
}
