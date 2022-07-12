import React from "react";
import { Title, AboutField } from "components/Card";
import { Disabled, Status } from "const/Terminals/TerminalFieldNames";

export default function StatusInfoCard({
  editingId,
  terminals,
  terminalGroups,
}) {
  let groupCount;
  let terminalCount;
  let activeCount;
  let offCount;
  let disableCount;
  // let lockedCount;
  if (terminals.data !== undefined && terminalGroups !== undefined) {
    groupCount = terminalGroups.data.filter(
      (node) => node.ParentId === editingId
    ).length;
    terminalCount = terminals.data.filter(
      (node) => node.ParentId === editingId
    ).length;
    activeCount = terminals.data.filter(
      (node) => node.ParentId === editingId && node[Status].indexOf("A") >= 0
    ).length;
    offCount = terminals.data.filter(
      (node) => node.ParentId === editingId && node[Status].indexOf("F") >= 0
    ).length;
    disableCount = terminals.data.filter(
      (node) => node.ParentId === editingId && node[Status].indexOf("D") >= 0
    ).length;
    // lockedCount = children.filter(
    //   (node) =>
    //     node["ConfigLock"] === true && node.ParentId === editingId
    // ).length;
  }

  return (
    <div className="wrap-960 wrap-bg-w" style={{ height: "400px" }}>
      <Title title="STATUS" />
      <ul className="editor-content">
        {/* <AboutField
          title="LOCKED"
          value={lockedCount}
          className="status-item-content"
        /> */}
        <AboutField
          title="TOTAL GROUPS"
          value={groupCount}
          className="status-item-content"
        />
        <AboutField
          title="TOTAL TERMINALS"
          value={terminalCount}
          className="status-item-content"
        />
        <AboutField
          title="ACTIVE"
          value={activeCount}
          className="status-item-content"
        />
        <AboutField
          title="OFF"
          value={offCount}
          className="status-item-content"
        />
        <AboutField
          title="DISABLE"
          value={disableCount}
          className="status-item-content"
        />
      </ul>
    </div>
  );
}
