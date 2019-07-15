import React, { Component } from "react";
import { compose } from "redux";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { notifyEmailUser, allowLogin } from "../../actions/NotifyActions";
import { Link } from 'react-router-dom';
import classnames from "classnames";
import AppNavbar from '../../components/layout/AppNavbar';

import emailValidation from "../../validations/EmailValidation";

import EmailAlert from '../layout/EmailAlert';
import PasswordAlert from "../layout/PasswordAlert";
import '../../css/FirstPage.css';
import WOW from 'wowjs';

import { firebaseConnect } from "react-redux-firebase";

 class Login extends Component {
   state = {
     email: "",
     password: "",
     animationName: "",
     style: {
       beforeAt: "",
       at: "",
       afterAt: "",
       domenName: ""
     }
   };

   componentDidMount = () => {
     const { style } = this.state;
     const { notifyEmailUser, allowLogin } = this.props;
     allowLogin(null);
     notifyEmailUser({ style});
    //  new WOW.WOW().init();
   };

   onPasswordChange = e => {
     this.setState({ password: e.target.value });
     const passwordLen = e.target.value.length;
     console.log("toto je password" + this.state.password.length);
     for (let i = 0; i <= passwordLen; i++) {
       if (passwordLen > 5 && passwordLen < 9) {
         this.setState({ wrongPassword: false });
       } else {
         this.setState({ wrongPassword: true });
       }
     }
   };
   onEmailChange = e => {
     const { message } = this.props.notify;
     const { email } = this.state;
     const { notifyEmailUser } = this.props;

     this.setState({ email: e.target.value });
     let style = emailValidation(e.target.value, e.target.value.length);
     console.log(e.target.value + " " + e.target.value.length);
     notifyEmailUser(style);
   };

   onSubmit = e => {
     e.preventDefault();

     const { firebase, allowLogin } = this.props;
     const { email, password, active } = this.state;
     const { emailmessage, messageType } = this.props.notify;

     // Locker animation
     let styleSheet = document.styleSheets[0];
     let animationName = `animation${Math.round(Math.random() * 100)}`;

     let keyframes = `@keyframes ${animationName} {
          from { margin-left: 0px; }

          20%  { margin-left: -1px }

          40%  { margin-left:  2px }

          60%  { margin-left: -1px }

          80%  { margin-left:  2px }

          90%  { margin-left:  0px }

          to   { margin-left: 0px; }
    }`;

     styleSheet.insertRule(keyframes, styleSheet.cssRules.length);

     this.setState({
       animationName: animationName
     });

     // Firebase submit
     firebase
       .login({
         email,
         password
       })
       .catch(err => {
         for (let i = 0; i < 4; i++) {
           if (Object.values(emailmessage.style)[i] === "#28a745") {
             allowLogin("Emailsuccess");
           } else {
             allowLogin("Emailerror");
           }
         }
       });
   };
   onIconSubmit = e => {
     e.preventDefault();
     const {
       props: { firebase, history }
     } = this;

     var provider = new firebase.auth.FacebookAuthProvider();

     firebase
       .auth()
       .signInWithPopup(provider)
       .then(function(result) {
         // This gives you a Facebook Access Token. You can use it to access the Facebook API.
         var token = result.credential.accessToken;
         localStorage.setItem("token", token);
         // The signed-in user info.
         var user = result.user;
         // ...
         history.push("/");
       })
       .catch(function(error) {
         // Handle Errors here.
         var errorCode = error.code;
         var errorMessage = error.message;
         // The email of the user's account used.
         var email = error.email;
         // The firebase.auth.AuthCredential type that was used.
         var credential = error.credential;
         // ...
       });
   };
   onSubmit3 = e => {
     e.preventDefault();
     //  var token = result.credential.accessToken;
     var token1 = localStorage.getItem("token");
     const { firebase } = this.props;

     firebase
       .auth()
       .signOut(token1)
       .then(function() {
         console.log("successful signout");
       })
       .catch(function(error) {
         console.log("nope signout");
       });
   };

   render() {
     const { messageType } = this.props.notify;

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
       
     
             <div className="card loginCard wow slideInLeft"
             data-wow-duration="2s"
             >
               <div className="card-header loginHeader">
                 <h3 style={{color:'black'}}>
                   Sign In{" "}
                   <div className="element" style={style}>
                     <i className="fas fa-lock" />
                   </div>
                 </h3>
                 <div className="d-flex justify-content-end social_icon">
                   <span className="face">
                     <i
                       className="fab fa-facebook-square icon"
                       onClick={this.onIconSubmit}
                     />
                   </span>
                   <span className="goo">
                     <i className="fab fa-google-plus-square icon" />
                   </span>
                   <span className="twit">
                     <i className="fab fa-twitter-square icon" />
                   </span>
                 </div>
               </div>

               <div className="card-body">
                 {!messageType ? (
                 
                     <h6>Please enter your credentials</h6>
                  
                 ) : (
                   <EmailAlert />
                 )}

                 <form onSubmit={this.onSubmit}>
                   <div className="input-group form-group">
                     <div className="input-group-prepend">
                       <span className="input-group-text">
                         <i className="fas fa-user" />
                       </span>
                     </div>
                     <input
                       type="text"
                       className={classnames("form-control", {
                         "is-invalid": messageType === "error",
                         "form-control is-valid":
                           messageType === "Emailsuccess"
                       })}
                       name="email"
                       required
                       placeholder="email"
                       value={this.state.email}
                       onChange={this.onEmailChange}
                     />
                   </div>

                   <PasswordAlert />

                   <div className="input-group form-group">
                     <div className="input-group-prepend">
                       <span className="input-group-text">
                         <i className="fas fa-key" />
                       </span>
                     </div>

                     <input
                       type="password"
                       className={classnames("form-control", {
                         "is-invalid": messageType === "error",
                         "form-control is-invalid":
                           messageType === "Emailsuccess"
                       })}
                       // "form-control is-invalid"
                       name="password"
                       required
                       placeholder="password"
                       value={this.state.password}
                       onChange={this.onPasswordChange}
                     />
                   </div>

                   <div className="row align-items-center remember rememberMe">
                     <input type="checkbox" />
                     Remember Me
                   </div>
                   <div className="form-group">
                     <input
                       type="submit"
                       value="Login"
                       className="btn float-right fp-submit-btn"
                     />
                   </div>
                   <div className="d-flex rememberMe ">
                     <a href="#">Forgot your password?</a>
                   </div>
                 </form>
               </div>
             </div>
      
     );
   }
 }

Login.propTypes = {
  firebase: PropTypes.object.isRequired,
  notify: PropTypes.object.isRequired,
  notifyEmailUser: PropTypes.func.isRequired,
  allowLogin: PropTypes.func.isRequired
};

export default compose(
  firebaseConnect(),
  connect(
    (state, props) => ({
      notify: state.notify
    }),
    { notifyEmailUser, allowLogin }
  )
)(Login);
