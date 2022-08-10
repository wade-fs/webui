import React, { Fragment } from "react";
import { Modal } from "react-bootstrap";
import { WizardField, NavButton } from "components/Card";
import Checkbox from "components/Form/Checkbox";
import Counter from "components/Form/Counter";
import Input from "components/Form/Input";
import RadioButton from "components/Form/RadioButton";
import Select from "components/Form/Select";
import WizardSidebar, { Tab } from "components/ObjectCommon/WizardSidebar";
import AddObjectToGroup from "components/ObjectCommon/AddObjectToGroup";
import CloseWizardAlert from "components/Alert/CloseWizardAlert";
import ObjectPicker from "components/ObjectCommon/ObjectPicker";
import { getObjectById } from "utils/Object";

import {
  getTerminalSetting,
  clearTerminalSetting,
} from "actions/TerminalActions";
import {
  closeApplicationWizard,
  addApplication,
} from "actions/ApplicationActions";
import { loadServers } from "actions/ServerActions";

import {
  clone,
  stringValid,
  nameValidator,
  isDefaultObject,
  positiveNumberValidator,
} from "lib/Util";

import {
  APPLICATION_INFO,
  APPLICATION_GROUP_INFO,
  APPLICATION_PROPERTIES,
  VNC_PROPERTIES,
  CONNECTION_OPTIONS,
  SESSION_OPTIONS,
  LOAD_BALANCE,
  RDS_SERVER,
  AppTabs,
  AppGroupTabs,
  VncTabs,
  VncGroupTabs,
  TERMINAL,
  VNC_GROUP_INFO,
  VNC_INFO
} from "const/Applications/ApplicationConsts";
import { DUPLICATE_NAME_ERROR } from "const/Message";
import { NameInfo } from "const/Terminals/TerminalConsts";
import {
  Id,
  Name,
  ParentId,
  ParentName,
  MaintainAspectRatio,
  ScaleDownOnly,
  UseScreenSize,
  Resolution,
  SessionWidth,
  SessionHeight,
  ResolutionOptions,
  MinQueueTime,
  MaxQueueTime,
  IgnoreRDGatewayIfLocal,
  Infinite,
  LoadBalanced,
  EnforcePrimary,
  InstantFailover,
  CPUWeight,
  MemoryWeight,
  SessionWeight,
  Alias,
  LinkedApp,
  LinkedAppCommandOptions,
  LinkedAppDirectory,
  LinkedAppName,
  Path,
  PathType,
  RdsServerIds,
  UseRDGateway,
  Tid,
  Screen,
} from "const/Applications/ApplicationFieldNames";

import {
  DefaultApplication,
  DefaultAppGroup,
} from "const/Applications/Default";
import { terminalScreenOptions } from "const/Consts";

import { checkDuplicateName } from "utils/Check";

const applicationOptionsField = [
  {
    title: "Allow application to be tiled.",
    name: "AllowTile",
    options: { type: "checkbox" },
    form: Checkbox,
  },
  // {
  //   title: "Allow application to be moved.",
  //   name: "IsMoveable",
  //   options: { type: "checkbox" },
  //   form: Checkbox,
  // },
  /*{
    title: 'Include Camera Overlays',
    name: 'UseOverlays',
    options: {type: 'checkbox', inputStyle: {top: '8px'}},
    form: Checkbox
  },*/
  /*{
    title: 'Include Virtual Screen Overlays.',
    name: 'UseVirtualScreenOverlays',
    options: {type: 'checkbox', inputStyle: {top: '8px'}},
    form: Checkbox
  },*/
];
const connectionOptionsFields = [
  {
    title: "Always maintain a connection",
    name: "MaintainSession",
    options: {
      type: "checkbox",
      description:
        "Keeps a session, reconnecting and restarting if it is closed.",
    },
    form: Checkbox,
  },
  {
    title: "Connect at boot-up",
    name: "StartSession",
    options: {
      type: "checkbox",
      description: "Starts a session for this application at boot up.",
    },
    form: Checkbox,
  },
  {
    title: "Disconnect in the background",
    name: "DisconnectInBackground",
    options: {
      type: "checkbox",
      description:
        "Application being used in a multisession configuration will disconnect once it is moved into the background.",
    },
    form: Checkbox,
  },
  {
    title: "Allow Auto-Login.",
    name: "AllowAutoLogin",
    options: { type: "checkbox" },
    form: Checkbox,
  },
];

const sessionScalingOptionsField = [
  {
    title: "Maintain Aspect Ratio",
    name: MaintainAspectRatio,
    options: { type: "checkbox" },
    form: Checkbox,
  },
  {
    title: "Scale Down Only",
    name: ScaleDownOnly,
    options: { type: "checkbox" },
    form: Checkbox,
  },
];

const filterTab = (tab, isGroup) => {
  if (tab === 'RDS') {
    if (isGroup) {
      return [...AppGroupTabs]
    } else {
      return [...AppTabs]
    }
  } else if (tab === 'VNC') {
    if (isGroup) {
      return [...VncGroupTabs]
    } else {
      return [...VncTabs]
    }
  }
}

const filterNameLabel = (tab, isGroup) => {
  if (tab === 'RDS') {
    if (isGroup) {
      return 'Application Group Name'
    } else {
      return "Application Name"
    }
  } else if (tab === 'VNC') {
    if (isGroup) {
      return 'Vnc Group Name'
    } else {
      return 'Vnc Name'
    }
  }
}

const label = (tab) => {
  if (tab === 'RDS') {
    return 'Application Group'
  } else if (tab === 'VNC') {
    return 'Vnc Group'
  }
}

export default class Wizard extends React.Component {
  constructor(props) {
    super(props);
    const isGroup = props.data.isGroup;
    const tabs = filterTab(props.tab, isGroup);
    const updateTabs = tabs.map((item, index) =>
      index == 0
        ? new Tab(item, { clickable: true, visited: true })
        : new Tab(item, { clickable: false, completed: true })
    );
    this.state = {
      tabs: updateTabs,
      data: !props.data.isGroup
        ? clone(DefaultApplication)
        : clone(DefaultAppGroup),
      selectedTabIndex: 0,
      showExitAlert: false,
      showServerPicker: false,
      showTerminalPicker: false,
      selectedServerId: "",
      appType: Path,
      defaultClose: "",
      errorFields: {},
    };
    props.dispatch(loadServers());
  }

  componentDidMount() {
    let {
      props: { parentId },
      state: { data, defaultClose },
    } = this;
    data[ParentId] = parentId;
    defaultClose = JSON.stringify(data);
    this.setState({ data, defaultClose });
  }

  change = (e) => {
    let {
      props: {
        data: { isGroup, applications, applicationGroups, editingId },
      },
      state: { data, errorFields, tabs, selectedTabIndex },
    } = this;
    data[e.target.name] = e.target.value;

    if (e.target.error) {
      console.log("AW name", e.target.name, "error", e.target.error);
      errorFields[e.target.name] = e.target.error;
    } else {
      delete errorFields[e.target.name];
	}
    if (e.target.name === Name || e.target.name === ParentId) {
      const hasDuplicateName = checkDuplicateName(
        editingId,
        data[Name],
        data[ParentId],
        isGroup === false ? applications : applicationGroups
      );
      if (hasDuplicateName) {
        errorFields[Name] = DUPLICATE_NAME_ERROR;
      } else {
        if (e.target.name === ParentId) {
          const isNameValid = nameValidator(data[Name]);
          if (isNameValid == null) delete errorFields[Name];
        } else {
          delete errorFields[Name];
        }
      }
    } else if (e.target.name === Resolution && e.target.value !== "Custom") {
      const [width, height] = e.target.value
        .split(" x ")
        .map((item) => parseInt(item));
      data[SessionWidth] = width;
      data[SessionHeight] = height;
      this.setState({ data });
    } else if (e.target.name === LinkedApp) {
      if (data[LinkedApp] === "Desktop") {
        if (data[LinkedAppName] !== undefined) {
          delete data[LinkedAppName];
        }
        if (data[Alias] !== undefined) {
          delete data[Alias];
        }
        if (data[LinkedAppCommandOptions] !== undefined) {
          delete data[LinkedAppCommandOptions];
        }
        if (data[LinkedAppDirectory] !== undefined) {
          delete data[LinkedAppDirectory];
        }
      }
      this.setState({ data });
    } else if (e.target.name === PathType) {
      if (data[LinkedApp] === "Application") {
        if (data[LinkedAppName] !== undefined) {
          delete data[LinkedAppName];
        }
        if (data[Alias] !== undefined) {
          delete data[Alias];
        }
        if (data[LinkedAppDirectory] !== undefined) {
          delete data[LinkedAppDirectory];
        }
      }

      this.setState({ data, appType: e.target.value });
    }
    this.setState({
      errorFields,
      tabs: this.setTabClickable(tabs, selectedTabIndex, true),
    });
  };

  changeTerminal = (e) => {
    let {
      state: { data, errorFields }
    } = this;
    data[Tid] = e.target.value;
    this.props.dispatch(getTerminalSetting(data[Tid]));
    if (e.target.error) {
      errorFields[e.target.name] = e.target.error;
    }
  }

  setTabClickable = (tabs, selectedTabIndex, isCurrentTabCompleted) => {
    tabs[selectedTabIndex].completed = isCurrentTabCompleted;
    tabs.forEach((tab) => {
      tab.clickable = tab.completed && isCurrentTabCompleted;
    });
    return tabs;
  };

  onSelect = (selectedTabIndex) => {
    let { tabs } = this.state;
    tabs[selectedTabIndex].visited = true;
    this.setState({ selectedTabIndex });
  };

  closeWizard = () => {
    this.props.dispatch(closeApplicationWizard());
  };
  openExitAlert = () => {
    this.setState({
      showExitAlert: true,
    });
  };
  closeExitAlert = () => {
    this.setState({
      showExitAlert: false,
    });
  };
  openServerPicker = () => {
    this.setState({ showServerPicker: true });
  };
  openTerminalPicker = () => {
    this.setState({ showTerminalPicker: true });
  };
  closeServerPicker = () => {
    this.setState({ showServerPicker: false });
  };
  closeTerminalPicker = () => {
    this.setState({ showTerminalPicker: false });
  };

  gotoTab = (offset) => {
    let {
      state: { tabs, selectedTabIndex },
    } = this;
    if (selectedTabIndex == tabs.length - 1 && offset == 1) {
      this.onFinish();
    }
    if (
      selectedTabIndex + offset >= 0 &&
      selectedTabIndex + offset < tabs.length
    ) {
      tabs[selectedTabIndex + offset].clickable = true;
      tabs[selectedTabIndex + offset].visited = true;
      // add reset tree type on wizard first page
      if (selectedTabIndex + offset === 0) {
        this.setState({
          selectedTabIndex: selectedTabIndex + offset,
          tabs,
        });
      } else {
        this.setState({ selectedTabIndex: selectedTabIndex + offset, tabs });
      }
    }
  };

  onBack = () => {
    this.gotoTab(-1);
  };
  onNext = () => {
    let {
      state: { tabs, selectedTabIndex },
    } = this;
    tabs[selectedTabIndex].completed = true;
    this.setState({ tabs });
    this.gotoTab(1);
  };
  onFinish = () => {
    let {
      props: { dispatch },
      state: { data },
    } = this;
    delete data[ParentName];
    const isGroup = this.props.data.isGroup;
    const tab = this.props.tab;
    if (isGroup === false) {
      delete data[Resolution];
      if (data.UseScreenSize) {
        delete data["SessionHeight"];
        delete data["SessionWidth"];
      }
    }
    if (tab === 'VNC') {
      data["GroupType"] = 'VNC'
    }
    dispatch(addApplication(data, isGroup));
  };

  canBack = () => {
    let {
      state: { selectedTabIndex },
    } = this;
    return selectedTabIndex > 0;
  };
  canNext = () => {
    let {
      state: { selectedTabIndex, tabs, data, errorFields },
    } = this;
    if (selectedTabIndex > tabs.length - 2) return false;
    const tab = tabs[selectedTabIndex].label;
    switch (tab) {
      case APPLICATION_INFO:
      case APPLICATION_GROUP_INFO:
      case VNC_GROUP_INFO:
        return stringValid(data.Name) && isDefaultObject(errorFields);
      case VNC_INFO:
        return stringValid(data.Name) && isDefaultObject(errorFields) && data.Tid !== 0 &&
          data.Screen !== ""
      case SESSION_OPTIONS:
        return isDefaultObject(errorFields);
      case RDS_SERVER:
        return (
          typeof data.RdsServerIds === "string" && data.RdsServerIds.length > 1
        );
      default:
        return true;
    }
  };
  canFinish = () => {
    let {
      props: { tab },
      state: { data, errorFields },
    } = this;
    const isGroup = this.props.data.isGroup;
    if (isGroup === true)
      return isDefaultObject(errorFields) && stringValid(data.Name);
    if (tab === "RDS") {
      return (
        isDefaultObject(errorFields) &&
        stringValid(data.Name) &&
        typeof data.RdsServerIds === "string" &&
        data.RdsServerIds !== ""
      );
    } else if (tab === "VNC") {
      return isDefaultObject(errorFields) &&
        stringValid(data.Name) &&
        data.Tid !== 0 &&
        data.Screen !== ""
    }
  };

  toggleSelectServer = (id) => {
    if (id != this.state.selectedServerId) {
      this.setState({ selectedServerId: id });
    }
  };

  addRdsServers = (id) => {
    let {
      state: { data, selectedServerId },
    } = this;
    selectedServerId = id;
    data.RdsServerIds =
      data.RdsServerIds == null || data.RdsServerIds.length == 0
        ? `${id}`
        : `${data.RdsServerIds},${id}`;
    this.setState({ data, selectedServerId });
    this.closeServerPicker();
  };
  addTerminal = (id) => {
    let {
      state: { data, selectedServerId },
    } = this;
    selectedServerId = id;
    data.RdsServerIds =
      data.RdsServerIds == null || data.RdsServerIds.length == 0
        ? `${id}`
        : `${data.RdsServerIds},${id}`;
    this.setState({ data, selectedServerId });
    this.closeTerminalPicker();
  };

  removeRdsServer = () => {
    let {
      state: { data, selectedServerId },
    } = this;
    if (
      data[RdsServerIds] != null &&
      data[RdsServerIds].length > 0 &&
      selectedServerId != ""
    ) {
      let rdsServers = data[RdsServerIds].split(",");
      let idx = rdsServers.indexOf(selectedServerId + "");
      if (idx != -1) {
        rdsServers.splice(idx, 1);
        data[RdsServerIds] = rdsServers.join(",");
        this.setState({ data });
      }
    }
  };

  getWrapperField(title, name, options, Tag, description, btnOptions = {}) {
    let {
      state: { data },
    } = this;
    return (
      <WizardField
        title={title}
        name={name}
        options={{ value: options?.value ?? data[name], ...options }}
        Tag={Tag}
        // description={description}
        onChange={this.change}
        btnOptions={btnOptions}
      />
    );
  }

  basicInfoCard() {
    let {
      props: {
        data: { isGroup },
        rdss, rdsGroups, rdsMainTree, vncs, vncGroups, vncMainTree,
        tab,
        terminals: { terminals, terminalGroups, terminalMainTree }
      },
      state: { data, errorFields },
    } = this;

    const nameLabel = filterNameLabel(tab, isGroup)
    let parentName = "";
    const parentId = parseInt(data.ParentId);
    if (parentId != null && parentId != 0) {
      if (tab === "RDS") {
        parentName = rdsGroups.data?.find((item) => item.Id === parentId).Name
      } else {
        parentName = vncGroups?.data?.find((item) => item.Id === parentId).Name
      }
    }
    let terminalParentName = getObjectById(data[Tid], terminals)?.Name;
    let mainTree = {};
    if (tab === 'RDS') {
      mainTree.data = rdsMainTree.data.filter(item => item.GroupType === tab || item.Id === 0);
    } else {
      mainTree.data = vncMainTree.data.filter(item => item.GroupType === tab || item.Id === 0);
    }
    return (
      <div className="wrap01 mt-12  wrap-bg-w pb-24">
        <h3 className=" border-bottom h-40">BASIC INFO</h3>
        <div className="pt-12">
          {this.getWrapperField(
            nameLabel,
            Name,
            {
              type: "input",
              showCharacterCounter: true,
              max: 20,
              validator: nameValidator,
              error: errorFields[Name],
            },
            Input,
            NameInfo
          )}
        </div>
        <label className="pt-12">{label(tab, isGroup)}</label>
        <AddObjectToGroup
          isGroup={isGroup}
          objectGroups={tab === "RDS" ? rdsGroups : vncGroups}
          currentTab={tab}
          tab={tab}
          selectGroupName={parentName}
          mainTree={tab === "RDS" ? rdsMainTree : vncMainTree}
          treeType="appGroup"
          onConfirm={this.change}
          pickerTitle="CHOOSE EXISTING GROUP"
        />
        {(tab === 'VNC' && !isGroup) &&
          <>
            <label className="pt-12">Select Terminal</label>
            <AddObjectToGroup
              isGroup={isGroup}
              objectGroups={terminalGroups}
              mainTree={terminalMainTree}
              treeType="terminal"
              selectTerminalName={terminalParentName}
              onConfirm={this.changeTerminal}
              pickerTitle="CHOOSE TERMINAL"
            />
            <div className="pt-12">
              {this.getWrapperField(
                "Select Terminal Screen",
                Screen,
                {
                  type: "select",
                  value: data.Screen ?? "",
                  options: terminalScreenOptions,
                  style: { display: "inline-flex" },
                },
                Select
              )}
            </div>
          </>
        }
      </div>
    );
  }
  smartSessionWeightsCard() {
    let {
      state: { data },
    } = this;
    let disabled = data[LoadBalanced] != true;
    return (
      <div className="wrap01 mt-12 wrap-bg-w pb-24">
        <h3 className=" border-bottom h-40">LOAD BALANCE</h3>
        <div className=" align-left pt-12">
          {this.getWrapperField(
            "Load Balance",
            LoadBalanced,
            {
              type: "checkbox",
              disabled: data[EnforcePrimary],
            },
            Checkbox
          )}
          {this.getWrapperField(
            "Enforce Primary",
            EnforcePrimary,
            {
              type: "checkbox",
              disabled: data[LoadBalanced],
            },
            Checkbox
          )}
          {this.getWrapperField(
            "Instant Failover",
            InstantFailover,
            { type: "checkbox" },
            Checkbox
          )}
          {this.getWrapperField(
            "CPU Utilization Weight",
            CPUWeight,
            { type: "counter", min: 0, max: 999, disabled: disabled },
            Counter
          )}
          {this.getWrapperField(
            "Memory Utilization Weight",
            MemoryWeight,
            { type: "counter", min: 0, max: 999, disabled: disabled },
            Counter
          )}
          {this.getWrapperField(
            "Sessions Weight",
            SessionWeight,
            { type: "counter", min: 0, max: 999, disabled: disabled },
            Counter
          )}
        </div>
      </div>
    );
  }

  queuingCard() {
    return (
      <div className="wrap01 mt-12  wrap-bg-w pb-24">
        <h3 className=" border-bottom h-40">QUEUE TIME</h3>
        <div className=" align-left pt-12">
          {this.getWrapperField(
            "Min Queue Time (second)",
            MinQueueTime,
            { type: "input", className: "w-100 ml-5 mr-20" },
            Input
          )}
          {this.getWrapperField(
            "Max Queue Time (second)",
            MaxQueueTime,
            { type: "input", className: "w-100 ml-5" },
            Input
          )}
          <div className="mt-8">
            {this.getWrapperField(
              "Infinite ?",
              Infinite,
              {
                type: "checkbox",
              },
              Checkbox
            )}
          </div>
        </div>
      </div>
    );
  }

  addRdsServerCard() {
    let {
      props: { servers, rdss, rdsGroups, rdsMainTree, vncs, vncGroups, vncMainTree },
      state: { data, selectedServerId },
    } = this;
    let selectedServers;
    let rdsServers = [];
    if (data[RdsServerIds] != null && data[RdsServerIds] != "") {
      rdsServers = data[RdsServerIds].split(",");
    }
    if (servers.servers.data != null) {
      selectedServers = servers.servers.data.filter(
        (server) => rdsServers.indexOf(server[Id] + "") != -1
      );
    }
    return (
      <div className="wrap01 mt-12  wrap-bg-w pb-8">
        <h3 className=" border-bottom h-40">RDS SERVER</h3>
        <div className=" align-left">
          <label for="">The highest server will be the priority.</label>
          {selectedServers.length < 1 && (
            <div
              className="addnew-btn mt-12"
              onClick={() => this.openServerPicker()}
            >
              ＋ ADD NEW
            </div>
          )}
          {selectedServers != null && selectedServers.length > 0 && (
            <Fragment>
              {selectedServers.map((server, index) => (
                <div
                  key={server.Id}
                  className={
                    "schedule-btn-2" +
                    (index == 0
                      ? " mt-12 mb-8"
                      : index == selectedServers.length - 1
                        ? ""
                        : " mb-8") +
                    (server[Id] == selectedServerId ? " select" : "")
                  }
                  onClick={() => this.toggleSelectServer(server[Id])}
                >
                  {server[Name]}
                  {selectedServerId == server[Id] && (
                    <div
                      className="action-delete-sm"
                      onClick={() => this.removeRdsServer(server[Id])}
                    ></div>
                  )}
                </div>
              ))}
            </Fragment>
          )}
        </div>
      </div>
    );
  }

  addTerminalCard() {
    let {
      props: { terminals },
      state: { data, selectedServerId },
    } = this;
    let selectedTerminals;
    let rdsServers = [];
    if (data[RdsServerIds] != null && data[RdsServerIds] != "") {
      rdsServers = data[RdsServerIds].split(",");
    }
    if (terminals.terminals.data != null) {
      selectedTerminals = terminals.terminals.data.filter(
        (server) => rdsServers.indexOf(server[Id] + "") != -1
      );
    }
    return (
      <div className="wrap01 mt-12  wrap-bg-w pb-8">
        <h3 className=" border-bottom h-40">TERMINAL</h3>
        <div className=" align-left">
          <label for="">The highest server will be the priority.</label>
          {selectedTerminals.length < 1 && (
            <div
              className="addnew-btn mt-12"
              onClick={() => this.openTerminalPicker()}
            >
              ＋ ADD NEW
            </div>
          )}
          {selectedTerminals != null && selectedTerminals.length > 0 && (
            <Fragment>
              {selectedTerminals.map((server, index) => (
                <div
                  key={server.Id}
                  className={
                    "schedule-btn-2" +
                    (index == 0
                      ? " mt-12 mb-8"
                      : index == selectedTerminals.length - 1
                        ? ""
                        : " mb-8") +
                    (server[Id] == selectedServerId ? " select" : "")
                  }
                  onClick={() => this.toggleSelectServer(server[Id])}
                >
                  {server[Name]}
                  {selectedServerId == server[Id] && (
                    <div
                      className="action-delete-sm"
                      onClick={() => this.removeRdsServer(server[Id])}
                    ></div>
                  )}
                </div>
              ))}
            </Fragment>
          )}
        </div>
      </div>
    );
  }

  rdsGatewaySettingsCard() {
    return (
      <div className="wrap01 mt-12  wrap-bg-w pb-10">
        <h3 className=" border-bottom h-40">RDS GATEWAY SETTINGS</h3>
        <div className=" align-left pt-12">
          {this.getWrapperField(
            "Use RD Gateway Server",
            UseRDGateway,
            { type: "checkbox" },
            Checkbox
          )}
          {this.getWrapperField(
            "Bypass RD Gateway Server for local addresses.",
            IgnoreRDGatewayIfLocal,
            { type: "checkbox" },
            Checkbox
          )}
        </div>
      </div>
    );
  }

  sessionResolutionOptionsCard() {
    let {
      state: { data },
    } = this;

    return (
      <div className="wrap01 mt-12  wrap-bg-w pb-24">
        <h3 className=" border-bottom h-40">SESSION RESOLUTION</h3>
        <div className=" align-left pt-12">
          {this.getWrapperField(
            "Use Screen Resolution",
            UseScreenSize,
            { type: "checkbox" },
            Checkbox
          )}
          <div style={{ display: "flex", alignItems: "end" }}>
            <div>
              {this.getWrapperField(
                "Resolution",
                Resolution,
                {
                  type: "select",
                  value: data[Resolution] ?? "1024 x 768",
                  options: ResolutionOptions,
                  className: "w-120 h-32 mr-16",
                  disabled: data[UseScreenSize],
                },
                Select
              )}
            </div>
            {data[Resolution] === "Custom" && (
              <div>
                {this.getWrapperField(
                  "Session Width",
                  SessionWidth,
                  {
                    type: "number",
                    className: "w-100 mr-5",
                    disabled: data[UseScreenSize],
                    value: data[SessionWidth] ?? 1024,
                    validator: positiveNumberValidator,
                    minNumber: 1,
                  },
                  Input
                )}
              </div>
            )}
            {data[Resolution] === "Custom" && (
              <span className={data[UseScreenSize] ? "op-35" : ""}> X </span>
            )}
            {data[Resolution] === "Custom" && (
              <div>
                {this.getWrapperField(
                  "Session Height",
                  SessionHeight,
                  {
                    type: "number",
                    className: "w-100 ml-5",
                    disabled: data[UseScreenSize],
                    value: data[SessionHeight] ?? 768,
                    validator: positiveNumberValidator,
                    minNumber: 1,
                  },
                  Input
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // title: 'Applicatin Options'
  // fields: [{title, name, options, form}]
  getPropertiesCard(title, fields) {
    return (
      <div className="wrap01 mt-12 wrap-bg-w pb-24">
        <h3 className=" border-bottom h-40">{title}</h3>
        <div
          className={
            title === "CONNECTION"
              ? "align-left-multi-line"
              : "align-left pt-12"
          }
        >
          {fields.map((field) =>
            this.getWrapperField(
              field.title,
              field.name,
              field.options,
              field.form
            )
          )}
        </div>
      </div>
    );
  }

  getTypeCard() {
    let {
      state: { data, appType },
    } = this;

    return (
      <div className="wrap01 mt-12 wrap-bg-w pb-24">
        <h3 className=" border-bottom h-40">TYPE</h3>
        <div className="align-left pt-12 pb-12">
          {this.getWrapperField(
            "Desktop",
            LinkedApp,
            {
              type: "radio",
              value: data[LinkedApp],
              selectedValue: "Desktop",
              style: { marginBottom: "8px" },
            },
            RadioButton
          )}
          {this.getWrapperField(
            "Application",
            LinkedApp,
            {
              type: "radio",
              value: data[LinkedApp],
              selectedValue: "Application",
              style: { marginBottom: "8px" },
            },
            RadioButton
          )}
          {data[LinkedApp] === "Application" &&
            this.getWrapperField(
              "Path Type",
              PathType,
              {
                options: [Path, Alias],
              },
              Select
            )}
          {data[LinkedApp] === "Application" &&
            appType === Path &&
            this.getWrapperField("Program Path", LinkedAppName)}
          {data[LinkedApp] === "Application" &&
            appType === Alias &&
            this.getWrapperField(Alias, Alias)}
          {data[LinkedApp] === "Application" &&
            this.getWrapperField(
              "Command Line Options",
              LinkedAppCommandOptions
            )}
          {/* {data[LinkedApp] === "Application" &&
            appType === Path &&
            this.getWrapperField(
              "Start in the following folder",
              LinkedAppDirectory
            )} */}
        </div>
      </div>
    );
  }

  render() {
    let {
      props: { servers, terminals, rdss, rdsGroups, rdsMainTree, vncs, vncGroups, vncMainTree, tab, currentTab },
      state: {
        tabs,
        data,
        selectedTabIndex,
        showExitAlert,
        showServerPicker,
        showTerminalPicker,
        defaultClose,
      },
    } = this;

    const selectedTab = tabs[selectedTabIndex].label;
    const autoClose = JSON.stringify(data);

    return (
      <Modal show={true}>
        <div className="w-container">
          <div className="wrapper2" style={{ marginTop: "80px" }}>
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
                    {(selectedTab === APPLICATION_GROUP_INFO ||
                      selectedTab === APPLICATION_INFO ||
                      selectedTab === VNC_GROUP_INFO ||
                      selectedTab === VNC_INFO) &&
                      this.basicInfoCard()}
                    {selectedTab === `${APPLICATION_PROPERTIES || VNC_PROPERTIES}` && (
                      <Fragment>
                        {this.getPropertiesCard(
                          "GERNERAL OPTIONS",
                          applicationOptionsField
                        )}
                        {this.getPropertiesCard(
                          "SCALING OPTIONS",
                          sessionScalingOptionsField
                        )}
                        {this.sessionResolutionOptionsCard()}
                        {tab === 'RDS' &&
                          <Fragment>
                            {this.getTypeCard()}
                          </Fragment>
                        }
                      </Fragment>
                    )}
                    {selectedTab === RDS_SERVER && (
                      <Fragment>
                        {this.addRdsServerCard()}
                      </Fragment>
                    )}
                    {selectedTab === TERMINAL && (
                      <Fragment>
                        {this.addTerminalCard()}
                      </Fragment>
                    )}
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
              {showServerPicker && (
                <ObjectPicker
                  treeType="appServer"
                  mainTree={servers.serverMainTree.data}
            rdss={rdss} rdsGroups={rdsGroups} rdsMainTree={rdsMainTree}
            vncs={vncs} vncGroups={vncGroups} vncMainTree={vncMainTree}
            currentTab={currentTab}
                  pickerTitle="ADD RDS SERVER"
                  onCancel={this.closeServerPicker}
                  onConfirm={this.addRdsServers}
                />
              )}
              {showTerminalPicker && (
                <ObjectPicker
                  treeType="appServer"
                  mainTree={terminals.terminalMainTree.data}
            rdss={rdss} rdsGroups={rdsGroups} rdsMainTree={rdsMainTree}
            vncs={vncs} vncGroups={vncGroups} vncMainTree={vncMainTree}
            currentTab
                  pickerTitle="ADD TERMINAL"
                  onCancel={this.closeTerminalPicker}
                  onConfirm={this.addTerminal}
                />
              )}
            </Modal.Body>
          </div>
        </div>
      </Modal>
    );
  }
}
