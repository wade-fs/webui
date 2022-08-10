import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import RFB from "@novnc/novnc/core/rfb.js";

import { getFullScreenApi, getExitFullScreenApi } from "lib/Util";
import { toLetter } from "utils/String";

import { LOADING, LOADED, FAILURE, INITIAL } from "const/DataLoaderState.js";
import { WsEndpoint, Dev } from "const/Env";

class VNCClient2 extends React.Component {
  static propTypes = {
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
      text: null,
    };
    this.div = React.createRef();

    ["", "moz", "webkit", "ms"].forEach((v) => {
      window.addEventListener(v + "fullscreenchange", this.fullscreenChange);
    });
  }

  componentDidMount() {
    if (this.props.autoConnect) this.connect();
  }
  componentWillUnmount() {
    if (this.rfb) {
      this.rfb.removeEventListener("connect", this.connected);
      this.rfb.removeEventListener("disconnect", this.disconnected);
      this.rfb.disconnect();
    }

    ["", "moz", "webkit", "ms"].forEach((v) => {
      window.removeEventListener(v + "fullscreenchange", this.fullscreenChange);
    });
  }

  getconnection = () => {
	//const pre = "ws://"+this.props.terminalIp+":4088/ws";
	const pre = "ws://localhost:4088/ws";
    const base1 = `${pre}/${this.props.terminalIp}/shadow/${
      this.props.screenIdx + 1
    }`;
    const base = `${WsEndpoint}/${this.props.terminalIp}/shadow/${
      this.props.screenIdx + 1
    }`;
    return base;
  };

  toggleFullScreen = () => {
    if (document.fullscreenElement) {
      this.exitFullscreen();
    } else {
      this.enterFullscreen();
    }
  };
  enterFullscreen = () => {
    const element = this.div.current;
    getFullScreenApi(element).call(element);
  };
  exitFullscreen = () => {
    getExitFullScreenApi(document).call(document);
  };

  fullscreenChange = () => {
    if (!document.fullscreenElement) {
      // reset canvas size
      let element = this.div.current.querySelectorAll("canvas")[0];
      element.style.width = "425px";
      element.style.height = "240px";
    }
  };
  connected = () => {
    this.setState({ state: LOADED, text: null });
  };
  disconnected = () => {
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
        this.rfb = new RFB(this.div.current, ws, {
          credentials: { password: "112233" },
        });
        this.rfb.clipViewport = true;
        this.rfb.scaleViewport = true;
        this.rfb.resizeSession = true;
        this.rfb.viewOnly = !this.props.interactive;
        this.rfb.addEventListener("connect", this.connected);
        this.rfb.addEventListener("disconnect", this.disconnected);
      }
    );
  };

  render() {
    let {
      props: { screenIdx, terminalIp },
      state: { state, text },
    } = this;
    return (
      <Fragment>
        <article className="mr-8">screen {toLetter(screenIdx + 1)}</article>
        <section ref={this.div}>
          <div
            className="icon-screen-resize"
            onClick={this.toggleFullScreen}
          ></div>
          {state == INITIAL && (
            <div className="mr-8 icon-connect" onClick={this.connect}></div>
          )}
          {(state == LOADING || state == FAILURE) && (
            <p
              style={{
                color: state == FAILURE ? "red" : "",
              }}
            >
              {text}
            </p>
          )}
        </section>
      </Fragment>
    );
  }
}

export default connect((state) => {
  return {
    token: state.auths.token.data,
  };
})(VNCClient2);
