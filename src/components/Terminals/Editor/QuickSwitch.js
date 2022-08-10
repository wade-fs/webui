import React, { Fragment } from "react";
import { Modal } from "react-bootstrap";
import { openTerminalEditor, getTerminal } from "actions/TerminalActions";
import { TerminalObject } from "const/Consts";
import ObjectDashboard from "components/ObjectCommon/ObjectDashboard";

export default class QuickSwitch extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showTiles: false,
    };
  }

  toggleTiles = () => {
    this.setState({ showTiles: !this.state.showTiles });
  };
  openEditor = async (id, isGroup) => {
    let { dispatch } = this.props;
    await dispatch(getTerminal(id, isGroup));
    await dispatch(openTerminalEditor(id, isGroup));
  };

  render() {
    let {
      props: { data, servers, applications, dispatch, isGroup, editingId },
      state: { showTiles },
    } = this;
    return (
      <Fragment>
        <Modal id="quick-switch-modal" show={showTiles}>
          <Modal.Body>
            <div className="combined-shape">
              <ObjectDashboard
                data={data}
                servers={servers.servers}
                applications={applications.applications}
                vncs={applications.vncs}
                objects={data.terminals}
                objectGroups={data.terminalGroups}
                mainTree={data.terminalMainTree}
                inEditor={false}
                showRightClick={false}
                dispatch={dispatch}
                isGroup={isGroup}
                object={TerminalObject}
                openEditor={this.openEditor}
                hideFavorite="true"
                hideNew="true"
                insideEditor={true}
                editingId={editingId}
              />
            </div>
            <div
              className="quick-switch-img-up"
              onClick={this.toggleTiles}
            ></div>
          </Modal.Body>
        </Modal>
        {!showTiles && (
          <div
            className="quick-switch-img-down"
            onClick={this.toggleTiles}
          ></div>
        )}
      </Fragment>
    );
  }
}
