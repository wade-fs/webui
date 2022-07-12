import React, { Fragment } from "react";
import { Modal } from "react-bootstrap";
import CloseWizardAlert from "components/Alert/CloseWizardAlert";
import WizardSidebar, { Tab } from "components/ObjectCommon/WizardSidebar";
import { NavButton } from "components/Card";
import ApplicationCard from "./ApplicationCard";
import ControlCard from "./ControlCard";
import DisplayCard from "./DisplayCard";
import HardwareCard from "./HardwareCard";
import ModuleCard from "./ModuleCard";
import InfoCard from "./InfoCard";
import PropertiesCard from "./PropertiesCard";
import UserAccessCard from "./UserAccessCard";

import { loadSchedules } from "actions/ScheduleActions";

import {
  addTerminal,
  clearParentTerminal,
  closeTerminalWizard,
  getDefaultKeyboardMapping,
  getDefaultMouseMapping,
  getFirmwarePackage,
  getDisplayOptions,
  getModelMap,
  getParentTerminal,
  loadModules,
  loadModuleSettings,
} from "actions/TerminalActions";
import { modelFixOptions } from "const/Consts";

import {
  TerminalTabs,
  TerminalGroupTabs,
  TERMINAL_INFO,
  TERMINAL_GROUP_INFO,
  APPLICATION,
  CONTROL,
  DISPLAY,
  HARDWARE,
  MODULE,
  TERMINAL_PROPERTIES,
  USER_ACCESS,
} from "const/Terminals/TerminalConsts";
import {
  AllowShadow,
  Replaceable,
  ShowDeviceStatusBar,
  EnforceBootPriority,
  TerminalEffects,
  CopySettingFrom,
  FirmwarePackage,
  ApplyAllProperties,
  HardwareFields,
  Id,
  IpAddressMethod,
  InstalledModules,
  MAC,
  Manufacturer,
  Model,
  ModuleApplyAll,
  ModuleId,
  NumberOfScreens,
  ParentId,
  Password,
  PossibleModuleSetting,
  Schedules,
  TerminalInfoFields,
  Username,
  UserType,
  UserAccessApplyAll,
  ControlApplyAll,
  ScheduleApplyAll,
  extractApplications,
  extractAuthUser,
  extractControls,
  extractFields,
  extractHardware,
  extractMonitors,
  extractTerminalInfoWizard,
  extractTerminalOptions,
  getMonitorXPositionField,
  getMonitorYPositionField,
  getScreenApplicationsField,
  isApplicationCompleted,
  isAuthUserCompleted,
  isHardwareCompleted,
  isMonitorCompleted,
  isTerminalInfoCompleted,
  isTerminalOptionsCompleted,
} from "const/Terminals/TerminalFieldNames";
import {
  DefaultTerminalInfo,
  DefaultMonitor,
  DefaultTerminaProperties,
  DefaultAuthUser,
  DefaultOtherApplyAll,
} from "const/Terminals/Default";

import { stringValid, isDefaultObject, isNotEmptyObject } from "lib/Util";

import { findOverrideById, getAppOverride } from "utils/Override";
import { toLetter } from "utils/String";
import { getDataForBaseCard } from "utils/Object";
import { generateDefaultDisplay } from "utils/Display";
import { macDeformatter } from "utils/MAC";

export default class Wizard extends React.Component {
  constructor(props) {
    super(props);
    const isGroup = props.data.isGroup;
    const tabs = isGroup === true ? [...TerminalGroupTabs] : [...TerminalTabs];
    const updateTabs = tabs.map((item, index) =>
      index == 0
        ? new Tab(item, { clickable: true, visited: true })
        : new Tab(item)
    );
    this.state = {
      tabs: updateTabs,
      selectedTabIndex: 0,
      showExitAlert: false,
      errorFields: {},
      authUser: { ...DefaultAuthUser },
      controls: {
        EnableHotkey: false,
        ...props.data.defaultKeyboardMapping.data,
        ...props.data.defaultMouseMapping.data,
      },
      hardware: this.setHardwareFromPendingTerminal(props.data.defaultTerminal),
      monitors: { ...DefaultMonitor },
      oriAppOverrides: {},
      appOverrides: {},
      modules: [],
      schedules: [],
      terminalInfo: { ...DefaultTerminalInfo },
      terminalProperties: { ...DefaultTerminaProperties },
      otherApplyAll: isGroup === true ? { ...DefaultOtherApplyAll } : {},
      selectedScreenId: 1,
      applyAllProperties: {},
      defaultClose: JSON.stringify(DefaultTerminalInfo),
    };
    this.prefetchData(props.dispatch);
  }

  async componentDidMount() {
    let {
      props: { dispatch, parentId },
      state: { terminalInfo, defaultClose },
    } = this;
    terminalInfo[ParentId] = parentId;
    defaultClose = JSON.stringify(terminalInfo);
    if (parentId != null && parentId !== 0) {
      dispatch(getParentTerminal(parentId));
    }
    await this.generateApplications();
    this.setState({
      terminalInfo,
      defaultClose,
    });
  }
  componentDidUpdate(prevProps) {
    if (this.shouldProcessCopyTerminalSetting(prevProps)) {
      this.processTerminalSetting();
    }
    if (this.shouldUpdateSchedules(prevProps)) {
      const schedules = this.props.data.schedules.data ?? [];
      this.setState({ schedules: schedules });
    }
    if (this.shouldUpdateModules(prevProps)) {
      const modules = this.generateModules();
      this.setState({ modules: modules });
    }
    if (this.shouldGenerateDefaultHotkeysData(prevProps)) {
      this.setState({
        controls: {
          ...this.props.data.defaultMouseMapping.data,
          ...this.generateDefaultHotkeysData(),
        },
      });
    }
    if (this.shouldGenerateDefaultMousesData(prevProps)) {
      this.setState({
        controls: {
          ...this.props.data.defaultKeyboardMapping.data,
          ...this.generateDefaultMousesData(),
        },
      });
    }
    if (this.shouldUpdateDataBasedOnParent(prevProps)) {
      const parentTerminal = this.props.data.parentTerminal.data;
      if (parentTerminal) {
        this.updateDataBasedOnParent();
      }
    }
    // check hareware to get monitor options
    if (
      prevProps.data.hardwareInfo.data !== this.props.data.hardwareInfo.data
    ) {
      const monitors =
        this.props.data.isGroup === true
          ? { ...DefaultMonitor }
          : generateDefaultDisplay(
              this.props.data.hardwareInfo,
              DefaultMonitor
            );
      this.setState({ monitors: monitors });
    }
  }

  onChange = (updated) => {
    let {
      props: { data },
      state: {
        tabs,
        selectedTabIndex,
        errorFields,

        authUser,
        controls,
        hardware,
        monitors,
        modules,
        terminalInfo,
        terminalProperties,
        schedules,
        otherApplyAll,
      },
    } = this;
    const isGroup = data.isGroup;
    const selectedTab = tabs[selectedTabIndex].label;
    switch (selectedTab) {
      case TERMINAL_INFO:
      case TERMINAL_GROUP_INFO:
        this.getParentTerminalIfNeeded(updated);
        this.setState({
          terminalInfo: updated,
          tabs: this.setTabClickable(
            tabs,
            selectedTabIndex,
            isTerminalInfoCompleted(updated),
            isDefaultObject(errorFields)
          ),
        });
        break;
      case HARDWARE:
        // check default
        if (
          this.shouldSetMonitorToDefault(hardware, updated) &&
          this.props.data.hardwareInfo.data.length > 0
        ) {
          monitors =
            isGroup === true
              ? { ...DefaultMonitor }
              : generateDefaultDisplay(data.hardwareInfo, DefaultMonitor);
        }
        this.setState({
          hardware: updated,
          monitors: monitors,
          tabs: this.setTabClickable(
            tabs,
            selectedTabIndex,
            isHardwareCompleted(updated, false) &&
              data.hardwareInfo.data !== undefined &&
              data.hardwareInfo.data.length !== 0
          ),
        });
        break;
      case TERMINAL_PROPERTIES:
        if (Array.isArray(updated)) {
          this.setState({ schedules: updated });
        } else if (Object.keys(updated)[0] === ScheduleApplyAll) {
          this.setState({ otherApplyAll: { ...otherApplyAll, ...updated } });
        } else {
          this.setState({
            terminalProperties: updated,
          });
        }
        this.setState({
          tabs: this.setTabClickable(tabs, selectedTabIndex, true),
        });
        break;
      case DISPLAY:
        if (isNaN(updated[getMonitorXPositionField(1)]))
          updated[getMonitorXPositionField(1)] = 0;
        if (isNaN(updated[getMonitorYPositionField(1)]))
          updated[getMonitorYPositionField(1)] = 0;

        this.setState({
          monitors: updated,
          tabs: this.setTabClickable(
            tabs,
            selectedTabIndex,
            isMonitorCompleted(updated)
          ),
        });
        break;
      case APPLICATION:
        this.setState({
          monitors: { ...monitors, ...updated },
          tabs: this.setTabClickable(tabs, selectedTabIndex),
        });
        break;
      case USER_ACCESS:
        this.setState({
          authUser: updated,
          tabs: this.setTabClickable(
            tabs,
            selectedTabIndex,
            isAuthUserCompleted(updated, isGroup)
          ),
        });
        break;
      case MODULE:
        if (Array.isArray(updated)) {
          this.setState({
            modules: updated,
            tabs: this.setTabClickable(tabs, selectedTabIndex, true),
          });
        } else {
          // Put ModuleApplyAll in terminalProperties for now.
          this.setState({
            otherApplyAll: { ...otherApplyAll, ...updated },
          });
        }
        break;
      // case CONTROL:
      //   this.setState({
      //     controls: { ...controls, ...updated },
      //     tabs: this.setTabClickable(tabs, selectedTabIndex, true),
      //   });
      //   break;
      default:
        break;
    }
  };

  prefetchData(dispatch) {
    dispatch(getModelMap());
    // dispatch(getFirmwarePackage());
    dispatch(loadModuleSettings());
    dispatch(getDefaultMouseMapping());
    dispatch(getDefaultKeyboardMapping());
  }
  setHardwareFromPendingTerminal(defaultTerminal) {
    if (defaultTerminal == null) return {};
    // this.fetchDataByHardware(
    //   defaultTerminal[Manufacturer]
    //    defaultTerminal[Model]
    // );
    return {
      [MAC]: defaultTerminal[MAC],
      [Manufacturer]: "Arista",
      [Model]: modelFixOptions[0],
      // [IpAddressMethod]: defaultTerminal[IpAddressMethod],
    };
  }
  shouldProcessCopyTerminalSetting(prevProps) {
    const prevCopyId = prevProps.data.terminalSetting.data?.Id;
    const copyId = this.props.data.terminalSetting.data?.Id;
    return prevCopyId == copyId ? false : true;
  }
  processTerminalSetting() {
    let {
      props: {
        data: { terminalSetting },
      },
      state: { terminalInfo },
    } = this;

    switch (terminalInfo[CopySettingFrom]) {
      case "Default":
      case "Terminal":
        // Default and Copy selected
        const terminal = terminalSetting.data;
        // prevent default to copy (copy id = undefined)
        if (terminal) {
          this.getParentTerminalIfNeeded(terminal);
          this.setState(
            {
              authUser: this.generateAuthUser(),
              controls: extractControls(terminal),
              hardware: {
                ...extractHardware(terminal),
                ...this.setHardwareFromPendingTerminal(
                  this.props.data.defaultTerminal
                ),
              },
              monitors: extractMonitors(terminal),
              terminalInfo: {
                ...this.state.terminalInfo,
                ...extractTerminalInfoWizard(terminal),
              },
              terminalProperties: extractTerminalOptions(terminal),
            },
            this.setTabCompleted()
          );
          this.fetchDataByHardware(terminal[Manufacturer], terminal[Model]);
          this.fetchModulesByMsIds(terminal[InstalledModules]);
          this.fetchSchedulesByScheduleIds(terminal[Schedules]);
        }
        break;
      case "None":
        // Copy and None selected
        this.getParentTerminalIfNeeded(DefaultTerminalInfo);
        this.setState({
          authUser: { ...DefaultAuthUser },
          controls: {
            ...this.props.data.defaultMouseMapping.data,
            ...this.props.data.defaultKeyboardMapping.data,
          },
          hardware: this.setHardwareFromPendingTerminal(
            this.props.data.defaultTerminal
          ),
          monitors: { ...DefaultMonitor },
          modules: {},
          terminalInfo: {
            ...DefaultTerminalInfo,
          },
          terminalProperties: { ...DefaultTerminaProperties },
          schedules: [],
        });
        break;
      default:
        break;
    }
  }
  shouldUpdateSchedules(prevProps) {
    const prevScheduleIds = prevProps.data.schedules.data;
    const scheduleIds = this.props.data.schedules.data;
    return prevScheduleIds == scheduleIds ? false : true;
  }
  shouldUpdateModules(prevProps) {
    const prevModuleIds = prevProps.data.modules.data;
    const moduleIds = this.props.data.modules.data;
    return prevModuleIds == moduleIds ? false : true;
  }
  generateModules() {
    const msIdWrappers = this.props.data.msIdWrappers.data;
    const possibleModuleSettings = this.props.data.possibleModuleSettings.data;
    const modules = msIdWrappers.map((m) => {
      let item = { ...m };
      const pms = possibleModuleSettings[item[ModuleId]];
      if (isNotEmptyObject(possibleModuleSettings)) {
        item = { ...item, [PossibleModuleSetting]: pms };
      }
      return item;
    });
    return modules;
  }
  async generateApplications() {
    const appOverrides = await getAppOverride();
    const defaultOverrides = JSON.parse(JSON.stringify(appOverrides));
    this.setState({
      appOverrides: appOverrides,
      oriAppOverrides: defaultOverrides,
    });
  }
  generateAuthUser() {
    const terminal = this.props.data.terminalSetting.data;
    let authUser = extractAuthUser(terminal);
    if (!isNotEmptyObject(authUser)) {
      authUser[UserType] = "None";
    } else if (isNotEmptyObject(authUser)) {
      authUser[UserType] =
        stringValid(authUser[Password]) && stringValid(authUser[Username])
          ? "Windows"
          : "None";
    }
    return authUser;
  }
  shouldGenerateDefaultHotkeysData(prevProps) {
    const prevDefaultHotkey = prevProps.data.defaultKeyboardMapping.data;
    const defaultHotkey = this.props.data.defaultKeyboardMapping.data;
    return prevDefaultHotkey == defaultHotkey ? false : true;
  }
  generateDefaultHotkeysData() {
    return this.props.data.defaultKeyboardMapping.data;
  }
  shouldGenerateDefaultMousesData(prevProps) {
    const prevDefaultMouse = prevProps.data.defaultMouseMapping.data;
    const defaultMouse = this.props.data.defaultMouseMapping.data;
    return prevDefaultMouse == defaultMouse ? false : true;
  }
  generateDefaultMousesData() {
    return this.props.data.defaultMouseMapping.data;
  }
  shouldSetMonitorToDefault(hardware, newHardware) {
    return (
      hardware[Manufacturer] != newHardware[Manufacturer] ||
      hardware[Model] != newHardware[Model] ||
      hardware[FirmwarePackage] != newHardware[FirmwarePackage]
    );
  }
  getParentTerminalIfNeeded(updated) {
    let {
      props: { dispatch, data },
    } = this;
    const parentId = data.parentTerminal.data?.Id;
    if (
      updated[ParentId] != null &&
      updated[ParentId] != 0 &&
      parentId !== updated[ParentId]
    ) {
      dispatch(getParentTerminal(updated[ParentId]));
    } else if (updated[ParentId] == null || updated[ParentId] === 0) {
      dispatch(clearParentTerminal());
    }
  }
  shouldUpdateDataBasedOnParent(prevProps) {
    const prevParentId = prevProps.data.parentTerminal.data?.Id;
    const parentId = this.props.data.parentTerminal.data?.Id;
    return prevParentId === parentId ? false : true;
  }
  updateDataBasedOnParent() {
    let {
      props: { data },
      state: {
        authUser,
        controls,
        monitors,
        terminalProperties,
        otherApplyAll,
      },
    } = this;
    const isGroup = data.isGroup;
    const parentTerminal = this.props.data.parentTerminal.data;
    if (isGroup === false)
      this.fetchDataByHardware(
        parentTerminal[Manufacturer],
        parentTerminal[Model]
      );
    // check properties apply all
    if (
      Object.keys(parentTerminal).length !== 0 &&
      parentTerminal[ApplyAllProperties] !== undefined
    ) {
      // replace from apply all
      const applyAllProperties = parentTerminal[ApplyAllProperties].split(",");
      if (
        applyAllProperties[Replaceable] !== undefined ||
        applyAllProperties[TerminalEffects] !== undefined ||
        applyAllProperties[ShowDeviceStatusBar] !== undefined ||
        applyAllProperties[EnforceBootPriority] !== undefined ||
        applyAllProperties[AllowShadow] !== undefined
      ) {
        terminalProperties = extractTerminalOptions(parentTerminal);
      }
    }
    // check module apply all
    if (parentTerminal[ModuleApplyAll] === true) {
      this.fetchModulesByMsIds(parentTerminal[InstalledModules]);
      if (isGroup === true) {
        otherApplyAll[ModuleApplyAll] = parentTerminal[ModuleApplyAll];
      } else {
        delete otherApplyAll[ModuleApplyAll];
      }
    }
    // check schedule apply all
    if (parentTerminal[ScheduleApplyAll] === true) {
      this.fetchSchedulesByScheduleIds(parentTerminal[Schedules]);
      if (isGroup === true) {
        otherApplyAll[ScheduleApplyAll] = parentTerminal[ScheduleApplyAll];
      } else {
        delete otherApplyAll[ScheduleApplyAll];
      }
    }
    // // check application apply all
    // if (parentTerminal["Screen1_Applications"]) {
    //   const numberOfScreens = parentTerminal[NumberOfScreens];
    //   let screenServerGroupFields = [];
    //   for (var i = 1; i <= numberOfScreens; i++) {
    //     screenServerGroupFields.push(getScreenApplicationsField(i));
    //   }
    //   monitors = {
    //     ...monitors,
    //     ...extractFields(parentTerminal, screenServerGroupFields),
    //   };
    // }
    // check user access apply all
    if (parentTerminal[UserAccessApplyAll]) {
      authUser = extractAuthUser(parentTerminal);
      if (isGroup === true) {
        authUser[UserAccessApplyAll] = parentTerminal[UserAccessApplyAll];
      } else {
        delete authUser[UserAccessApplyAll];
      }
    }
    // check control apply all
    if (parentTerminal[ControlApplyAll]) {
      controls = extractControls(parentTerminal);
      if (isGroup === true) {
        controls[ControlApplyAll] = parentTerminal[ControlApplyAll];
      } else {
        delete controls[ControlApplyAll];
      }
    }
    this.setState({
      authUser,
      controls,
      monitors,
      terminalProperties,
      otherApplyAll,
    });
  }

  fetchDataByHardware(manufacturer, model) {
    if (!stringValid(manufacturer) && !stringValid(model)) return;
    let {
      props: { dispatch },
    } = this;
    dispatch(getDisplayOptions(manufacturer, model));
  }
  fetchModulesByMsIds(installedModules) {
    if (!stringValid(installedModules)) return;
    let {
      props: { dispatch },
    } = this;
    const installedMsIds = installedModules.split(",");
    dispatch(loadModules(installedMsIds));
  }
  fetchSchedulesByScheduleIds(schedules) {
    if (!stringValid(schedules)) return;
    let {
      props: { dispatch, data },
    } = this;
    const scheduleIds = schedules.split(",");
    dispatch(loadSchedules(scheduleIds, "terminals.schedules"));
  }

  setTabCompleted() {
    let {
      props: { data },
      state: {
        authUser,
        controls,
        hardware,
        monitors,
        terminalInfo,
        terminalProperties,
        tabs,
        selectedTabIndex,
      },
    } = this;
    const isGroup = data.isGroup;
    tabs.forEach((tab) => {
      switch (tab.label) {
        case TERMINAL_INFO:
          tab.completed = isTerminalInfoCompleted(terminalInfo);
          break;
        case TERMINAL_PROPERTIES:
          tab.completed = isTerminalOptionsCompleted(terminalProperties);
          break;
        case HARDWARE:
          tab.completed =
            isHardwareCompleted(hardware, false) &&
            data.hardwareInfo.data !== undefined &&
            data.hardwareInfo.data.length !== 0;
          break;
        case DISPLAY:
          tab.completed = isMonitorCompleted(monitors);
          break;
        case USER_ACCESS:
          tab.completed = isAuthUserCompleted(authUser, isGroup);
          break;
        case APPLICATION:
          tab.completed = isApplicationCompleted(monitors);
        case CONTROL:
        case MODULE:
          tab.completed = true;
          break;
        default:
          break;
      }
    });
    this.setState({
      tabs: this.setTabClickable(
        tabs,
        selectedTabIndex,
        isTerminalInfoCompleted(terminalInfo)
      ),
    });
  }
  setTabClickable(
    tabs,
    selectedTabIndex,
    isCurrentTabCompleted,
    hasErrors = false
  ) {
    tabs[selectedTabIndex].completed = isCurrentTabCompleted;
    tabs.forEach((tab) => {
      tab.clickable = tab.completed && isCurrentTabCompleted && !hasErrors;
    });
    return tabs;
  }

  openExitAlert = () => {
    this.setState({ showExitAlert: true });
  };
  closeExitAlert = () => {
    this.setState({ showExitAlert: false });
  };
  closeWizard = () => {
    this.props.dispatch(closeTerminalWizard());
  };

  handleErrorFields = (errorFields) => {
    this.setState({ errorFields });
  };

  selectTab = (offset) => {
    let {
      state: { selectedTabIndex, tabs },
    } = this;
    selectedTabIndex = (selectedTabIndex + offset) % tabs.length;

    tabs[selectedTabIndex].completed = true;
    tabs[selectedTabIndex].clickable = true;
    tabs[selectedTabIndex].visited = true;
    this.setState({ selectedTabIndex, tabs });
  };

  onSelect = (selectedTabIndex) => {
    let { tabs } = this.state;
    tabs[selectedTabIndex].visited = true;
    this.setState({ tabs, selectedTabIndex });
  };
  onBack = () => {
    this.selectTab(-1);
  };
  onNext = () => {
    this.selectTab(1);
  };
  onFinish = () => {
    let {
      props: { dispatch, data },
      state: {
        appOverrides,
        authUser,
        controls,
        hardware,
        monitors,
        modules,
        terminalInfo,
        terminalProperties,
        schedules,
        applyAllProperties,
        otherApplyAll,
      },
    } = this;
    let terminal = {
      ...authUser,
      ...controls,
      ...hardware,
      ...monitors,
      ...terminalInfo,
      ...terminalProperties,
      ...otherApplyAll,
    };
    if (terminal[MAC] != null && terminal[MAC].indexOf(" ") != -1) {
      terminal[MAC] = macDeformatter(terminal[MAC]);
    }
    // remove not override app
    const terminalApps = findOverrideById(terminal, appOverrides.data);
    const isGroup = data.isGroup;
    // terminal group has properties apply all
    if (isGroup === true) {
      let applyAllArray = [];
      Object.keys(applyAllProperties).forEach((key) => {
        applyAllProperties[key].forEach((item) => {
          applyAllArray.push(item);
        });
      });
      const applyAllArrayToString = applyAllArray.join(",");
      terminal[ApplyAllProperties] = applyAllArrayToString;
      terminal[Manufacturer] = "";
      terminal[Model] = "";
      terminal[FirmwarePackage] = "modeldefault";
    }
    dispatch(addTerminal(terminal, schedules, modules, terminalApps, isGroup));
  };

  canBack = () => {
    let {
      props: { data },
      state: { tabs, errorFields, selectedTabIndex, hardware },
    } = this;
    const tab = tabs[selectedTabIndex].label;
    switch (tab) {
      case HARDWARE:
        return (
          isHardwareCompleted(hardware, false) &&
          data.hardwareInfo.data !== undefined &&
          data.hardwareInfo.data.length !== 0 &&
          isDefaultObject(errorFields) &&
          (hardware.hasOwnProperty(MAC) && hardware.MAC != null
            ? hardware.MAC.length == 27 ||
              hardware.MAC.length == 12 ||
              hardware.MAC.length == 0
            : true)
        );
      default:
        return selectedTabIndex > 0;
    }
  };
  canNext = () => {
    let {
      props: { data },
      state: {
        selectedTabIndex,
        tabs,
        errorFields,
        terminalInfo,
        terminalProperties,
        hardware,
        monitors,
        authUser,
      },
    } = this;
    if (selectedTabIndex > tabs.length - 2) return false;
    const tab = tabs[selectedTabIndex].label;
    const isGroup = data.isGroup;
    switch (tab) {
      case TERMINAL_INFO:
      case TERMINAL_GROUP_INFO:
        return (
          isTerminalInfoCompleted(terminalInfo) && isDefaultObject(errorFields)
        );
      case HARDWARE:
        return (
          isHardwareCompleted(hardware, false) &&
          data.hardwareInfo.data !== undefined &&
          data.hardwareInfo.data.length !== 0 &&
          isDefaultObject(errorFields) &&
          (hardware.hasOwnProperty(MAC) && hardware.MAC != null
            ? hardware.MAC.length == 27 ||
              hardware.MAC.length == 12 ||
              hardware.MAC.length == 0
            : true)
        );
      case TERMINAL_PROPERTIES:
        return isTerminalOptionsCompleted(terminalProperties);
      case DISPLAY:
      case APPLICATION:
        return isGroup ? true : isMonitorCompleted(monitors);
      case USER_ACCESS:
        return (
          isAuthUserCompleted(authUser, isGroup) || authUser.UserType == "None"
        );
      default:
        return true;
    }
  };
  canFinish = () => {
    let {
      props: { data },
      state: {
        errorFields,
        terminalInfo,
        terminalProperties,
        hardware,
        monitors,
        authUser,
      },
    } = this;
    const isGroup = data.isGroup;
    if (isGroup === true)
      return (
        isDefaultObject(errorFields) &&
        isTerminalInfoCompleted(terminalInfo) &&
        (isAuthUserCompleted(authUser, isGroup) || authUser.UserType == "None")
      );
    return (
      isDefaultObject(errorFields) &&
      isTerminalInfoCompleted(terminalInfo) &&
      isHardwareCompleted(hardware, false) &&
      data.hardwareInfo.data != null &&
      data.hardwareInfo.data.length !== 0 &&
      (hardware.hasOwnProperty(MAC) && hardware[MAC] != null
        ? hardware[MAC].length === 27 ||
          hardware[MAC].length === 12 ||
          hardware[MAC].length === 0
        : true) &&
      isTerminalOptionsCompleted(terminalProperties) &&
      isMonitorCompleted(monitors) &&
      (isAuthUserCompleted(authUser, isGroup) || authUser.UserType == "None")
    );
  };

  updateApplyAllProperties = (applyAllProperties) => {
    this.setState({ applyAllProperties: applyAllProperties });
  };

  onSelectScreen = (selectedScreenId) => {
    const intSelectedScreenId = parseInt(selectedScreenId);
    this.setState({
      selectedScreenId: intSelectedScreenId,
    });
  };
  setApplication = (screenApplications) => {
    let data = JSON.parse(JSON.stringify(this.state.monitors));
    Object.keys(screenApplications).forEach((key) => {
      if (data.hasOwnProperty(key)) {
        data[key] = screenApplications[key];
      }
    });
    this.setState({ monitors: data }, () => {
      this.onChange(data);
    });
  };
  setAppOverrides = (appOverrides) => {
    const updateOverrides = JSON.parse(JSON.stringify(this.state.appOverrides));
    updateOverrides.data = appOverrides;
    this.setState({ appOverrides: updateOverrides });
  };

  render() {
    let {
      props: { dispatch, data },
      state: {
        errorFields,
        tabs,
        selectedTabIndex,
        showExitAlert,
        appOverrides,
        oriAppOverrides,
        authUser,
        controls,
        hardware,
        monitors,
        modules,
        terminalInfo,
        terminalProperties,
        schedules,
        selectedScreenId,
        otherApplyAll,
        applyAllProperties,
        defaultClose,
      },
    } = this;
    let {
      adUsers,
      defaultKeyboardMapping,
      defaultMouseMapping,
      firmwarePackage,
      hardwareInfo,
      isGroup,
      manufacturerModelMap,
      moduleSettings,
      parentTerminal,
      possibleModuleSettings,
      terminalMainTree,
      terminals,
      terminalGroups,
      verifyAuthUserResult,
    } = data;
    const selectedTab = tabs[selectedTabIndex].label;
    const applications = getDataForBaseCard(extractApplications(monitors));
    const autoClose = JSON.stringify(terminalInfo);
    return (
      <Modal show={true}>
        <div className="w-container" style={{ marginTop: "80px" }}>
          <div className="wrapper2">
            <Modal.Body
              style={{ backgroundColor: "#F2F8E5", paddingBottom: "0px" }}
            >
              <div className="clearfix">
                {showExitAlert && (
                  <CloseWizardAlert
                    yes={this.closeWizard}
                    no={this.closeExitAlert}
                  />
                )}
                <WizardSidebar
                  selectedTabIndex={selectedTabIndex}
                  tabs={tabs}
                  onSelect={this.onSelect}
                />
                <div
                  className="close mt-12"
                  onClick={
                    autoClose === defaultClose
                      ? this.closeWizard
                      : this.openExitAlert
                  }
                ></div>
                <div className="wizard-container">
                  <div className="modal-wizard-card">
                    {(selectedTab == TERMINAL_GROUP_INFO ||
                      selectedTab == TERMINAL_INFO) &&
                      terminalInfo != null && (
                        <InfoCard
                          dispatch={dispatch}
                          isGroup={isGroup}
                          data={terminalInfo}
                          errorFields={errorFields}
                          terminalMainTree={terminalMainTree}
                          objects={terminals}
                          objectGroups={terminalGroups}
                          onChange={this.onChange}
                          handleErrorFields={this.handleErrorFields}
                        />
                      )}
                    {selectedTab == HARDWARE && (
                      <HardwareCard
                        dispatch={dispatch}
                        data={hardware}
                        errorFields={errorFields}
                        firmwarePackage={firmwarePackage}
                        manufacturerModelMap={manufacturerModelMap}
                        onChange={this.onChange}
                        handleErrorFields={this.handleErrorFields}
                      />
                    )}

                    {selectedTab == TERMINAL_PROPERTIES && (
                      <PropertiesCard
                        dispatch={dispatch}
                        isGroup={isGroup}
                        data={terminalProperties}
                        parentTerminal={parentTerminal}
                        applyAllProperties={applyAllProperties}
                        otherApplyAll={otherApplyAll}
                        schedules={schedules}
                        onChange={this.onChange}
                        updateApplyAllProperties={this.updateApplyAllProperties}
                      />
                    )}
                    {selectedTab == DISPLAY && (
                      <DisplayCard
                        dispatch={dispatch}
                        isGroup={isGroup}
                        data={monitors}
                        parentTerminal={parentTerminal}
                        applications={applications}
                        hardware={hardware}
                        defaultMouseMapping={defaultMouseMapping}
                        appMultiTree={
                          this.props.applications.applicationMainTree.data
                        }
                        hardwareInfo={hardwareInfo}
                        appOverrides={appOverrides}
                        oriAppOverrides={oriAppOverrides}
                        adUsers={adUsers}
                        verifyAuthUserResult={verifyAuthUserResult}
                        onChange={this.onChange}
                        setAppOverrides={this.setAppOverrides}
                      />
                    )}
                    {selectedTab == APPLICATION && (
                      <ApplicationCard
                        dispatch={dispatch}
                        isGroup={isGroup}
                        isLoaded={true}
                        appOverrides={appOverrides}
                        oriAppOverrides={oriAppOverrides}
                        terminal={applications}
                        parentTerminal={parentTerminal}
                        adUsers={adUsers}
                        verifyAuthUserResult={verifyAuthUserResult}
                        treeType="application"
                        terminalMainTree={terminalMainTree}
                        appMultiTree={
                          this.props.applications.applicationMainTree.data
                        }
                        onChange={this.onChange}
                        onSelect={this.onSelectScreen}
                        selectedScreenId={selectedScreenId}
                        selectedScreen={toLetter(selectedScreenId)}
                        setApplication={this.setApplication}
                        setAppOverrides={this.setAppOverrides}
                      />
                    )}
                    {selectedTab == USER_ACCESS && (
                      <UserAccessCard
                        dispatch={dispatch}
                        isGroup={isGroup}
                        data={authUser}
                        parentTerminal={parentTerminal}
                        adUsers={adUsers}
                        verifyAuthUserResult={verifyAuthUserResult}
                        onChange={this.onChange}
                      />
                    )}
                    {selectedTab == MODULE && (
                      <ModuleCard
                        dispatch={dispatch}
                        isGroup={isGroup}
                        modules={modules}
                        parentTerminal={parentTerminal}
                        otherApplyAll={otherApplyAll}
                        moduleSettings={moduleSettings}
                        possibleModuleSettings={possibleModuleSettings}
                        onChange={this.onChange}
                      />
                    )}
                    {/* {selectedTab == CONTROL && (
                      <ControlCard
                        dispatch={dispatch}
                        isGroup={isGroup}
                        data={controls}
                        parentTerminal={parentTerminal}
                        defaultKeyboardMapping={defaultKeyboardMapping}
                        defaultMouseMapping={defaultMouseMapping}
                        onChange={this.onChange}
                      />
                    )} */}
                  </div>
                  <NavButton
                    canBack={this.canBack()}
                    canNext={this.canNext()}
                    canFinish={this.canFinish()}
                    onBack={this.onBack}
                    onNext={this.onNext}
                    onFinish={this.onFinish}
                  />
                </div>
              </div>
            </Modal.Body>
          </div>
        </div>
      </Modal>
    );
  }
}
