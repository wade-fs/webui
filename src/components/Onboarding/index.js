import React, { Component } from "react";
import { connect } from "react-redux";
import { isNullOrUndefined } from "util";
import { ServicesAgreement } from "./ServicesAgreement";
import { Modal } from "react-bootstrap";

class OnBoarding extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showPop: true,
    };
    this.leftMenus = ["SERVICES AGREEMENT"];
    this.onSwitchAgreement = this.onSwitchAgreement.bind(this);
  }

  componentDidUpdate() {
    const { isAgreed } = this.props.data.onBoarding;
    if (!isAgreed) {
      window.scroll(0, 0);
    }
  }

  render() {
    const { showPop } = this.state;
    const {
      step,
      isAgreed,
      toggle,
      licenseValid,
      licenseId,
      terminals,
      purchaseDate,
      expirationDate,
      q8VistaVersion,
    } = this.props.data.onBoarding;
    return (
      <Modal show={showPop}>
        <Modal.Body
          style={{ backgroundColor: "#F2F8E5", paddingBottom: "0px" }}
        >
          {isNullOrUndefined(isAgreed) || isAgreed ? null : (
            <div className="msgstatus w-container">
              Please AGREE the terms of service to continue.
            </div>
          )}
          <div className="w-container">
            <div className="" style={{ backgroundColor: "gray" }}>
              <div className="clearfix">
                <div className="wizard-sidebar">
                  <div className="login-logo"></div>
                  {this.leftMenus.map((item, index) => {
                    if (index * 1000 <= step) {
                      return (
                        <div
                          className={(index == 0 ? "mt-45" : null) + " active"}
                          key={index}
                        >
                          <div className="circle this"></div>
                          <p>{item}</p>
                        </div>
                      );
                    } else {
                      return (
                        <div className="active op-35" key={index}>
                          <p>{item}</p>
                        </div>
                      );
                    }
                  })}
                </div>
                <ServicesAgreement
                  onSwitchAgreement={this.onSwitchAgreement}
                  toggle={toggle}
                  step={step}
                />
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    );
  }
}

export default connect((state) => {
  return {
    data: state.users,
  };
})(OnBoarding);
