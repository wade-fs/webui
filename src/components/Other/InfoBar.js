import React, { Fragment } from "react";
import { connect } from "react-redux";

import { hideInfoBar } from "actions/InfobarActions";

class InfoBar extends React.Component {
  close = () => {
    this.props.dispatch(hideInfoBar());
  };
  render() {
    let {
      props: { showInfoBar, infoType, infoBarTitle, dispatch },
    } = this;
    if (showInfoBar) {
      setTimeout(function () {
        dispatch(hideInfoBar());
      }, 5000);
    }
    return (
      <Fragment>
        {showInfoBar && (
          <div
            className={
              infoType === "error" ? "msgstatus infobar-bgc-error" : "msgstatus"
            }
          >
            {infoType === "error" && <div className="infobar-error"></div>}
            {infoType === "info" && <div className="infobar-success"></div>}
            {infoType === "warning" && <div className="infobar-warning"></div>}
            {infoBarTitle}
          </div>
        )}
      </Fragment>
    );
  }
}

export default connect((state) => {
  return {
    showInfoBar: state.infobar.showInfoBar,
    infoType: state.infobar.infoType,
    infoBarTitle: state.infobar.infoBarTitle,
  };
})(InfoBar);
