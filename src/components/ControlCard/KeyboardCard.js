import React, { Fragment } from "react";
import { EditorField } from "components/Card";
import Select from "components/Form/Select";

import { KeyOptions } from "const/Consts";
import {
  HotkeyStateOptions,
  ControlFields,
  KeyboardTitles,
  titleToHotkeyState,
  titleToHotkeyCode,
} from "const/Terminals/TerminalFieldNames";

import { stringValid } from "lib/Util";

export default class KeyboardCard extends React.Component {
  constructor(props) {
    super(props);
    this.changedField = "";
  }

  getKeyboardOptions(title) {
    let {
      props: { data },
      changedField,
    } = this;
    let options = [""];
    let combinations = new Set();
    KeyboardTitles.forEach((t) => {
      let hotkeyStateField = data[titleToHotkeyState[t]];
      let hotkeyCodeField = data[titleToHotkeyCode[t]];
      if (
        t != title &&
        stringValid(hotkeyStateField) &&
        stringValid(hotkeyCodeField)
      ) {
        combinations.add(hotkeyStateField + "+" + hotkeyCodeField);
      }
    });
    let hotkeyStateField = titleToHotkeyState[title];
    let hotkeyCodeField = titleToHotkeyCode[title];
    KeyOptions.forEach((option) => {
      let combination = data[hotkeyStateField] + "+" + option;
      if (!combinations.has(combination)) {
        options.push(option);
      } else if (
        combination == data[hotkeyStateField] + "+" + data[hotkeyCodeField] &&
        (changedField.startsWith(hotkeyCodeField) ||
          changedField.startsWith(hotkeyStateField))
      ) {
        options.push(option);
      }
    });

    return options;
  }
  getEditorHotKey(title, hotkeyState, hotkeyCode) {
    let {
      props: { data, isEditMode, isLoaded = true, onChange },
    } = this;
    let label;
    let hotkeyCodeOptions;

    if (isLoaded === false) return;

    label = data[hotkeyState] + " + " + data[hotkeyCode];
    hotkeyCodeOptions = this.getKeyboardOptions(title);

    const stateProperties = {
      type: "select",
      options: HotkeyStateOptions,
      value: data[hotkeyState],
      className: "w-100 h-32 mr-20",
      style: { display: "inline-flex" },
    };
    const codeProperties = {
      type: "select",
      options: hotkeyCodeOptions,
      value: data[hotkeyCode],
      className: "w-100 h-32",
      style: { display: "inline-flex" },
    };

    return (
      <li key={title}>
        <label className={!isEditMode ? "select-title" : ""}>
          {title.toUpperCase()}
        </label>
        {!isEditMode && <p data-view>{label}</p>}
        {isEditMode && (
          <Fragment>
            <Select
              title={title}
              name={hotkeyState}
              {...stateProperties}
              onChange={onChange}
            />
            <Select
              title={title}
              name={hotkeyCode}
              {...codeProperties}
              onChange={onChange}
            />
          </Fragment>
        )}
      </li>
    );
  }
  getWizardHotKey(title, hotkeyState, hotkeyCode) {
    let {
      props: { data, disabled, onChange },
    } = this;

    const hotkeyCodeOptions = this.getKeyboardOptions(title);
    const stateProperties = {
      type: "select",
      options: HotkeyStateOptions,
      value: data[hotkeyState],
      disabled: disabled,
      className: "inline-flex w-100 h-32 mr-20",
    };
    const codeProperties = {
      type: "select",
      options: hotkeyCodeOptions,
      value: data[hotkeyCode],
      disabled: disabled,
      className: "inline-flex w-100 h-32",
    };
    return (
      <div key={title} className="pt-12">
        <label for="">{title}</label>
        <label>
          <div style={{ lineHeight: "32px" }}>
            <Select
              title={title}
              name={hotkeyState}
              {...stateProperties}
              onChange={onChange}
            />
            <Select
              title={title}
              name={hotkeyCode}
              {...codeProperties}
              onChange={onChange}
            />
          </div>
        </label>
      </div>
    );
  }

  render() {
    let {
      props: { format = "wizard" },
    } = this;

    return (
      <Fragment>
        {format == "wizard" && (
          <div className="align-left pb-12">
            {KeyboardTitles.map((title) =>
              this.getWizardHotKey(
                title,
                titleToHotkeyState[title],
                titleToHotkeyCode[title]
              )
            )}
          </div>
        )}
        {format == "editor" && (
          <div className="wrap-bg-w mb-16">
            <div className="subject">HOTKEY ▼</div>
            <ul className="editor-content">
              {KeyboardTitles.map((title) =>
                this.getEditorHotKey(
                  title,
                  titleToHotkeyState[title],
                  titleToHotkeyCode[title]
                )
              )}
            </ul>
          </div>
        )}
      </Fragment>
    );
  }
}
