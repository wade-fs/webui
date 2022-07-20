import React, { Fragment } from "react";
import { EditorField } from "components/Card";
import Input from "components/Form/Input";
import Select from "components/Form/Select";

import { isDefaultObject } from "lib/Util";

import {
  isHardwareCompleted,
  FirmwarePackage,
  Manufacturer,
  Model,
  MAC,
  SecondaryMAC,
} from "const/Terminals/TerminalFieldNames";

export default class HardwareCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      errorFields: {},
      manufacturerOptions: props.manufacturerModelMap?.data
        ? [...props.manufacturerModelMap.data.keys()]
        : [],
      modelOptions: this.getModelOptions(
        props.data?.Manufacturer ?? "",
        props.manufacturerModelMap
      ),
      firmwarePackageOptions: this.getFirmwareOptions(props),
    };
  }

  componentDidUpdate(prevProps) {
    // check Cancel or Apply
    if (
      prevProps.isEditMode !== this.props.isEditMode &&
      this.props.isEditMode === false
    ) {
      const modelOptions = this.getModelOptions(
        this.props.data?.Manufacturer ?? "",
        this.props.manufacturerModelMap
      );
      this.setState({ modelOptions: modelOptions });
    }
    // TODO: 這邊對 isOff/isActive 的判斷需要商榷
	const status = this.props.status ?? "";
	const isOff = (status == "" ||
		status.indexOf("F") >= 0 ||
		status.indexOf("I") >= 0 ||
		status.indexOf("B") >= 0 ||
		status.indexOf("W") >= 0 ||
		status.indexOf("O") >= 0);
	const isActive = (status.indexOf("A") >= 0 ||
		status.indexOf("E") >= 0 ||
		status.indexOf("R") >= 0 ||
		status.indexOf("T") >= 0 ||
		status.indexOf("C") >= 0);
    // check status change
    if (prevProps.status !== this.props.status && isOff) {
      this.setState({ canApply: true });
    } else if (prevProps.status !== this.props.status && isActive) {
      this.setState({ canApply: false });
    }
  }

  change = (e) => {
    let {
      props: { data, onChange },
      state: { errorFields },
    } = this;
    data[e.target.name] = e.target.value;
    if (e.target.name === Manufacturer) {
      let modelOptions = this.getModelOptions(
        e.target.value,
        this.props.manufacturerModelMap
      );
      data[Model] = modelOptions[0];
      this.setState({ modelOptions });
    }
    if (e.target.error !== "") {
      errorFields[e.target.name] = e.target.error;
    } else {
      delete errorFields[e.target.name];
    }
    const canApply =
      isDefaultObject(errorFields) &&
      isHardwareCompleted(data, true) &&
      data[MAC].length == 12;
    onChange(data, canApply);
  };

  clear = () => {
    let {
      props: { onChange },
      state: { errorFields },
    } = this;
    let data = { ...this.props.data };
    data[MAC] = "";
    data[SecondaryMAC] = "";
    if (this.props.data[MAC] !== "" || this.props.data[SecondaryMAC] !== "") {
      onChange(data, true);
    } else {
      onChange(data, false);
    }
    delete errorFields[MAC];
    this.setState({
      data,
      errorFields,
    });
  };

  getFirmwareOptions = (props) => {
    let firmwarePackage = props.firmwarePackage.data;
    // TODO remove hardcode modeldefault option
    let options = ["modeldefault"];
    if (firmwarePackage !== "null" && firmwarePackage !== undefined) {
      options = options.concat(
        firmwarePackage.map((firmwarePackage) => firmwarePackage["Version"])
      );
    }
    return options;
  };
  getModelOptions = (manufacturer, manufacturerModelMap) => {
    let options = [this.props.data.Manufacturer];
    if (manufacturer == null || manufacturer == "") return options;
    if (manufacturerModelMap && manufacturerModelMap.data) {
      options = [...manufacturerModelMap.data.get(manufacturer)];
      return options;
    }
    return options;
  };
  getWrapperField(title, name, options, Tag, btnOptions) {
    let {
      props: { isEditMode, data },
    } = this;
    return (
      <EditorField
        isEditMode={isEditMode}
        title={title}
        name={name}
        hasButton={name === MAC ? true : false}
        options={{ value: data[name], ...options }}
        btnOptions={btnOptions}
        Tag={Tag}
        onChange={this.change}
      />
    );
  }

  render() {
    let {
      props: { isLoaded, isEditMode, data, status, editingId, onChange },
      state: {
        errorFields,
        manufacturerOptions,
        modelOptions,
        firmwarePackageOptions,
      },
    } = this;
	const canEditModel = (status == "" ||
		status.indexOf("F") >= 0 ||
		status.indexOf("I") >= 0 ||
		status.indexOf("B") >= 0 ||
		status.indexOf("W") >= 0 ||
		status.indexOf("O") >= 0);
    return (
      isLoaded && (
        <ul className="editor-content">
          {this.getWrapperField(
            "MANUFACTURER",
            Manufacturer,
            {
              type: "select",
              options: manufacturerOptions,
              value: data[Manufacturer] ?? "",
              data: data,
              disabled: true,
            },
            Select
          )}
          {this.getWrapperField(
            "MODEL",
            Model,
            {
              type: "select",
              options: modelOptions,
              value: data[Model] ?? "",
              data: data,
              disabled: true,
            },
            Select
          )}
          {this.getWrapperField(
            "MAC Address",
            MAC,
            {
              type: "text",
              max: 12,
              className: "w-240",
              showCharacterCounter: true,
              placeholder: "0-9 or A-F (a-f)",
              disabled: !canEditModel,
              error: errorFields[MAC],
            },
            Input,
            {
              btnName: "CLEAR",
              btnDisabled: !canEditModel,
              btnClick: this.clear,
            }
          )}
        </ul>
      )
    );
  }
}
