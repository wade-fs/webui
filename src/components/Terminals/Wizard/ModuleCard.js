import React, { Fragment } from "react";
import { ApplyAll } from "components/Card";
import DeleteObjectAlert from "components/Alert/DeleteObjectAlert";
import ModuleEditor from "components/Module/ModuleEditor";
import { Name, ModuleApplyAll } from "const/Terminals/TerminalFieldNames";

import { isInheritedFromParent } from "utils/Check";

export default class ModuleCard extends React.Component {
  constructor(props) {
    super(props);
    const isInherited = isInheritedFromParent(
      props.parentTerminal.data,
      ModuleApplyAll
    );
    this.state = {
      isInherited: isInherited,
      modules: props.modules,
      editingModuleId: undefined,
      showModuleEditor: false,
      showModuleDeleteAlert: false,
    };
  }

  setApplyAll = (e) => {
    const config = {
      ModuleApplyAll: e.target.value,
    };
    this.props.onChange(config);
  };

  openModuleEditor = (e, moduleId = undefined) => {
    e.stopPropagation();
    this.setState({
      showModuleEditor: true,
      editingModuleId: moduleId,
    });
  };
  openModuleDeleteAlert = (e, moduleId) => {
    e.stopPropagation();
    this.setState({ showModuleDeleteAlert: true, deleteModuleId: moduleId });
  };
  closeModuleDeleteAlert = () => {
    this.setState({ showModuleDeleteAlert: false });
  };

  deleteModule = () => {
    let {
      state: { modules, editingModuleId },
    } = this;
    delete modules[editingModuleId];
    this.setState({
      modules,
    });
    this.closeModuleDeleteAlert();
  };

  select = (moduleId) => {
    let editingModuleId;
    if (moduleId === this.state.editingModuleId) {
      editingModuleId = undefined;
    } else {
      editingModuleId = moduleId;
    }

    this.setState({ editingModuleId: editingModuleId });
  };

  onCancel = () => {
    this.setState({ showModuleEditor: false });
  };
  // Input data: {Id: moduleId, Type: moduleType, Name: moduleName, Setting: [{Key: moduleKey, Value: moduleValue}]}
  onConfirm = (data) => {
    let {
      state: { modules, editingModuleId },
      props: { onChange, possibleModuleSettings },
    } = this;
    data["PossibleModuleSetting"] =
      possibleModuleSettings.data[data["ModuleId"]];
    if (editingModuleId == null) {
      modules[data["ModuleId"]] = data;
    } else {
      modules[editingModuleId] = data;
    }

    this.setState(
      {
        modules,
        showModuleEditor: false,
      },
      () => {
        if (!!onChange) {
          onChange(modules);
        }
      }
    );
  };

  getModuleButton(module) {
    let {
      props: { moduleSettings },
      state: { isInherited, editingModuleId },
    } = this;
    const settings = moduleSettings.data.find(
      (item) => item.Id === module.ModuleId
    );
    return (
      <div
        key={module.Name}
        className={
          "schedule-btn-2" +
          (module.ModuleId == 0 ? " mt-24 mb-8" : " mb-8") +
          (editingModuleId == module.ModuleId ? "  select" : "")
        }
        onClick={() => this.select(module.ModuleId)}
      >
        {`${settings?.Name}${" : "}${settings?.Type}`}
        {!isInherited && editingModuleId == module.ModuleId && (
          <div className="action-region">
            <div
              className="action-edit-sm mr-16"
              onClick={(e) => this.openModuleEditor(e, module.ModuleId)}
            ></div>
            <div
              className="action-delete-sm"
              onClick={(e) => this.openModuleDeleteAlert(e, module.ModuleId)}
            ></div>
          </div>
        )}
      </div>
    );
  }

  render() {
    let {
      props: {
        isGroup,
        otherApplyAll,
        parentTerminal,
        moduleSettings,
        possibleModuleSettings,
      },
      state: {
        isInherited,
        modules,
        editingModuleId,
        showModuleEditor,
        showModuleDeleteAlert,
      },
    } = this;

    return (
      <Fragment>
        <div className="wrap01 wrap-bg-w clearfix pb-8">
          <h3 className=" border-bottom h-40">MODULES</h3>
          {isInherited && (
            <span style={{ float: "right" }}>
              Inherit from {parentTerminal.data[Name]}
            </span>
          )}
          {isGroup && (
            <ApplyAll
              name={ModuleApplyAll}
              isEditMode={true}
              value={otherApplyAll[ModuleApplyAll] ?? false}
              onChange={this.setApplyAll}
              disabled={isInherited}
            />
          )}
          <div className="align-left">
            {!isInherited && (
              <div className="addnew-btn" onClick={this.openModuleEditor}>
                ＋ ADD NEW
              </div>
            )}
            {modules.map((module) => this.getModuleButton(module))}
          </div>
        </div>
        {showModuleEditor && (
          <ModuleEditor
            data={
              editingModuleId != null ? modules[editingModuleId] : undefined
            }
            modules={modules}
            editingId={0}
            isAdd={editingModuleId == null ? true : false}
            moduleSettings={moduleSettings}
            possibleModuleSettings={possibleModuleSettings}
            onCancel={this.onCancel}
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
    );
  }
}
