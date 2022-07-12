import React, { Fragment } from "react";
import { Modal } from "react-bootstrap";
import { ItemField } from "components/Card";
import { CancelAndConfirm } from "components/Form/Button";
import RadioButton from "components/Form/RadioButton";
import AddObjectToGroup from "components/ObjectCommon/AddObjectToGroup";

import {
  createNewTerminalLabel,
  replaceExistingLabel,
  ConfigSelectionField,
  SelectedTerminalId,
  sectionStyles,
  labelStyles,
  inputStyles,
} from "const/Header";

import { getObjectById } from "utils/Object";

export default class ConfigSelection extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {},
    };
  }

  change = (e) => {
    let {
      state: { data },
    } = this;
    data[e.target.name] = e.target.value;
    this.setState({ data });
  };

  onCancel = () => {
    this.props.onCancel();
  };
  onConfirm = () => {
    let {
      state: { data },
      props: { onConfirm, replaceExistingTerminal, openTerminalWizard },
    } = this;
    if (data[ConfigSelectionField] === createNewTerminalLabel) {
      openTerminalWizard();
    }
    if (data[ConfigSelectionField] === replaceExistingLabel) {
      replaceExistingTerminal(data[SelectedTerminalId]);
    }
  };

  canConfirm = () => {
    let { data } = this.state;
    if (data[ConfigSelectionField] === replaceExistingLabel) {
      return data[SelectedTerminalId] != null;
    }
    return true;
  };

  selectTerminal = (e) => {
    let { data } = this.state;
    data[SelectedTerminalId] = e.target.value;
    this.setState({ data });
  };

  getWrapperField(title, name, options, Tag) {
    let {
      state: { data },
    } = this;
    return (
      <ItemField
        title={title}
        name={name}
        options={{ value: data[name], ...options }}
        Tag={Tag}
        onChange={this.change}
      />
    );
  }

  render() {
    let {
      props: { terminalMainTree, terminals, terminalGroups },
      state: { data },
    } = this;
    const canConfirm = this.canConfirm();
    let terminalName = "";
    if (data[SelectedTerminalId] !== undefined) {
      terminalName = getObjectById(data[SelectedTerminalId], terminals)?.Name;
    }

    const terminalsById = terminals?.data.reduce((acc, cur) => {
      acc[cur.Id] = cur;
      return acc;
    }, {});

    return (
      <Modal show={true}>
        <Modal.Body style={{ backgroundColor: "transparent" }}>
          <div className="pop-up-window ">
            <h2 className="mb-22">Create new or replace?</h2>
            <div className="border-right  align-left" style={sectionStyles}>
              {this.getWrapperField(
                createNewTerminalLabel,
                ConfigSelectionField,
                {
                  type: "radio",
                  selectedValue: createNewTerminalLabel,
                  style: labelStyles,
                  inputStyle: inputStyles,
                },
                RadioButton
              )}
            </div>
            <div className="align-left" style={sectionStyles}>
              {this.getWrapperField(
                replaceExistingLabel,
                ConfigSelectionField,
                {
                  type: "radio",
                  selectedValue: replaceExistingLabel,
                  style: labelStyles,
                  inputStyle: inputStyles,
                },
                RadioButton
              )}
              <AddObjectToGroup
                isReplace={true}
                pickerTitle="REPLACE EXISTING TERMINAL"
                disabled={data[ConfigSelectionField] != replaceExistingLabel}
                field={SelectedTerminalId}
                mainTree={terminalMainTree}
                treeType="terminalReplace"
                wsItems={terminalsById}
                selectGroupName={terminalName}
                objects={terminals}
                objectGroups={terminalGroups}
                onConfirm={this.selectTerminal}
              />
            </div>
            <CancelAndConfirm
              canConfirm={canConfirm}
              onConfirm={this.onConfirm}
              onCancel={this.onCancel}
            />
          </div>
        </Modal.Body>
      </Modal>
    );
  }
}
