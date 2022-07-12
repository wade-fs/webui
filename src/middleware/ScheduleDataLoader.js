import {
  LOAD_REQUEST,
  LOAD_SUCCESS,
  LOAD_FAILURE,
  // schedule action type
  LOAD_SCHEDULES,
  UPDATE_SCHEDULES,
} from "const/ActionType";

import { LOADING } from "const/DataLoaderState.js";
import { getObjectProperty } from "lib/Util";

import { showInfoBar } from "actions/InfobarActions";
import { loadTerminals, loadTerminalGroups } from "actions/TerminalActions";

import { checkSchedule, updateApiSchedules } from "utils/Schedule";

const loadData = (path, loaderPromise) => (dispatch) => {
  dispatch({ type: LOAD_REQUEST, payload: { path } });
  loaderPromise
    .then(({ data, response }) => {
      dispatch({ type: LOAD_SUCCESS, payload: { path, data } });
    })
    .catch((err) => {
      dispatch({ type: LOAD_FAILURE, payload: { path, data: err } });
    });
};

export default (store) => (next) => (action) => {
  let state = store.getState();
  let { type, payload } = action;
  let rst = next(action);

  switch (type) {
    case LOAD_SCHEDULES: {
      let { scheduleIds, path, isGroup, loader } = payload;
      if (scheduleIds && path && loader) {
        let loadingSate = getObjectProperty(state, `${path}.state`);
        if (loadingSate !== LOADING)
          store.dispatch((dispatch) => {
            dispatch({ type: LOAD_REQUEST, payload: { path } });
            let schedules = [];
            let schedulePromise = scheduleIds.map((id) => {
              return loader(id).then((value) => {
                if (value.result === false) {
                  throw Error(value.data);
                }
                return value.data;
              });
            });
            Promise.all(schedulePromise)
              .then((values) => {
                values.forEach((value) => {
                  schedules.push(value);
                });
                dispatch({
                  type: LOAD_SUCCESS,
                  payload: { path, data: schedules },
                });
              })
              .catch((err) => {
                const errorMsg = err.message ?? `Load schedules failed`;
                const oriObject = getObjectProperty(state, path);
                dispatch(showInfoBar(errorMsg, "error"));
                dispatch({
                  type: LOAD_FAILURE,
                  payload: { path, data: oriObject },
                });
              });
          });
      }
      break;
    }
    case UPDATE_SCHEDULES: {
      let {
        editingId,
        oriIds,
        data,
        path,
        isGroup,
        isEnable,
        isApplyAll,
        getScheduleLoader,
        getTerminalLoader,
        updateTerminalLoader,
      } = payload;
      if (
        editingId &&
        oriIds &&
        data &&
        path &&
        getScheduleLoader &&
        getTerminalLoader &&
        updateTerminalLoader
      ) {
        let loadingSate = getObjectProperty(state, `${path}.state`);
        if (loadingSate !== LOADING)
          store.dispatch((dispatch) => {
            dispatch({ type: LOAD_REQUEST, payload: { path } });
            const schdules = checkSchedule(data);
            updateApiSchedules(schdules, oriIds).then((value) => {
              if (value.result === false) {
                const errorMsg = value.data ?? "upadte schedules error";
                const oriObject = getObjectProperty(state, path);
                dispatch(showInfoBar(errorMsg, "error"));
                dispatch({
                  type: LOAD_FAILURE,
                  payload: { path, data: oriObject.data },
                });
              } else {
                const scheduleIds = value.data;
                let updateData = isGroup
                  ? {
                      Schedules: scheduleIds,
                      EnabledSchedule: isEnable,
                      ScheduleApplyAll: isApplyAll,
                    }
                  : {
                      Schedules: scheduleIds,
                      EnabledSchedule: isEnable,
                    };
                updateTerminalLoader(editingId, updateData)
                  .then((value) => {
                    if (value.result === false) {
                      throw Error(value.data);
                    }
                    let arrScheduleIds = [];
                    if (scheduleIds !== "") {
                      arrScheduleIds = scheduleIds.split(",");
                    }
                    let schedulePromise = arrScheduleIds.map((id) => {
                      return getScheduleLoader(id).then((value) => {
                        if (value.result === false) {
                          throw Error(value.data);
                        }
                        return value.data;
                      });
                    });
                    Promise.all(schedulePromise)
                      .then((values) => {
                        let schdules = [];
                        values.forEach((schdule) => schdules.push(schdule));
                        dispatch(showInfoBar("Update Schedules Success!!"));
                        dispatch({
                          type: LOAD_SUCCESS,
                          payload: { path, data: schdules },
                        });
                        const object =
                          isGroup === true ? "terminal group" : "terminal";
                        getTerminalLoader(editingId)
                          .then((value) => {
                            if (value.result === false) {
                              throw Error(value.data);
                            }
                            dispatch({
                              type: LOAD_SUCCESS,
                              payload: {
                                path: "terminals.editingTerminal",
                                data: value.data,
                              },
                            });
                            isGroup
                              ? dispatch(loadTerminalGroups())
                              : dispatch(loadTerminals());
                            dispatch(showInfoBar(`Update ${object} success!!`));
                          })
                          .catch((err) => {
                            throw Error(err);
                          });
                      })
                      .catch((err) => {
                        throw Error(err);
                      });
                  })
                  .catch((err) => {
                    let errorMsg = err.message ?? `Update schedules failed`;
                    const oriObject = getObjectProperty(state, path);
                    dispatch(showInfoBar(errorMsg, "error"));
                    dispatch({
                      type: LOAD_FAILURE,
                      payload: { path, data: oriObject.data },
                    });
                  });
              }
            });
          });
      }
      break;
    }
    default: {
      break;
    }
  }
  return rst;
};
