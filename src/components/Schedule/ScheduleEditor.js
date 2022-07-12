import React, { Fragment } from "react";
import { Modal } from "react-bootstrap";
import { CancelAndConfirm } from "components/Form/Button";
import { ItemField } from "components/Card";
import Select from "components/Form/Select";

import {
  isDefaultObject,
  isNotEmptyObject,
  stringValid,
  minuteHourValidator,
} from "lib/Util";
import {
  getUtcMilliSeconds,
  getDateAndTimeFromUtcMilliseconds,
} from "./ScheduleUtils";

import {
  WEEK,
  MONTH,
  YEAR,
  TimeInterval,
  Everyday,
  EveryWeek,
  EveryMonth,
  EveryYear,
  OnceOnly,
  Enable,
  Disable,
  Minute,
  Hour,
  StartDate,
  EndDate,
  Action,
  Days,
  EndTime,
  FrequencyInMinute,
  StartTime,
  Type,
  terminalActions,
  serverActions,
  allRepeatModels,
  enableDisableRepeatModels,
} from "const/Other/ScheduleConsts";

export default class ScheduleEditor extends React.Component {
  constructor(props) {
    super(props);
    let selectedDays = [];
    if (props.data != null && Object.keys(props.data).length > 0) {
      if (props.data[Type] == EveryWeek && stringValid(props.data[Days])) {
        selectedDays = props.data[Days].split(",").map(
          (day) => WEEK[parseInt(day)]
        );
      }
    }
    const data = this.getUISchedule(props.data);
    this.state = {
      data: data,
      selectedDays: selectedDays,
      repeatModels: this.isEnableDisableAction(data[Action])
        ? enableDisableRepeatModels
        : allRepeatModels,
      canSave: props.isAdd,
      errorFields: {},
    };
  }

  change = (e) => {
    let {
      state: { data, selectedDays, canSave, errorFields },
    } = this;

    data[e.target.name] = e.target.value;
    if (e.target.name === "Action") {
      if (this.isEnableDisableAction(e.target.value)) {
        data[Type] = Everyday;
        if (isNotEmptyObject(errorFields)) errorFields = {};
        this.setState({
          data,
          repeatModels: [Everyday, EveryWeek, EveryMonth, EveryYear, OnceOnly],
        });
      } else {
        data[Type] = TimeInterval;
        data[EndDate] = "";
        data[EndTime] = "";
        data[Minute] = "";
        data[Hour] = "";
        this.setState({
          repeatModels: allRepeatModels,
        });
      }
    } else if (e.target.name === Type) {
      if (e.target.value === TimeInterval) {
        data[EndDate] = "";
        data[EndTime] = "";
        data[Minute] = "";
        data[Hour] = "";
      } else {
        // reset errorFields
        if (isNotEmptyObject(errorFields)) errorFields = {};
      }
    } else if (e.target.name === Minute && e.target.value >= 60) {
      let hour = "";
      if (data[Hour] === "") {
        hour = parseInt(e.target.value / 60) + 0;
      } else {
        hour = parseInt(e.target.value / 60) + parseInt(data[Hour]);
      }
      e.target.value = e.target.value % 60;
      // onChange({ target: { name: Hour, value: hour } });
      data[Hour] = hour;
      data[e.target.name] = e.target.value;
    }

    // check canSave
    canSave =
      isDefaultObject(errorFields) &&
      stringValid(data[Action]) &&
      stringValid(data[Type]) &&
      stringValid(data[StartDate]) &&
      stringValid(data[StartTime]);
    if (data[Type] === TimeInterval) {
      canSave =
        stringValid(data[EndTime]) &&
        stringValid(data[EndDate]) &&
        (stringValid(data[Hour]) || stringValid(data[Minute]));
      if (
        data[EndDate].localeCompare(data[StartDate]) === -1 ||
        (data[EndDate].localeCompare(data[StartDate]) === 0 &&
          (data[EndTime].localeCompare(data[StartTime]) === 0 ||
            data[EndTime].localeCompare(data[StartTime]) === -1))
      ) {
        canSave = false;
        errorFields[EndTime] = "End date must be in the future.";
        this.setState({ errorFields });
      } else if (errorFields[EndTime] != null) {
        delete errorFields[EndTime];
        this.setState({ errorFields });
      }
    } else if (data[Type] === EveryWeek) {
      canSave = selectedDays.length > 0;
    }

    this.setState({
      data,
      canSave,
    });
  };
  cancel = () => {
    let {
      props: { onClose },
    } = this;
    if (!!onClose) onClose();
    this.setState({
      data: {},
      selectedDays: [],
    });
  };
  save = () => {
    let {
      props: { onConfirm },
      state: { data },
    } = this;
    const schedule = this.getServerSchedule(data);
    if (!!onConfirm) onConfirm(schedule);
  };

  isEnableDisableAction = (action) => {
    return action == Enable || action == Disable;
  };

  selectDay = (day) => {
    let { selectedDays, canSave } = this.state;
    if (selectedDays.includes(day)) {
      selectedDays.splice(selectedDays.indexOf(day), 1);
    } else {
      selectedDays.push(day);
    }
    canSave = selectedDays.length > 0;
    this.setState({
      selectedDays,
      canSave,
    });
  };

  /// get UI schedule from Server schedule
  getUISchedule = (schedule) => {
    let uiSchedule = {};
    if (isNotEmptyObject(schedule)) {
      Object.keys(schedule).forEach((key) => {
        switch (key) {
          case StartTime:
            let { date: startDate, time: startTime } =
              getDateAndTimeFromUtcMilliseconds(schedule[key]);
            uiSchedule[StartDate] = startDate;
            uiSchedule[StartTime] = startTime;
            break;
          case EndTime:
            let { date: endDate, time: endTime } =
              getDateAndTimeFromUtcMilliseconds(schedule[key]);
            uiSchedule[EndDate] = endDate;
            uiSchedule[EndTime] = endTime;
            break;
          case FrequencyInMinute:
            uiSchedule[Hour] = parseInt(parseInt(schedule[key]) / 60);
            uiSchedule[Minute] = parseInt(schedule[key]) % 60;
          default:
            uiSchedule[key] = schedule[key];
            break;
        }
      });
    }
    // Setup default value when create new schedule
    if (uiSchedule[Action] == null) {
      uiSchedule[Action] = this.getActionOptions()[0];
    }
    if (uiSchedule[Type] == null) {
      if (this.isEnableDisableAction(uiSchedule[Action])) {
        uiSchedule[Type] = enableDisableRepeatModels[0];
      } else {
        uiSchedule[Type] = allRepeatModels[0];
      }
    }
    if (uiSchedule[StartDate] == null || uiSchedule[StartDate] === "") {
      const today = new Date().toLocaleString("en-us", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
      let [tempDate, tempTime] = today.split(", ");
      const dateArray = tempDate.split("/");
      const date = [dateArray[2], dateArray[0], dateArray[1]].join("-");
      const time = tempTime.substring(0, 5);
      uiSchedule[StartDate] = date;
      uiSchedule[StartTime] = time;
    }

    return uiSchedule;
  };
  /// Get Server Schedule from UI schedule
  getServerSchedule = (schedule) => {
    let serverSchedule = {};
    Object.keys(schedule).forEach((key) => {
      switch (key) {
        case StartDate:
          serverSchedule[StartTime] = getUtcMilliSeconds(
            schedule[StartDate],
            schedule[StartTime]
          );
          break;
        case EndDate:
          serverSchedule[EndTime] = getUtcMilliSeconds(
            schedule[EndDate],
            schedule[EndTime]
          );
          break;
        case Hour:
          if (schedule[Hour] != null) {
            if (serverSchedule[FrequencyInMinute] == null) {
              serverSchedule[FrequencyInMinute] = 0;
            }
            serverSchedule[FrequencyInMinute] +=
              schedule[Hour] === "" ? 0 : parseInt(schedule[Hour]) * 60;
          }
          break;
        case Minute:
          if (schedule[Minute] != null) {
            if (serverSchedule[FrequencyInMinute] == null) {
              serverSchedule[FrequencyInMinute] = 0;
            }
            serverSchedule[FrequencyInMinute] +=
              schedule[Minute] === "" ? 0 : parseInt(schedule[Minute]);
          }
          break;
        case StartTime:
        case EndTime:
        case FrequencyInMinute:
          break;
        default:
          serverSchedule[key] = schedule[key];
          break;
      }
    });
    if (schedule[Type] == EveryWeek) {
      let days = this.state.selectedDays.map((day) => WEEK.indexOf(day)).sort();
      serverSchedule[Days] = days.join(",");
    } else if (serverSchedule[Type] != EveryWeek) {
      if (serverSchedule.hasOwnProperty(Days)) {
        delete serverSchedule[Days];
      }
    }
    if (serverSchedule[Type] != TimeInterval) {
      if (serverSchedule.hasOwnProperty(EndTime)) {
        delete serverSchedule[EndTime];
      }
    }

    return serverSchedule;
  };

  getActionOptions = () => {
    let {
      props: { objectType = "Terminal" },
    } = this;
    let actions = [];
    switch (objectType) {
      case "Terminal":
        actions = terminalActions;
        break;
      case "Server":
        actions = serverActions;
        break;
      default:
        break;
    }

    return actions;
  };

  getWrapperField(title, name, options, Tag) {
    let {
      state: { data },
    } = this;
    return (
      <ItemField
        title={title}
        name={name}
        options={{ value: data[name], ...options }}
        Tag={Tag}
        onChange={this.change}
      />
    );
  }

  render() {
    let {
      props: { isAdd },
      state: { data, repeatModels, selectedDays, canSave, errorFields },
    } = this;
    const actions = this.getActionOptions();
    return (
      <Modal id="schedule-pop-editor" show={true}>
        <Modal.Body>
          <div className="pop-up-window ">
            <h2 className="mb-22">
              {isAdd ? "ADD NEW SCHEDULE" : "EDIT SCHEDULE"}
            </h2>
            <div className="mb-24">
              <label>Status</label>
              {this.getWrapperField(
                "Action",
                Action,
                {
                  type: "select",
                  options: actions,
                },
                Select
              )}
            </div>
            <div className="mb-24">
              <label>Repeat Model</label>
              {this.getWrapperField(
                "RepeatModel",
                Type,
                {
                  type: "select",
                  options: repeatModels,
                  className: "w-180",
                },
                Select
              )}
            </div>
            <div className="mb-24">
              <label>
                {data[Type] == TimeInterval ? "Start from" : "Time"}
              </label>
              <div className="mt-8">
                {this.getWrapperField("Start date", StartDate, {
                  type: "date",
                  className: "inline-flex w-180 mr-16",
                })}
                {this.getWrapperField("Start time", StartTime, {
                  type: "time",
                  className: "inline-flex w-180 mr-16",
                })}
              </div>
            </div>
            {data["Type"] == TimeInterval && (
              <Fragment>
                <div className="mb-24">
                  <label>End at</label>
                  <div className="mt-8">
                    {this.getWrapperField("End date", EndDate, {
                      type: "date",
                      className: "inline-flex w-180 mr-16",
                    })}
                    {this.getWrapperField("End time", EndTime, {
                      type: "time",
                      className: "inline-flex w-180 mr-16",
                    })}
                    {errorFields[EndTime] != null && (
                      <span className="msg err">{errorFields[EndTime]}</span>
                    )}
                  </div>
                </div>
                <div className="mb-24">
                  <label>
                    Repeat Every <span style={{ color: "red" }}>*</span>
                  </label>
                  <div className="flex mt-8">
                    {this.getWrapperField("Hour", Hour, {
                      type: "number",
                      minNumber: 0,
                      maxNumber: 60,
                      validator: minuteHourValidator,
                    })}
                    <span className="pl-12" style={{ lineHeight: "32px" }}>
                      Hour
                    </span>
                  </div>
                  <div className="flex mt-8">
                    {this.getWrapperField("Minute", Minute, {
                      type: "number",
                      minNumber: 0,
                      maxNumber: 60,
                      validator: minuteHourValidator,
                    })}
                    <span className="pl-12" style={{ lineHeight: "32px" }}>
                      Min
                    </span>
                  </div>
                </div>
              </Fragment>
            )}
            {data["Type"] == EveryWeek && (
              <div className="mb-24">
                <label>Select Day</label>
                <div className="mt-5">
                  {WEEK.map((day) => (
                    <div
                      key={day}
                      className={
                        "week-day" +
                        (selectedDays.includes(day) ? " day-selected" : "")
                      }
                      onClick={() => this.selectDay(day)}
                    >
                      {day}
                    </div>
                  ))}
                </div>
              </div>
            )}
            <CancelAndConfirm
              canConfirm={canSave}
              onConfirm={this.save}
              onCancel={this.cancel}
            />
          </div>
        </Modal.Body>
      </Modal>
    );
  }
}
