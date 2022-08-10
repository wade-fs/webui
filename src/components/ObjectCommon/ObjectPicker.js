import React from "react";
import { Modal } from "react-bootstrap";
import { CancelAndConfirm } from "components/Form/Button";
import { Tree } from "components/Tree";

export default class ObjectPicker extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedId: undefined,
      showAllTree: false,
    };
  }

  selectGroup = (id) => {
    let {
      props: { treeType },
    } = this;
    let selectedId;
    // add NoGroup
    if (treeType !== "appGroup") {
      if (id === 0) {
        selectedId = id;
      } else {
        selectedId = id;
      }
    } else {
      if (id.Id === 0) {
        selectedId = id.Id;
      }
      selectedId = id.Id;
    }

    this.setState({ selectedId });
  };
  toggleAllTree = () => {
    this.setState({ showAllTree: !this.state.showAllTree });
  };

  render() {
    let {
      props: {
        isGroup = true,
        editingId = 0,
        treeType,
        mainTree,
        rdss, rdsGroups, rdsMainTree,
        vncs, vncGroups, vncMainTree,
        currentTab,
        wsItems = {},
        pickerTitle = "",
        onCancel,
        onConfirm,
      },
      state: { selectedId, showAllTree },
    } = this;

    return (
      <Modal id="tree-modal" show={true}>
        <Modal.Body>
          <div className="pop-up-window " style={{ maxHeight: "700px" }}>
            <h2 className="mb-22">{pickerTitle}</h2>
            <Tree
              defaultFilter={isGroup}
              editingId={editingId}
              tree={mainTree}
              treeType={treeType}
            rdss={rdss}
            rdsGroups={rdsGroups}
            rdsMainTree={rdsMainTree}
            vncs={vncs}
            vncGroups={vncGroups}
            vncMainTree={vncMainTree}
            currentTab={currentTab}
              showAllTree={showAllTree}
              wsItems={wsItems}
              selectedId={selectedId}
              toggleAllTree={this.toggleAllTree}
              onSelect={this.selectGroup}
            />
            <CancelAndConfirm
              canConfirm={selectedId != null}
              onConfirm={() => onConfirm(selectedId)}
              onCancel={onCancel}
            />
          </div>
        </Modal.Body>
      </Modal>
    );
  }
}
