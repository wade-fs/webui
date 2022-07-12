import React, { Fragment } from "react";
import { ApplyAll, ItemField } from "components/Card";
import Slider from "components/Form/Slider";
import KeyboardCard from "components/ControlCard/KeyboardCard";
import MouseCard from "components/ControlCard/MouseCard";

import {
  EnableHotkey,
  ControlApplyAll,
  Name,
} from "const/Terminals/TerminalFieldNames";
import { KeyboardFields, MouseButtonMapping } from "const/Consts";

import { getServerMouseData } from "components/ControlCard/ControlCardUtils";
import { isInheritedFromParent } from "utils/Check";

// MouseFields: actions
// MouseOptiosn: all available mouse button
// KeyboardFields: actions
// KeyOptions: all hotkey button

export default class ControlCard extends React.Component {
  constructor(props) {
    super(props);
    const isInherited = isInheritedFromParent(
      props.parentTerminal.data,
      ControlApplyAll
    );
    this.state = {
      isInherited: isInherited,
    };
  }

  change = (e, type = "keyboard") => {
    let {
      props: { data, onChange },
    } = this;
    data[e.target.name] = e.target.value;
    if (type === "mouse") {
      const formattedData = getServerMouseData(data, MouseButtonMapping);
      data[MouseButtonMapping] = formattedData[MouseButtonMapping];
    }
    onChange(data);
  };

  render() {
    let {
      props: {
        isGroup,
        data,
        defaultKeyboardMapping,
        defaultMouseMapping,
        parentTerminal,
      },
      state: { isInherited },
    } = this;
    return (
      <Fragment>
        <div className="wrap01 wrap-bg-w pb-8 mb-12">
          <h3 className=" border-bottom h-40">
            HOTKEYS
            {isInherited && (
              <span style={{ float: "right" }}>
                Inherit from {parentTerminal.data[Name]}
              </span>
            )}
            {isGroup && (
              <ApplyAll
                name={ControlApplyAll}
                isEditMode={true}
                value={data[ControlApplyAll] ?? false}
                onChange={this.change}
                disabled={isInherited}
              />
            )}
          </h3>
          <div className="align-left">
            <label>Enable Hotkey</label>
            <ItemField
              title="Enable Hotkey"
              name={EnableHotkey}
              options={{
                value: data[EnableHotkey],
                type: "slider",
                className: "slideline2 w-152 mt-4",
                disabled: isInherited,
              }}
              Tag={Slider}
              onChange={this.change}
            />
          </div>
          <KeyboardCard
            isEditMode={true}
            data={data}
            disabled={!data[EnableHotkey] || isInherited}
            onChange={this.change}
          />
        </div>
        <div className="wrap01 wrap-bg-w mb-12">
          <h3 className=" border-bottom h-40">MOUSE BUTTONS</h3>
          <MouseCard
            disabled={isInherited}
            data={data}
            isEditMode={true}
            format="wizard"
            path={MouseButtonMapping}
            defaultMouseMapping={defaultMouseMapping}
            style={{ maxHeight: "550px", overflow: "auto" }}
            onChange={this.change}
          />
        </div>
      </Fragment>
    );
  }
}
