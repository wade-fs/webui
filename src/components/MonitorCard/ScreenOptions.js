import React from "react";
import { ItemField } from "../../components/Card";
import Input from "../../components/Form/Input";
import Checkbox from "../../components/Form/Checkbox";
import Select from "../../components/Form/Select";

import { SelectorMenuSizeOptions } from "../../const/Terminals/Display";

export default function ScreenOptions({
  isEditMode,
  data,
  selectedScreenId,
  disabled,
  change,
  openMouseButtonMapSettings,
}) {
  const getCheckboxField = (title, name, options, Tag) => {
    return (
      <ItemField
        isEditMode={true}
        title={title}
        name={name}
        options={{ value: data[name], disabled: !isEditMode, ...options }}
        Tag={Tag}
        onChange={change}
      />
    );
  };
  const screenPrefix = `Screen${selectedScreenId}`;
  const showApplicationSelector =
    data[`${screenPrefix}_ShowSelector`] == true ||
    data[`${screenPrefix}_ShowSelector`] == "YES";
  const showEnableTiling =
    data[`${screenPrefix}_EnableTiling`] == true ||
    data[`${screenPrefix}_EnableTiling`] == "YES";
  const showOverrideMouseButtonMapping =
    data[`${screenPrefix}_OverrideMouseButtonMapping`] == true ||
    data[`${screenPrefix}_OverrideMouseButtonMapping`] == "YES";

  return (
    <div className="display-screen-options">
      {/* <div
        className={
          "align-left" + (showApplicationSelector ? " border-bottom" : "")
        }
      >
        {getCheckboxField(
          "Allow applications to move to/from screen",
          screenPrefix + "_AllowGroupMovement",
          {
            type: "checkbox",
          },
          Checkbox
        )}
        {getCheckboxField(
          "Show application selector",
          screenPrefix + "_ShowSelector",
          {
            type: "checkbox",
          },
          Checkbox
        )}
      </div> */}
      {/* {showApplicationSelector && (
        <div className="align-left border-bottom ">
          {getCheckboxField(
            "Auto-hide selector",
            screenPrefix + "_AutoHideSelector",
            {
              type: "checkbox",
            },
            Checkbox
          )}
          {getCheckboxField(
            "Tile on Selector activation",
            screenPrefix + "_TileOnGroupSelectorActivation",
            { type: "checkbox", disabled: disabled },
            Checkbox
          )}
          {getCheckboxField(
            "Selector Menu Size",
            screenPrefix + "_SelectorSize",
            {
              type: "select",
              options: SelectorMenuSizeOptions,
            },
            Select,
            "mb-16"
          )}
        </div>
      )} */}
      <div
        className={"align-left" + (showEnableTiling ? " border-bottom" : "")}
      >
        {getCheckboxField(
          "Enable tiling",
          screenPrefix + "_EnableTiling",
          {
            type: "checkbox",
          },
          Checkbox
        )}
        {getCheckboxField(
          "Tile application at startup",
          screenPrefix + "_TileOnStartup",
          {
            type: "checkbox",
          },
          Checkbox
        )}
      </div>
      {showEnableTiling && (
        <div className="align-left">
          {/* {getCheckboxField(
            "Show grid",
            screenPrefix + "_TileShowGrid",
            {
              type: "checkbox",
            },
            Checkbox
          )} */}
          {/* {getCheckboxField(
            "Tile application at startup",
            screenPrefix + "_TileOnStartup",
            {
              type: "checkbox",
            },
            Checkbox
          )} */}
          {/* {getCheckboxField(
            "Tile Inactivity Time (seconds)",
            screenPrefix + "_TileInactiveTime",
            {
              type: "text",
            },
            Input,
            "mb-16"
          )}
          {getCheckboxField(
            "Include main menu as tile",
            screenPrefix + "_TileWithMainMenu",
            {
              type: "checkbox",
            },
            Checkbox
          )}
          {getCheckboxField(
            "Tile Interactive",
            screenPrefix + "_TileInteractive",
            {
              type: "checkbox",
            },
            Checkbox
          )} */}
        </div>
      )}
      {/* <div
        className={
          "align-left" +
          (showOverrideMouseButtonMapping ? " border-bottom" : "")
        }
      >
        {getCheckboxField(
          "Use specific mouse button mapping",
          screenPrefix + "_OverrideMouseButtonMapping",
          {
            type: "checkbox",
          },
          Checkbox
        )}
      </div> */}
      {showOverrideMouseButtonMapping && (
        <div
          className="display-button-mapping"
          disabled={disabled}
          onClick={disabled ? null : openMouseButtonMapSettings}
        >
          <div className="setting-sm"></div>
          Mouse Button Map Settings
        </div>
      )}
    </div>
  );
}
