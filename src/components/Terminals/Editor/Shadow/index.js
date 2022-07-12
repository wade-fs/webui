import React, { Fragment } from "react";
import VNCClient2 from "./VNCClient2";
import { terminalStatus } from "../Header";

import { LOADED } from "const/DataLoaderState";
import { ASKFIRST } from "const/Terminals/ShadowMode";
import { IpAddress } from "const/Terminals/TerminalFieldNames";

import { getObjectProperty } from "lib/Util";

const DATAPATH = "props.terminal.data";
export default class Shadow extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeIdx: 0,
    };
  }

  setActive = (idx) => {
    if (this.state.activeIdx != idx)
      this.setState({
        activeIdx: idx,
      });
  };

  render() {
    let {
      state: { activeIdx },
      props: {
        about,
		data,
        editingId: id,
        terminal: { state },
      },
    } = this;

    const allow = getObjectProperty(this, `${DATAPATH}.AllowShadow`) == true;
    const mode = getObjectProperty(this, `${DATAPATH}.ShadowMode`);
    const interactive =
      getObjectProperty(this, `${DATAPATH}.AllowInteractiveShadow`) == true;
    const numberOfScreens = getObjectProperty(
      this,
      `${DATAPATH}.NumberOfScreens`
    );
    const status = terminalStatus;

    const terminalActive = status.indexOf("A") >= 0;

    return (
      state == LOADED && (
        <Fragment>
          <div className="wrap-960 wrap-bg-w" style={{ height: "720px" }}>
            {mode != "NO" && terminalActive && (
              <div className="shadow-content">
                <ul className="view-bar">
                  {Array.from({ length: numberOfScreens }, (v, i) => i).map(
                      (idx) => (
                        <li onClick={() => this.setActive(idx)}>
                          <VNCClient2
                            key={idx}
                            terminalIp={about[IpAddress]}
                            screenIdx={idx}
                            numberOfScreens={numberOfScreens}
                            ask={mode == ASKFIRST}
                            interactive={interactive}
                          />
                        </li>
                      )
                    )}
                </ul>
              </div>
            ) || 
              <div><p>No shadow</p></div>
            }
          </div>
        </Fragment>
      )
    );
  }
}
