import React, { Fragment } from "react";
import { EditorField, ApplyAll } from "components/Card";
import Slider from "components/Form/Slider";
import Select from "components/Form/Select";

import { ShadowOptions } from "const/Terminals/TerminalConsts";
import {
  Name,
  AllowShadow,
  Replaceable,
  AllowInteractiveShadow,
  BootPriorityMaxWait,
  BootPriority,
  RebootDependentTerminals,
  ShowDeviceStatusBar,
  EnforceBootPriority,
  TerminalEffects,
  ShadowMode,
  ForceAdminMode,
} from "const/Terminals/TerminalFieldNames";

import {
  getApplyAllProperties,
  getDisabledProperties,
} from "utils/Properties";

export default class PropertiesCard extends React.Component {
  constructor(props) {
    super(props);
    const isInherited =
      props.disableApplyAllProperties != null &&
      Object.keys(props.disableApplyAllProperties).length > 0
        ? true
        : false;
    const disableApplyAllProperties = getDisabledProperties(
      props.parentTerminal.data
    );
    this.state = {
      disabledApplyAllProperties: disableApplyAllProperties ?? {},
      isInherited: isInherited,
    };
  }

  change = (e) => {
    let {
      props: { data, onChange },
    } = this;
    data[e.target.name] = e.target.value;
    onChange(data, true);
  };

  getWrapperApplyAll(key) {
    let {
      props: { isEditMode, applyAllProperties, setApplyAll },
      state: { disabledApplyAllProperties },
    } = this;
    return (
      <ApplyAll
        name={`${key}ApplyAll`}
        isEditMode={isEditMode}
        value={applyAllProperties[key] != null ? true : false}
        onChange={(e) => setApplyAll(e, key)}
        disabled={disabledApplyAllProperties[key] !== undefined ? true : false}
      />
    );
  }
  getWrapperField(title, name, options, Tag, style) {
    let {
      props: { isEditMode, data },
    } = this;
    return (
      <EditorField
        title={title}
        name={name}
        options={{ value: data[name], ...options }}
        Tag={Tag}
        isEditMode={isEditMode}
        style={style}
        onChange={this.change}
      />
    );
  }

  render() {
    let {
      props: { isLoaded, isGroup, data, parentTerminal },
      state: { isInherited, disabledApplyAllProperties },
    } = this;
    return (
      isLoaded && (
        <Fragment>
          {isInherited && (
            <div
              className="modal-text-b"
              style={{
                position: "absolute",
                top: "16px",
                right: "80px",
              }}
            >
              Inherit from {parentTerminal.data[Name]}
            </div>
          )}
          <ul className="editor-content">
            {isGroup && this.getWrapperApplyAll(Replaceable)}
            {this.getWrapperField(
              "ALLOW REPLACEMENT AT TERMINAL IF OFFLINE",
              Replaceable,
              {
                value: data[Replaceable],
                type: "slider",
                disabled:
                  disabledApplyAllProperties[Replaceable] != null
                    ? true
                    : false,
              },
              Slider
            )}
            {/* {this.getWrapperField(
              "PUT TERMINAL IN ADMIN MODE AT STARTUP",
              ForceAdminMode,
              {
                value: data[ForceAdminMode],
                type: "slider",
              },
              Slider
            )}
            {isGroup && this.getWrapperApplyAll(TerminalEffects)}
            {this.getWrapperField(
              "ENABLE TERMINAL EFFECT",
              TerminalEffects,
              {
                value: data[TerminalEffects],
                type: "slider",
                disabled:
                  disabledApplyAllProperties[TerminalEffects] != null
                    ? true
                    : false,
              },
              Slider
            )} */}
            {isGroup && this.getWrapperApplyAll(ShowDeviceStatusBar)}
            {/* {this.getWrapperField(
              "SHOW TERMINAL STATUS",
              ShowDeviceStatusBar,
              {
                value: data[ShowDeviceStatusBar],
                type: "slider",
                disabled:
                  disabledApplyAllProperties[ShowDeviceStatusBar] != null
                    ? true
                    : false,
              },
              Slider
            )}
            {isGroup && this.getWrapperApplyAll(EnforceBootPriority)}
            {this.getWrapperField(
              "ENFORCE BOOT PRIORITY",
              EnforceBootPriority,
              {
                value: data[EnforceBootPriority],
                type: "slider",
                disabled:
                  disabledApplyAllProperties[EnforceBootPriority] != null
                    ? true
                    : false,
              },
              Slider
            )}
            {data[EnforceBootPriority] === true && (
              <Fragment>
                {this.getWrapperField("BOOT PRIORITY", BootPriority, {
                  value: data[BootPriority],
                  type: "number",
                  disabled:
                    disabledApplyAllProperties[EnforceBootPriority] != null
                      ? true
                      : false,
                })}
                {this.getWrapperField(
                  "MAXIMUM WAIT TIME (SECOND)",
                  BootPriorityMaxWait,
                  {
                    value: data[BootPriorityMaxWait],
                    type: "number",
                    disabled:
                      disabledApplyAllProperties[EnforceBootPriority] != null
                        ? true
                        : false,
                  }
                )}
              </Fragment>
            )}
            {this.getWrapperField(
              "REBOOT LOWER PRIORITY TERMINAL ON STARTUP",
              RebootDependentTerminals,
              {
                value: data[RebootDependentTerminals],
                type: "slider",
                disabled:
                  disabledApplyAllProperties[EnforceBootPriority] != null
                    ? true
                    : false,
              },
              Slider
            )}
            {isGroup && this.getWrapperApplyAll(AllowShadow)}
            {this.getWrapperField(
              "ALLOW SHADOWING",
              AllowShadow,
              {
                value: data[AllowShadow],
                type: "slider",
                disabled:
                  disabledApplyAllProperties[AllowShadow] != null
                    ? true
                    : false,
              },
              Slider
            )} */}
            {data[AllowShadow] === true && (
              <Fragment>
                {this.getWrapperField(
                  "SHADOW MODE",
                  ShadowMode,
                  {
                    value: data[ShadowMode],
                    type: "select",
                    options: ShadowOptions,
                    disabled:
                      disabledApplyAllProperties[AllowShadow] != null
                        ? true
                        : false,
                  },
                  Select
                )}
                {data[ShadowMode] !== "NO" &&
                  this.getWrapperField(
                    "ALLOW INTERACTIVE SHADOW",
                    AllowInteractiveShadow,
                    {
                      value: data[AllowInteractiveShadow],
                      type: "slider",
                      disabled:
                        disabledApplyAllProperties[AllowShadow] != null
                          ? true
                          : false,
                    },
                    Slider
                  )}
              </Fragment>
            )}
          </ul>
        </Fragment>
      )
    );
  }
}
