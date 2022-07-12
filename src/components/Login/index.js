import React, { Fragment } from "react";
import { connect } from "react-redux";
import Input from "components/Form/Input";

import { login } from "actions/AuthActions";

import { FAILURE, LOADING } from "const/DataLoaderState";
import { Password, Username } from "const/Terminals/TerminalFieldNames";

import { stringValid } from "lib/Util";

const usernameOptions = {
  id: "login_username",
  type: "text",
  className: "login-input",
  placeholder: "User Name / ID",
};
const passwordOptions = {
  id: "login_password",
  type: "password",
  className: "login-input",
  autocomplete: "off",
  placeholder: Password,
};

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {},
    };
  }

  componentDidMount() {
    document.addEventListener("keydown", this.checkEnter, false);
    this.autoLogin("admin", "admin");
  }
  componentWillUnmount() {
    document.removeEventListener("keydown", this.checkEnter, false);
  }

  change = (e) => {
    let data = this.state.data;
    data[e.target.name] = e.target.value;
    this.setState({ data });
  };

  checkEnter = (event) => {
    if (event.keyCode === 13) {
      this.login();
    }
  };

  login = () => {
    let {
      state: { data },
      props: { dispatch },
    } = this;
    if (!stringValid(data[Username]) || !stringValid(data[Password])) {
      // TODO: current disable for easies test and debug.
      // return;
    }
    let { Username, Password } = data;
    if (Username != null) {
      Username = Username.toLowerCase();
    }
    dispatch(login({ Username, Password }));
  };

  isLogging = () => {
    let {
      props: { token },
    } = this;
    return token.state == LOADING;
  };
  isLoginFailed = () => {
    let {
      props: { token },
    } = this;
    return token.state == FAILURE;
  };

  autoLogin = (username, password) => {
    let usernameInput = document.getElementById("login_username");
    let passwordId = document.getElementById("login_password");
    usernameInput.value = username;
    passwordId.value = password;
    this.setState({ data: { Username: username, Password: password } });
  };

  render() {
    let {
      props: { token },
      state: { data },
    } = this;
    const canLogin = stringValid(data[Username]) && stringValid(data[Password]);

    return (
      <Fragment>
        {this.isLogging() && (
          <div className="lightbox_bg-2" style={{ zIndex: "5555" }}>
            <div className="spinner"></div>
          </div>
        )}
        <div className="w-container">
          <main className="login-content">
            <section className="login-left">
              <div className="login-logo"></div>
            </section>
            <div className="login-line"></div>
            <section className="login-right">
              <h1 className="login-welcome">Welcome</h1>
              <div className="login-user" />
              <h3 style={{ fontWeight: "normal" }}>Login to continue</h3>
              <div
                className="pt-24 pb-24"
                style={{
                  position: "relative",
                }}
              >
                <Input
                  title={Username}
                  name={Username}
                  value={data[Username]}
                  {...usernameOptions}
                  onChange={this.change}
                />
                <Input
                  title={Password}
                  name={Password}
                  value={data[Password]}
                  {...passwordOptions}
                  onChange={this.change}
                />
                {this.isLoginFailed() && (
                  <span className="mt-16 err">
                    {token.error !== undefined ? token.error : null}
                  </span>
                )}
              </div>
              <button
                className="login-btn"
                disabled={!canLogin}
                onClick={canLogin ? this.login : null}
              >
                LOGIN
              </button>
            </section>
          </main>
        </div>
      </Fragment>
    );
  }
}

export default connect((state) => {
  return {
    token: state.auths.token,
  };
})(Login);
