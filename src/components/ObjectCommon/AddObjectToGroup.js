import React, { Fragment } from "react";
import { ItemField } from "components/Card";

import ObjectPicker from "components/ObjectCommon/ObjectPicker";

export default class AddObjectToGroup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: { ParentName: props.selectGroupName },
      showAddGroupModal: false,
    };
  }

  componentDidUpdate() {
    if (this.state.data.ParentName !== this.props.selectGroupName) {
      let data = this.state.data;
      data["ParentName"] = this.props.selectGroupName;
      this.setState({ data });
    }
  }

  change = (e) => {
    let {
      props: { onConfirm, objectGroups, field = "ParentId" },
    } = this;
    if (e.target.name == "ParentName") {
      // make sure the input group name exists in object tree
      if (e.target.value != "") {
        let node = objectGroups.data.find((item) => item.Id === id);
        if (node != null) {
          onConfirm({
            target: { id: `u${field}`, name: field, value: node.id },
          });
        }
      } else {
        onConfirm({ target: { id: `u${field}`, name: field, value: 0 } });
      }
    }
  };

  onConfirm = (id) => {
    let {
      props: { onConfirm, objects, objectGroups, field = "ParentId" },
      state: { data },
    } = this;

    if (typeof id === "string") {
      id = parseInt(id);
    }

    onConfirm({ target: { id: `u${field}`, name: field, value: id } });
    // add NoGroup
    if (id === 0) {
      data.ParentName = "";
    } else {
      if (field === "CopyTerminalId") {
        data.ParentName = objects.data.find((item) => item.Id === id)?.Name;
      } else {
        data.ParentName = objectGroups.data.find(
          (item) => item.Id === id
        )?.Name;
      }
    }
    this.setState({
      data,
    });
    this.closeAddGroupModal();
  };

  openAddGroupModal = () => {
    this.setState({ showAddGroupModal: true });
  };
  closeAddGroupModal = () => {
    this.setState({ showAddGroupModal: false });
  };

  render() {
    let {
      state: { showAddGroupModal },
      props: {
        isGroup = true,
        editingId = 0,
        treeType,
        wsItems,
        disabled,
        mainTree,
        pickerTitle,
        selectGroupName,
        field = "ParentId",
        outerClass = "mt-8",
      },
    } = this;
    return (
      <div className={outerClass}>
        <ItemField
          title={field}
          name="ParentName"
          options={{
            type: "input",
            value: selectGroupName,
            className: "w-240",
            style: {
              opacity: "1",
            },
            disabled: true,
          }}
          onChange={this.change}
          hasButton={true}
          btnOptions={{
            btnName: "BROWSE",
            btnDisabled: disabled,
            btnClick: disabled ? () => null : this.openAddGroupModal,
          }}
        />
        {showAddGroupModal && (
          <ObjectPicker
            isGroup={isGroup}
            editingId={editingId}
            treeType={treeType}
            mainTree={mainTree.data}
            wsItems={wsItems}
            pickerTitle={pickerTitle}
            onCancel={this.closeAddGroupModal}
            onConfirm={this.onConfirm}
          />
        )}
      </div>
    );
  }
}
