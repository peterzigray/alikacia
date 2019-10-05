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
import CountUp from 'react-countup';
import { ENGINE_METHOD_NONE } from 'constants';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import { UserIsAuthenticated, UserIsNotAuthenticated } from '../../helpers/auth'



const Child = (path) => {
  console.log('coje to match')
  //console.log(`${match.url}`)
  const { debt, group, debtors, debtorsLeft, clickedFriend, balance } = path
  const {pathname} = path.location

  console.log('===============path==================')
  console.log(debtors)
  console.log(debtorsLeft)


 
  if (pathname === '/' || pathname === '/client/Dashboard'  ){
        return (<Dashboard 
          debtors={debtors.length < 1 ? [{ id: 0 }]: debtors } 
          debtorsLeft={debtorsLeft} 
          currentGroup={group}
          totalBalance={balance}
          clickedFriend={clickedFriend}
           />)
      }
  if (pathname === '/' || pathname === '/client/History' ){
        return (<ClientOverview  debt={debt}/>)
      }
  if (pathname === '/' || pathname === '/client/Friends' ){
        return (<Friends/>)
      }
  if (pathname === '/' || pathname === '/client/AddBills' ){
        return (<AddDebt/>)
      }
  else {
        return (<Friends pathname={pathname} />)
  }
}
/////////////////////////////////Left debtors////////////////////////////////////////////////////////
function getLeftDebtors(personsIoweTo) {
  // STORE ALL DUPLICATE RECORDS
  const duplicatedLeft = personsIoweTo.filter((ele, indx) => {
    return indx !== personsIoweTo.map(p => p['id']).indexOf(ele['id'])
  }
)

  // STORE IDECKA OF DUPLICATE RECORDS
  const ide = duplicatedLeft.map(d => d.id)

  // FOR FIRST RECORDS WHERE ID === DUPLICATED CHANGE ACTUAL DEBT TO SUM OF ALL RECORDS WHERE ID === PARTICULAR DUPLICATED ID
  for (var j = 0; j < ide.length; j++) {
    gimmeSum2(personsIoweTo, ide[j])
  }











  function gimmeSum2(ar, idecko) {
    var number = ar.filter(({ id }) => id === idecko).reduce((sum, record) => sum + Number(record.actualDebt), 0)
    // CHANGE ACTUAL DEBT UNDER ONE NAME    
    ar.filter(obj => obj.id === idecko ? Object.assign(obj, { actualDebt: number.toFixed(2) }) : null)
  }

  // STORE ALL DEBTORS WHERE DUPLICATED RECORD HAS BEEN FILTERED AND ONLY RECORD WHERE ACTUAL DEBT HAS BEEN STORED AS SUM OFF ALL RECORD REMAIN
  const debtorsLeft = personsIoweTo.filter((pilot, index, array) => { return array.map(a => a['id']).indexOf(pilot['id']) === index })

  return debtorsLeft

}


function listOfUsersIOwe(debt,users,auth) {
  var result = [];
  for (var i = 0; i < debt.length; i++) {
    result.push(giveMePayerForOvrview(debt[i], users, auth))
  }
  // remove all empry arrays + JSON.stringify create clone, prevention against deformation
  return JSON.parse(JSON.stringify([].concat.apply([], [...result])));
}


// ASSIGN PAYER AND ACTUALDEBT TO EXIST DEBT BASED ON WHO I OWE TO 
function giveMePayerForOvrview(debt, users, auth) {
  const { id } = debt.paidBy;
  var res = [];
  debt.debtTo.forEach((d) => {
    if (d.id === auth && id !== auth) {
      res.push(Object.assign(debt.paidBy, { actualDebt: d.actualDebt }))
      }
    }
  )
  return res
}

//////////////////////////////////RIGHT DEBTORS//////////////////////////////////////////

function getRightDebtors(arrOfUsersWhoOweMe) {
       // STORE ALL DUPLICATE RECORDS
       const duplicated = arrOfUsersWhoOweMe.filter((ele, indx) => {
        return indx !== arrOfUsersWhoOweMe.map(p => p['id']).indexOf(ele['id'])
      }
      )
      // STORE IDECKA OF DUPLICATE RECORDS
      const idecka = duplicated.map(d => d.id)

      // FOR FIRST RECORDS WHERE ID === DUPLICATED CHANGE ACTUAL DEBT TO SUM OF ALL RECORDS WHERE ID === PARTICULAR DUPLICATED ID
      for (var j = 0; j < idecka.length; j++) {
        gimmeSum(arrOfUsersWhoOweMe, idecka[j])
      }


      function gimmeSum(ar, idecko) {
        var number = ar.filter(({ id }) => id === idecko).reduce((sum, record) => sum + Number(record.actualDebt), 0)
        // CHANGE ACTUAL DEBT UNDER ONE NAME    
        ar.filter(obj => obj.id === idecko ? Object.assign(obj, { actualDebt: number.toFixed(2) }) : null)
      }

      // STORE ALL DEBTORS WHERE DUPLICATED RECORD HAS BEEN FILTERED AND ONLY RECORD WHERE ACTUAL DEBT HAS BEEN STORED AS SUM OFF ALL RECORD REMAIN
      const debtors = arrOfUsersWhoOweMe.filter((pilot, index, array) => { return array.map(a => a['id']).indexOf(pilot['id']) === index })

      console.log('----debtors of the right side-----')
      console.log(debtors)
      return debtors
}
/**
 * 
 * @param {array} debt array of objects of debts
 * @param {object} auth object mine authorization
 */
  function listOfUsersWhoOweMe(debt, auth) {
   var result = [];
   for (var i = 0; i < debt.length; i++) {
    result.push(giveMePayer(debt[i], auth))
  }
  // CONCAT ALL ARRAYS OF DEBTORS INTO ONE AND GET RID OF INNER ARRAYS SO RESULT IS --> [{},{},{}] + CREATE DEEP COPY OF DEBTORS ARRAY (NON MUTABLE)     
  return  JSON.parse(JSON.stringify([].concat.apply([], [...result])))
}
/**
 * 
 * @param {object} debt one object od debt
 * @param {object} auth object mine authorization
 */
function giveMePayer(debt, auth) {
  const { id } = debt.paidBy;
  var result = [];
  if (id === auth) {
    if (debt.debtTo.length !== 0) {
      debt.debtTo.forEach(d => result.push(d))
    }
  }
  var finalResult = result.filter((obj) => { return obj.id !== auth }).flat()
  return finalResult
}

const styles = {
  transition: "all 0.3s ease-out"
}

class Clients extends Component {
    state = {
    totalOwed: null,
    youAreOwed: null,
    youOwed: null,
    navbarOn: true,
    debtorsLeft:'',
    debtorsRight: '',

    isAuthenticated: false,
    totalOweBalance: '0',
    friendHasBeenClicked: false,
    clickedGroup:'',
   
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
    isLoadedFirstTime: true,
    showAddClient: '',
  };

  // componentDidMount() {
  //   const {users, debt ,auth} = this.props;
  //   let stateCopy123 = Object.assign({}, this.state);
  //   var debtLeft = JSON.parse(JSON.stringify(debt));

  //   // STORE ALL RETURNED DEBTORS WITHOUT ME
  //   var personsIoweTo = listOfUsersIOwe(debtLeft, users, auth.uid);

  //   // STORE ALL DEBTORS FOR LEFT SIDE
  //   var debtorsLeft = getLeftDebtors(personsIoweTo)

  //   stateCopy123.debtorsLeft = debtorsLeft
  //   this.setState(stateCopy123)
  // }


  // GET TOTAL BALANCE OWED MONEY AND PAID MONEY
//   static getDerivedStateFromProps(props, state) {
//     const { clients, debt, auth,users } = props;
//     const total = {};
//     var youOwedNum = [];
//     var theyOwedNum = [];
//     var sumOfOwedMoney = 0;
//     var sumOfPaidMoney = 0;
//     //
//     if (debt && users && auth) {

//       var debtLeft = JSON.parse(JSON.stringify(debt));

//       // STORE ALL RETURNED DEBTORS WITHOUT ME
//       var personsIoweTo = listOfUsersIOwe(debtLeft, users, auth.uid);

//       // STORE ALL DEBTORS FOR LEFT SIDE
//       var debtorsLeft = getLeftDebtors(personsIoweTo)
//       console.log('////////////////////////')
//       console.log(debtorsLeft)
     

// this.setState({debtorsLeft: debtorsLeft2})

//       debt.forEach(d => {
//         if (d.debtor && d.debtor[1] === auth.uid) {
//           youOwedNum.push(parseInt(d.debtor[0]))
//           // Object.assign(total, {totalOwed:d.debtor[0]}) ;
//         }
//         if (d.paidBy === auth.uid) {
//           console.log(d.balance)
//           theyOwedNum.push(parseInt(d.balance))
//         }
//       }
//       )
//       for (let i = 0; i < youOwedNum.length; i++) {
//         sumOfOwedMoney += youOwedNum[i]
//       }
//       for (let i = 0; i < theyOwedNum.length; i++) {
//         sumOfPaidMoney += theyOwedNum[i]
//       }
//       // result of amount of money you owed
//       Object.assign(total, { youOwed: sumOfOwedMoney });
//       // result of amount of money you paid
//       Object.assign(total, { youAreOwed: sumOfPaidMoney });
//       return total
//     }
//     return debtorsLeft
//   }


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

  clickedFrienInfo = (currentClickedId , g) => {
    console.log('-----parent-----')
    console.log(currentClickedId)
    console.log(g)
 

    const {users, debt ,auth } = this.props;
    let stateCopy123 = Object.assign({}, this.state);
    var debtLeft = JSON.parse(JSON.stringify(debt));

    //-----------------------------------------------------left side
    // STORE ALL RETURNED DEBTORS WITHOUT ME
    var personsIoweTo = listOfUsersIOwe(debtLeft, users, currentClickedId);
    // STORE ALL DEBTORS FOR LEFT SIDE
    var debtorsLeft = getLeftDebtors(personsIoweTo).filter((object) => object !== null)

    console.log('---------------------clicked')
    console.log(debtLeft)

    //-----------------------------------------------------right side
    var arrOfUsersWhoOweMe = listOfUsersWhoOweMe([...debt], currentClickedId);
    var debtors =  getRightDebtors(arrOfUsersWhoOweMe)

 

    
    stateCopy123.clickedGroup = g
    stateCopy123.debtorsLeft = debtorsLeft
    stateCopy123.debtorsRight = debtors

    stateCopy123.friendHasBeenClicked = true
    this.setState(stateCopy123)


  }

  onLogoutClick = e => {
    e.preventDefault();

    const { firebase } = this.props;
    firebase.logout();

     this.props.history.push('/login');
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
    stateCopy.isLoadedFirstTime = false
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

  // updateCounter = () =>{}

  render() {
    const { clients , users, debt, groups} = this.props;
    const { totalOwed, cards, showSettings, showAddClient, youAreOwed, youOwed } = this.state;
    const { auth, isAuthenticated } = this.props;
    let settingsAndLogout = "";

    const navbarClassName = this.state.navbarOn ? 'col-lg-2half d-none d-sm-block bg-light sidebar transition sidebar-sticky h-100' : 'col-lg-1half d-block bg-light sidebar transition sidebar-sticky h-100';
    const mainClassName = this.state.navbarOn ? 'col-9 transition h-100 ' : 'col-10 transition';
    const iconChange = this.state.navbarOn ? 'fas fa-arrow-circle-left fa-2x' : 'fas fa-arrow-circle-right fa-2x';

    console.log('------------------------CLIENT----------------------------')
    console.log('----------------------------------------------------------')
    if(users){
      var currentUser = users.filter(user => { return user.id === auth.uid })
      // console.log('sdshcdsfhcksdjckjdkjfkjkjkjk')
      // console.log(currentUser);
    }
    if(groups){
      var clickedGroup = groups.filter(group => group.members.some(member => member.id === auth.uid));
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
            <li className="nav-item" onClick={this.onLogoutClick}>
              <Link to="/" className="nav-link">
               LogOut
              </Link>
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



    if (debt && users ) {
      console.log('------------users------------')
      
      var allUsers = JSON.parse(JSON.stringify(users));
      var myName = allUsers.filter(user => {
        if (user.id === auth.uid ){
          return user
        } 
      })[0]
      const {firstName , lastName} = myName;
      console.log(firstName + ' ' + lastName)

      /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      //******************************ALL ABOUT DEBTORS DISPLAYED ON RIGHT SIDE OF THE SCREEN OF DASHBOARD************************************** */
      /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

      // STORE ALL RETURNED DEBTORS WITHOUT ME
      var arrOfUsersWhoOweMe = listOfUsersWhoOweMe([...debt], auth.uid);

      var debtors =  getRightDebtors(arrOfUsersWhoOweMe)
   

      /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      //******************************ALL ABOUT DEBTORS DISPLAYED ON LEFT SIDE OF THE SCREEN OF DASHBOARD************************************** */
      /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////  
  
      var debtLeft = JSON.parse(JSON.stringify(debt));

      // STORE ALL RETURNED DEBTORS WITHOUT ME
      var personsIoweTo = listOfUsersIOwe(debtLeft, users, auth.uid);

      
      // STORE ALL DEBTORS FOR LEFT SIDE
      var debtorsLeft = getLeftDebtors(personsIoweTo)
      console.log('-------------------------this is it-----------')
      console.log(personsIoweTo)


      // -------------------------------------------------------------------------------------------->
      // TOTAL BALANCE YOU OWE
      var listOfUsersForBalance = JSON.parse(JSON.stringify(debtorsLeft));
      var totalOwedBalance = listOfUsersForBalance.filter(({ actualDebt }) => actualDebt).reduce((sum, record) => sum + Number(record.actualDebt), 0)


      // TOTAL BALANCE THEY OWED
      var listOfUsersForBalance2 = JSON.parse(JSON.stringify(debtors));
      var totalPaidBalance = listOfUsersForBalance2.filter(({ actualDebt }) => actualDebt).reduce((sum, record) => sum + Number(record.actualDebt), 0)

      // TOTAL BALANCE
      var totalBalanceForMe = totalPaidBalance - totalOwedBalance;
      //<--------------------------------------------------------------------------------------------

      
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
               

                

                  <ul class="nav na</ul>vbar-nav ml-auto">
                  <li class="nav-item dropdown">
                      <i class="nav-link  btn fas fa-cog fa-lg" href="#" id="navbarDropdownMenuLink" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" style={{ color: '#0069D9', 'cursor': 'pointer'}}>
                      {/* <i
                        style={{ color: '#0069D9' }}
                        className="btn fas fa-cog fa-lg"
                        onMouseEnter={() =>
                          this.setState({ showSettings: !showSettings })}
                      /> */}
        </i>
                    <div class="dropdown-menu dropdown-menu-right">
                   
                        <a href="#" class="dropdown-item">{auth.email}</a>
                        <a href="#" class="dropdown-item"> <Link to="/settings" className="nav-link">
                          Settings
              </Link></a>
                        <div class="dropdown-divider"></div>
                     
                        <a
                          href="#!"
                          className="nav-link dropdown-item"
                          onClick={this.onLogoutClick}
                        >
                          Logout
                    </a>
                    </div>
                 
                  </li>
                  </ul>

                  {/* <ul class="nav navbar-nav ml-auto">
                    <li class="nav-item dropdown">
                      <a href="#" class="nav-link dropdown-toggle" data-toggle="dropdown">Admin</a>
                      <div class="dropdown-menu dropdown-menu-right">
                        <a href="#" class="dropdown-item">Reports</a>
                        <a href="#" class="dropdown-item">Settings</a>
                        <div class="dropdown-divider"></div>
                        <a href="#" class="dropdown-item">Logout</a>
                      </div>
                    </li>
                  </ul> */}

     </div>

                


                {/* <div className="dropdown-menu show ">
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
                    <li className="nav-item" onClick={this.onLogoutClick}>
                      <Link to="/" className="nav-link">
                        LogOut
              </Link>
                    </li>
                  </ul>
                </div> */}

              {/* {settingsAndLogout} */}
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
   

        

          <div className="container-fluid h-100" style={{ 'background-color':'#F8F9FA'}}>

          <div className="row h-100">
              <nav className={navbarClassName} >
               
                {/* <div className="col-2 sidebar-sticky pl-0 pr-0" style={{'padding-top': '100%'}}></div>
 */}

                  

                  {this.state.navbarOn ?
                   <div className='make-me-sticky'>
                     <div className="logo ">
                  <div className="photo">
                    <img src="https://demos.creative-tim.com/black-dashboard/assets/img/anime3.png" />
                  </div>
                    {' '}  {firstName + ' ' + lastName}  
                  </div>

                    <div className="logo pt-3 pb-3 pl-4 " onClick={this.onClickButton.bind(this, 0)}>            
                      <i class="fas fa-home fa-lg"></i>{' '}{' '}<span><Link to="/client/Dashboard" debtors={debtors}
                  debtorsLeft={debtorsLeft} >Dashboard</Link></span>               
                  </div>

                    <div className="logo pt-3 pb-3 pl-4" onClick={this.onClickButton.bind(this, 2)}>              
                      <i class="fas fa-history fa-lg"></i>{' '}{' '} <Link to="/client/History " debtors={debtors}
                  debtorsLeft={debtorsLeft} >History</Link>               
                  </div>
                    <div className="logo pt-3 pb-3 pl-4" onClick={this.onClickButton.bind(this, 3)}>              
                      <i class="fas fa-user-friends fa-lg"></i>{' '}{' '} <Link to="/client/Friends" debtors={debtors}
                  debtorsLeft={debtorsLeft} >friends</Link>             
                  </div>
                    <div className="logo pt-3 pb-3 pl-4" onClick={this.onClickButton.bind(this, 1)}>              
                      <i class="fas fa-plus fa-lg"></i>{' '}{' '} <Link to="/client/AddBills" debtors={debtors}
                  debtorsLeft={debtorsLeft} >Add Bills</Link>       
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
                    </div>
                  : 
                 <React.Fragment>
                  
                  
                    <div className="photo ml-3 ">
                    <img src="https://demos.creative-tim.com/black-dashboard/assets/img/anime3.png" />
                  </div> 
              

                    <ul class="nav flex-column mt-2 mb-3 mt-1 pl-2 ml-3">
                        <li class="nav-item mt-3">
                            <i class="fas fa-home fa-lg"></i>
                        </li>
                        <li class="nav-item mt-3">
                            <i class="fas fa-history fa-lg"></i>
                        </li>
                      </ul>

                    <ul class="nav flex-column mt-2 mb-3 mt-1 pl-2 ml-3">
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


              
               
                

              </nav>

              <div className={mainClassName}>
                <div className='row h-25 pt-5 mb-5'>
                  <div className="col">
                    <div class="card border-info  mx-sm-1 p-3">
                      <div class="card border-info shadow text-info p-3 my-card" ><span class="fa fa-euro-sign fa-lg" aria-hidden="true"></span></div>
                      <div class="text-info text-center mt-3"><h4>Balance</h4></div>
                      <div class="text-info text-center mt-2"><h1> {totalBalanceForMe >= 0 ? <h1 >
                        {'€'} <CountUp decimals={2} end={totalBalanceForMe} />
                      </h1> :
                        <h2 >
                          {'€'} <CountUp decimals={2} duration={3.75} end={totalBalanceForMe} />
                        </h2>}</h1></div>
                    </div>
                    </div>

                  <div className="col">

                    <div class="card border-success mx-sm-1 p-3">
                      <div class="card border-success shadow text-success p-3 my-card"><span class="fa fa-arrow-up" aria-hidden="true"></span></div>
                      <div class="text-success text-center mt-3"><h4>You are owed</h4></div>
                      <div class="text-success text-center mt-2"><h1>9332</h1></div>
                    </div>

                   



                  </div>

                  <div className="col">

                    <div class="card border-danger mx-sm-1 p-3">
                      <div class="card border-danger shadow text-danger p-3 my-card" ><span class="fa fa-arrow-down" aria-hidden="true"></span></div>
                      <div class="text-danger text-center mt-3"><h4>You owed</h4></div>
                      <div class="text-danger text-center mt-2"><h1>346</h1></div>
                    </div>

                </div>
               

              </div>

                <div className='row' style={{height:'10%'}}>
                  <div className="col-12 mb-2 mr-2" style={{ height: '10%' }} >
                    <div className="border-bottom " style={{ 'border-color':'#F8F9FA'}}>
                      {showAddClient === 0 || !showAddClient ? (
                        <div className='row'>

                        <h5> Dashboard </h5> <h5 classNaame="ml-5"> Dashboard </h5></div>
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
                  </div>

                </div>


                <div className='row h-50'>
                  {/* <div className="clientTable">  */}

                {showAddClient === 0 || !showAddClient ? 

                // <Dashboard debtors={debtors} debtorsLeft={debtorsLeft}/>
               <React.Fragment>

                    {
                      this.state.friendHasBeenClicked ?
                        <Route
                          path='/:id'
                          render={(props) => <Child
                            {...props}
                            debt={debt}
                            debtors={this.state.debtorsRight}
                            debtorsLeft={this.state.debtorsLeft}
                            group={this.state.clickedGroup}
                            balance={totalBalanceForMe}

                          //      clickedFriend={this.clickedFrienInfo.bind(this)}
                          />}

                        /> : null
                    }
                      {!this.state.friendHasBeenClicked && !this.state.isLoadedFirstTime ?
                    <Route
                      path='/:id'
                      render={(props) => <Child
                        {...props}
                        debt={debt}
                        debtors={debtors}
                        debtorsLeft={debtorsLeft}
                        group={clickedGroup}
                        balance={totalBalanceForMe}

                      //    clickedFriend={this.clickedFrienInfo.bind(this)}
                      />}

                    /> : null}
                  {this.state.isLoadedFirstTime ?
                    <Route
                      path='/'
                      render={(props) => <Child
                        {...props}
                        debt={debt}
                        debtors={debtors}
                        debtorsLeft={debtorsLeft}
                        group={clickedGroup}
                        balance={totalBalanceForMe}

                      //           clickedFriend={this.clickedFrienInfo.bind(this)} 
                      />}

                    /> : null}
                    </React.Fragment>

                : null}

                {showAddClient === 1 ? <AddDebt /> : null}

                {showAddClient === 2  ? <ClientOverview debt={debt}/> : null}

                {showAddClient === 3 ? <Friends></Friends> : null}

                    {/* <div className='row'> */}

                     
                      {/* <Route 
                path='/Friends/o0zm6jC0dbPyjG9ru1Xyy78AUnl1' 
                render={ (props) => <Child {...props}  debt={debt}  debtors={debtors} debtorsLeft={debtorsLeft}/>}
              />  */}
                      {/* </div> */}
                {/* </div> */}


                </div>


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
  firestoreConnect([{ collection: 'clients' }]), 
  firestoreConnect([{ collection: 'users' }]),
  firestoreConnect([{ collection: 'debt' }]),
  firestoreConnect([{ collection: 'groups' }]),
  connect((state, props) => ({
    clients: state.firestore.ordered.clients,
    users: state.firestore.ordered.users,
    auth: state.firebase.auth,
    settings: state.settings,
    debt: state.firestore.ordered.debt,
    groups: state.firestore.ordered.groups
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


