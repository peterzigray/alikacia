import React, { Component } from "react";
import { compose } from "redux";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { notifyEmailUser, allowLogin } from "../../actions/NotifyActions";
import { Link } from 'react-router-dom';

import '../../css/FirstPage.css';

import { firebaseConnect } from "react-redux-firebase";

class FirstPage extends Component {
  state = {

  };

  onSubmitLogin = () => {
   const  { onLoginClickHandler } = this.props;
    onLoginClickHandler();
  }
  onSubmitRegistration = () => {
    const { onRegistrationClickHandler } = this.props;
    onRegistrationClickHandler();

  }

  render() {

    return (

              <div className="card-body">
                <h2>Share bills. Make sure everyone gets paid back.</h2>
                <br/>
                <h4>Join us today</h4>
                <form>
                  <div className="row-1">
                    <div className="col-md-12">
                      <button
                        type="button"
                        className="btn btn-warning-Fp btn-lg btn-block"
                        onClick={this.onSubmitLogin}
                      >
                        Login
                      </button>
                    </div>
                  </div>{" "}
                  <br />
                  <div className="row-2">
                    <div className="col-md-12">
                      <button
                        type="button"
                        className="btn btn-warning-Fp btn-lg btn-block"
                        onClick={this.onSubmitRegistration}
                      >
                        Sign Up
                      </button>
                    </div>
                  </div>
                </form>
              </div>
       
    );
  }
}


FirstPage.propTypes = {
  firebase: PropTypes.object.isRequired,
  notify: PropTypes.object.isRequired,
  notifyEmailUser: PropTypes.func.isRequired,
  allowLogin: PropTypes.func.isRequired,

  onRegistrationClickHandler: PropTypes.func.isRequired,
  onLoginClickHandler: PropTypes.func.isRequired
};

export default compose(
  firebaseConnect(),
  connect(
    (state, props) => ({
      notify: state.notify
    }),
    { notifyEmailUser, allowLogin }
  )
)(FirstPage);
