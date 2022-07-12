import React, { Fragment } from "react";
import { stringValid } from "lib/Util";
import { Modal } from "react-bootstrap";
import { CancelAndConfirm } from "components/Form/Button";
import Input from "components/Form/Input";
import Select from "components/Form/Select";
import Slider from "components/Form/Slider";

export default class ModuleEditor extends React.Component {
  constructor(props) {
    super(props);
    let typeNameMap = this.getTypeNameMap(props);
    let typeOptions = [...typeNameMap.keys()];
    let nameOptions = [];
    let selectedModules = [];
    let data = {};
    let selectedType = "";
    let selectedName = "";

    for (const module of Object.values(props.modules)) {
      selectedModules.push(module.Name);
    }
    if (typeOptions.length > 0) {
      if (selectedType !== "") {
        selectedType = props.data.Type;
        nameOptions = [...typeNameMap.get(selectedType)];
      } else {
        selectedType = typeOptions[0];
        nameOptions = [...typeNameMap.get(typeOptions[0])];
      }
    }
    let newOptions = this.checkTypeOptions(selectedModules, nameOptions);
    if (nameOptions.length > 0) {
      selectedName = newOptions[0];
    }
    if (props.data != null) {
      selectedType = props.data["Type"];
      selectedName = props.data["Name"];
      data = this.getUiData(props.data);
      nameOptions = [...typeNameMap.get(selectedType)];
    } else if (
      Array.isArray(Object.keys(this.props.possibleModuleSettings.data))
    ) {
      data["ModuleType"] = typeOptions[0];
      data["ModuleName"] = newOptions[0];
      this.props.possibleModuleSettings.data[0]?.forEach((item) => {
        data[item["Key"]] = item["Default"];
      });
    }
    const canSave = !!selectedName;
    this.state = {
      data: data,
      selectedModules: selectedModules,
      selectedType: selectedType,
      selectedName: selectedName,
      typeOptions: [...typeOptions],
      nameOptions: props.isAdd ? [...newOptions] : [...nameOptions],
      typeNameMap: typeNameMap,
      canSave: canSave,
    };
  }

  change = (e) => {
    let {
      state: { data, selectedType, selectedName, canSave, typeNameMap },
    } = this;
    if (e.target.name == "ModuleType") {
      data = {};
      let nameOptions = [];
      let selectedModules = [];

      selectedType = e.target.value;
      if (typeNameMap.get(e.target.value) != null) {
        nameOptions = [...typeNameMap.get(e.target.value)];
      }
      for (const module of Object.values(this.props.modules)) {
        selectedModules.push(module.Name);
      }
      let newOptions = this.checkTypeOptions(selectedModules, nameOptions);
      if (newOptions.length > 0) {
        selectedName = newOptions[0];
      } else {
        selectedName = "";
      }
      data["ModuleType"] = e.target.value;
      data["ModuleName"] = selectedName;
      const moduleId = this.getModuleId(e.target.value, selectedName);
      if (moduleId !== -1) {
        this.props.possibleModuleSettings.data[moduleId].forEach((item) => {
          data[item["Key"]] = item["Default"];
        });
      }
      this.setState({
        selectedType,
        selectedName,
        nameOptions: [...newOptions],
      });
    } else if (e.target.name == "ModuleName" && e.target.value !== "") {
      data["ModuleType"] = selectedType;
      data["ModuleName"] = e.target.value;
      selectedName = e.target.value;
      const moduleId = this.getModuleId(selectedType, e.target.value);
      this.props.possibleModuleSettings.data[moduleId].forEach((item) => {
        data[item["Key"]] = item["Default"];
      });
      this.setState({
        selectedName,
      });
    } else {
      data[e.target.name] = e.target.value;
    }

    canSave = !!selectedName;
    this.setState({
      data,
      canSave,
    });
  };
  onCancel = () => {
    let {
      props: { onCancel },
    } = this;
    if (!!onCancel) onCancel();
  };
  // send out {Id: moduleId, Type: moduleType, Name: moduleName, Setting: [{Key: moduleKey, Value: moduleValue}]}to call back
  onConfirm = () => {
    let {
      props: { onConfirm, editingId },
      state: { data, selectedType, selectedName },
    } = this;
    if (!!onConfirm) {
      let module = {};
      let moduleId = this.getModuleId(selectedType, selectedName);
      if (moduleId === -1) {
        throw `Cannot find module id for module type: ${selectedType} and module name ${selectedName}`;
        return;
      }
      module["Id"] = editingId ?? 0;
      module["ModuleId"] = moduleId;
      module["Type"] = selectedType;
      module["Name"] = selectedName;
      module["Setting"] = this.getModuleSettings(data);
      onConfirm(module);
    }
  };

  isConfigureActive = () => {
    let {
      state: { data },
    } = this;
    return stringValid(data["ModuleType"]) && stringValid(data["ModuleName"]);
  };

  checkTypeOptions(selectedModules, nameOptions) {
    let newOptions = JSON.parse(JSON.stringify(nameOptions));
    for (const option of nameOptions) {
      for (const name of selectedModules) {
        if (option === name) {
          newOptions.splice(newOptions.indexOf(name), 1);
          break;
        }
      }
    }
    return newOptions;
  }
  // Return module id (string) based on given type and name from module list.
  getModuleId(type, name) {
    let moduleSettings = this.props.moduleSettings.data;
    if (!Array.isArray(moduleSettings)) return -1;
    let module = moduleSettings.find(
      (item) => item["Type"] == type && item["Name"] == name
    );
    if (module == null) return -1;
    return module["Id"];
  }
  getTypeNameMap(props) {
    let typeNameMap = new Map();
    let moduleSettings = props.moduleSettings.data;
    if (!Array.isArray(moduleSettings)) return typeNameMap;
    moduleSettings.forEach((item) => {
      if (!typeNameMap.has(item["Type"])) {
        typeNameMap.set(item["Type"], new Set());
      }
      typeNameMap.get(item["Type"]).add(item["Name"]);
    });
    return typeNameMap;
  }
  // Get real module settings(key value list) from data object.
  getModuleSettings(data) {
    let setting = [];
    Object.keys(data).forEach((key) => {
      if (key != "ModuleType" && key != "ModuleName")
        setting.push({
          Key: key,
          Value: data[key],
        });
    });
    return setting;
  }
  // Get data object from module setting(key value list) used to edit in UI
  getUiData(module) {
    let setting = module["Setting"];
    let data = {};
    setting.forEach((item) => {
      data[item["Key"]] = item["Value"];
    });
    data["ModuleType"] = module["Type"];
    data["ModuleName"] = module["Name"];
    return data;
  }

  getWrapperField(title, key, value, type, className = "mb-24") {
    let Type;
    let options;
    switch (type) {
      case "DropDown":
        Type = Select;
        options = {
          type: "select",
          options: stringValid(value) ? value.split(",") : [],
          value: this.state.data[key],
        };
        break;
      case "Input":
        Type = Input;
        options = {
          type: "number",
          value: this.state.data[key],
          minNumber: 0,
        };
        break;
      case "Switch":
        Type = Slider;
        options = { type: "slider", value: this.state.data[key] };
        break;
      default:
        break;
    }
    return (
      <div key={title} className={className}>
        <label>{title}</label>
        <div className="mt-8">
          <Type title={title} name={key} {...options} onChange={this.change} />
        </div>
      </div>
    );
  }
  getWrapperSelect(title, name, options, outerClass = "mb-24") {
    return (
      <div className={outerClass}>
        <label>{title}</label>
        <div className="mt-8">
          <Select
            title={title}
            name={name}
            {...options}
            onChange={this.change}
          />
        </div>
      </div>
    );
  }

  render() {
    let {
      props: { isAdd },
      state: {
        data,
        typeOptions,
        nameOptions,
        selectedType,
        selectedName,
        canSave,
      },
    } = this;
    let moduleId = this.getModuleId(selectedType, selectedName);
    let moduleSetting = [];
    if (this.props.possibleModuleSettings.data !== undefined) {
      if (isAdd) {
        if (moduleId === -1) moduleId = 0;
        moduleSetting = this.props.possibleModuleSettings.data[moduleId];
      } else {
        moduleSetting = this.props.data["PossibleModuleSetting"];
      }
    }

    return (
      <Modal id="module-pop-editor" show={true}>
        <Modal.Body
          style={{
            backgroundColor: "transparent",
          }}
        >
          <div className="pop-up-window ">
            <h2 className="mb-22">
              {isAdd ? "ADD NEW MODULE" : "EDIT MODULE"}
            </h2>
            <label className="subject">MODULE TYPE</label>
            {this.getWrapperSelect("Type", "ModuleType", {
              type: "select",
              options: typeOptions,
              class: "w100percent h-32",
              value:
                data["ModuleType"] !== undefined
                  ? data["ModuleType"]
                  : typeOptions[0],
              disabled: isAdd ? false : true,
            })}
            {this.getWrapperSelect("Name", "ModuleName", {
              type: "select",
              options: nameOptions,
              class: "w100percent h-32",
              value:
                data["ModuleName"] !== undefined
                  ? data["ModuleName"]
                  : nameOptions[0],
              disabled: isAdd ? false : true,
            })}

            <label
              className={"subject" + (this.isConfigureActive() ? "" : " op-35")}
            >
              CONFIGURE MODULE
            </label>
            <div className="border-bottom"></div>
            {this.isConfigureActive() && (
              <div style={{ maxHeight: "400px", overflowY: "auto" }}>
                {moduleSetting != null &&
                  moduleSetting.map((item, index) =>
                    this.getWrapperField(
                      item["Description"],
                      item["Key"],
                      item["Value"],
                      item["Type"],
                      index == 0 ? "mb-24 mt-24" : "mb-24"
                    )
                  )}
              </div>
            )}
            <CancelAndConfirm
              canConfirm={canSave}
              onConfirm={this.onConfirm}
              onCancel={this.onCancel}
            />
          </div>
        </Modal.Body>
      </Modal>
    );
  }
}
