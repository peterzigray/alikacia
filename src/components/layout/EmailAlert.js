import React, { Component } from "react";
import { compose } from "redux";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { notifyPasswordUser, allowLogin } from "../../actions/NotifyActions";
import { firebaseConnect } from 'react-redux-firebase';
import '../../css/Alerts.css';

class Alert extends Component {
  render() {
    
    const { emailmessage, messageType } = this.props.notify;
   
      return (
        <div>
          {messageType === "Emailerror" || messageType ===  "Email&PasswordError" ? (
            <div className="alert">
              <p className="errorTitle">
                {" "}
                Please type your e-mail address in the format{" "}
              </p>
              <span style={{ color: emailmessage.style.beforeAt }}>
                yourname
              </span>
              <span style={{ color: emailmessage.style.at }}>@</span>
              <span style={{ color: emailmessage.style.afterAt }}>
                example
              </span>
              <span style={{ color: emailmessage.style.domenName }}>
                .com
              </span>
            </div>
          ) : null
          // <div>
          //     <p>Please enter your email address & password</p>
          // </div>
          }
          {messageType !== "Emailerror" && messageType !== "Email&PasswordError" ? (
            <div className="alert">
              <p className='errorMessage' style={{ color: "red" }}>
                <i className="fas fa-exclamation-circle" />{" "}Please correct your password</p>
            </div>
          ) : null
          // <div>
          //     <p>Please enter your email address & password</p>
          // </div>
          }
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
