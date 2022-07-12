import React, { Fragment } from "react";
import { EditorContainer } from "components/Card";
import ModuleTable from "./ModuleTable";
import DeleteObjectAlert from "components/Alert/DeleteObjectAlert";
import ModuleEditor from "components/Module/ModuleEditor";
import Checkbox from "components/Form/Checkbox";

import { updateTerminal } from "actions/TerminalActions";
import { showInfoBar } from "actions/InfobarActions";

import { clone, objectEqual } from "lib/Util";

import {
  InstalledModules,
  ModuleApplyAll,
} from "const/Terminals/TerminalFieldNames";
import { TERMINAL_MODULE_APPLY_ALL } from "const/Message";

import { isInheritedFromParent } from "utils/Check";

import { apiAddModule, apiDeleteModule, apiUpdateModule } from "api";

const applyAllStyles = {
  top: "4px",
  height: "24px",
  width: "24px",
};

export default class ModuleCard extends React.Component {
  constructor(props) {
    super(props);
    const modules = this.getModulesData();
    const isInherited = isInheritedFromParent(
      props.parentTerminal.data,
      ModuleApplyAll
    );
    this.state = {
      isInherited: isInherited,
      data: props.data.data != null ? Object.assign({}, props.data.data) : {},
      modules: modules,
      editingModuleId: undefined,
      editingId: undefined,
      deleteId: undefined,
      deleteIds: [],
      addModules: [],
      ids:
        props.isLoaded &&
        props.data.data[InstalledModules]?.split(",").map((id) => parseInt(id)),
      showModuleEditor: false,
      showModuleDeleteAlert: false,
      edited: false,
      canApply: false,
    };
  }

  componentDidUpdate(prevProps, prevStates) {
    // set UI data with props when cancel or apply
    if (prevProps.isEditMode !== this.props.isEditMode) {
      const modules = this.getModulesData();
      const ids = this.props.data.data[InstalledModules].split(",").map((id) =>
        parseInt(id)
      );
      this.setState({
        modules: modules,
        deleteIds: [],
        addModules: [],
        ids: ids,
      });
    } else if (this.shouldUpdateModulesData(prevProps)) {
      const modules = this.getModulesData();
      this.setState({ modules: modules });
    }
  }

  shouldUpdateModulesData(prevProps) {
    let isModuleListChanged = false;
    let isModuleSettingsChanged = false;
    let isPossibleModuleSettingsChanged = false;
    let isMsIdWrappersChanged = false;
    isModuleListChanged =
      this.props.modules.state != "LOADING" &&
      this.props.modules.data != null &&
      !objectEqual(prevProps.modules.data, this.props.modules.data);
    isModuleSettingsChanged =
      this.props.moduleSettings.state != "LOADING" &&
      this.props.moduleSettings.data != null &&
      !objectEqual(
        prevProps.moduleSettings.data,
        this.props.moduleSettings.data
      );
    isPossibleModuleSettingsChanged =
      this.props.possibleModuleSettings.state != "LOADING" &&
      this.props.possibleModuleSettings.data != null &&
      !objectEqual(
        prevProps.possibleModuleSettings.data,
        this.props.possibleModuleSettings.data
      );
    isMsIdWrappersChanged =
      this.props.msIdWrappers.state != "LOADING" &&
      this.props.msIdWrappers.data != null &&
      !objectEqual(prevProps.msIdWrappers.data, this.props.msIdWrappers.data);
    return (
      isModuleListChanged ||
      isModuleSettingsChanged ||
      isPossibleModuleSettingsChanged ||
      isMsIdWrappersChanged
    );
  }

  change = (e) => {
    let {
      state: { data },
    } = this;
    data[e.target.name] = e.target.value;
    const edited = this.checkEdit(
      this.state.modules,
      this.props.modules.data,
      this.state.data
    );
    this.setState({ data, edited: edited, canApply: edited }, () => {
      this.props.onChangeEdit(edited);
    });
  };

  apply = async () => {
    let {
      props: { dispatch, isGroup, editingId, onChangeEdit },
      state: { data, modules, deleteIds },
    } = this;

    if (!!dispatch) {
      let ids = [...this.state.ids];
      try {
        // delete modules
        for (const deleteId of deleteIds) {
          const response = await apiDeleteModule(deleteId);
          if (response.result === false) {
            const errorMsg = response.data;
            throw Error(errorMsg);
          }
        }
        // update and add modules
        for (const module of modules) {
          if (module.Id != null && module.Id != 0) {
            const response = await apiUpdateModule(module.Id, module);
            if (response.result === false) {
              const errorMsg = response.data;
              throw Error(errorMsg);
            }
          } else {
            const responseAdd = await apiAddModule(editingId, module);
            if (responseAdd.result === false) {
              const errorMsg = responseAdd.data;
              throw Error(errorMsg);
            }
            ids.push(parseInt(newId));
          }
        }
        data[InstalledModules] = ids.join(",");
        updateConfig =
          isGroup === true
            ? {
                ModuleApplyAll: data[ModuleApplyAll],
                InstalledModules: data[InstalledModules],
              }
            : {
                InstalledModules: data[InstalledModules],
              };

        dispatch(updateTerminal(editingId, updateConfig, false));
      } catch (err) {
        const errorMsg = err.message;
        dispatch(showInfoBar(errorMsg, "error"));
      }
      this.setState(
        {
          deleteId: undefined,
          deleteIds: [],
          addModules: [],
          edited: false,
          canApply: false,
        },
        () => {
          onChangeEdit(this.state.edited);
        }
      );
      this.props.onCancel("ModulesCard");
    }
  };

  checkEdit = (modules, oriModules, data) => {
    const isGroup = this.props.isGroup;
    const applyAllEdit =
      isGroup === false
        ? false
        : data[ModuleApplyAll] !== this.props.data.data[ModuleApplyAll];
    if (applyAllEdit === true) return applyAllEdit;

    const numberEdit =
      Object.keys(modules).length !== Object.keys(oriModules).length;
    if (numberEdit === true) return numberEdit;

    const moduleEdit = Object.values(modules).some((module) =>
      module.Setting.some(
        (item, idx) =>
          oriModules[module.ModuleId] == null ||
          oriModules[module.ModuleId][idx] == null ||
          item.Value != oriModules[module.ModuleId][idx].Value
      )
    );
    if (moduleEdit === true) return moduleEdit;

    return false;
  };

  onConfirm = (module) => {
    let {
      props: { possibleModuleSettings, onChangeEdit },
      state: { data, editingId, modules, addModules, ids, deleteIds, edited },
    } = this;
    const oriModules = this.getModulesData();
    if (editingId == null) {
      if (oriModules[module["ModuleId"]] == null) {
        addModules.push(module);
      } else {
        module["Id"] = oriModules[module["ModuleId"]].Id;
        const deleteIdx = deleteIds.indexOf(module["Id"]);
        if (deleteIdx !== -1) {
          deleteIds.splice(deleteIdx, 1);
          // recover from ids
          ids.push(module["Id"]);
        }
      }
    }
    module["PossibleModuleSetting"] =
      possibleModuleSettings.data[module["ModuleId"]];
    modules[module["ModuleId"]] = module;

    edited = this.checkEdit(modules, this.props.modules.data, data);

    this.setState(
      { modules, addModules, deleteIds, ids, edited, canApply: edited },
      () => {
        onChangeEdit(edited);
      }
    );

    this.closeModuleEditor();
  };
  deleteModule = () => {
    let {
      props: { onChangeEdit },
      state: {
        data,
        modules,
        ids,
        deleteIds,
        edited,
        editingModuleId,
        deleteId,
      },
    } = this;

    if (editingModuleId == null) return;

    delete modules[editingModuleId];
    if (deleteId !== 0) {
      deleteIds.push(deleteId);
      // remove from ids
      const deleteIdx = ids.indexOf(deleteId);
      ids.splice(deleteIdx, 1);
    }

    edited = this.checkEdit(modules, this.props.modules.data, data);

    this.closeModuleDeleteAlert();
    this.setState(
      {
        modules,
        edited,
        ids,
        deleteIds,
        canApply: edited,
      },
      () => {
        onChangeEdit(edited);
      }
    );
  };

  getModulesData() {
    const data = clone(this.props.data.data);
    const msIdWrappers = clone(this.props.msIdWrappers.data);
    const modules = clone(this.props.modules.data);
    const moduleSettings = clone(this.props.moduleSettings.data);
    const possibleModuleSettings = clone(
      this.props.possibleModuleSettings
    ).data;
    if (
      data == null ||
      data == "" ||
      msIdWrappers == null ||
      modules == null ||
      moduleSettings == null ||
      possibleModuleSettings == null
    ) {
      return [];
    }
    let moduleDetails = [];
    let installedModules = data[InstalledModules].split(",").map((id) =>
      parseInt(id)
    );
    if (modules != null && moduleSettings != null && msIdWrappers != null) {
      for (let i = 0; i < installedModules.length; i++) {
        let data = {};
        const msId = installedModules[i];
        let moduleId;
        const msIdWrapper = msIdWrappers.find(
          (wrapper) => wrapper["Id"] == msId
        );
        if (msIdWrapper == null) continue;
        moduleId = msIdWrapper["ModuleId"];
        if (Number.isNaN(msId)) continue;
        if (Number.isNaN(moduleId)) continue;
        data["Setting"] = [];
        if (modules[moduleId] != null && modules[moduleId] != "") {
          modules[moduleId].forEach((item) => {
            data["Setting"].push({ Key: item["Key"], Value: item["Value"] });
          });
        }
        data["PossibleModuleSetting"] = [];
        if (possibleModuleSettings[moduleId] != null) {
          possibleModuleSettings[moduleId].forEach((item) => {
            data["PossibleModuleSetting"].push({
              Key: item["Key"],
              Value: item["Value"],
              Type: item["Type"],
              Description: item["Description"],
            });
          });
        }
        data["Id"] = msId;
        data["ModuleId"] = moduleId;
        data["Name"] = this.getModuleName(moduleId);
        data["Type"] = this.getModuleType(moduleId);
        moduleDetails.push(data);
      }
      return moduleDetails;
    }
    return moduleDetails;
  }
  getModuleType(moduleId) {
    const moduleSettings = this.props.moduleSettings.data;
    if (moduleSettings == null) return -1;
    const moduleSetting = moduleSettings.find((item) => item["Id"] == moduleId);
    if (moduleSetting == null) return -1;
    return moduleSetting["Type"];
  }
  getModuleName(moduleId) {
    const moduleSettings = this.props.moduleSettings.data;
    if (moduleSettings == null) return -1;
    const moduleSetting = moduleSettings.find((item) => item["Id"] == moduleId);
    if (moduleSetting == null) return -1;
    return moduleSetting["Name"];
  }

  openModuleEditor = (id = undefined, moduleId = undefined) => {
    this.setState({
      showModuleEditor: true,
      editingId: id,
      editingModuleId: moduleId,
    });
  };
  closeModuleEditor = () => {
    this.setState({ showModuleEditor: false });
  };
  openModuleDeleteAlert = (id = undefined, editingModuleId) => {
    this.setState({
      showModuleDeleteAlert: true,
      editingModuleId: editingModuleId,
      deleteId: id,
    });
  };
  closeModuleDeleteAlert = () => {
    this.setState({
      showModuleDeleteAlert: false,
      editingModuleId: undefined,
      deleteId: undefined,
    });
  };

  render() {
    let {
      props: {
        isLoading,
        isLoaded,
        isEditMode,
        isGroup,
        moduleSettings,
        possibleModuleSettings,
        parentTerminal,
        onEdit,
        onCancel,
      },
      state: {
        isInherited,
        editingId,
        editingModuleId,
        data,
        modules,
        showModuleEditor,
        showModuleDeleteAlert,
        edited,
        canApply,
      },
    } = this;

    return (
      <Fragment>
        {/*isLoading && <p>Loading...</p>*/}
        {!isLoaded && ( /*{!isLoading && !isLoaded && (*/
          <div className="wrap-960 wrap-bg-w modal-content-edit">
            No data found...
          </div>
        )}
        {isLoaded && ( /*{!isLoading && isLoaded && (*/
          <Fragment>
            <EditorContainer
              isEditMode={isEditMode}
              title="MODULE"
              edited={edited}
              canApply={canApply}
              onEdit={onEdit}
              onCancel={onCancel}
              onApply={this.apply}
            >
              {isInherited && (
                <div className="subject ml-16">
                  Inherited from {parentTerminal.data["Name"]}
                </div>
              )}
              {isGroup && !isInherited && (
                <Checkbox
                  title={TERMINAL_MODULE_APPLY_ALL}
                  name={ModuleApplyAll}
                  labelClass="subject ml-16"
                  inputStyle={applyAllStyles}
                  value={data[ModuleApplyAll] ?? false}
                  disabled={!isEditMode}
                  onChange={this.change}
                />
              )}
              <div className="flex end">
                {!isInherited && isEditMode && (
                  <div
                    className="addnew-btn"
                    onClick={() => this.openModuleEditor()}
                  >
                    <a>+ ADD MODULE</a>
                  </div>
                )}
              </div>
              {modules.length !== 0 &&
                modules.map((module) => (
                  <ModuleTable
                    isEditMode={!isInherited ? isEditMode : false}
                    key={`${module.Id}`}
                    data={module}
                    openEditor={() =>
                      this.openModuleEditor(module.Id, module.ModuleId)
                    }
                    trash={() =>
                      this.openModuleDeleteAlert(module.Id, module.ModuleId)
                    }
                    apply={this.apply}
                  />
                ))}
            </EditorContainer>
            {showModuleEditor && (
              <ModuleEditor
                data={
                  editingModuleId != null ? modules[editingModuleId] : undefined
                }
                modules={modules}
                editingId={editingId}
                isAdd={editingId == null ? true : false}
                moduleSettings={moduleSettings}
                possibleModuleSettings={possibleModuleSettings}
                onCancel={this.closeModuleEditor}
                onConfirm={this.onConfirm}
              />
            )}
            {showModuleDeleteAlert && (
              <DeleteObjectAlert
                isPermanently={false}
                description="Are you sure you want to delete the following module?"
                objectType="module"
                yes={this.deleteModule}
                no={this.closeModuleDeleteAlert}
              />
            )}
          </Fragment>
        )}
      </Fragment>
    );
  }
}
