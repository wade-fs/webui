import React, { Fragment } from "react";
import Select from "components/Form/Select";

import { MouseFields, MouseFieldToTitle } from "const/Consts";

import { getMouseOptions, getUiMouseData } from "./ControlCardUtils";
// MouseFields: actions
// MouseOptiosn: all available mouse button
// KeyboardFields: actions
// KeyOptions: all hotkey button

export default class MouseCard extends React.Component {
  constructor(props) {
    super(props);
    const defaultMouseMapping = props.defaultMouseMapping?.data ?? props.data;
    const data = getUiMouseData(props.data, defaultMouseMapping, props.path);
    this.state = {
      data: data,
    };
  }

  componentDidUpdate(prevProps) {
    // update after cancel or apply
    if (this.props.isEditMode !== prevProps.isEditMode) {
      const defaultMouseMapping =
        this.props.defaultMouseMapping?.data ?? this.props.data;
      const data = getUiMouseData(
        this.props.data,
        defaultMouseMapping,
        this.props.path
      );
      this.setState({ data: data });
    }
  }

  change = (e) => {
    let {
      props: { onChange },
      state: { data },
    } = this;
    const key = e.target.name;
    if (!!onChange) {
      data[key] = e.target.value;
      this.setState({ data });
      onChange(e, "mouse");
    }
  };

  getEditorMouseButton(title, name) {
    let {
      props: { isEditMode, disabled },
      state: { data },
    } = this;
    const options = getMouseOptions(name, data);
    const editorProperties = {
      type: "select",
      options: options,
      disabled: disabled,
      value: data[name],
      className: "w-150 h-32",
    };
    return (
      <li key={name}>
        <label className={!isEditMode ? "select-title" : ""}>
          {title.toUpperCase()}
        </label>
        {!isEditMode && <p data-view>{data[name]}</p>}
        {isEditMode && (
          <Fragment>
            <Select
              title={title}
              name={name}
              {...editorProperties}
              onChange={this.change}
            />
          </Fragment>
        )}
      </li>
    );
  }

  getWizardMouseButton(title, name) {
    let {
      props: { disabled },
      state: { data },
    } = this;
    const options = getMouseOptions(name, data);
    const wizardProperties = {
      type: "select",
      options: options,
      disabled: disabled,
      value: data[name],
      className: "w-150 h-32",
    };
    return (
      <Fragment key={title}>
        <label>{title}</label>
        <div className="pt-12">
          <Select
            title={title}
            name={name}
            {...wizardProperties}
            onChange={this.change}
          />
        </div>
      </Fragment>
    );
  }

  render() {
    let {
      props: { format = "wizard" },
    } = this;
    return (
      <Fragment>
        {format === "wizard" && (
          <div className="align-left pb-12">
            {MouseFields.map((field) =>
              this.getWizardMouseButton(MouseFieldToTitle[field], field)
            )}
          </div>
        )}
        {format === "editor" && (
          <div className="wrap-bg-w">
            <div className="subject">MOUSE BUTTONS ▼</div>
            <ul className="editor-content">
              {MouseFields.map((field) =>
                this.getEditorMouseButton(MouseFieldToTitle[field], field)
              )}
            </ul>
          </div>
        )}
      </Fragment>
    );
  }
}
