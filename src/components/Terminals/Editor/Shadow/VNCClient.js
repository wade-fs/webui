import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import RFB from "@novnc/novnc/core/rfb.js";

import {
  getFullScreenApi,
  getExitFullScreenApi,
  fullscreenEnabled,
  getFullscreenElement,
} from "lib/Util";

import { LOADING, LOADED, FAILURE, INITIAL } from "const/DataLoaderState.js";
import { WsEndpoint, ApiDelay, Dev } from "const/Env";

const FULLSCREENENABLED = fullscreenEnabled();

class VNCClient extends React.Component {
  static propTypes = {
    terminalId: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
      .isRequired,
    screenIdx: PropTypes.number.isRequired,
    autoConnect: PropTypes.bool,
    interactive: PropTypes.bool,
    ask: PropTypes.bool,
  };
  static defaultProps = {
    autoConnect: true,
    interactive: true,
    ask: false,
  };
  constructor(props) {
    super(props);
    this.state = {
      state: INITIAL,
      fullscreen: false,
      text: null,
    };
    this.div = React.createRef();

    if (FULLSCREENENABLED)
      ["", "moz", "webkit", "ms"].forEach((v) => {
        window.addEventListener(v + "fullscreenchange", this.fullscreenChange);
      });
  }

  componentDidMount() {
    if (this.props.autoConnect) this.connect();
  }
  componentWillUnmount() {
    if (this.rfb) {
      if (this.connectTime) clearTimeout(this.connectTime);
      this.rfb.removeEventListener("connect", this.connected);
      this.rfb.removeEventListener("disconnect", this.disconnected);
      this.rfb.disconnect();
    }
    if (FULLSCREENENABLED)
      ["", "moz", "webkit", "ms"].forEach((v) => {
        window.removeEventListener(
          v + "fullscreenchange",
          this.fullscreenChange
        );
      });
  }

  fullscreenChange() {
    this.setState({ fullscreen: Boolean(getFullscreenElement()) });
  }

  getconnection = () => {
    let token = this.props.token;
    let path = `/shadow/${this.props.terminalId}/${this.props.screenIdx + 1}`;
    let base = WsEndpoint;

    //TODO testing all the ways to send the token
    //base = base.replace(/(?<=wss?:\/\/)/,`${token}@`); only supported in chrome
    document.cookie = `X-Authorization=${token}; path=/`;
    //path = `${path}?t=${token}`;

    return `${base}${path}`;
  };
  enterFullscreen = () => {
    let ele = this.div.current;
    getFullScreenApi(ele).call(ele);
  };
  exitFullscreen = () => {
    getExitFullScreenApi(document).call(document);
  };
  connected = () => {
    this.connectTime = setTimeout(() => {
      this.setState({ state: LOADED, text: null }, () => {
        this.rfb.focus();
      });
    }, ApiDelay);
  };
  disconnected = (event) => {
    if (this.state.state != LOADED)
      this.setState({
        state: FAILURE,
        text: this.props.ask
          ? "Terminal denied to connect or failed to connect"
          : "Failed to connect",
      });
  };
  connect = () => {
    this.setState(
      {
        state: LOADING,
        text: this.props.ask ? "Waiting user to accept..." : "Connecting...",
      },
      () => {
        let ws = this.getconnection();
        this.rfb = new RFB(this.div.current, ws);
        this.rfb.clipViewport = true;
        this.rfb.scaleViewport = true;
        this.rfb.resizeSession = true;
        this.rfb.viewOnly = !this.props.interactive;
        this.rfb.addEventListener("connect", this.connected);
        this.rfb.addEventListener("disconnect", this.disconnected);

        //securityfailure capabilities clipboard bell desktopname
      }
    );
  };

  render() {
    let {
      state: { state, text, fullscreen },
    } = this;
    return (
      //TODO move styles into scss file
      <div
        style={{
          background: "gray",
          textAlign: "center",
          verticalAlign: "middle",
          width: "100%",
          height: "100%",
        }}
      >
        {state == INITIAL && (
          <div
            className="mr-8"
            style={{
              margin: "auto",
              position: "relative",
              top: "50%",
              transform: "translateY(-50%)",
              cursor: "pointer",
              width: "32px",
              height: "32px",
              zIndex: 1,
              backgroundSize: "contain",
              backgroundImage: 'url("assets/images/play.png")',
            }}
            onClick={this.connect}
          ></div>
        )}

        {(state == LOADING || state == FAILURE) && (
          <div
            className="mr-8"
            style={{
              margin: "auto",
              position: "relative",
              top: "50%",
              transform: "translateY(-50%)",
              color: state == FAILURE ? "red" : "",
              zIndex: 1,
            }}
          >
            {text}
          </div>
        )}
        <div
          ref={this.div}
          style={{
            zIndex: 0,
            opacity: state != LOADED ? 0 : 1,
            width: "100%",
            height: "100%",
          }}
        >
          {FULLSCREENENABLED && (
            <div
              className="screen-resize"
              onClick={fullscreen ? this.exitFullscreen : this.enterFullscreen}
              style={{
                bottom: 0,
                right: 0,
                top: "initial",
                transform: "initial",
                cursor: "pointer",
              }}
            ></div>
          )}
        </div>
      </div>
    );
  }
}

export default connect((state) => {
  return {
    token: state.auths.token.data,
  };
})(VNCClient);
