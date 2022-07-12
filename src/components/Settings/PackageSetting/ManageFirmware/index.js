import React, { Fragment } from "react";
import { ItemField } from "components/Card";
import Checkbox from "components/Form/Checkbox";
import Select from "components/Form/Select";
import RadioButton from "components/Form/RadioButton";
import CopyFirmwareSettings from "./CopyFirmwareSettings";
import EditFirmwareSettings from "./EditFirmwareSettings";

import {
  updateFirmwareSettings,
  loadFirmwareSettings,
  copyPackage,
  deletePackage,
  downloadPackage,
  loadPackages,
  lockPackage,
  renamePackage,
} from "actions/SettingActions";

import { clone, stringValid, objectEqual } from "lib/Util";
import { getCustomizeData } from "../../Utils";

import { FirmwareSettingFields, Firmware } from "const/Consts";
import { LOADING, LOADED } from "const/DataLoaderState";

export default class ManageFirmware extends React.Component {
  constructor(props) {
    super(props);
    let firmwares = [];
    if (
      props.packages.packageList.state == LOADED &&
      props.packages.packageList.data != null
    ) {
      firmwares = props.packages.packageList.data.filter(
        (item) => item.Type == Firmware
      );
    }
    let manufacturerOptions;
    let data;
    if (Array.isArray(props.manufacturerModelMap.data)) {
      manufacturerOptions = [...props.manufacturerModelMap.data.keys()];
      data = this.getData(props);
    }
    this.state = {
      data: data,
      isEditMode: true,
      firmwares: firmwares,
      copySettingsOpened: false,
      editSettingsOpened: false,
      editingIdx: -1,
      editingFirmware: null,
      modelOptions: Array.isArray(props.manufacturerModelMap.data)
        ? [...props.manufacturerModelMap.data.get(data.Manufacturer)]
        : [],
      manufacturerOptions: manufacturerOptions,
    };
  }

  componentDidUpdate(prevProps) {
    if (
      !objectEqual(
        this.props.packages.firmwareSettings.data,
        prevProps.packages.firmwareSettings.data
      ) ||
      !objectEqual(
        this.props.packages.packageList.data,
        prevProps.packages.packageList.data
      )
    ) {
      let data = this.getData(this.props);
      this.setState({
        data: { ...this.state.data, ...data },
        modelOptions:
          this.props.manufacturerModelMap.data != null
            ? [...this.props.manufacturerModelMap.data.get(data.Manufacturer)]
            : [],
      });
    }
  }

  change = (e) => {
    let {
      state: { data },
    } = this;
    // Firmware Settings
    if (FirmwareSettingFields.includes(e.target.name)) {
      this.props.dispatch(
        updateFirmwareSettings(
          data.Manufacturer,
          data.Model,
          getCustomizeData(FirmwareSettingFields, this.state.data)
        )
      );
    }

    // Manufacturer Model
    if (e.target.name == "Manufacturer" || e.target.name == "Model") {
      if (e.target.name == "Manufacturer") {
        let manufacturerModelMap = this.props.manufacturerModelMap.data;
        if (manufacturerModelMap != null) {
          let modelOptions = [...manufacturerModelMap.get(e.target.value)];
          this.setState({ modelOptions });
        }
      }
      if (stringValid(data.Manufacturer) && stringValid(data.Model)) {
        this.props.dispatch(
          loadFirmwareSettings(data.Manufacturer, data.Model)
        );
      }
    }
  };
  getData(props) {
    let data = {};
    // Firmware Settings
    let firmwareSettings = props.packages.firmwareSettings;
    if (firmwareSettings.data != LOADING && firmwareSettings.data != null) {
      data = {
        ...data,
        ...firmwareSettings.data,
      };
    }
    data.Manufacturer = props.manufacturerModelMap.data.keys().next().value;
    data.Model = props.manufacturerModelMap.data
      .get(data.Manufacturer)
      .values()
      .next().value;
    return data;
  }
  lock(index) {
    let {
      state: { firmwares },
    } = this;
    this.props.dispatch(
      lockPackage(firmwares[index].Id, !firmwares[index].Locked)
    );
    firmwares[index].Locked = !firmwares[index].Locked;
    this.setState({ firmwares });
  }
  download(index) {
    this.props.dispatch(downloadPackage(this.state.firmwares[index].Id));
  }
  copy = (firmware) => {
    this.props.dispatch(copyPackage(firmware.Id, firmware.Name));
    let {
      state: { firmwares },
    } = this;
    firmwares.push(firmware);
    this.setState({ firmwares });
    this.closeCopySettings();
  };
  edit = (firmware, index) => {
    let {
      state: { firmwares },
    } = this;
    this.props.dispatch(renamePackage(firmware.Id, firmware.Name));
    firmwares[index] = firmware;
    this.setState({ firmwares });
    this.closeEditSettings();
  };
  delete(index) {
    let {
      state: { firmwares },
    } = this;
    this.props.dispatch(deletePackage(firmwares[index].Id));
    firmwares.splice(index, 1);
    this.setState(firmwares);
  }
  openCopySettings(firmware, index) {
    this.setState({
      copySettingsOpened: true,
      editingFirmware: firmware,
      editingIdx: index,
    });
  }
  closeCopySettings = () => {
    this.setState({
      copySettingsOpened: false,
      editingFirmware: null,
      editingIdx: -1,
    });
  };
  openEditSettings(firmware, index) {
    this.setState({
      editSettingsOpened: true,
      editingFirmware: firmware,
      editingIdx: index,
    });
  }
  closeEditSettings = () => {
    this.setState({
      editSettingsOpened: false,
      editingFirmware: null,
      editingIdx: -1,
    });
  };
  getWrapperField(title, name, options, Tag) {
    let {
      state: { isEditMode, data },
    } = this;
    return (
      <Fragment>
        <label>{title}</label>
        <ItemField
          isEditMode={isEditMode}
          title={title}
          name={name}
          options={{ value: data != null ? data[name] : "", ...options }}
          Tag={Tag}
          onChange={this.change}
        />
      </Fragment>
    );
  }
  getSettingCard(firmware, index) {
    return (
      <div key={firmware.Name}>
        <div className={index == 0 ? " mt-40" : ""}>
          <div>
            <h3 style={{ display: "inline" }}>{firmware.Name}</h3>
            {this.getWrapperField(
              firmware.Id,
              "DefaultPackageId",
              {
                type: "radio",
                style: {
                  position: "relative",
                  marginLeft: "10px",
                  top: "10px",
                },
                inputClass: "",
              },
              RadioButton
            )}
          </div>
          <div
            className={"list-lock-icon" + (firmware.Locked ? " this" : "")}
            onClick={() => this.lock(index)}
          ></div>
          <div
            className="list-download-icon"
            onClick={() => this.download(index)}
          ></div>
          <div
            className="list-copy-icon"
            onClick={() => this.openCopySettings(firmware, index)}
          ></div>
          <div
            className="action-edit-sm"
            onClick={() => this.openEditSettings(firmware, index)}
          ></div>
          <div
            className="action-delete-sm"
            onClick={() => this.delete(index)}
          ></div>
        </div>
      </div>
    );
  }

  render() {
    let {
      props: { manufacturerModelMap },
      state: {
        firmwares,
        copySettingsOpened,
        editSettingsOpened,
        editingFirmware,
        editingIdx,
        manufacturerOptions,
        modelOptions,
      },
    } = this;
    return (
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          height: "100%",
        }}
      >
        <div className="setting-sidebar left-right">
          {Array.isArray(manufacturerModelMap.data) && (
            <div
              className="align-left left-right"
              style={{ marginBottom: "10px" }}
            >
              {this.getWrapperField(
                "Allow the package setting in Terminal configuration.",
                "AllowPackageAtTerminal",
                { type: "checkbox" },
                Checkbox
              )}
            </div>
          )}
          <div className="clearfix" style={{ paddingBottom: "6px" }}>
            {this.getWrapperField(
              "MANUFACTURER",
              "Manufacturer",
              {
                type: "select",
                options: manufacturerOptions,
              },
              Select
            )}
            {this.getWrapperField(
              "MODEL",
              "Model",
              {
                type: "select",
                options: modelOptions,
              },
              Select
            )}
            <div
              className="clearfix align-left"
              style={{ marginLeft: "20px", paddingTop: "8px" }}
            >
              {Array.isArray(manufacturerModelMap.data) &&
                this.getWrapperField(
                  "Allow Chain Loader",
                  "AllowChainLoader",
                  { type: "checkbox" },
                  Checkbox
                )}
            </div>
          </div>
          {firmwares.map((firmware, index) =>
            this.getSettingCard(firmware, index)
          )}
        </div>
        {copySettingsOpened && (
          <CopyFirmwareSettings
            data={{ data: editingFirmware }}
            index={editingIdx}
            onConfirm={this.copy}
            onCancel={this.closeCopySettings}
          />
        )}
        {editSettingsOpened && (
          <EditFirmwareSettings
            data={{ data: editingFirmware }}
            index={editingIdx}
            onConfirm={this.edit}
            onCancel={this.closeEditSettings}
          />
        )}
      </div>
    );
  }
}
