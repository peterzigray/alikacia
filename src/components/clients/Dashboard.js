import React, { Component } from 'react';
import { Link } from "react-router-dom";
import { compose } from 'redux';
import { connect } from 'react-redux';
import { firestoreConnect } from 'react-redux-firebase';
import PropTypes from 'prop-types';
import Spinner from '../layout/Spinner';
import classnames from "classnames";
import '../../css/Cients.css'
// import '../../css/LoginCss.css'
import '../../pics/app.jpg';
// import "react-responsive-carousel/lib/styles/carousel.min.css";
// import { Carousel } from 'react-responsive-carousel';
// import { Carousel } from 'react-customizable-carousel'
import AliceCarousel from 'react-alice-carousel';
import "react-alice-carousel/lib/alice-carousel.css";


function getFriendsCount(users, id) {
  var friendCounter = users.map((user) => user.id === id && user.friends ? user.friends : [])
  return [].concat.apply([], [...friendCounter]).length
}
function getGroupsCount(groups, key) {
  var groupCounter = groups.filter(group => group.members.some(member => member.id === key));
  return groupCounter
}
function getFriendsForCard(users, id) {
  // Arrray with all of my friends but me at the first position
  var allUsers = JSON.parse(JSON.stringify(users));
  var res = allUsers.map(user => user.id === id && user.friends).filter(arr => arr !== false).flat()
  res.push(id);
 // res.unshift({ id })
  // Insert My user at the first position of friends array
  return res
}
// 


/*
 * RENAME firstName keys in all array to label for input use
 * another comment here
 * ...
 */
function renameKeys(copyofU, newKeys) {
  var newArrOfChngedKeys = [];
  for (let i = 0; i < copyofU.length; i++) {
    newArrOfChngedKeys.push(giveBackNewArray(copyofU[i], newKeys))
  }
  return newArrOfChngedKeys
}
//-------------------------------------------------------------------------------------------------------------------------->
/*
* RETURN changed key for every single object in array one by one
* another comment here
* ...
*/
function giveBackNewArray(copyofU, newKeys) {
  const keyValues = Object.keys(copyofU).map(key => {
    const newKey = newKeys[key] || key;
    return { [newKey]: copyofU[key] };
  }
  );
  return Object.assign({}, ...keyValues);
}

function getMyFriends(users, friends) {
  var result = [];
  for (var i in users) {
    var matched = false
    for (var j in friends) {
      if (users[i].id === friends[j]) {
        matched = true
      }
    }
    if (matched) {
      result.push(users[i])
    }
  }
  return result
}

class dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      totalOwed: null,
      isAuthenticated: false,
      showSettings: false,
      showSettleLoan: false,
      id: "DrOldEvSJx0mXM5V8KhD",
      balanceUpdateAmount: '',
      class: '',
      classNumber: '',
      style: '',
      myFriends: [{ id: 1, firstName: 'Peter', lastName: 'Zigray' }],
      skuska: 'null',
      currentIndex: 0,
      friends: '',
      groupCount: '',
      friendCount: '',
      groups: '',
      showDebts: true,
      wasSlideClicked : false,

    };
  }
  

  

  balanceSubmit = (e) => {
    e.preventDefault();

    const { debt, firestore } = this.props;
    const { balanceUpdateAmount } = this.state;
    const clientUpdate = {
      balance: parseFloat(balanceUpdateAmount)
    };

    firestore.update({ collection: "debt", doc: this.state.id }, clientUpdate);
    this.setState({ balanceUpdateAmount: '' })
  }

  onChange = e => this.setState({ [e.target.name]: e.target.value });



  // static getDerivedStateFromProps(props, state) {
  //   console.log('-------------------getDerivedStateFromProps')
//     //const { auth, groups } = props;

//     const { users, debt, auth, onBalanceChange, debtors, debtorsLeft, groups } = this.props;
//     let stateCopy0 = Object.assign({}, this.state);

//     // Arrray with all of my friends but me at the first position
//     var allUsers = JSON.parse(JSON.stringify(users));
//     var friends = allUsers.map(user => user.id === auth.uid && user.friends).filter(arr => arr !== false).flat()

//     // Insert My user at the first position of friends array
//     friends.unshift({ id: auth.uid, email: auth.email, label: 'Me' })


//     var allFriendsWithMe = friends.map((i) => (
//       //   <Link to={`/Dashboard/${i.id}`} >
//       <div className="card-body text-success text-center" key={i.id}>
//         <div className="UserPicsDash d-flex justify-content-center ">
//           <img className="" src="https://demos.creative-tim.com/black-dashboard/assets/img/anime3.png" />
//         </div>
//         <div className="card-body text-center mt-2">
//           <h3 className="">{i.label} {' '} {i.lastName}</h3>
//         </div>
//         < button
//           //onClick={this.showGroupDetail.bind(this, group.id)}
//           className="btn btn-success btn-rounded btn-md btnUserDash align-middle">
//           <h4 className=""> Groups</h4>
//         </button>
//         {/* < button
//                           //onClick={this.showGroupDetail.bind(this, group.id)}
//                           className="btn btn-success btn-sm btn-block btn-icon-split mb-1"
//                         >
//                          friends
//                         </button> */}
//       </div>
//     )
//     )

//  stateCopy0.friends = allFriendsWithMe;
//     // stateCopy0.friendCount = friendCount;
//     stateCopy0.skuska = allFriendsWithMe;
//     return { stateCopy0 }
   
    

    // this.setState(stateCopy0)

    // Used here because for whatever reason it was not able to load groups in componentDidMount
    // if (groups) {
    //  console.log('-----------1--------groups')
    //   var groupCounter = groups.map((group) => group.members.filter(member => member.id === auth.uid))
    //   return  {groupCount : [].concat.apply([], [...groupCounter]).length}
    // } 

    // if (auth.uid) {
    //   return { isAuthenticated: true };
    // } else {
    //   return { isAuthenticated: false };
    // }
  //}

// shouldComponentUpdate () {
//   console.log('yeezzzz')
// }


  showGroupDetail = () =>{
    this.setState({ showDebts: !this.state.showDebts})
    
  }
  //Delete Client
  onDeleteClick = (id) => {
    const { firestore } = this.props;
    firestore
      .delete({ collection: 'debt', doc: id })
    // .then(history.push('/'))
  }

  //open setup to picked loan
  settleUpLoan = (id) => {
    console.log(id)
    this.setState({ showSettleLoan: true, id: id })
    window.scrollTo({
      top: 440,
      behavior: "smooth"
    });
  }

  onMessageInputChnge = (e) => {
    e.preventDefault();
    console.log('prislo to sem')

    var stateCopy = Object.assign({}, this.state);

    var progress = this.refs.progress;
    var pathLenght = progress.getAttribute('r') * 2 * Math.PI;

    var totalLength = 130;
    var actualCounter = totalLength - e.target.value.length;
    var per = e.target.value.length / totalLength;
    var newOffset = pathLenght - (pathLenght * per);

    if (actualCounter >= 65) {
      stateCopy.class = 'progress'
    }
    if (actualCounter < 65) {
      stateCopy.class = 'warning'
    }
    if (actualCounter <= 25) {
      stateCopy.class = 'danger'
    }


    if (actualCounter > 0) {
      progress.style.strokeDashoffset = newOffset + 'px'
    }
    progress.style.strokeDasharray = pathLenght + 'px'

    if (actualCounter >= 0) {
      stateCopy.classNumber = 'black'
    } else {
      stateCopy.classNumber = 'red'
    }
    stateCopy.number = actualCounter;

    this.setState(stateCopy);
  //  console.log(pathLenght - e.target.value.length)
  }
  // clickOnCard = (w) => {
  //   console.log(w.id)
  //   return (<Link to={`/Friends/${w.id}`} />)
    
  
  // }
  thumbItem = (item, i) => (
    <span key={item} onClick={() => this.Carousel.slideTo(i)}>* </span>
  )
  // UNSAFE_componentWillMount() {
  //   const { users, debt, auth, onBalanceChange, debtors, debtorsLeft, groups } = this.props;
  //   console.log('componentwill mount')
  //   this.setState({groups: groups})
  //   if(groups){
  //     console.log(groups)
  //   }
 
  //}
  componentWillUnmount () {
    console.log('--------------componentWillUnmount')
 
  }
  // shouldComponentUpdate(){
  //   console.log('--------------shouldComponentUpdate')
  // }
  
  componentWillUpdate(){
    console.log('---------------componentWillUpdate')
  }
  componentDidUpdate(prevProps, prevState) {
    console.log('---------------------componentDidUpdate')
   
    


    
    
  }
  componentDidMount(){
    console.log('-------------------componentDidMount')
    const { users, debt, auth, onBalanceChange, debtors, debtorsLeft, groups,   } = this.props;
    var stateCopy0 = Object.assign({}, this.state);

    // FIND ALL FRIENDS FOR CARD BUT IF THERE IS NO ONE RETURN JUST ME, OTHERWISE APP WILL BE CRUSH DOWN
    var friends0 = getFriendsForCard(users, auth.uid).filter(function (el) {
      return el != null;
    });
    console.log('=======================ffffirends=================*****')
    

   
    

    // const newKeys = { label: "firstName" };
    // const friends = renameKeys(friends1, newKeys);


    // if (!wasClicked){
  
      var friends = getMyFriends(users, friends0)
      var allFriendsWithMe = friends.map((i) => (
        //   <Link to={`/Dashboard/${i.id}`} >
        <div className="card-body text-success text-center" key={i.id}>
          <div className="UserPicsDash d-flex justify-content-center ">
            <img className="" src="https://demos.creative-tim.com/black-dashboard/assets/img/anime3.png" />
          </div>
          <div className="card-body text-center mt-2">
            <h3 className="">{i.firstName} {' '} {i.lastName}</h3>
          </div>


        </div>
      )
      )
 
    
  

    // if (groups) {
    //   var group01 = getGroupsCount(groups, auth.uid)
    // }
    if (users) {
      var friendCount = getFriendsCount(users, auth.uid)
    }
    // hardcoded because from init, it has problem to load group data from firebase
    stateCopy0.groupCount = 2;
    stateCopy0.friendCount = friendCount;
    stateCopy0.skuska = allFriendsWithMe;
    stateCopy0.friends = allFriendsWithMe;
    stateCopy0.wasSlideClicked = true;
    this.setState(stateCopy0)
  // }
   
  }

  clickedFriend = (currentClickedId, g) => {
    // console.log('-----parent-----')
    // console.log(currentClickedId)
    // console.log(g)


    // const { users, debt, auth } = this.props;
    // let stateCopy123 = Object.assign({}, this.state);
    // var debtLeft = JSON.parse(JSON.stringify(debt));

    // //-----------------------------------------------------left side
    // // STORE ALL RETURNED DEBTORS WITHOUT ME
    // var personsIoweTo = listOfUsersIOwe(debtLeft, users, currentClickedId);
    // // STORE ALL DEBTORS FOR LEFT SIDE
    // var debtorsLeft = getLeftDebtors(personsIoweTo).filter((object) => object !== null)

    // console.log('---------------------clicked')
    // console.log(debtLeft)

    // //-----------------------------------------------------right side
    // var arrOfUsersWhoOweMe = listOfUsersWhoOweMe([...debt], currentClickedId);
    // var debtors = getRightDebtors(arrOfUsersWhoOweMe)




  //   // stateCopy123.clickedGroup = g
  //   stateCopy123.debtorsLeft = debtorsLeft
  //   stateCopy123.debtorsRight = debtors

  //  // stateCopy123.friendHasBeenClicked = true
  //   this.setState(stateCopy123)


  }

  
  slideNext = () =>{ 

    const { users, debt, auth ,onBalanceChange, debtors, debtorsLeft, clickedFriend, groups} = this.props;
    let stateCopy1 = Object.assign({}, this.state);

    stateCopy1.wasSlideClicked = true;

    if(stateCopy1.currentIndex === (this.state.friends.length - 1)){
      stateCopy1.currentIndex = this.state.currentIndex + 0
    } else {
      stateCopy1.currentIndex = this.state.currentIndex + 1
    }

  
    console.log('sem to doslo prve')
    const { key } = stateCopy1.friends[stateCopy1.currentIndex];
    
    // console.log(this.state.friends)
    // console.log(this.state.friends.length)
    // console.log(stateCopy1.currentIndex)
    // console.log(this.state.friends[stateCopy1.currentIndex])
    // group counter

    if (groups) {
      var groupsCountAfter = getGroupsCount(groups, key)
    }
    if (users) {
      var friendCountAfter = getFriendsCount(users, key)
    }

    stateCopy1.groupCount = groupsCountAfter.length
    stateCopy1.friendCount = friendCountAfter

    //SEND TO PARENT WHICH USER SHOULD BE DISPALYED
   var nn = clickedFriend(key, groupsCountAfter)
   
    this.setState(stateCopy1)
}
  slidePrev = () => {
    const { users, debt, auth ,onBalanceChange, debtors, debtorsLeft, clickedFriend, groups} = this.props;
    let stateCopy2 = Object.assign({}, this.state);
    if(this.state.currentIndex === 0){
      stateCopy2.currentIndex = this.state.currentIndex - 0
    } else {
      stateCopy2.currentIndex = this.state.currentIndex - 1
    }
    console.log('preview')
    
   
    // console.log(stateCopy2.currentIndex)
    // console.log(this.state.friends[stateCopy2.currentIndex])
    const { key } = stateCopy2.friends[stateCopy2.currentIndex];

    if (groups) {
      var groupsCountPrev = getGroupsCount(groups, key)
    }
    if (users) {
      var friendCountPrev = getFriendsCount(users, key)
    }

    stateCopy2.groupCount = groupsCountPrev.length
    stateCopy2.friendCount = friendCountPrev
  
    //SEND TO PARENT WHICH USER SHOULD BE DISPALYED
   // clickedFriend(key, groupsCountPrev)

    stateCopy2.wasSlideClicked = true
    this.setState(stateCopy2)
  }





  onSlideChanged = (e) => this.setState({ currentIndex: e.item })
  render() {
    console.log('--------Dashboard-----------render')
  
    const { users, debt, auth, onBalanceChange, debtors, debtorsLeft, currentGroup} = this.props;
    // console.log(debtors)
    // console.log(debtorsLeft)
    // Arrray with all of my friends but me at the first position
    var allUsers = JSON.parse(JSON.stringify(users));
   
    // console.log(this.state.friends)
    // SETTING GROUP COUNTER
    // if (!this.state.groupCount)
    // if (groups) {
    //   console.log('-------------------groups')
    //   var groupCounter = groups.map((group) => group.members.filter(member => member.id === auth.uid))
    //   this.setState({ groupCount: [].concat.apply([], [...groupCounter]).length })
    // }
    
    
    // if there is NoOne disable buttons
    //


  //   if (debtors.length < 1 && debtorsLeft < 1) {
  //     return (
  //       <div className="mt-5 ml-5">
  //         <h3>You dont have any Friends to share the debt with</h3>
  //         <h4>plese click on button bellow and add some</h4>
  //         <Link to="/client/Friends" className="nav-link">
  //           <button type="button"
  //             className='btn btn-primary btn-sm '
  //             >
  //               Add Friends
  //             </button>
  //             </Link>
  //       </div>
  //     )
      
  //   } 

  //  // else if (debt && users) {
  //   else 
  if (users) {
      var myName = users.filter(user => {
        if (user.id === auth.uid) {
          return user
        }
      })[0]
      const { firstName, lastName } = myName;

      return (
        <div className="row h-100">
          <div className="col-md-4 pt-2">
          <div className="row h-100">

          <div className="col-md-2 ">
                <div className="" style={{"padding-top": "15rem"}}>
                  <button
                    type="button"
                    className='btn btn-primary btn-sm '
                    aria-disabled="true"
                    onClick={() => this.slidePrev()}>{"<"}
                  </button>
              </div>
          </div>
            <div className="col-md-8" style={{"padding": "0"}}>



            <div className="card mb-3 shadow-lg bg-white rounded mt-4 text-center"

style={{ "max-width": "100%" }}>

<div>
<AliceCarousel
  dotsDisabled={true}
  buttonsDisabled={true}
  items={this.state.skuska}
  slideToIndex={this.state.currentIndex}
  ref={(el) => (this.Carousel = el)}
  onSlideChanged={this.onSlideChanged}
/>

                    {this.state.showDebts ?
                      < button
                        onClick={this.showGroupDetail}
                        className="btn btn-success btn-rounded btn-md btnUserDash align-middle">
                        <h4 className="">Groups</h4>
                      </button> :
                      < button
                        onClick={this.showGroupDetail}
                        className="btn btn-success btn-rounded btn-md btnUserDash align-middle">
                        <h4 className="">Debts</h4>
            </button>}

 

</div>

<div className="card-body row mt-4">


<div className="col-4 text-center">
  <h3 >
    {this.state.friendCount}
     </h3>
  <small>
    Friends
     </small>
</div>
<div className="col-4 text-center">
  <h3>
      {this.state.groupCount}
     </h3>
  <small>
    Groups
     </small>
</div>
<div className="col-4 text-center">
  <h3>
    {debtorsLeft.length}
  </h3>
  <small>
    Debts
     </small>
</div>

</div>

</div>

</div>
      <div className="col-md-2">
            <div className="" style={{"padding-top": "15rem"}}>
                <button className='btn btn-primary btn-sm ' 
                        aria-disabled="true" 
                        onClick={() => this.slideNext()}>{">"}
                </button>
            </div> 
      </div> 
            </div>
             
            </div>


          {this.state.friendCount < 1 ?
            <div className="col-md-8">
        <div className="mt-5 ml-5">
          <h3>You dont have any Friends to share the debt with</h3>
          <h4>plese click on button bellow and add some</h4>
          <Link to="/client/Friends" className="nav-link">
            <button type="button"
              className='btn btn-primary btn-sm '
              >
                Add Friends
              </button>
              </Link>
        </div>
        </div>
      : null

    } 
           
            

          {this.state.showDebts && this.state.friendCount >= 1  ?
          
          <React.Fragment>
          <div className="col-md-4">
            <table className="table-borderless" style={{ width: '100%' }}>
              <thead className="thead-inverse">
                <tr >
                  <th className="pb-2">You owed</th>
                  <th />
                </tr>
              </thead>
              <React.Fragment>
                {debtorsLeft.map((w) => (
                    <React.Fragment>
                      <Link to={`/Friends/${w.id}`} >
                        <div className="card in-left mb-1"
                        // onClick={this.clickOnCard.bind(this, w)}
                        style={{cursor: "pointer"}}>
      
                          <ul className="list-group list-group-flush">
                            <li className="list-group-item ">
                              <div class="card-body">
                                <div className="photo mr-2 ">
                                  <img src="https://demos.creative-tim.com/black-dashboard/assets/img/anime3.png" />
                                </div> 
                              {'You owe '}{' '}{w.label}{' '}<span style={{color: 'red'}}>{w.actualDebt}{' '}</span> EUR
                              </div>
                            </li>
                          </ul>
                        </div>
                      </Link>
                    </React.Fragment>                
                    )
                  )
                }
              </React.Fragment>
            </table>
          </div>

          <div className="col-md-4">
            <table className="table-borderless" style={{width: '100%'}}>
              <thead className="thead-inverse">
                <tr>
                  <th className="pb-2" >You are owed</th>
                  <th />
                </tr>
              </thead>
              <React.Fragment>
               
                {debtors.map((w) => (
                  <Link to={`/Friends/${w.id}`} >
                  <React.Fragment>
                      {/* <tbody >
                       <div style={{ 'height': '105px' }}>
                          <tr key={w.id} style={{'line-height': '25px'}}>          
                            <i class="fas fa-user-circle fa-3x clientAvatar" />
                              <td>{w.label}{' '}{'owes you'}{' '}{w.actualDebt}</td>
                              <td>
                                <button
                                  // to={`/client/${client.id}`}
                                  onClick={this.settleUpLoan.bind(this, w.id)}
                                  className="btn btn-outline-primary btn-sm"
                                >
                                <i className="fas fa-arrow-circle-right" />{" "}
                                  View
                              </button>
                            </td>
                          </tr>
                        </div>
                      </tbody> */}

                    <div className="card in-left mb-1">
   
   <ul className="list-group list-group-flush">
     

       <li className="list-group-item ">


         {/* <div className="photo">
           <img src="https://demos.creative-tim.com/black-dashboard/assets/img/anime3.png" />
         </div> 
       {name.label}
       <div class="input-group">
           <input type="text" class="form-control" aria-label="Amount (to the nearest dollar)"/>
           <div class="input-group-append">
             <span class="input-group-text">$</span>
             <span class="input-group-text">0.00</span>
           </div>
         </div> */}
      

      
         <div class="card-body">

         <div className="photo mr-2">
           <img src="https://demos.creative-tim.com/black-dashboard/assets/img/anime3.png" />
         </div> 
        
            {w.label}{' '}{'owes you'}{' '}<span style={{ color: 'green' }}>{w.actualDebt}{' '}</span>EUR
                                              
         </div>
      

       </li>
       </ul>
   </div>




                  </React.Fragment>
                
                    </Link>))}
               
              </React.Fragment>
            </table>
          </div>
          </React.Fragment>
: null }

          {!this.state.showDebts && this.state.friendCount >= 1   ?
            <div className="col-md-8">
              <table className="table-borderless" style={{ width: '100%' }}>
                <thead className="thead-inverse">
                  <tr >
                    <th className="pb-2">Groups</th>
                    <th />
                  </tr>
                </thead>
                <React.Fragment>

                  {this.state.groupCount !== 0 ?
                    <React.Fragment>
                  {currentGroup.map((group) => (
                    <React.Fragment>
                      <Link to={`/Friends/Group/${group.id}`} >
                        <div className="card in-left mb-1"
                          // onClick={this.clickOnCard.bind(this, w)}
                          style={{ cursor: "pointer" }}>

                          <ul className="list-group list-group-flush">
                            <li className="list-group-item ">
                              <div class="card-body">
                                <div className="photo mr-2 ">
                                  <img src="https://demos.creative-tim.com/black-dashboard/assets/img/anime3.png" />
                                </div>
                                <h3>{group.name}</h3>
                              </div>
                            </li>
                          </ul>
                        </div>
                      </Link>
                    </React.Fragment>
                    )
                  )
                } 
                    </React.Fragment>
                :
                    <div className="mt-5 ml-5">
                      <h3>Your friend does't have any group yet,</h3>
                      <h4>but do not worry, you can add him one too, {':)'}</h4>
                      <h5>just go to the "Friends" section and create one, if you want to</h5>
                    </div>

              }




                </React.Fragment>
              </table>
            </div>
          : null }

    



          
    </div>
  )
}


    else {
      return (<Spinner />);
    }
  }
}














dashboard.propTypes = {
  firebase: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  settings: PropTypes.object.isRequired,

  firestore: PropTypes.object.isRequired,
  clients: PropTypes.array,
  debt: PropTypes.array,
//  clickedFriend:PropTypes.func
}

export default compose(
  firestoreConnect([{ collection: 'debt' }]),
  firestoreConnect([{ collection: 'groups' }]),
  firestoreConnect([{ collection: 'users' }]),
  


  connect((state, props) => ({
    debt: state.firestore.ordered.debt,
    // clients: state.firestore.ordered.clients,
    groups: state.firestore.ordered.groups,
    auth: state.firebase.auth,
    settings: state.settings,
    users: state.firestore.ordered.users,
   
  })),
  connect((state, props) => ({
    groups: state.firestore.ordered.groups,
    debt: state.firestore.ordered.debt
    

  })),

  // connect(({ firestore: { ordered } }, props) => ({
  //   users: ordered.users && ordered.users[0]
  // }))
  // connect(({ firestore: { ordered } }, props) => ({
  //   client: ordered.client && ordered.client[0]
  // }))
)(dashboard);