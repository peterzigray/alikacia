import React, { Component } from "react";
import { compose } from "redux";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { notifyPasswordUser, notifyEmailUser, allowLogin } from "../../actions/NotifyActions";
import AppNavbar from '../../components/layout/AppNavbar';
import { firestoreConnect } from "react-redux-firebase";

import "../../css/FirstPage.css";

import EmailAlert from '../layout/EmailAlert';
import PasswordAlert from "../layout/PasswordAlert";

import emailValidation from "../../validations/EmailValidation";
import passwordValidation from "../../validations/RegisterValidation";
import { firebaseConnect } from 'react-redux-firebase';
import { auth } from "firebase";

class Register extends Component {
  state = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    password2: "",
    animationName: "",
    style: {
      beforeAt: "",
      at: "",
      afterAt: "",
      domenName: ""
    },
    message: {
      txt : ''
    },
    alertEmail: 'black',
    alertPassword: 'black',
    disabled: 'disabled',
    messages: {
      messages: {
        character: '#586069',
        bottomLineCharacters: '#586069',
        includingNumber: '#586069',
        lowerCaseLetters: '#586069'
      }
    },
    style: {
      style: {
        afterAt: "#586069",
        at: "#586069",
        beforeAt: "#586069",
        domenName: "#586069"
      }
    }
  };


  componentDidMount = () => {
    const { message , style } = this.state;
    const { notifyEmailUser, notifyPasswordUser, allowLogin } = this.props;

    allowLogin(null)
    notifyEmailUser({ style });
    notifyPasswordUser({message});
  };

  onSubmit = e => {
    e.preventDefault();

    const { firebase, allowLogin, firestore , auth } = this.props;
    const { email, password, password2, firstName, lastName } = this.state;
    const { emailmessage, passwordmessage } = this.props.notify;

    // Locker animation
    let styleSheet = document.styleSheets[0];
    let animationName = `animation${Math.round(Math.random() * 100)}`;
    let keyframes =
     `@keyframes ${animationName} {
          from { margin-left: 0px; }

          20%  { margin-left: -1px }

          40%  { margin-left:  2px }

          60%  { margin-left: -1px }

          80%  { margin-left:  2px }

          90%  { margin-left:  0px }

          to   { margin-left: 0px; }
    }`;
    styleSheet.insertRule(keyframes, styleSheet.cssRules.length);


    var isError = false;
    var isErrorEmail ;
    var emailStyles = Object.values(this.state.style.style);
    var passwordStyles = Object.values(this.state.messages.messages);
   

    // CHECKING... IF THERE IS ANY FRONT-END ERROR
    emailStyles.forEach((e) => {   
      passwordStyles.forEach((p) => {
        var i = 0;
        while (i < passwordStyles.length) {
          if (e.match('#dc3545') || p.match('#dc3545')) {
            isErrorEmail = e.match('#dc3545');
            isError = true;
            break;
          } 
          i = i + 1;
        }
      }
    )   
  })
 
    // CREATE USER TO THE FIREBASE IF CONDITIONS HAVE BEEN DONE
    if (isError) {
      if (isErrorEmail){
        this.setState({ alertEmail: '#dc3545',disabled:'disabled' })
      } else {
        this.setState({ alertPassword: '#dc3545',disabled: 'disabled'   })
      }
    } else {
      console.log('preslo to sem')
      firebase.createUser({ email: email, password: password })
        .catch(err => { window.confirm(err.message) }, this.setState({
          alertEmail: '#dc3545'
        }
      )
    );
  }


   



  };

  onNameChange = (e) => {
    this.setState({ [e.target.name] :e.target.value });

  }

  onEmailChange = e => {
    
    // CREATE COPY OF GIVEN STATE
    let stateCopy = Object.assign({}, this.state);
    stateCopy.email = e.target.value;
    stateCopy.disabled = '';

    //AFTER CHANGE INPUT IS VALIDATEING
    if (e.target.value.length !== 0) {
      Object.assign(stateCopy.style, emailValidation(e.target.value, e.target.value.length))
    } 

    // SETING ERRORS TO UI WHILE USER IS TYPING
    Object.values(this.state.style.style).forEach(e => {
      if (e.match('#dc3545')) {
        stateCopy.alertEmail = '#dc3545';
        stateCopy.disabled = 'disabled';
      } else {
        stateCopy.alertEmail = 'black';
      }
    })

    // Assigne error messages to OUR state
    this.setState(stateCopy)
  };

  onPasswordChange = e => {
    // COPY OF THE STATE
    let stateCopy = Object.assign({}, this.state);
    stateCopy.disabled = '' ;
    const { password2 } = this.state;
    const passwordLen = e.target.value.length;
    stateCopy.password = e.target.value;

    // Assigne error messages to OUR state
    Object.assign(stateCopy.messages, passwordValidation(e.target.value, password2, passwordLen))
    this.setState(stateCopy)

     // SETING ERRORS TO UI WHILE USER IS TYPING
    Object.values(this.state.messages.messages).forEach(e => {
      if (e.match('#dc3545')) {
        stateCopy.alertPassword = '#dc3545';
        stateCopy.disabled = 'disabled';
      } else {
        stateCopy.alertPassword = 'black';
      }
    })
  };

  render() {
    const { message, messageType } = this.props.notify;
    const { messages } = this.state.messages
    let style = {
      animationName: this.state.animationName,

      animationTimingFunction: "ease-in-out",

      animationDuration: "0.5s",

      animationDelay: "0.0s",

      animationIterationCount: 1,

      animationDirection: "normal",

      animationFillMode: "forwards"
    };

    return (
      

            <div className="card cardRegister shadow-none">
              <div className="card-body card-body-reg">
                <h1 className="text-center" style={{color:'black'}}>
                  <div className="element1" style={style}>
                    <i className="fas fa-lock" /> Sign Up
                  </div>
                </h1>
                {!messageType ? (
                  
                    <h4>Create your personal account</h4>
                  
                ) : (
                    null
                  )}
                
                <form onSubmit={this.onSubmit}>
                  <p className='p-reg'>First Name</p>
                  <div className="input-group form-group form-group-reg">
                    {/* <div className="input-group-prepend">
                      <span className="input-group-text">
                        <i className="fas fa-user" />
                      </span>
                    </div> */}

                    <input
                      type="text"
                      className="form-control"
                      name="firstName"

                      required
                      value={this.state.firstName}
                      onChange={this.onNameChange}
                    />
                  </div>

                  <p className='p-reg'>Last Name</p> 
                  <div className="input-group form-group form-group-reg">
                    {/* <div className="input-group-prepend">
                      <span className="input-group-text">
                        <i className="fas fa-user" />
                      </span>
                    </div> */}
                    
                    <input
                      type="text"
                      className="form-control"
                      name="lastName"
                 
                      required
                      value={this.state.lastName}
                      onChange={this.onNameChange}
                    />
                  </div>
                  <span className='span-reg'>This will be your username. You can add the name of your organization later.</span>
                  
            {/* {this.state.isEmailUsed ? <p> {this.state.emailUsedMessage}</p> : null} */}

                  <p className='p-reg'
                     style={{ color: this.state.alertEmail }}
                  >Email address</p>
                  <div className="input-group form-group form-group-reg">
                    {/* <div className="input-group-prepend">
                      <span className="input-group-text">
                        <i className="fas fa-user" />
                      </span>
                    </div> */}

                    <input
                      type="text"
                      className="form-control"
                      name="email"
                
                      required
                      value={this.state.email}
                      onChange={this.onEmailChange}
                    />
                  </div>


            {this.state.alertEmail === 'black' ?
              <span className='span-reg'>We’ll occasionally send updates about your account to this inbox. We’ll never share your email address with anyone.</span>





              :
              <div className='span-reg'>


                <span >
                  Please type your e-mail address in the format{" "}
                </span>
                <span style={{ color: this.state.style.style.beforeAt }}>
                  yourname
              </span>
                <span style={{ color: this.state.style.style.at }}>@</span>
                <span style={{ color: this.state.style.style.afterAt }}>
                  example
              </span>
                <span style={{ color: this.state.style.style.domenName }}>
                  .com
              </span>
              </div>

            }










                  <p 
                     className='p-reg'
                     style={{ color: this.state.alertPassword }}
                  >Password</p>
                  <div className="input-group form-group form-group-reg">
                    {/* <div className="input-group-prepend">
                      <span className="input-group-text">
                        <i className="fas fa-key" />
                      </span>
                    </div> */}
                    <input
                      type="password"
                      className="form-control"
                      name="password"
                 
                      required
                      value={this.state.password}
                      onChange={this.onPasswordChange}
                    />
                  </div>
            <span className='span-reg'>Make sure it's at {' '}
              <span style={{ color: messages.character }}>least 15 characters</span>{' '}
              OR {' '}
              <span style={{ color: messages.bottomLineCharacters }}>at least 8 characters</span>{' '}
              <span style={{ color: messages.includingNumber }}>including a number</span>{' '}
              <span style={{ color: messages.lowerCaseLetters }}>and a lowercase letter.</span>{' '}
              Learn more.{' '}
            </span>
                  {/* <p className='p-reg'>Password 2</p>
                  <div className="input-group form-group form-group-reg">
               
                    <input
                      type="password"
                      className="form-control"
                      name="password2"
              
                      required
                      value={this.state.password2}
                      onChange={this.onPassword2Change}
                    />
                  </div>
                  <span className='span-reg'>Make sure you verified your password</span> */}

                  <input
                    type="submit"
                    value="Sign Up"
                    className="btn login_btn btn-block fp-submit-btn"
                    disabled = {this.state.disabled}
                    id='register'
                  />
                </form>
              </div>
            </div>
    
    );
  }
}

Register.propTypes = {
  firebase: PropTypes.object.isRequired,
  notify: PropTypes.object.isRequired,
  notifyPasswordUser: PropTypes.func.isRequired,
  notifyEmailUser: PropTypes.func.isRequired,
  allowLogin: PropTypes.func.isRequired,
  firestore: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired
};

export default compose(
  firebaseConnect(),
  firestoreConnect([{ collection: 'users' }]),
  connect(
    
    (state, props) => ({
      notify: state.notify,
      settings: state.settings,
      users: state.firestore.ordered.users,
      auth: state.firebase.auth
    }), 
    { notifyPasswordUser, notifyEmailUser, allowLogin }
  )
)(Register);
