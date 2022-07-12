import React, { Fragment } from "react";
import { ApplyAll } from "components/Card";
import ScheduleEditor from "./ScheduleEditor";
import DeleteObjectAlert from "components/Alert/DeleteObjectAlert";

import { ScheduleApplyAll } from "const/Terminals/TerminalFieldNames";

import { isInheritedFromParent } from "utils/Check";

import {
  getRepeatContent,
  getStartTimeStamp,
  getTimeContent,
} from "./ScheduleUtils";

export default class ScheduleWizard extends React.Component {
  constructor(props) {
    super(props);
    const isInherited = isInheritedFromParent(
      props.parentTerminal,
      ScheduleApplyAll
    );
    this.state = {
      isInherited: isInherited,
      data: props.data == null ? [] : props.data,
      config: props.config,
      editIdx: -1,
      showScheduleEditor: false,
      showDeleteAlert: false,
    };
  }

  setApplyAll = (e) => {
    const config = {
      ScheduleApplyAll: e.target.value,
    };
    this.setState({ config: config });
    this.props.onChange(config);
  };

  openScheduleEditor = (e, cleanEditId = false) => {
    e.stopPropagation();
    this.setState({
      showScheduleEditor: true,
    });
    if (cleanEditId) {
      this.setState({ editIdx: -1 });
    }
  };
  closeEditor = () => {
    this.setState({ showScheduleEditor: false });
  };
  openDeleteAlert = (e) => {
    e.stopPropagation();
    this.setState({ showDeleteAlert: true });
  };
  closeDeleteAlert = () => {
    this.setState({ showDeleteAlert: false });
  };

  editScheduleCard = (editIdx) => {
    if (editIdx != this.state.editIdx) {
      this.setState({ editIdx });
    } else {
      this.setState({ editIdx: -1 });
    }
  };
  saveSchedule = (schedule) => {
    let {
      state: { data, editIdx },
      props: { onChange },
    } = this;
    if (editIdx != -1) {
      data.splice(editIdx, 1, schedule);
    } else {
      data.push(schedule);
    }
    this.setState({ data });
    if (!!onChange) {
      onChange(data);
    }
    this.closeEditor();
  };
  deleteSchedule = () => {
    let {
      state: { data, editIdx },
      props: { onChange },
    } = this;
    data.splice(editIdx, 1);
    this.setState({ data });
    if (!!onChange) {
      onChange(data, "data");
    }
    this.closeDeleteAlert();
  };

  getScheduleButton(idx) {
    let {
      state: { isInherited, editIdx, data },
    } = this;
    let className = "flex mb-8";
    if (idx == 0) className = className + " mt-24";
    if (editIdx == idx) className = className + " select";
    if (isInherited) className = className + " op-35";
    return (
      <div
        className={className}
        onClick={isInherited ? null : () => this.editScheduleCard(idx)}
      >
        <div className="inline-flex-column w-540">
          <p>{data[idx]["action"]}</p>
          <p>{getTimeContent(data[idx])}</p>
          <p>{getRepeatContent(data[idx])}</p>
        </div>
        {isInherited === false && editIdx == idx && (
          <div className="inline-flex">
            <div
              className="action-edit-sm mr-16"
              onClick={(e) => this.openScheduleEditor(e)}
            ></div>
            <div
              className="action-delete-sm"
              onClick={(e) => this.openDeleteAlert(e)}
            ></div>
          </div>
        )}
      </div>
    );
  }
  getTableSchedule(item) {
    let action = item["Action"];
    let repeat = getRepeatContent(item);
    let time = getStartTimeStamp(item);
    return { Action: action, Date: repeat, Time: time };
  }

  render() {
    let {
      props: { object = "Terminal", isGroup = false, parentTerminal },
      state: {
        isInherited,
        data,
        config,
        showScheduleEditor,
        showDeleteAlert,
        editIdx,
      },
    } = this;
    const parentName = isInherited ? parentTerminal?.Name : null;
    return (
      <Fragment>
        <div className="wrap01 mt-12  wrap-bg-w pb-8 mb-28">
          <h3 className=" border-bottom ">
            SCHEDULE
            {isInherited && (
              <span style={{ float: "right" }}>Inherit from {parentName}</span>
            )}
            {isGroup && (
              <ApplyAll
                name={ScheduleApplyAll}
                isEditMode={true}
                value={config[ScheduleApplyAll] ?? false}
                onChange={this.setApplyAll}
                disabled={isInherited}
              />
            )}
          </h3>
          <div className="align-left mt-16">
            {!isInherited && (
              <div
                className="addnew-btn"
                onClick={(e) => this.openScheduleEditor(e, true)}
              >
                ＋ ADD NEW
              </div>
            )}
            {data.length > 0 &&
              data.map((schedule, idx) => this.getScheduleButton(idx))}
          </div>
        </div>
        {showScheduleEditor && (
          <ScheduleEditor
            isAdd={editIdx === -1}
            data={editIdx === -1 ? {} : data[editIdx]}
            object={object}
            onClose={this.closeEditor}
            onConfirm={this.saveSchedule}
          />
        )}
        {showDeleteAlert && (
          <DeleteObjectAlert
            isPermanently={false}
            description="Are you sure you want to delete the following schedule?"
            objectType="schedule"
            yes={this.deleteSchedule}
            no={this.closeDeleteAlert}
          />
        )}
      </Fragment>
    );
  }
}
