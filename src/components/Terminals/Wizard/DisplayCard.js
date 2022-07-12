import React, { Fragment } from "react";
import MonitorCard from "components/MonitorCard";

export default class DisplayCard extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let {
      props: {
        dispatch,
        isGroup,
        data,
        editingId = 0,
        appMultiTree,
        applications,
        hardware,
        hardwareInfo,
        defaultMouseMapping,
        parentTerminal,
        appOverrides,
        oriAppOverrides,
        adUsers,
        verifyAuthUserResult,
        setAppOverrides,
        onChange,
      },
    } = this;

    return (
      <div className="wrap01 wrap-bg-w">
        <div className="display-title">DISPLAY</div>
        <MonitorCard
          isLoaded={true}
          isWizard={true}
          isEditMode={true}
          isGroup={isGroup}
          displayEdit={true}
          hardware={hardware}
          terminal={{ data: data }}
          parentTerminal={parentTerminal}
          applications={applications.data}
          hardwareInfo={hardwareInfo}
          defaultMouseMapping={defaultMouseMapping}
          style={{ marginTop: "20px" }}
          className="wrap01 mb-26 flex"
          onChange={onChange}
          editingId={editingId}
          appMultiTree={appMultiTree}
          dispatch={dispatch}
          appOverrides={appOverrides}
          oriAppOverrides={oriAppOverrides}
          adUsers={adUsers}
          verifyAuthUserResult={verifyAuthUserResult}
          setAppOverrides={setAppOverrides}
        />
      </div>
    );
  }
}
