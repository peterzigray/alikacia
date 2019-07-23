import React, { Component } from 'react';
import { Link } from "react-router-dom";
import { compose } from 'redux';
import { connect } from 'react-redux';
import { firestoreConnect } from 'react-redux-firebase';
import PropTypes from 'prop-types';
import Spinner from '../layout/Spinner';
import '../../css/Cients.css';
import { get } from 'http';
import ClientOverview from './ClientOverview';
import AddDebt from './addDebt';
import Dashboard from './Dashboard';
import Friends from './Friends';


const styles = {
  transition: "all 0.3s ease-out"
}

class Clients extends Component {
  state = {
    totalOwed: null,
    youAreOwed: null,
    youOwed: null,
    navbarOn: true,

    isAuthenticated: false,
    cards: [
      {
        id: 0,
        name: "Dashboard",
        message: "Overview",
        icon: "fas fa-chart-bar",
        button: "btn btn-primary btn-lg float-right",
        bigIcon: "fas fa-file-invoice-dollar fa-3x",
        scale: 1,
        clicked: false,
        borderLeftColor: '#007bff'
      },
      {
        id: 1,
        name: "Add + ",
        message: "Update now",
        icon: "fas fa-sync",
        button: "btn btn-warning btn-lg float-right",
        bigIcon: "fas fa-wallet fa-3x",
        scale: 1,
        clicked: false,
        borderLeftColor: '#ffc107'
      },
      {
        id: 2,
        name: "History",
        message: "Let's set it up",
        icon: "far fa-calendar-check",
        button: "btn btn-success btn-lg float-right",
        bigIcon: "far fa-calendar-check fa-3x",
        scale: 1,
        clicked: false,
        borderLeftColor: '#28a745'
      },
      {
        id: 3,
        name: "Friends",
        message: "Check your friends",
        icon: "fas fa-chart-bar",
        button: "btn btn-danger btn-lg float-right",
        bigIcon: "fas fa-chart-pie fa-3x",
        scale: 1,
        clicked: false,
        borderLeftColor: '#dc3545'
      }
    ],
    showSettings: false,
    showAddClient: ''
  };


  // GET TOTAL BALANCE OWED MONEY AND PAID MONEY
  static getDerivedStateFromProps(props, state) {
    const { clients, debt, auth, } = props;
    const total = {};
    var youOwedNum = [];
    var theyOwedNum = [];
    var sumOfOwedMoney = 0;
    var sumOfPaidMoney = 0;
    //
    if (debt) {
      debt.forEach(d => {
        if (d.debtor && d.debtor[1] === auth.uid) {
          youOwedNum.push(parseInt(d.debtor[0]))
          // Object.assign(total, {totalOwed:d.debtor[0]}) ;
        }
        if (d.paidBy === auth.uid) {
          console.log(d.balance)
          theyOwedNum.push(parseInt(d.balance))
        }
      }
      )
      for (let i = 0; i < youOwedNum.length; i++) {
        sumOfOwedMoney += youOwedNum[i]
      }
      for (let i = 0; i < theyOwedNum.length; i++) {
        sumOfPaidMoney += theyOwedNum[i]
      }
      // result of amount of money you owed
      Object.assign(total, { youOwed: sumOfOwedMoney });
      // result of amount of money you paid
      Object.assign(total, { youAreOwed: sumOfPaidMoney });
      return total
    }
  }

  // static getDerivedStateFromProps(props, state) {
  //   const { debt, auth } = props;
    
  //   if(debt){
  //     //Add balances 
  //     const total = {}
  //     debt.forEach(d => {
  //     if(d.debtTo === auth.uid){
  //     Object.assign(total, { totalOwed: d.balance })
  //     }
  //     })
  //     return total
  //   }
   
  //   // PREVIOUS RESOLUTION
  //   // if (debt) {
  //   //   //Add balances 
  //   //   const total = debt.reduce((total, d) => {
  //   //    console.log(total)
  //   //     console.log(d)
  //   //     return total + parseFloat(d.balance.toString());
  //   //   }, 0);
  //   //   return { totalOwed: total };
  //   // }
  //   // return null
  // }

  // static getDerivedStateFromProps(props, state) {
  //   const { auth } = props;
  //   if (auth.uid) {
  //     return { isAuthenticated: true };
  //   } else {
  //     return { isAuthenticated: false };
  //   }
  // }
  onLogoutClick = e => {
    e.preventDefault();

    const { firebase } = this.props;
    firebase.logout();

    // this.props.history.push('/login');
  };

  onMouseOverHandler = id => {
    let stateCopy = Object.assign({}, this.state);
      stateCopy.cards[id].scale = 1.07;
    this.setState(stateCopy);
  };

  onMouseLeaveHandler = () => {
    let stateCopy = Object.assign({}, this.state);
    const length = this.state.cards.length;
    var clickedId = stateCopy.cards.findIndex(i => i.clicked === true)
      for(let i = 0; i < length; i++){
        stateCopy.cards[i].scale = 1;
      }
      if(clickedId !== -1){
        stateCopy.cards[clickedId].scale = 1.07;
      } 
    this.setState(stateCopy);
  };

  onClickButton = id => {

    window.scrollTo({
      top: 165,
      behavior: "smooth"
    });

    let stateCopy = Object.assign({}, this.state);
    stateCopy.showAddClient = id;
    const length = this.state.cards.length;
    for (let i = 0; i < length; i++) {
      stateCopy.cards[i].scale = 1;
      stateCopy.cards[i].clicked = false;
    }
    stateCopy.cards[id].clicked = true;
    stateCopy.cards[id].scale = 1.07;
    this.setState(stateCopy)
  };

  render() {
    const { clients , users, debt} = this.props;
    const { totalOwed, cards, showSettings, showAddClient, youAreOwed, youOwed } = this.state;
    const { auth, isAuthenticated } = this.props;
    let settingsAndLogout = "";

    const navbarClassName = this.state.navbarOn ? 'col-lg-2half d-none d-sm-block bg-light sidebar' : 'col-lg-1half d-block bg-light sidebar';
    const mainClassName = this.state.navbarOn ? 'col-9' : 'col-9';
    const iconChange = this.state.navbarOn ? 'fas fa-arrow-circle-left fa-2x' : 'fas fa-arrow-circle-right fa-2x';

    
    if(users){
      var currentUser = users.filter(user => { return user.id === auth.uid })
      console.log('sdshcdsfhcksdjckjdkjfkjkjkjk')
      console.log(currentUser);
    }
    

    if (showSettings) {
      settingsAndLogout = (
        <div className="dropdown-menu show ">
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
              <a href="#!" className="nav-link" onClick={this.onLogoutClick}>
                Logout
              </a>
            </li>
          </ul>
        </div>
      );
    } else {
      settingsAndLogout = null;
    }


    if (debt && users) {

      var newDebtRight = [];
      var newDebtLeft = [];

      for (var i in debt) {
    
        newDebtLeft.push(giveMePayerForOvrview(debt[i], users))
      }

      // ASSIGN PAYER AND ACTUALDEBT TO EXIST DEBT BASED ON WHO I OWE TO 
      function giveMePayerForOvrview(debt, users) {
        let result = {}
        var nieco = false;
        var value;
        debt.debtTo.forEach(d => {
          if (d.id === auth.uid) {
            nieco = true;
            value = d.actualDebt
          }
        }
        )
        users.forEach(user => {
          if (debt.paidBy === user.id && debt.paidBy !== auth.uid && nieco) {
            Object.assign(result, debt, { payer: user.firstName + user.lastName, actualDebt: value ? value : debt.balance })
          }
        }
        )
        return result
      }


      // FILTER OUT EMPTY OBJECTS
      newDebtLeft = newDebtLeft.filter(d => Object.keys(d).length !== 0)

      var output = [];

      //MERGE ALL OBJECT INTO ONE BESED ON WHO PAYD THE BILL
      newDebtLeft.forEach(function (item) {
        var existing = output.filter(function (v) {
          return v.paidBy === item.paidBy;
        });
        if (existing.length) {
          var existingIndex = output.indexOf(existing[0]);
          var actualDebt = parseInt(output[existingIndex].actualDebt) + parseInt(item.actualDebt)
          output[existingIndex].actualDebt = actualDebt
        } else {
          if (typeof item.actualDebt == 'string')
            item.actualDebt = [item.actualDebt];
          output.push(item);
        }
      });
      console.log('eeeeeeeeeeeeeeeeeeeeeeeeeeeeeee')
      

     var totalBalance = output.forEach(o => {
       var nieco;
       return nieco = nieco + o.actualDebt
      
      })
      console.log(totalBalance)
    }

   


    if (debt && users) {
      return (
        <React.Fragment>

        
        {/* <div className="row border-bottom mb-0 m9" style={{ 'background-color': '#1D2439' }}> */}
          <nav className="navbar sticky-top flex-md-nowrap p-0" style={{ 'background-color': '#1D2439' }}>>

          <div className="col">
            <div className="mt-1">
              <div style={{ padding: '.375rem .75rem', 'font-size': '1.1rem', color: 'yellow' }}>
                <i className="fas fa-euro-sign fa-lg"></i>
              </div>
            </div>
          </div>

          <div className="col p-1">
            <div className="m-2">
              <div className="" >
                <form className="form-inline active-pink-4 ">
                  <input className="form-control form-control-sm mr-3 w-75" type="text" placeholder="Search"
                    aria-label="Search" />
                  <i className="fas fa-search" aria-hidden="true"></i>
                </form>
              </div>
            </div>
          </div>

          <div className="col mt-0" id="navIcons">

            <div className="float-right mt-1">
              <div className="btn pr-3" style={{ 'font-size': '1.1rem', color: 'white' }}>

                <i className="fas fa-user-circle fa-lg clientAvatar" />{' '}
                {/* {currentUser[0].firstName} */}

              </div>

              <div className="btn pr-0 leftborder" style={{ 'font-size': '1.1rem', color: '#0069D9' }}>
                <i className="fas fa-bell fa-lg" />
                {/* <span className="button__badge">10</span> */}
              </div>
              <div className="btn pl-0" style={{ 'font-size': '1.1rem' }}>
                <i
                  style={{ color: '#0069D9' }}
                  className="btn fas fa-cog fa-lg"
                  onMouseEnter={() =>
                    this.setState({ showSettings: !showSettings })}
                />
              </div>

              {settingsAndLogout}
            </div>
          </div>


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
               ) : null}{" "} */}
          {/* <span className="text-primary">
                ${parseFloat(totalOwed).toFixed(2)}
               </span> */}
        </nav>
   

        

    <div className="wrapper">

              
              <nav className={navbarClassName} style={{height: '100rem'}}>
               
                <div className="sidebar-sticky" style={{'padding-top': '4rem'}}>


                  

                  {this.state.navbarOn ?
                   <React.Fragment>
                     <div className="logo">
                  <div className="photo">
                    <img src="https://demos.creative-tim.com/black-dashboard/assets/img/anime3.png" />
                  </div>
                  {auth.email}  
                  </div>

                  <div className="logo" onClick={this.onClickButton.bind(this, 0)}>            
                    <i class="fas fa-home fa-lg"></i> Dashboard               
                  </div>

                  <div className="logo" onClick={this.onClickButton.bind(this, 2)}>              
                    <i class="fas fa-history fa-lg"></i> History                
                  </div>
                  <div className="logo" onClick={this.onClickButton.bind(this, 3)}>              
                    <i class="fas fa-user-friends fa-lg"></i> Friends              
                  </div>
                  <div className="logo" onClick={this.onClickButton.bind(this, 1)}>              
                    <i class="fas fa-plus fa-lg"></i> Add bills                
                  </div>

                      {/* <ul class="nav flex-column mt-2 mb-3 mt-1 pl-1">
                        <li class="nav-item mt-3">
                          <i class="fas fa-home fa-lg"></i> Dashboard
                        </li>
                        <li class="nav-item mt-3">
                          <i class="fas fa-history fa-lg"></i> History
                        </li>
                      </ul>

                      <ul class="nav flex-column mt-2 mb-3 mt-1 pl-1">
                        <li class="nav-item mt-3">
                          <i class="fas fa-user-friends fa-lg"></i> Friends
                        </li>
                        <li class="nav-item mt-3">
                          <i class="fas fa-plus fa-lg"></i> Add bills
                        </li>
                      </ul>  */}
                    </React.Fragment>
                  : 
                 <React.Fragment>
                  
                  
                  <div className="photo">
                    <img src="https://demos.creative-tim.com/black-dashboard/assets/img/anime3.png" />
                  </div> 
              

                      <ul class="nav flex-column mt-2 mb-3 mt-1 pl-3">
                        <li class="nav-item mt-3">
                            <i class="fas fa-home fa-lg"></i>
                        </li>
                        <li class="nav-item mt-3">
                            <i class="fas fa-history fa-lg"></i>
                        </li>
                      </ul>

                      <ul class="nav flex-column mt-2 mb-3 mt-1 pl-3">
                        <li class="nav-item mt-3">           
                            <i class="fas fa-user-friends fa-lg"></i> 
                        </li>
                        <li class="nav-item mt-3">
                            <i class="fas fa-plus fa-lg"></i> 
                        </li>
                      </ul> 
                 </React.Fragment> 
                  
                }



<div className="nav flex-column mt-2 pl-3">
  
                  <i className={iconChange}
                    onClick={(e) => this.setState({ navbarOn: !this.state.navbarOn })}
                  ></i>
                </div>


                </div>
               
                

              </nav>

              <main role="main" className={mainClassName}>
        
          <div className="row border-bottom mb-2 mt-2" style={{ 'height': '15rem' }}>
            <div className="col p-5">
              <div className="mx-auto border-left pl-2" style={{width: '50%'}}>             
              <h6 style={{ color:'grey'}}>Total Balance</h6>
                {}
                <h2 style={{ color: 'red' }}>
                {'$'} 440
                </h2>
                <p>View statement ></p>
              </div>
            </div> 
            <div className="col p-5">
              <div className="mx-auto border-left pl-2" style={{ width: '50%' }}>   
                <h6 style={{ color: 'grey' }}>You owe</h6>
                {}
                <h2 style={{ color: 'Black' }}>
                  {'$'} 440
                </h2>
                <p>View statement ></p>
              </div>
            </div> 
            <div className="col p-5">
              <div className="mx-auto border-left pl-2" style={{ width: '50%' }}>   
                <h6 style={{ color: 'grey' }}>You are owed</h6>
                {}
                <h2 style={{ color: 'green' }}>
                  {'$'} 440
                </h2>
                <p>View statement ></p>
              </div>
            </div> 
  </div>

            
  {/* <div className="row mt-4 border-bottom" style={{ 'height': '10rem' }}>
              {cards.map(card => (
                <div className="col ">
                  <div
                    className="card"
                    style={{ width: "50%m"}}
                    onMouseEnter={this.onMouseOverHandler.bind(
                      this,
                      card.id
                    )}
                    onMouseLeave={this.onMouseLeaveHandler.bind(
                      this,
                      card.id
                    )}
                    style={{
                      ...styles,
                      transform: "scale(" + card.scale + ")",
                      "border-left-color": `${card.borderLeftColor}`,
                      "border-left-width": "5px"

                    }}
                  // style={{...styles, opacity: this.state.opacity, transform: 'scale(' +this.state.scale +')'}}
                  >
                    <div className="card-body">
                      <div className="row">
                        <div className="col-5">
                          <i
                            className={card.bigIcon}
                            style={{ color: "#17a2b8" }}
                          />
                        </div>
                        <div className="col-7">
                          <button
                            type="button"
                            className={card.button}
                            onClick={this.onClickButton.bind(this, card.id)}
                          >
                            {card.name}
                          </button>
                        </div>
                      </div>


                    </div>
                    <div className="card-footer">
                      <small className="text-muted"><span style={{ color: "#a9a9a9" }}>
                        <i className={card.icon} />
                        {' '}{card.message}
                      </span></small>
                    </div>
                  </div>
                </div>
              ))}

            
            
            </div> */}
            

            
        

          <div className="row mt-4" style={{height: 'auto'}}>
        
       
            <div className="col">
              {/* <div
                className="card text-white bg-info mb-2 iconsoverlap"
                style={{ width: "110px", height: "60px" }}
              > */}
                <div className="d-flex ">
                  {/* <i className="fas fa-bookmark" /> {' '} */}
                  {showAddClient === 0 || !showAddClient ? (
                    <h5> Dashboard </h5>
                  ) : null}
                  {showAddClient === 1 ? (
                    <h5> Add Debt </h5>
                  ) : null}
                  {showAddClient === 2 ? (
                    <h5> History </h5>
                  ) : null}
                  {showAddClient === 3 ? (
                    <h5> Friends </h5>
                  ) : null}
                </div>
              {/* s */}
              {/* <ClientOverview/> */}
              <div className="clientTable">
                {showAddClient === 0 || !showAddClient ? <Dashboard/> : null}
                {showAddClient === 1 ? <AddDebt /> : null}

                {showAddClient === 2  ? <ClientOverview
                  debt={debt}
                /> : null}
                {showAddClient === 3 ? <Friends></Friends> : null}
              </div>
            </div>
          </div>
          </main>
            {/* </main> */}
            </div>
            
    
        </React.Fragment>
      );
    }





    else {
      return <Spinner />;
    }
  }
}

Clients.propTypes = {
  firebase: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  settings: PropTypes.object.isRequired,

  firestore: PropTypes.object.isRequired,
  clients: PropTypes.array,
  debt: PropTypes.array
}

export default compose(
  firestoreConnect([{ collection: 'clients' }]), firestoreConnect([{ collection: 'users' }]),
  firestoreConnect([{ collection: 'debt' }]),
  connect((state, props) => ({
    clients: state.firestore.ordered.clients,
    users: state.firestore.ordered.users,
    auth: state.firebase.auth,
    settings: state.settings,
    debt: state.firestore.ordered.debt
  }))
)(Clients);
// export default compose(
//   firestoreConnect([{ collection: 'users' }]),
//   connect((state, props) => ({
//     users: state.firestore.ordered.users,
//     auth: state.firebase.auth,
//     settings: state.settings
//   }))
// )(Clients);


