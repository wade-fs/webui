import React, { Fragment } from "react";
import { connect } from "react-redux";
import { openTerminalWizard, updateTerminal } from "actions/TerminalActions";
import {
  MAC,
  Manufacturer,
  Model,
  IpAddressMethod,
} from "const/Terminals/TerminalFieldNames";
import { LOADING } from "const/DataLoaderState";
import Spinner from "components/Other/Spinner";

import ConfigSelection from "./ConfigSelection";

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedTerminal: null,
      hasPendingTerminals: false,
      showPendingTerminals: true,
      showUserInfoDropdown: false,
      showConfigSelection: false,
      showVersion: false,
      version: undefined,
    };
  }
  componentDidMount() {
    this.setVersion();
  }

  componentDidUpdate(prevProps) {
    let {
      props: { pendingTerminals },
      state: { hasPendingTerminals },
    } = this;
    if (
      prevProps.pendingTerminals.length !== pendingTerminals.length &&
      pendingTerminals.length === 0
    ) {
      this.setState({
        hasPendingTerminals: false,
      });
    } else if (
      hasPendingTerminals === false &&
      pendingTerminals != null &&
      prevProps.pendingTerminals !== pendingTerminals
    ) {
      this.setState({
        showPendingTerminals: true,
        hasPendingTerminals: true,
      });
    }
  }

  setVersion = () => {
    let {
      props: { productInfo },
    } = this;
    // let version = productInfo.data.Version.split("-")[0];
    const version = productInfo.data;
    this.setState({ version: version });
  };

  onChangeTab = (tab) => {
    this.props.onChangeTab(tab);
    if (this.state.showVersion) {
      this.setState({ showVersion: false });
    }
    if (this.state.showUserInfoDropdown) {
      this.setState({ showUserInfoDropdown: false });
    }
    if (this.state.showPendingTerminals) {
      this.setState({ showPendingTerminals: false });
    }
  };

  toggleShowPendingTerminals = () => {
    this.setState({ showPendingTerminals: !this.state.showPendingTerminals });
    if (this.state.showVersion || this.state.showUserInfoDropdown) {
      this.setState({ showVersion: false });
      this.setState({ showUserInfoDropdown: false });
    }
  };
  openConfigSelection = (terminal) => {
    this.setState({
      selectedTerminal: terminal,
      showConfigSelection: true,
    });
    this.toggleShowPendingTerminals();
  };
  closeConfigSelection = () => {
    this.setState({
      selectedTerminal: null,
      showConfigSelection: false,
    });
  };
  replaceExistingTerminal = (terminalId) => {
    let {
      props: { dispatch },
      state: { selectedTerminal },
    } = this;
    dispatch(
      updateTerminal(
        terminalId,
        { [MAC]: selectedTerminal.Mac },
        false,
        "hardware"
      )
    );
    this.closeConfigSelection();
  };
  openTerminalWizard = () => {
    let {
      props: { dispatch, tab },
      state: { selectedTerminal },
    } = this;
    if (tab !== "TERMINALS") {
      this.onChangeTab("TERMINALS");
    }
    dispatch(
      openTerminalWizard(false /*isGroup*/, {
        [MAC]: selectedTerminal?.Mac,
        [Manufacturer]: selectedTerminal?.Manufacturer,
        [Model]: selectedTerminal?.Model,
        [IpAddressMethod]: selectedTerminal?.IpAddressMethod,
      })
    );
    this.closeConfigSelection();
  };

  toggleShowUserInfoDropdown = () => {
    if (this.state.showVersion) {
      this.setState({ showVersion: !this.state.showVersion });
    }
    if (this.state.showPendingTerminals) {
      this.setState({ showPendingTerminals: !this.state.showPendingTerminals });
    }
    this.setState({ showUserInfoDropdown: !this.state.showUserInfoDropdown });
  };

  toggleShowVersion = () => {
    if (this.state.showUserInfoDropdown) {
      this.setState({
        showUserInfoDropdown: !this.state.showUserInfoDropdown,
      });
    }
    if (this.state.showPendingTerminals) {
      this.setState({
        showPendingTerminals: !this.state.showPendingTerminals,
      });
    }
    this.setState({ showVersion: !this.state.showVersion });
  };
  isTerminalUpdating = () => {
    let {
      props: { editingTerminal, temrinalEditorOpened },
    } = this;
    return editingTerminal.state == LOADING && !temrinalEditorOpened;
  };

  toHelpPage = () => {
    window.open("/manual", "_blank", "noopener noreferrer");
  };

  render() {
    let {
      props: {
        terminals,
        pendingTerminals,
        terminalGroups,
        terminalMainTree,
        userInfo,
        userLogout,
      },
      state: {
        hasPendingTerminals,
        showPendingTerminals,
        showUserInfoDropdown,
        showConfigSelection,
        showVersion,
        version,
      },
    } = this;

    const currentPendingTerminals = pendingTerminals;

    return (
      <header className="w-container">
        {/* {this.isTerminalUpdating() && <Spinner />} */}
        <div className="main-header-logo"></div>
        {this.props.wsMessage.type !== undefined &&
          this.props.wsMessage.message !== "" && (
            <div className="ws-message">
              <div className="main-ws-info"></div>
              {`${this.props.wsMessage.type}: ${this.props.wsMessage.message}`}
            </div>
          )}
        <nav>
          <ul>
            {hasPendingTerminals ? (
              <li>
                <div
                  className="device-icon"
                  onClick={this.toggleShowPendingTerminals}
                ></div>
                <div className="circle-gray-sm">
                  {currentPendingTerminals?.length ?? 0}
                </div>
                {showPendingTerminals && (
                  <ul className="showbox">
                    {Array.isArray(currentPendingTerminals) &&
                      currentPendingTerminals.length > 0 &&
                      currentPendingTerminals.map(
                        (terminal) =>
                          terminal.Mac !== "" && (
                            <li
                              className="header-mac"
                              key={terminal.Mac}
                              onClick={() => this.openConfigSelection(terminal)}
                            >
                              <span>{terminal.Mac.substr(0, 2)}</span>
                              <span>{terminal.Mac.substr(2, 2)}</span>
                              <span>{terminal.Mac.substr(4, 2)}</span>
                              <span>{terminal.Mac.substr(6, 2)}</span>
                              <span>{terminal.Mac.substr(8, 2)}</span>
                              <span>{terminal.Mac.substr(10, 2)}</span>
                            </li>
                          )
                      )}
                  </ul>
                )}
              </li>
            ) : (
              <li>
                <div className="device-icon-hidden"></div>
                <div className="circle-gray-sm">
                  {currentPendingTerminals?.length ?? 0}
                </div>
              </li>
            )}
            <li>
              <div className="help-icon" onClick={this.toggleShowVersion}></div>
              {showVersion && (
                <ul className="showbox">
                  <li>{`Version: ${version}`}</li>
                  <li>User Manual</li>
                </ul>
              )}
            </li>
            <li>
              <div
                className="user-icon"
                onClick={this.toggleShowUserInfoDropdown}
              ></div>
              {showUserInfoDropdown && userInfo.data != null && (
                <ul className="showbox">
                  <li>
                    {userInfo.data.FirstName + " " + userInfo.data.LastName}
                  </li>
                  <li onClick={userLogout}>Logout</li>
                </ul>
              )}
            </li>
          </ul>
        </nav>
        {showConfigSelection && (
          <ConfigSelection
            replaceExistingTerminal={this.replaceExistingTerminal}
            openTerminalWizard={this.openTerminalWizard}
            terminals={terminals}
            terminalGroups={terminalGroups}
            terminalMainTree={terminalMainTree}
            onCancel={this.closeConfigSelection}
          />
        )}
      </header>
    );
  }
}

export default connect((state) => {
  return {
    pendingTerminals: state.terminals.pendingTerminals,
    userInfo: state.auths.userInfo,
    terminals: state.terminals.terminals,
    terminalGroups: state.terminals.terminalGroups,
    terminalMainTree: state.terminals.terminalMainTree,
    editingTerminal: state.terminals.editingTerminal,
    temrinalEditorOpened: state.terminals.editorOpened,
    wsMessage: state.wsMessage,
  };
})(Header);
