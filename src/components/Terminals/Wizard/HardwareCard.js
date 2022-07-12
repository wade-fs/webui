import React, { Fragment } from "react";
import { WizardField } from "components/Card";
import Input from "components/Form/Input";
import Select from "components/Form/Select";

import { getDisplayOptions } from "actions/TerminalActions";

import { stringValid } from "lib/Util";

import {
  FirmwarePackage,
  Manufacturer,
  Model,
  MAC,
} from "const/Terminals/TerminalFieldNames";
import { modelFixOptions } from "const/Consts";

export default class HardwareCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      manufacturerOptions: [],
      modelOptions: [],
      firmwarePackageOptions: [],
    };
  }

  componentDidMount() {
    let {
      props: {
        dispatch,
        data,
        errorFields,
        manufacturerModelMap,
        firmwarePackage,
        onChange,
        handleErrorFields,
      },
    } = this;
    if (data.Manufacturer === undefined) {
      data[Manufacturer] = [...manufacturerModelMap.data.keys()][0];
      // use data[Manufacturer] to get other options
      let {
        manufacturerOptions,
        modelOptions,
        firmwarePackageOptions,
      } = this.getOptions(
        manufacturerModelMap.data,
        firmwarePackage.data,
        data
      );
      data[Model] = modelOptions[0];
      data[FirmwarePackage] = firmwarePackageOptions[0];
      this.setState(
        {
          manufacturerOptions: manufacturerOptions,
          modelOptions: modelOptions,
          firmwarePackageOptions: firmwarePackageOptions,
        },
        () => {
          onChange(data);
          if (stringValid(data[Manufacturer]) && stringValid(data[Model])) {
            dispatch(getDisplayOptions(data[Manufacturer], data[Model]));
          }
          handleErrorFields(errorFields);
        }
      );
    } else {
      const {
        manufacturerOptions,
        modelOptions,
        firmwarePackageOptions,
      } = this.getOptions(
        manufacturerModelMap.data,
        firmwarePackage.data,
        data
      );
      data[Manufacturer] = data.Manufacturer ?? manufacturerOptions[0];
      data[Model] = data.Model ?? modelOptions[0];
      data[FirmwarePackage] = data.FirmwarePackage ?? firmwarePackageOptions[0];
      data[MAC] = data[MAC];
      this.setState(
        {
          manufacturerOptions: manufacturerOptions,
          modelOptions: modelOptions,
          firmwarePackageOptions: firmwarePackageOptions,
        },
        () => {
          onChange(data);
          if (stringValid(data[Manufacturer]) && stringValid(data[Model])) {
            dispatch(getDisplayOptions(data[Manufacturer], data[Model]));
          }
          handleErrorFields(errorFields);
        }
      );
    }
  }

  change = (e) => {
    let {
      props: {
        dispatch,
        data,
        errorFields,
        manufacturerModelMap,
        firmwarePackage,
        onChange,
        handleErrorFields,
      },
    } = this;
    data[e.target.name] = e.target.value;
    let {
      manufacturerOptions,
      modelOptions,
      firmwarePackageOptions,
    } = this.getOptions(manufacturerModelMap.data, firmwarePackage.data, data);
    if (e.target.name === Manufacturer) {
      data[Model] = modelOptions[0];
    }
    this.setState({
      manufacturerOptions: manufacturerOptions,
      modelOptions: modelOptions,
      firmwarePackageOptions: firmwarePackageOptions,
    });
    if (!!onChange) {
      onChange(data);
    }
    if (
      (e.target.name === Manufacturer || e.target.name === Model) &&
      stringValid(data[Manufacturer]) &&
      stringValid(data[Model])
    ) {
      dispatch(getDisplayOptions(data[Manufacturer], data[Model]));
    }
    if (e.target.error !== "" && e.target.error != null) {
      errorFields[e.target.name] = e.target.error;
    } else {
      delete errorFields[e.target.name];
    }
    handleErrorFields(errorFields);
  };

  clear = () => {
    let {
      props: { data, errorFields, onChange },
    } = this;
    data[MAC] = "";
    delete errorFields[MAC];
    onChange(data);
    handleErrorFields(errorFields);
  };

  getOptions(manufacturerModelMap, firmwarePackage, data) {
    let manufacturerOptions = [];
    let modelOptions = [];
    let firmwarePackageOptions = [];
    if (manufacturerModelMap == null) {
      return { manufacturerOptions, modelOptions, firmwarePackageOptions };
    }
    let manufacturer = data[Manufacturer];
    let model = data[Model];
    let modelKey = `${manufacturer} ${model}`;
    manufacturerOptions =
      manufacturerModelMap instanceof Object &&
      !(manufacturerModelMap instanceof Error)
        ? [...manufacturerModelMap.keys()]
        : [];
    if (manufacturerModelMap.has(manufacturer)) {
      modelOptions = [...manufacturerModelMap.get(manufacturer)];
    }
    if (firmwarePackage !== "null" && firmwarePackage !== undefined) {
      //TODO remove this hardcode modeldefault options
      firmwarePackageOptions = [
        "modeldefault",
        ...firmwarePackage.map((item) => item["Version"]),
      ];
    } else {
      firmwarePackageOptions = ["modeldefault"];
    }
    return {
      manufacturerOptions: [...manufacturerOptions],
      modelOptions: [...modelOptions],
      firmwarePackageOptions: [...firmwarePackageOptions],
    };
  }

  getWrapperField(title, name, options, Tag, btnOptions = {}) {
    let {
      props: { data },
    } = this;
    return (
      <WizardField
        title={title}
        name={name}
        options={{ value: data[name], ...options }}
        Tag={Tag}
        onChange={this.change}
        hasButton={name === MAC ? true : false}
        btnOptions={btnOptions}
      />
    );
  }

  render() {
    let {
      props: { data, errorFields, firmwarePackage },
      state: { manufacturerOptions, modelOptions, firmwarePackageOptions },
    } = this;
    return (
      <Fragment>
        <div className="wrap01 wrap-bg-w pb-24">
          <h3 className="border-bottom">HARDWARE</h3>
          <div className="mt-12 mb-24">
            {this.getWrapperField(
              "Manufacturer",
              Manufacturer,
              {
                type: "select",
                value: data.Manufacturer ?? "",
                options: manufacturerOptions,
                style: { display: "inline-flex" },
                required: true,
              },
              Select
            )}
          </div>
          <div className="mt-12 mb-24">
            {this.getWrapperField(
              "Model",
              Model,
              {
                type: "select",
                value: data.Model ?? "",
                options: modelFixOptions,
                style: { display: "inline-flex" },
                required: true,
              },
              Select
            )}{" "}
          </div>{" "}
          {/* <div className="mt-12 mb-24">
            {this.getWrapperField(
              "Firmware Package",
              FirmwarePackage,
              {
                type: "select",
                value: firmwarePackage.data === "null" ? "modeldefault" : "",
                options: firmwarePackageOptions,
                style: { display: "inline-flex" },
                required: true,
              },
              Select
            )}
          </div> */}
        </div>
        <div className="wrap01 wrap-bg-w pb-24 mt-12">
          <h3 className="border-bottom">TERMINAL</h3>
          <div className="mt-12">
            {this.getWrapperField(
              "MAC Address",
              MAC,
              {
                type: "text",
                max: 12,
                value: data[MAC] ?? "",
                className: "w-240",
                showCharacterCounter: errorFields[MAC] == null,
                placeholder: "0-9 or A-F (a-f)",
                error: errorFields[MAC],
              },
              Input,
              {
                btnName: "CLEAR",
                btnDisabled: false,
                btnClick: this.clear,
              }
            )}
          </div>
        </div>
      </Fragment>
    );
  }
}
