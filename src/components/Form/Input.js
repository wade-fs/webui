import React, { Fragment } from "react";
import { TogglePassword } from "components/Form/Button";

import { stringValid } from "lib/Util";
import { emailValid } from "lib/Util/Validator";

import {
  INPUT_MAX_ERROR,
  INPUT_REQURE_ERROR,
  TERMINAL_MAC_ERROR,
} from "const/Message";

import { macFormatter, macDeformatter } from "../../utils/MAC";

export default class Input extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      oldValue: "",
      showPassword: false,
    };
  }

  onChange = (e) => {
    const errorMsg = this.valid(e.target.value, e.target.name);
    this.setError(e, errorMsg);
  };
  onBlur = (e) => {
    let {
      props: { required = false, onBlur },
    } = this;
    e.target.value = e.target.value.trim();
    if (!required && !stringValid(e.target.value)) {
      this.setError(e, null);
      return;
    }
    let errorMsg = this.valid(e.target.value, e.target.name);
    if (errorMsg == null && onBlur) {
      e.target.value = onBlur(e.target.value);
    }
    this.setError(e, errorMsg);
  };
  onFocus = (e) => {
    let {
      props: { onFocus, onChange },
    } = this;
    if (!!onFocus) {
      e.target.value = onFocus(e.target.value);
      onChange(e);
    }
  };

  valid = (value, name) => {
    let {
      props: { required = false, validator, max },
    } = this;
    let errorMsg;
    if (name === "Email") {
      errorMsg = emailValid(value);
      if (errorMsg !== null) {
        return errorMsg;
      }
    } else {
      if (required && !stringValid(value)) {
        return INPUT_REQURE_ERROR;
      }
      if (validator) {
        errorMsg = validator(value);
        if (errorMsg) return errorMsg;
      }
      if (max && value.length > max) {
        return INPUT_MAX_ERROR;
      }
    }

    return null;
  };

  setError = (e, errorMsg) => {
    e.target.error = errorMsg;
    if (this.state.oldValue !== e.target.value)
      this.setState({ oldValue: e.target.value });
    this.props.onChange(e);
  };

  togglePassword = () => {
    this.setState({ showPassword: !this.state.showPassword });
  };

  render() {
    let {
      props: {
        id,
        name,
        value,
        type,
        placeholder = "",

        error,
        max,

        minNumber,
        maxNumber,

        disabled = false,
        required = false,
        showCharacterCounter = false,

        className = "w-180",
        style = {},
      },
      state: { oldValue, showPassword },
    } = this;


    return (
      <Fragment>
        <div className="input-wrapper">
          {name === "MAC" ? (
            <CustomInput
              className={className}
              style={style}
              id={id}
              name={name}
              placeholder={placeholder}
              max={max}
              value={value == null ? "" : macFormatter(value)}
              oldValue={oldValue}
              formatter={macFormatter}
              deformatter={macDeformatter}
              disabled={disabled}
              aria-describedby={id + "_err"}
              onChange={this.setError}
            />
          ) : (
            <input
              className={className}
              style={style}
              id={id}
              name={name}
              type={
                type === "password"
                  ? !showPassword
                    ? "password"
                    : "text"
                  : type
              }
              min={minNumber}
              max={maxNumber}
              placeholder={placeholder}
              value={value == null ? "" : value}
              disabled={disabled}
              aria-describedby={id + "_err"}
              onChange={this.onChange}
              onBlur={this.onBlur}
              onFocus={this.onFocus}
            />
          )}
          {type === "password" && (
            <TogglePassword
              showPassword={showPassword}
              onClick={this.togglePassword}
            />
          )}
        </div>
        {showCharacterCounter && error == null && (
          <span className="msg">
            {value == null
              ? 0
              : name == "MAC"
              ? value.replaceAll(" ", "").length
              : value.length}
            /{max}
          </span>
        )}
        {!!error && (
          <span className="msg err" id={id + "_err"}>
            {error}
          </span>
        )}
      </Fragment>
    );
  }
}

const CustomInput = ({
  className,
  style,
  name,
  value,
  oldValue,
  max,
  formatter,
  deformatter,
  onChange,
  ...options
}) => {
  const change = (e) => {
    const currentEvent = e.target;
    const trimValue = currentEvent.value.trim();
    const currentLength = max + 5;
    if (trimValue.length <= currentLength) {
      const regex =
        /^[0-9A-Fa-f]{2}[\s]{1}[0-9A-Fa-f]{2}[\s]{1}[0-9A-Fa-f]{2}[\s]{1}[0-9A-Fa-f]{2}[\s]{1}[0-9A-Fa-f]{2}[\s]{1}[0-9A-Fa-f]{2}$/;
      const isValid = regex.test(trimValue);

      let dataValue = deformatter(currentEvent.value);
      const isBackwardSpace = dataValue.length === oldValue.length;
      if (isBackwardSpace) {
        dataValue = dataValue.substr(0, dataValue.length - 1);
      }
      let errorMsg;

      if (!isValid && currentEvent.value.length === currentLength) {
        errorMsg = TERMINAL_MAC_ERROR;
      } else {
        errorMsg = "";
      }

      const newEvent = {
        target: { name: currentEvent.name, value: dataValue },
      };

      onChange(newEvent, errorMsg);
    }
  };

  return (
    <Fragment>
      <input
        className={className}
        style={style}
        key={name}
        name={name}
        value={value}
        disabled={options?.disabled ?? false}
        onChange={change}
      ></input>
    </Fragment>
  );
};
