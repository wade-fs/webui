import React, { Fragment } from "react";

import { showInfoBar } from "actions/InfobarActions";

import TerminalInfoCard from "./TerminalInfoCard";
import CpuInfoCard from "./CpuInfoCard";
import MemoryInfoCard from "./MemoryInfoCard";
import IpMenuSettingsInfoCard from "./IpMenuSettingsInfoCard";
import PciInfoCard from "./PciInfoCard";
import StatusInfoCard from "./StatusInfoCard";
import HardwareModelCard from "./HardwareModelCard";

export default class About extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let {
      props: {
        isLoading,
        isLoaded,
        data,
        editingId,
        isGroup,
        terminals,
        terminalGroups,
      },
    } = this;

	isLoaded = data ? true : false;
    isLoading = !isLoaded;

    return (
      <Fragment>
        {/* !sLoaded && (
          <div className="wrap-960 wrap-bg-w modal-content-edit">
            No data found...
          </div>
        ) */}
        {isGroup && (
          <Fragment>
            <StatusInfoCard
              editingId={editingId}
              terminals={terminals}
              terminalGroups={terminalGroups}
            />
            <HardwareModelCard editingId={editingId} terminals={terminals} />
          </Fragment>
        )}
        {!isGroup && (
          <div className="clearfix">
            <div className="w33percent float_left mb-30">
              <TerminalInfoCard data={data} editingId={editingId} />
            </div>
            <div className="w33percent float_left mb-30">
              <CpuInfoCard data={data} />
              <MemoryInfoCard data={data} />
            </div>
            <div className="w33percent float_left mb-30">
              <IpMenuSettingsInfoCard data={data} />
              <PciInfoCard data={data} />
            </div>
          </div>
        )}
      </Fragment>
    );
  }
}
