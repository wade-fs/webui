import React, { Fragment } from "react";
import { connect } from "react-redux";

import { Modal } from "react-bootstrap";

class Timer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      count: props.current,
      showCountdown: false,
      isMove: false,
    };
    this.session = props.session;
    this.current = props.current;
    this.timeoutCount;
    this.sessionCount;
  }

  componentDidMount() {
    this.sessionCount = setInterval(() => this.sessionTimer(), 1000);
  }
  componentDidUpdate(prevProps, prevState) {
    this.session = this.props.session;
    this.current = this.props.current;
    if (
      prevProps.session !== this.props.session ||
      prevProps.current !== this.props.current
    ) {
      this.setState({ count: this.current });
    }
    if (!this.state.isMove && this.session !== this.props.session) {
      this.setState({ isMove: true });
    }
  }
  componentWillUnmount() {
    clearInterval(this.timeoutCount);
  }

  timeoutTimer = () => {
    if (this.state.showCountdown && this.state.count > 0) {
      this.setState({ count: this.state.count - 1 });
    } else if (
      this.state.showCountdown &&
      this.state.count === 0 &&
      !this.props.isLogout
    ) {
      this.props.userLogout();
    }
  };
  sessionTimer = () => {
    if (!this.state.showCountdown && this.session > 0) {
      this.session = this.session - 1;
    } else if (!this.state.showCountdown && this.session === 0) {
      if (!this.state.isMove) {
        this.session = this.props.session;
        this.setState({ showCountdown: true });
        clearInterval(this.sessionCount);
        this.timeoutCount = setInterval(this.timeoutTimer, 1000);
      } else {
        this.session = this.props.session;
        this.setState({ isMove: false });
      }
    }
  };
  resetExpireTime = () => {
    this.session = this.props.session;
    this.current = this.props.current;
    this.setState({
      isMove: false,
      showCountdown: false,
      count: this.current,
    });
    clearInterval(this.timeoutCount);
    this.sessionCount = setInterval(this.sessionTimer, 1000);
  };

  render() {
    let {
      props: { dispatch, session, current, userLogout },
      state: { showCountdown, count },
    } = this;
    return (
      <Modal id="idle-modal" show={showCountdown}>
        <Modal.Body>
          <div className="checkalert">
            <div className="modal-title-content">SESSION TIMEOUT</div>
            <div className="content"> Your session will expire in {count}</div>
            <div className="nav-footer flex space-between">
              <a onClick={this.resetExpireTime}>Extend my Session</a>
              <a className="alert-btn" onClick={userLogout}>
                Logout Now
              </a>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    );
  }
}

export default connect((state) => {
  return { expires: state.auths.expires };
})(Timer);
