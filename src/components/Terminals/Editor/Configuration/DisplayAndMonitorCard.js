import React, { Fragment } from "react";
import MonitorCard from "components/MonitorCard";

import { iterateObject } from "lib/Util";

import { isMonitorCompleted } from "const/Terminals/TerminalFieldNames";

import { isInheritedFromParent } from "utils/Check";

export default class DisplayAndMonitorCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      overrideEdit: false,
    };
  }

  componentDidUpdate(prevProps, prevState) {
    // check isEditMode
    if (
      prevProps.isEditMode !== this.props.isEditMode &&
      this.props.isEditMode === true
    ) {
      this.setState({ isCancel: false });
    }
    // check isCancel
    if (
      prevProps.isEditMode !== this.props.isEditMode &&
      this.props.isEditMode === false
    ) {
      this.setState({
        overrideEdit: false,
        isCancel: true,
      });
    }
  }

  change = (updatedTerminal) => {
    let {
      props: { isGroup, data, displayEdit, onChange },
      state: { overrideEdit },
    } = this;

    iterateObject(updatedTerminal, ({ key, value }) => {
      if (data[key] != value) {
        data[key] = value;
      }
    });
    let currenrData = { ...data };
    Object.keys(data).forEach((key) => {
      if (updatedTerminal[key] === undefined) {
        delete currenrData[key];
      }
    });
    const canApply = isGroup || isMonitorCompleted(currenrData) ? true : false;

    onChange(currenrData, canApply);
  };

  resetCancel = () => {
    this.setState({ isCancel: false });
  };

  checkAppOverrideEdit = (overrideEdit) => {
    this.setState(
      {
        overrideEdit: overrideEdit,
      },
      () => {
        this.props.onChangeEdit(overrideEdit);
      }
    );
  };

  render() {
    let {
      props: {
        dispatch,
        isLoaded,
        isEditMode,
        isGroup,
        editingId = 0,
        terminalMainTree,
        appMultiTree,
        data,
        applications,
        appOverrides,
        oriAppOverrides,
        hardware,
        hardwareInfo,
        defaultMouseMapping,
        parentTerminal,
        onChangeEdit,
        adUsers,
        verifyAuthUserResult,
        setAppOverrides,
      },
      state: { isCancel },
    } = this;

    return (
      isLoaded && (
        <Fragment>
          <MonitorCard
            dispatch={dispatch}
            isWizard={false}
            isLoaded={isLoaded}
            isGroup={isGroup}
            isEditMode={isEditMode}
            isCancel={isCancel}
            disabled={!isEditMode}
            style={{ marginTop: "32px" }}
            className="wrap01-2 mb-26 flex"
            editingId={editingId}
            terminal={{ data: { ...data } }}
            parentTerminal={parentTerminal}
            hardware={hardware}
            hardwareInfo={hardwareInfo}
            applications={applications}
            oriAppOverrides={oriAppOverrides}
            appOverrides={appOverrides}
            adUsers={adUsers}
            verifyAuthUserResult={verifyAuthUserResult}
            appMultiTree={appMultiTree}
            terminalMainTree={terminalMainTree}
            defaultMouseMapping={defaultMouseMapping}
            onChange={this.change}
            onChangeEdit={onChangeEdit}
            setAppOverrides={setAppOverrides}
            resetCancel={this.resetCancel}
            checkAppOverrideEdit={this.checkAppOverrideEdit}
          />
        </Fragment>
      )
    );
  }
}
