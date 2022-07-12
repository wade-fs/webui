import React from "react";

import { BuildInfo } from "const/Env";
export default class Header extends React.Component {
  render() {
    return (
      <div className="navbar-fixed-bottom">
        {/* <div>
          {BuildInfo && (
            <div style={{ opacity: 0.8, fontSize: "0.7em" }}>
              {`v${BuildInfo.version}, ${new Date(BuildInfo.time)}, React${
                React.version
              }`}
            </div>
          )}
        </div> */}
      </div>
    );
  }
}
