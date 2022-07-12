import React, { Fragment } from "react";
import Input from "components/Form/Input";
import { CancelAndConfirm } from "components/Form/Button";

import { APP_ALL_MESSAGE } from "const/Message";

export function ItemField({
  title,
  name,
  onChange,
  options = { type: "text", value: "" },
  Tag = Input,
  isEditMode = true,
  hasButton = false,
  btnOptions = { btnName: "BROWSE", btnDisabled: false, btnClick: null },
}) {
  let { children = null, ...properties } = options;
  let value = properties.value ?? "";
  if (properties.split) {
    let splitter = " ";
    if (name == "VideoPortMapping") {
      splitter = ";";
    }
    if (name == "frequencyInMinute") {
      let hour = Math.floor(value / 60);
      let min = value % 60;
      if (properties.idx == 0) {
        value = hour;
      } else if (properties.idx == 1) {
        value = min;
      }
    } else {
      value = value == null ? "" : value.split(splitter)[properties.idx];
    }
  }
  if (properties.type === "date" || properties.type === "time") {
    properties.required = "";
  }
  if (properties.type != "file") {
    properties.value = value;
    properties.checked = value === true;
  }
  let id = `u${name}`;
  if (properties.split) {
    id = `u${name}_${properties.idx}`;
  }
  if (typeof value === "boolean") {
    if (value == true) {
      value = "YES";
    } else if (value == false) {
      value = "NO";
    }
  }

  return (
    <div className={hasButton ? "input-and-btn" : ""}>
      {isEditMode && (
        <Fragment>
          <Tag
            id={id}
            name={name}
            title={title}
            onChange={onChange}
            {...properties}
          >
            {children}
          </Tag>
          {hasButton && (
            <button
              className="primary-btn"
              disabled={btnOptions.btnDisabled}
              onClick={btnOptions.btnClick}
            >
              {btnOptions.btnName}
            </button>
          )}
        </Fragment>
      )}
      {!isEditMode && (
        <Fragment>
          {options.type === "password" && value !== "" ? (
            <p data-view>●●●●●●●●●●●●</p>
          ) : (
            <p
              data-view={options.type === "radio" ? false : true}
              style={{ whiteSpace: options.wrap ? "normal" : "inherit" }}
            >
              {value}
            </p>
          )}
        </Fragment>
      )}
    </div>
  );
}

export function EditorField(props) {
  return (
    <li className={props.outerClass}>
      <label
        className={
          !props.isEditMode && props.Tag?.name === "Select"
            ? "select-title"
            : ""
        }
      >
        {props.title}
        {props.options?.required && (
          <span style={{ color: "red" }}>{" *"}</span>
        )}
      </label>
      <ItemField {...props} />
    </li>
  );
}

export function WizardField(props) {
  return props.Tag?.name === "Checkbox" || props.Tag?.name === "RadioButton" ? (
    <ItemField {...props} />
  ) : (
    <Fragment>
      <label>
        {props.title}
        {props.options?.required && (
          <span style={{ color: "red" }}>{" *"}</span>
        )}
      </label>
      {props.description && (
        <p className="maximun-charactor">{props.description}</p>
      )}
      <ItemField {...props} />
    </Fragment>
  );
}

export function ApplyAll({
  name,
  value,
  onChange,
  isEditMode = true,
  disabled = false,
  outsideStyle = { float: "right", zIndex: "5", marginRight: "46px" },
  insideStyle = {},
  message = APP_ALL_MESSAGE,
}) {
  function change(e) {
    const { checked } = e.target;
    const event = {
      target: {
        name: e.target.name,
        value: checked,
      },
    };
    onChange(event);
  }
  return (
    <div style={outsideStyle}>
      <label className={!isEditMode ? "op-35" : ""} style={insideStyle}>
        <input
          name={name}
          type="checkbox"
          value={value}
          checked={value}
          disabled={disabled}
          onChange={change}
        />
        {message}
      </label>
    </div>
  );
}

export function Title({ title }) {
  return <div className="subject">{title}</div>;
}

export function AboutField({ title, value }) {
  return (
    <li>
      <label>{title}</label>
      <p data-view>{value}</p>
    </li>
  );
}

export function EditorSubTab({
  tabWidth,
  tabZIndex,
  tabClass,
  subTabs,
  currentTab,
  selectTab,
}) {
  return (
    <nav className="modal-sub-tab">
      <ul>
        {subTabs.map((tab, index) => (
          <li
            key={tab}
            className={tabClass + (tab === currentTab ? " sub-tab-click" : "")}
            name={tab}
            style={
              tab === currentTab
                ? { left: String(tabWidth * index + 20 + "px"), zIndex: 10 }
                : {
                    left: String(tabWidth * index + 20 + "px"),
                    zIndex: tabZIndex - index,
                  }
            }
            onClick={(e) => selectTab(e.target.getAttribute("name"))}
          >
            {tab}
          </li>
        ))}
      </ul>
    </nav>
  );
}

export function EditorContainer({
  isEditMode,
  title,
  edited,
  canApply,
  onEdit,
  onCancel,
  onApply,
  children,
}) {
  return (
    <div className="modal-content-card">
      <div
        className={
          isEditMode
            ? "wrap-960 wrap-bg-w modal-content-card-edit"
            : "wrap-960 wrap-bg-w modal-content-edit"
        }
      >
        {!isEditMode && <div className="action-edit" onClick={onEdit}></div>}
        <Title title={title} />
        <div
          className={
            isEditMode
              ? "modal-content-inside-card-edit"
              : "modal-content-inside-card"
          }
        >
          {children}
        </div>
      </div>
      {isEditMode && (
        <CancelAndConfirm
          type="APPLY"
          canConfirm={canApply && edited}
          onCancel={onCancel}
          onConfirm={onApply}
        />
      )}
    </div>
  );
}

export function NavButton({
  canBack,
  canNext,
  canFinish,
  onBack,
  onNext,
  onFinish,
}) {
  return (
    <div className="nav-footer mt-24">
      <button
        className="primary-btn"
        disabled={!canBack}
        onClick={canBack ? onBack : null}
      >
        BACK
      </button>
      <button
        className="primary-btn"
        disabled={!canNext}
        onClick={canNext ? onNext : null}
      >
        NEXT
      </button>
      <button
        className="primary-btn"
        disabled={!canFinish}
        onClick={canFinish ? onFinish : null}
      >
        FINISH
      </button>
    </div>
  );
}
