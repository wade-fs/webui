import { stringValid } from "lib/Util";
import {
  TimeInterval,
  EveryWeek,
  OnceOnly,
  StartTime,
  EndTime,
  FrequencyInMinute,
  Type,
  Days,
  WEEK,
  MONTHS,
} from "const/Other/ScheduleConsts";

export function getRepeatContent(schedule) {
  let repeatContent = "Repeat";
  switch (schedule[Type]) {
    case TimeInterval:
      let mins = parseInt(schedule[FrequencyInMinute]);
      let hour = Math.floor(mins / 60);
      let min = mins % 60;
      repeatContent = `${repeatContent} every ${hour} hour(s) and ${min} min(s)`;
      break;
    case EveryWeek:
      if (stringValid(schedule[Days])) {
        let days = schedule[Days].split(",")
          .map((day) => WEEK[parseInt(day)])
          .join(", ");
        repeatContent = `${repeatContent} ${days}`;
      }
      break;
    case OnceOnly:
      repeatContent = OnceOnly;
      break;
    default:
      repeatContent = `${repeatContent} ${schedule[Type]}`;
  }
  return repeatContent;
}

export function getTimeContent(schedule) {
  let time = "";
  if (schedule[Type] == TimeInterval) {
    let { date: startDate, time: startTime } =
      getDateAndTimeFromUtcMilliseconds(schedule[StartTime]);
    let { date: endDate, time: endTime } = getDateAndTimeFromUtcMilliseconds(
      schedule[EndTime]
    );
    let start = getDate(startDate) + ", " + getTime(startTime);
    let end = getDate(endDate) + ", " + getTime(endTime);
    time = `Start from ${start}. End at ${end}`;
  } else {
    let { date: startDate, time: startTime } =
      getDateAndTimeFromUtcMilliseconds(schedule[StartTime]);
    time = getDate(startDate) + ", " + getTime(startTime);
  }
  return time;
}

/// Get date 'Sep 12, 2019' from '2019-09-12'
export function getDate(date) {
  let arr = date.split("-");
  return `${MONTHS[parseInt(arr[1])]} ${arr[2]}, ${arr[0]}`;
}

/// Get time '12:00 AM' from '12:00:00'
export function getTime(time) {
  let hour = parseInt(time.substring(0, 2));
  let min = parseInt(time.substring(3, 5));
  let meridiem = "AM";
  if (hour == 12) {
    meridiem = "PM";
  } else if (hour > 12 && hour < 24) {
    meridiem = "PM";
    hour -= 12;
  } else if (hour == 24) {
    hour = 0;
  }
  return `${hour > 10 ? hour : `0${hour}`}:${
    min > 10 ? min : `0${min}`
  } ${meridiem}`;
}

/// Get date stamp '2019/12/12' from '2019-12-12'
export function getDateStamp(date) {
  return date.split("-").join("/");
}

/// Get time stamp '2019/12/12 12:00 AM' from UTC milliseconds 1555268400000
export function getStartTimeStamp(schedule) {
  let stamp = "";
  if (schedule.hasOwnProperty(StartTime)) {
    let isoTimeStamp = getLocalIsoTimestamp(schedule[StartTime]);
    let date = getDateStamp(isoTimeStamp.substring(0, 10));
    let time = getTime(isoTimeStamp.substring(11, 19));
    stamp = `${date} ${time}`;
  }
  return stamp;
}

/// Get date and time { data: '2019-12-12', time: '12:00:00' } from UTC milliseconds 1555268400000
export function getDateAndTimeFromUtcMilliseconds(utc) {
  if (utc !== "") {
    let isoTimeStamp = getLocalIsoTimestamp(utc);
    let date = isoTimeStamp.substring(0, 10);
    let time = isoTimeStamp.substring(11, 19);
    return { date, time };
  }
  return { date: "", time: "" };
}

export function getTimezoneOffsetInHour() {
  let date = new Date();
  let timezoneOffsetInHour = date.getTimezoneOffset() / 60;
  return timezoneOffsetInHour;
}

export function getTimezoneOffsetInMilliSeconds() {
  let date = new Date();
  let timezoneOffsetInMilliSeconds = date.getTimezoneOffset() * 60000;
  return timezoneOffsetInMilliSeconds;
}

// GEt UTS milliseconds 1555268400000 from timestamp in ISO format'2019-04-14T12:00:00-07:00'
export function getUtcMilliSeconds(date, time) {
  let timezoneOffset = -getTimezoneOffsetInHour();
  let sign = timezoneOffset >= 0 ? "+" : "-";
  let offsetString = `${sign}${pad(timezoneOffset)}:00`;
  let iso = `${date}T${time}${offsetString}`;
  let utc = Date.parse(iso);
  return utc;
}

// Get local time in ISO format "2019-04-13T12:00:00.000Z" from UTC millisecondas
export function getLocalIsoTimestamp(utc) {
  let offset = getTimezoneOffsetInMilliSeconds();
  let time = new Date(utc - offset).toISOString();
  return time;
}

export function pad(num) {
  var norm = Math.floor(Math.abs(num));
  return (norm < 10 ? "0" : "") + norm;
}
