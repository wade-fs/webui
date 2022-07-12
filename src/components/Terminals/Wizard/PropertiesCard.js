import React, { Fragment } from "react";
import { ApplyAll, WizardField } from "components/Card";
import Checkbox from "components/Form/Checkbox";
import Select from "components/Form/Select";
import ScheduleWizard from "components/Schedule/ScheduleWizard";

import {
  Name,
  AllowInteractiveShadow,
  AllowShadow,
  BootPriority,
  BootPriorityMaxWait,
  EnforceBootPriority,
  ForceAdminMode,
  RebootDependentTerminals,
  Replaceable,
  Schedules,
  ShadowMode,
  ShowDeviceStatusBar,
  TerminalEffects,
  ScheduleApplyAll,
} from "const/Terminals/TerminalFieldNames";
import { ShadowOptions } from "const/Terminals/TerminalConsts";
import {
  EnforceBootPriorityApplyAll,
  AllowShadowApplyAll,
} from "const/Terminals/Properties";

import {
  getApplyAllProperties,
  getDisabledProperties,
} from "utils/Properties";

export default class PropertiesCard extends React.Component {
  constructor(props) {
    super(props);
    const applyAllProperties = getApplyAllProperties(props.parentTerminal.data);
    const isInherited = Object.keys(applyAllProperties).length > 0;
    const disabledApplyAllProperties = getDisabledProperties(
      props.parentTerminal.data
    );
    this.state = {
      isInherited: isInherited,
      disabledApplyAllProperties: disabledApplyAllProperties,
    };
  }

  change = (e) => {
    let {
      props: { data, onChange },
    } = this;
    data[e.target.name] = e.target.value;
    onChange(data);
  };

  getWrapperField(title, name, options, Tag) {
    let {
      props: { data },
    } = this;
    return (
      <WizardField
        title={title}
        name={name}
        options={{ value: data[name], ...options }}
        Tag={Tag}
        onChange={this.change}
      />
    );
  }

  getWrapperApplyAll(key) {
    let {
      props: { applyAllProperties },
      state: { disabledApplyAllProperties },
    } = this;
    return (
      <ApplyAll
        name={`${key}ApplyAll`}
        isEditMode={true}
        value={applyAllProperties[key] !== undefined ? true : false}
        onChange={(e) => this.setApplyAll(e, key)}
        disabled={disabledApplyAllProperties[key] !== undefined ? true : false}
        outsideStyle={{ zIndex: "5" }}
        insideStyle={{
          display: "block",
          height: "30px",
          lineHeight: "30px",
          fontSize: "14px",
          fontWeight: "500",
          zIndex: "5",
        }}
        message={`Apply settings to all terminals(${key})`}
      />
    );
  }
  setApplyAll = (e, key) => {
    let applyAllProperties = Object.assign({}, this.props.applyAllProperties);
    if (e.target.value === true) {
      if (key === EnforceBootPriority) {
        applyAllProperties[key] = [...EnforceBootPriorityApplyAll];
      } else if (key === AllowShadow) {
        applyAllProperties[key] = [...AllowShadowApplyAll];
      } else {
        applyAllProperties[key] = [key];
      }
    } else {
      delete applyAllProperties[key];
    }
    this.props.updateApplyAllProperties(applyAllProperties);
  };

  render() {
    let {
      props: {
        isGroup,
        data,
        schedules,
        parentTerminal,
        otherApplyAll,
        onChange,
      },
      state: { isInherited, disabledApplyAllProperties },
    } = this;

    return (
      <Fragment>
        <div className="wrap01 wrap-bg-w clearfix pb-8">
          <h3 className=" border-bottom h-40">
            GERNERAL SETTINGS
            {isInherited && (
              <span style={{ float: "right" }}>
                Inherit from {parentTerminal.data[Name]}
              </span>
            )}
          </h3>
          <div className="align-left">
            <div style={{ float: "left" }}>
              {this.getWrapperField(
                "Allow replacement at terminal",
                Replaceable,
                {
                  type: "checkbox",
                  disabled:
                    disabledApplyAllProperties[Replaceable] != null
                      ? true
                      : false,
                },
                Checkbox
              )}

              {/* {this.getWrapperField(
                "Enable terminal effect",
                TerminalEffects,
                {
                  type: "checkbox",
                  disabled:
                    disabledApplyAllProperties[TerminalEffects] != null
                      ? true
                      : false,
                },
                Checkbox
              )}
              {this.getWrapperField(
                "Show terminal status",
                ShowDeviceStatusBar,
                {
                  type: "checkbox",
                  disabled:
                    disabledApplyAllProperties[ShowDeviceStatusBar] != null
                      ? true
                      : false,
                },
                Checkbox
              )}
              {this.getWrapperField(
                "Enforce boot priority",
                EnforceBootPriority,
                {
                  type: "checkbox",
                  labelClass:
                    data[EnforceBootPriority] === true ? "border-bottom" : "",
                  disabled:
                    disabledApplyAllProperties[EnforceBootPriority] != null
                      ? true
                      : false,
                },
                Checkbox
              )} */}
              {/* {data[EnforceBootPriority] === true && (
                <Fragment>
                  {this.getWrapperField("Boot priority", BootPriority, {
                    disabled:
                      disabledApplyAllProperties[EnforceBootPriority] != null
                        ? true
                        : false,
                    required: true,
                  })}
                  {this.getWrapperField(
                    "Maximum wait time",
                    BootPriorityMaxWait,
                    {
                      disabled:
                        disabledApplyAllProperties[EnforceBootPriority] != null
                          ? true
                          : false,
                      required: true,
                    }
                  )}
                </Fragment>
              )} */}
              {/* {this.getWrapperField(
                "Allow terminal to be shadowed",
                AllowShadow,
                {
                  type: "checkbox",
                  labelClass:
                    (data[AllowShadow] == true ? "border-bottom" : "") +
                    (data[EnforceBootPriority] === true ? " mt-24" : ""),
                  disabled:
                    disabledApplyAllProperties[AllowShadow] != null
                      ? true
                      : false,
                },
                Checkbox
              )} */}
              {data[AllowShadow] === true && (
                <Fragment>
                  {this.getWrapperField(
                    "Shadow mode",
                    ShadowMode,
                    {
                      type: "select",
                      options: ShadowOptions,
                      disabled:
                        disabledApplyAllProperties[AllowShadow] !== undefined
                          ? true
                          : false,
                      value: data[ShadowMode],
                    },
                    Select
                  )}
                  {/* {data.ShadowMode == "NO"
                    ? null
                    : this.getWrapperField(
                        "Allow interactive shadow",
                        AllowInteractiveShadow,
                        {
                          type: "checkbox",
                          labelClass: data[AllowShadow] === true ? "mt-24" : "",
                          disabled:
                            disabledApplyAllProperties[AllowShadow] != null
                              ? true
                              : false,
                        },
                        Checkbox
                      )} */}
                </Fragment>
              )}
              {data.ShadowMode == "NO"
                ? null
                : this.getWrapperField(
                    "Allow interactive shadow",
                    AllowInteractiveShadow,
                    {
                      type: "checkbox",
                      labelClass: data[AllowShadow] === true ? "mt-24" : "",
                      disabled:
                        disabledApplyAllProperties[AllowShadow] != null
                          ? true
                          : false,
                    },
                    Checkbox
                  )}
            </div>
            <div style={{ float: "right" }}>
              {isGroup && this.getWrapperApplyAll(Replaceable)}
              {/* {isGroup && this.getWrapperApplyAll(TerminalEffects)}
              {isGroup && this.getWrapperApplyAll(ShowDeviceStatusBar)}
              {isGroup && this.getWrapperApplyAll(EnforceBootPriority)}
              {isGroup && this.getWrapperApplyAll(AllowShadow)} */}
            </div>
          </div>
        </div>
        <ScheduleWizard
          isGroup={isGroup}
          data={schedules}
          parentTerminal={parentTerminal.data}
          config={{ ScheduleApplyAll: otherApplyAll[ScheduleApplyAll] }}
          object="Terminal"
          onChange={onChange}
        />
      </Fragment>
    );
  }
}
