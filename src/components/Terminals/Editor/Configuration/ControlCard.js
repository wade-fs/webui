import React, { Fragment } from "react";
import { Title } from "components/Card";
import { ApplyAll } from "components/Card";
import MouseCard from "components/ControlCard/MouseCard";
import KeyboardCard from "components/ControlCard/KeyboardCard";

import { MouseButtonMapping } from "const/Consts";
import { ControlApplyAll } from "const/Terminals/TerminalFieldNames";

import { getServerMouseData } from "components/ControlCard/ControlCardUtils";
import { checkEdit, isInheritedFromParent } from "utils/Check";

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
    onChange(data, true);
  };

  render() {
    let {
      props: {
        isLoaded,
        isEditMode,
        data,
        parentTerminal,
        defaultMouseMapping,
        isGroup,
      },
      state: { isInherited },
    } = this;
    return (
      <Fragment>
        {isInherited && (
          <div
            className="modal-text-b"
            style={{
              position: "absolute",
              top: "16px",
              right: "80px",
            }}
          >
            Inherit from {parentTerminal.data["Name"]}
          </div>
        )}
        {isGroup && (
          <ApplyAll
            name={ControlApplyAll}
            isEditMode={isEditMode}
            value={data[ControlApplyAll]}
            insideStyle={{ marginTop: "20px", marginRight: "20px" }}
            disabled={!isEditMode || isInherited}
            onChange={this.change}
          />
        )}
        <KeyboardCard
          isLoaded={isLoaded}
          isEditMode={isEditMode}
          data={data}
          format="editor"
          onChange={this.change}
        />
        <MouseCard
          isLoaded={isLoaded}
          isEditMode={isEditMode}
          isInherited={isInherited}
          data={data}
          format="editor"
          defaultMouseMapping={defaultMouseMapping}
          onChange={this.change}
        />
      </Fragment>
    );
  }
}
