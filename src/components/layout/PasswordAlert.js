
import React, { Component } from "react";
import { compose } from "redux";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { notifyPasswordUser, allowLogin } from "../../actions/NotifyActions";
import { firebaseConnect } from 'react-redux-firebase';
import '../../css/Alerts.css';

class Alert extends Component {
  // state = {
  //   counter: 0
  // }
  
  // componentWillMount = () => {
  //   const { counter } = this.state;
  //   this.setState({counter: counter + 1})
  //   console.log(this.state.counter)
  // }
  render() {
    

    const { passwordmessage, messageType } = this.props.notify;
   
      return (
        <div>
          {messageType === "PasswordError" ||
          messageType === "Email&PasswordError" ? (
              <p className = 'errorMessagecover'>
              {passwordmessage.message.txt ? (
                  <p className='errorMessage' style={{ color: "red" }}>
                  <i className="fas fa-exclamation-circle" />{" "}
                  {passwordmessage.message.txt}
                </p>
              ) : null}
            </p>
          ) : null}
          {/* {messageType === "PasswordNotMatch" ? (
            <p style={{ color: "red" }}>
              <i className="fas fa-exclamation-circle" />
              password is not match.{" "}
            </p>
          ) : null}
          {messageType === "PasswordLenght" ? (
            <p style={{ color: "red" }}>
              <i className="fas fa-exclamation-circle" />
              password has to be min 8 characters.{" "}
            </p>
          ) : null} */}
        </div>
      );
           }
}

Alert.propTypes = {
  firebase: PropTypes.object.isRequired,
  notify: PropTypes.object.isRequired,
  allowLogin: PropTypes.func.isRequired
};

export default compose(
  firebaseConnect(),
  connect((state, props) => ({
    notify: state.notify
  }), { notifyPasswordUser, allowLogin })
)(Alert)
