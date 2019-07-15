import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from "prop-types";
import { compose } from "redux";
import { connect } from "react-redux";
import '../../css/Navbar.css'
import { firestoreConnect, firebaseConnect } from "react-redux-firebase";
import { notifyUser, allowLogin } from "../../actions/NotifyActions";

class AppNavbar extends Component {
  state = {
    isAuthenticated: false
  };

  static getDerivedStateFromProps(props, state) {
    const { auth } = props;
    if (auth.uid) {
      return { isAuthenticated: true };
    } else {
      return { isAuthenticated: false };
    }
  }
  onLogoutClick = (e) => {
    e.preventDefault();

    const { firebase } = this.props;
    firebase.logout();

    // this.props.history.push('/login');
  }

  onSubmitLogin = () => {
    const { onLoginClickHandler } = this.props;
    onLoginClickHandler();
  }
  onSubmitRegistration = () => {
    const { onRegistrationClickHandler } = this.props;
    onRegistrationClickHandler();

  }


  render() {
    const { isAuthenticated } = this.state;
    const { auth } = this.props;
    const { allowRegistration } = this.props.settings;

    return (
    

    
      <nav className="navbar fixed-top">
     
          <div className="col-md-3">
          <Link to="/Login" className="navbar-brand">
            <span style={{ color: "#FFC312" }}>Ca$h</span>Slice{" "}
            <i
              className="fas fa-piggy-bank "
              style={{ color: "#FFC312" }}
            />
          </Link>
          </div>
          <div className="col-md-6"/>
        
          {/* <button
            className="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-targe="#navbarMain"
          >
            <span className="navbar-toggler-icon" />
          </button> */}
          {/* <div className="collapse navbar-collapse" id="navbarMain"> */}
            {/* <ul className="navbar-nav mr-auto">
              {isAuthenticated ? (
                <li className="nav-item">
                  <Link to="/" className="nav-link">
                    Dashboard
                  </Link>
                </li>
              ) : null}
            </ul> */}
            {/* {isAuthenticated ? (
              <ul className="navbar-nav ml-auto">
                <li className="nav-item">
                  <a href="#!" className="nav-link">
                    {auth.email}
                  </a>
                </li>
                <li className="nav-item">
                  <Link to="/settings" className="nav-link">
                    Settings
                  </Link>
                </li>
                <li className="nav-item">
                  <a
                    href="#!"
                    className="nav-link"
                    onClick={this.onLogoutClick}
                  >
                    Logout
                  </a>
                </li>
              </ul>
            ) : null} */}
          <div className="col-md-3">
              <tr >
                <td >
              <button 
                className="btn btn-link"
              onClick={this.onSubmitLogin}>

                
                  {/* <Link to="/login" className="li-nav"> */}
                    Login
                 </button>   
                </td>
 {' '}
                <td >
                  {/* <Link to="/register" className="li-nav"> */}
                  <button
                className="btn btn-link"
                onClick={this.onSubmitRegistration}
                  >

              

                    SignUp
              </button>
                </td>
              </tr>
            </div>
      
        {/* </div> */}
      </nav>
     
    );
  }
}

AppNavbar.propTypes = {
  firebase: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  settings: PropTypes.object.isRequired
};

export default compose(
  firebaseConnect(),
  connect((state, props) => ({
    auth: state.firebase.auth,
    settings: state.settings
  }))
) (AppNavbar);