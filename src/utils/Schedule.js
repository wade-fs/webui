import { apiAddSchedule, apiUpdateSchedule, apiDeleteSchedule } from "api";

export async function updateApiSchedules(schedules, oriScheduleIds) {
  let scheduleIds = [];
  let addSchedules = [];
  const mapSchedules = schedules.reduce((acc, cur) => {
    if (cur.Id === 0) {
      addSchedules.push(cur);
    } else {
      acc[cur.Id] = cur;
    }
    return acc;
  }, {});
  let mapScheduleIds = Object.keys(mapSchedules);
  if (oriScheduleIds.length === 1 && oriScheduleIds[0] === "")
    oriScheduleIds = [];
  let schedulePromise = oriScheduleIds.map((id) => {
    // check Delete Schedule
    if (mapSchedules[id] === undefined) {
      return apiDeleteSchedule(id)
        .then((value) => {
          if (value.result === false) {
            throw Error(value.data);
          }
          return "";
        })
        .catch((err) => {
          throw Error(err);
        });
    } else if (mapSchedules[id]) {
      // check Update Schedule
      const oriIndex = mapScheduleIds.indexOf(id);
      mapScheduleIds.splice(oriIndex, 1);
      return apiUpdateSchedule(id, mapSchedules[id])
        .then((value) => {
          if (value.result === false) {
            throw Error(value.data);
          }
          return id;
        })
        .catch((err) => {
          throw Error(err);
        });
    }
  });
  return Promise.all(schedulePromise)
    .then((ids) => {
      ids.forEach((id) => {
        if (id !== "") scheduleIds.push(id);
      });
      // check Add Schedule
      let addPromises = addSchedules.map((newSchdule) => {
        return apiAddSchedule(newSchdule).then((value) => {
          return value.data;
        });
      });
      return Promise.all(addPromises)
        .then((newIds) => {
          newIds.forEach((newId) => scheduleIds.push(newId));
          return { result: true, data: scheduleIds.join(",") };
        })
        .catch((err) => {
          throw Error(err);
        });
    })
    .catch((err) => {
      const errorMsg = err.message ?? "Update schedules failed";
      return { result: false, data: errorMsg };
    });
}

export function checkSchedule(schedules) {
  let newSchedules = JSON.parse(JSON.stringify(schedules));
  schedules.forEach((schedule, idx) => {
    // check key
    if (schedule["Days"] === undefined) {
      newSchedules[idx]["Days"] = "";
    }
    if (schedule["EndTime"] === undefined) {
      newSchedules[idx]["EndTime"] = 0;
    }
    if (schedule["FrequencyInMinute"] === undefined) {
      newSchedules[idx]["FrequencyInMinute"] = 0;
    }
    if (schedule["Id"] === undefined) {
      newSchedules[idx]["Id"] = 0;
    }
  });

  return newSchedules;
}
