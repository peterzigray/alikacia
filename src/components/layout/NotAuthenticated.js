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
// import '../../css/LoginCss.css';

import { firebaseConnect } from "react-redux-firebase";

import Login from '../../components/auth/Login';
import Register from "../../components/auth/Register";
import FirstPage from './FirstPaga'



class NotAuthenticated extends Component {
  state = {
    lastScroll: null,
    position: "",
    count: null,
    firstPage :true,
    login : false,
    register : false
  };

componentDidMount(){
 
  // window.addEventListener("wheel", function(event){
  //   console.log('toto je to' + event.deltaY);
  //     if (event.deltaY > 0) {
       
  //       window.scrollTo({
  //         top: window.scrollY + 754,

  //         behavior: "smooth"
  //       });
  //     } else {
  //       console.log(window.scrollY);
  //       window.scrollTo({
  //         top: window.scrollY - 754,

  //         behavior: "smooth"
  //       });
  //     }
  //   }
  // );
}

  onLoginClick = () => {
    // console.log(window.scrollY);
    // if (window.scrollY < 481) {
    //   window.scrollTo({
    //     top: 754,
    //     behavior: "smooth"
    //   });
    // }
    const { firstPage, login, register } = this.state
    this.setState({firstPage: false, login:true, register:false })
  }

  onRegistrationClick = () => {
    // console.log(window.scrollY);
    // if (window.scrollY < 481) {
    //   window.scrollTo({
    //     top: 1520,
    //     behavior: "smooth"
    //   });
    // }
    const { firstPage, register } = this.state
    this.setState({ firstPage: false, register: true, login: false })
  }

  render() {
    const { firstPage, login, register } = this.state
    return (
      <div>
        <AppNavbar
          onLoginClickHandler={this.onLoginClick}
          onRegistrationClickHandler={this.onRegistrationClick}
        ></AppNavbar>
        <div className="Wrapper">
          <div className="row loginrow ">
            <div className="col-md-6 leftsidelogin" />
            <div className="col-md-6 rightsidelogin">
              <div className="card shadow-none cardInFirstPage">
                {firstPage ? <FirstPage
                  onLoginClickHandler={this.onLoginClick}
                  onRegistrationClickHandler={this.onRegistrationClick} /> : null}
                {login ? <Login /> : null}
                {register ? <Register /> : null}
              </div>
            </div>
          </div>
        </div>

        {/* <AppNavbar /> */}
        
        
{/* 
        <section className="slide-wrapper">
          <div className="container">
            <div
              id="myCarousel"
              className="carousel slide"
              data-ride="carousel"
            >
              <ol className="carousel-indicators">
                <li
                  data-target="#myCarousel"
                  data-slide-to="0"
                  className="active"
                />
                <li data-target="#myCarousel" data-slide-to="1" />
                <li data-target="#myCarousel" data-slide-to="2" />
                <li data-target="#myCarousel" data-slide-to="3" />
              </ol>

              <div className="carousel-inner">
                <div className="carousel-item active">
                  <div className="fill" style={{ color: "#48c3af" }}>
                    1
                  </div>
                </div>
                <div className="carousel-item">
                  <div className="fill" style={{ color: "#b33f4a" }}>
                    2
                  </div>
                </div>
                <div className="carousel-item">
                  <div className="fill" style={{ color: "#7fc2f4" }}>
                    3
                  </div>
                </div>
                <div className="carousel-item">
                  <div className="fill" style={{ color: "#e47794" }}>
                    4
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section> */}
      </div>
    );
  }
}

export default NotAuthenticated;
