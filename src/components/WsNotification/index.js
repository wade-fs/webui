import React, { Fragment } from "react";
import ReactDOM from "react-dom";
import { connect } from "react-redux";

import { WsEndpoint } from "const/Env";
import { wsNotification, getWatchdog } from "actions/OtherActions";
import {
  updateTerminalList,
  updateTerminalGroupList,
} from "actions/TerminalActions";
import { updateServerList, updateServerGroupList } from "actions/ServerActions";
import { updateAppList, updateAppGroupList } from "actions/ApplicationActions";

const ONNECTING = 0;
const OPEN = 1;
const CLOSING = 2;
const CLOSED = 3;
class WS {
  constructor(url, props = {}) {
    let defaultProps = {
      reconnect: 3000, //reconnect if failed or disconnected
      onMessage: null,
    };
    this.props = { ...defaultProps, ...props, url };
    this.state = null;
  }
  connect() {
    this.reconnect = true;
    if (this.timer) clearTimeout(this.timer);
    const ws = new WebSocket(this.props.url);

    ws.onopen = (event) => {
      this.state = event.target.readyState;
    };
    ws.onmessage = (event) => {
      this.state = event.target.readyState;
      if (this.props.onMessage) this.props.onMessage.call(null, event.data);
    };
    ws.onerror = (event) => {
      this.state = event.target.readyState;
    };
    ws.onclose = (event) => {
      this.state = event.target.readyState;
      this.props.dispatch(getWatchdog());
      if (event.code != 1000) {
        //reconnect
        if (this.reconnect && this.props.reconnect) {
          this.timer = setTimeout(
            this.connect.bind(this),
            this.props.reconnect
          );
        }
      }
    };

    this.ws = ws;
  }
  close() {
    if (this.ws) {
      this.reconnect = false;
      if (this.state == OPEN) this.ws.close();
    }
  }
}
class WsNotification extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      state: null,
    };
    this.ws = new WS(`${WsEndpoint}/notifications`, {
      dispatch: this.props.dispatch,
      onMessage: async (event) => {
        let data = JSON.parse(event);
        switch (data.type) {
          case "Terminal":
            switch (data.payload.action) {
              case "DELETE":
              case "POST":
              case "PUT":
                this.props.dispatch(
                  updateTerminalList(this.props.terminals.terminal.data)
                );
                break;
              default:
                break;
            }
            break;
          case "TerminalGroup":
            switch (data.payload.action) {
              case "DELETE":
              case "POST":
              case "PUT":
                this.props.dispatch(
                  updateTerminalGroupList(this.props.terminals.terminalGroups.data)
                );
                break;
              default:
                break;
            }
            break;
          case "terminalserver":
            switch (data.payload.action) {
              case "DELETE":
              case "POST":
              case "PUT":
                this.props.dispatch(
                  updateServerList(this.props.servers.serverGroups.data)
                );
                break;
              default:
                break;
            }
            break;
          case "RdsServerGroup":
            switch (data.payload.action) {
              case "DELETE":
              case "POST":
              case "PUT":
                this.props.dispatch(updateServerGroupList(
                  this.props.servers.servers.data
                ));
                break;
              default:
                break;
            }
            break;
          case "application":
            switch (data.payload.action) {
              case "DELETE":
              case "POST":
              case "PUT":
                this.props.dispatch( updateAppList(
                    this.props.applications.applicationGroups.data,
                    this.props.applications.vncGroups.data
                ));
                break;
              default:
                break;
            }
            break;
          case "ApplicationGroup":
            switch (data.payload.action) {
              case "DELETE":
              case "POST":
              case "PUT":
                this.props.dispatch( updateAppGroupList(
                  this.props.applications.applications.data,
                  this.props.applications.vncs.data
                ));
                break;
              default:
                break;
            }
            break;
          default:
            break;
        }
        this.props.dispatch(wsNotification(data));
      },
    });
  }
  componentDidMount() {
    this.ws.connect();
    //this.ws.close();
  }
  componentWillUnmount() {
    if (this.ws) this.ws.close();
  }
  render() {
    return null;
  }
}
export default connect((state) => {
  return {
    terminals: state.terminals,
    servers: state.servers,
    applications: state.applications,
  };
})(WsNotification);
