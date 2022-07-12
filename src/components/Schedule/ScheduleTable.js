import React, { Fragment } from "react";
import { EditorContainer } from "components/Card";
import Checkbox from "components/Form/Checkbox";
import Table from "components/Other/Table";
import ScheduleEditor from "./ScheduleEditor";
import DeleteObjectAlert from "components/Alert/DeleteObjectAlert";

import { updateSchedules } from "actions/ScheduleActions";

import { getRepeatContent, getStartTimeStamp } from "./ScheduleUtils";
import { objectEqual, arrayEqual } from "lib/Util";

import {
  TERMINAL_SCHEDULE_ENABLE,
  TERMINAL_SCHEDULE_APPLY_ALL,
} from "const/Message";
import {
  Name,
  EnabledSchedule,
  ScheduleApplyAll,
} from "const/Terminals/TerminalFieldNames";
import { DefaultSchedule } from "const/Terminals/Default";

import { checkListEdit, isInheritedFromParent } from "utils/Check";

const applyAllStyles = {
  top: "4px",
  height: "24px",
  width: "24px",
};

export default class ScheduleTable extends React.Component {
  constructor(props) {
    super(props);
    const isInherited = isInheritedFromParent(
      props.parentTerminal.data,
      ScheduleApplyAll
    );
    this.state = {
      isInherited: isInherited,
      data: props.data.data != null ? Object.assign({}, props.data.data) : {},
      schedules:
        props.schedules.data != null
          ? JSON.parse(JSON.stringify(props.schedules.data))
          : [],
      showScheduleEditor: false,
      showDeleteAlert: false,
      editIdx: -1,
      deleteIdx: -1,
      edited: false,
      canApply: false,
    };
  }

  componentDidUpdate(prevProps, prevStates) {
    // set UI data with props when cancel or apply
    if (
      !arrayEqual(prevProps.schedules.data, this.props.schedules.data) ||
      !objectEqual(prevProps.data.data, this.props.data.data)
    ) {
      const data = JSON.parse(JSON.stringify(this.props.data.data));
      const schedules = JSON.parse(
        JSON.stringify(this.props.schedules?.data ?? [])
      );
      this.setState({ data: data, schedules: schedules });
    }
  }

  change = (e) => {
    let {
      state: { data },
    } = this;
    data[e.target.name] = e.target.value;
    const edited = this.checkEdit(
      this.state.schedules,
      this.props.schedules.data,
      data
    );
    this.setState({ data, edited: edited, canApply: edited }, () => {
      this.props.onChangeEdit(edited);
    });
  };

  apply = () => {
    let {
      props: { dispatch, editingId, isGroup },
      state: { data, schedules },
    } = this;
    let oriIds = [];
    if (this.props.data.data.Schedules !== "") {
      oriIds = this.props.data.data.Schedules.split(",");
    }

    const isEnable = data[EnabledSchedule];
    const isApplyAll = data[ScheduleApplyAll];
    dispatch(
      updateSchedules(
        editingId,
        oriIds,
        schedules,
        isEnable,
        isApplyAll,
        "terminals.schedules",
        isGroup
      )
    );
    this.setState({
      isEditMode: false,
      canApply: false,
      edited: false,
    });
    this.props.onCancel("ScheduleCard");
  };
  onAdd = () => {
    this.setState({
      showScheduleEditor: true,
      editIdx: -1,
    });
  };
  onEdit = (idx) => {
    this.setState({
      showScheduleEditor: true,
      editIdx: idx,
    });
  };
  openDeleteAlert = (idx) => {
    this.setState({
      showDeleteAlert: true,
      deleteIdx: idx,
    });
  };
  closeDeleteAlert = () => {
    this.setState({ showDeleteAlert: false });
  };
  closeEditor = () => {
    this.setState({ showScheduleEditor: false });
  };
  saveSchedule = (update) => {
    let {
      props: { onChangeEdit },
      state: { data, schedules, editIdx, edited },
    } = this;

    if (editIdx == -1) {
      schedules.push(update);
    } else {
      schedules.splice(editIdx, 1, update);
    }
    // check edit schedule
    edited = this.checkEdit(schedules, this.props.schedules.data, data);
    this.setState(
      {
        schedules,
        edited,
        showScheduleEditor: false,
        canApply: edited,
      },
      () => {
        onChangeEdit(edited);
      }
    );
  };
  deleteSchedule = () => {
    let {
      props: { onChangeEdit },
      state: { data, schedules, edited, deleteIdx },
    } = this;

    schedules.splice(deleteIdx, 1);
    edited = this.checkEdit(schedules, this.props.schedules.data, data);

    this.setState(
      {
        schedules,
        edited,
        deleteIdx: -1,
        showDeleteAlert: false,
        canApply: edited,
      },
      () => {
        onChangeEdit(edited);
      }
    );
  };

  checkEdit = (schedules, oriSchedules, data) => {
    const isGroup = this.props.isGroup;
    const applyAllEdit =
      isGroup === false
        ? false
        : data[ScheduleApplyAll] !== this.props.data.data[ScheduleApplyAll];
    if (applyAllEdit === true) return applyAllEdit;

    const enabledEdit =
      data[EnabledSchedule] !== this.props.data.data[EnabledSchedule];
    if (enabledEdit === true) return enabledEdit;

    const listEdit = checkListEdit(schedules, oriSchedules);
    if (listEdit === true) return listEdit;

    return false;
  };

  getTableSchedule = (item) => {
    let action = item["Action"];
    let repeat = getRepeatContent(item);
    let time = getStartTimeStamp(item);
    return { Action: action, Date: repeat, Time: time };
  };

  render() {
    let {
      props: {
        isLoading,
        isLoaded,
        isEditMode,
        isGroup,
        objectType = "Terminal",
        parentTerminal,
        onChangeEdit,
        onEdit,
        onCancel,
      },
      state: {
        isInherited,
        data,
        schedules,
        showScheduleEditor,
        showDeleteAlert,
        editIdx,
        deleteIdx,
        edited,
        canApply,
      },
    } = this;

    const enabledSchedule = this.props.data.data[EnabledSchedule];
    let tableOptions = {};
    if (Array.isArray(schedules)) {
      tableOptions = {
        data: schedules.map((item) => this.getTableSchedule(item)),
        canEdit: !isInherited && !enabledSchedule && isEditMode,
        editCallback: this.onEdit.bind(this),
        deleteCallback: this.openDeleteAlert.bind(this),
      };
    }

    return (
      <Fragment>
        {isLoading && <p>Loading...</p>}
        {!isLoading && !isLoaded && (
          <div className="wrap-960 wrap-bg-w modal-content-card">
            No data found...
          </div>
        )}
        {!isLoading && isLoaded && (
          <Fragment>
            <EditorContainer
              isEditMode={isEditMode}
              title="SCHDULE"
              edited={edited}
              canApply={canApply}
              onEdit={onEdit}
              onCancel={onCancel}
              onApply={this.apply}
            >
              <div className="flex">
                <Checkbox
                  title={TERMINAL_SCHEDULE_ENABLE}
                  name={EnabledSchedule}
                  labelClass="align-left subject mt-12 ml-16"
                  inputStyle={applyAllStyles}
                  value={data[EnabledSchedule] ?? false}
                  disabled={
                    isEditMode ? (!isGroup && isInherited ? true : false) : true
                  }
                  onChange={this.change}
                />
                {isInherited && (
                  <div className="subject ml-16">
                    Inherited from {parentTerminal.data[Name]}
                  </div>
                )}
                {isGroup && !isInherited && (
                  <Checkbox
                    title={TERMINAL_SCHEDULE_APPLY_ALL}
                    name={ScheduleApplyAll}
                    labelClass="subject ml-16"
                    inputStyle={applyAllStyles}
                    value={data[ScheduleApplyAll] ?? false}
                    disabled={!isEditMode}
                    onChange={this.change}
                  />
                )}
                {!isInherited && !enabledSchedule && isEditMode && (
                  <div className="addnew-btn end" onClick={this.onAdd}>
                    ＋ ADD NEW
                  </div>
                )}
              </div>
              {Array.isArray(schedules) && schedules.length > 0 && (
                <div className="clearfix">
                  <Table options={tableOptions} />
                </div>
              )}
            </EditorContainer>
            {showDeleteAlert && (
              <DeleteObjectAlert
                isPermanently={false}
                description="Are you sure you want to delete the following schedule?"
                objectType="schedule"
                yes={this.deleteSchedule}
                no={this.closeDeleteAlert}
              />
            )}
            {showScheduleEditor && (
              <ScheduleEditor
                isAdd={editIdx === -1}
                data={editIdx === -1 ? DefaultSchedule : schedules[editIdx]}
                objectType={objectType}
                onClose={this.closeEditor}
                onConfirm={this.saveSchedule}
                onChangeEdit={onChangeEdit}
              />
            )}
          </Fragment>
        )}
      </Fragment>
    );
  }
}
