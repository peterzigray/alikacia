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
import Select from "react-dropdown-select";


class friends extends Component {
  state = {
    totalOwed: null,
    isAuthenticated: false,
    showSettings: false,
    showSettleLoan: false,
    id: "DrOldEvSJx0mXM5V8KhD",
    balanceUpdateAmount: '',
    class: '',
    classNumber: '',
    style: '',
    addFriends: false,
    multi: true,
    selectedOption: {},
    friendsList: '',
    actualUsersDebts: [{id: 'null'}],

    detailRecordOfFriend: [{ id: 'null', paidBy: {id: 1, label: 'none'}, status: {color: 'none', state: 'none'} }],
    showClickedRecord: false,
    recordId:'',
    allRecordForRow: ''
  };

  // SHOW POP UP FOR ADDING NEW FRIENDS
  addFriends = (e) => {
    e.preventDefault();
    this.setState({addFriends: !this.state.addFriends})
  }

  // SET ALL FRIENDS TO FRIENDSLIST STATE PICKED FROM COMBO BOX
  onFriendsListChange = (selectedOption) => {
    var stateCopy3 = Object.assign({}, this.state);
    stateCopy3.friendsList = selectedOption;
    this.setState(stateCopy3);
    console.log('HAHAHAH')
    console.log(stateCopy3.friendsList)

  }
  onSubmitFriends = (e) => {
    const {
      state,
      props: { firestore, history, users, auth}
    } = this;

    var stateCopy6 = Object.assign({}, this.state);


    if(this.state.friendsList < 1){
      window.alert("Please choose your new friends!")
      // stateCopy6.selectedOption = {};
      // this.setState(stateCopy6)
    }

    // UPDATE MY USER WITH NEW FRIENDS
    var copyofUser = JSON.parse(JSON.stringify(users));
    

    // FILTER MY USER
    var myUserFriends = copyofUser.filter(user => user.id === auth.uid).filter(user => user.id === auth.uid)
    console.log('sadjkkskfksdkjsk')
    console.log(myUserFriends)
      
    if (!('friends' in myUserFriends[0])){
      myUserFriends = [];
    } else {
      myUserFriends = myUserFriends[0].friends.filter(friend => friend)
    }


    // FILTER PICKED USERS FROM MULTICHOICE COMBO BOX
    console.log(this.state.friendsList)
    var newPickedFriends = this.state.friendsList
    
    // MERGE MYUSERSFRIEND WITH FRIENDSLIST
    for(var i in myUserFriends){
      newPickedFriends.push(myUserFriends[i])
    }
    console.log(newPickedFriends)
      
    firestore.collection('users').doc(auth.uid).set({ friends: newPickedFriends }, { merge: true })
    this.setState({ addFriends: !this.state.addFriends })
    
  }

  onRecordClick = (id) => {
    
    const { showClickedRecord } = this.state;
    const { users, debt, auth } = this.props;

    this.setState({showClickedRecord: !showClickedRecord , recordId: id})

    var wholeClickedRecord = debt.filter(d => d.id === id)
    console.log('meno meno meno')
    console.log(wholeClickedRecord)
    this.setState({ allRecordForRow: wholeClickedRecord})

    console.log('---------id clicked----------')
    console.log(id)
  }


  showUserDetail = (idecko) => {
    const { users, debt, auth } = this.props;




    // // FILTER OUT EMPTY OBJECTS
    // newDebtLeft = newDebtLeft.filter(d => Object.keys(d).length !== 0).filter(debt => debt.paidBy === id)
    // // FILTER DEBT JUST WHERE ACTUAL ID IS PAYER
  
    console.log('----------po tomto pozeram----------')
    var debt2 = JSON.parse(JSON.stringify(debt));
  
    var detailRecordOfFriend = debt2.map(function(d){
      const{id}= d.paidBy
      var res = d.debtTo.map(function(c){
          if (c.id === idecko && id === auth.uid || c.id === auth.uid && id === idecko){
            console.log(d)
            return d
          }  
        }
      ).filter(a => a)
        return res
      }
    ).flat()
  
    console.log(detailRecordOfFriend)
  

    this.setState({ detailRecordOfFriend: detailRecordOfFriend})
   
  }

 

  render() {
    const { selectedOption } = this.state;
    const { users, debt, auth } = this.props;

    // COPY OFF REAL USERS
    var copyofU = JSON.parse(JSON.stringify(users));
    var showNonFriends = [];

    // FILTER ALL MY ALREADY PICKED FRIENDS / IF THERE IS NO ONE USER.ID IS SET TO 'NULL' BECAUSE I DONT WANT TO
    // CAUSE CRASH ON FILTER METHOD FORWARD.
    var myFriends = copyofU.map(user => user.id === auth.uid && user.friends).filter(arr => arr !== false).flat()

    if (typeof(myFriends[0]) !== 'undefined'){
      console.log('-------myFriends---------')
      console.log(myFriends)
    } else {
      console.log('-------None---------')
      myFriends = [{label: 'none'}]
    }
    

    // COPYOFUSERS - MYFRIENDS
    for (var i in copyofU){
      var matched = false
      for (var j in myFriends){
        if (copyofU[i].id === myFriends[j].id){
          matched = true
        }
      }
      if(!matched){
        showNonFriends.push(copyofU[i])
      }
    }
    myFriends = myFriends.filter(function (el) {
      return el.id != 'null';
    })
    console.log('--nonfriends---')
    console.log(showNonFriends)
    // IN CASE YOU DONT HAVE ANY FRIENDS PUSH ID NULL FOR MESSAGE RENDERING IN RETURN
    if (myFriends.length < 1){
      myFriends.push({ id: 'null' })
    }
   
  
    // KEY FOR RENAME ALL FIRSTNAME FOR NON PICKED FRIENDS IN ORTER TO FIT INTO COMBOMOX
    const newKeys = { firstName: "label" };

    // RETURN USERNAMES FOR COMBOBOX (THIS IS RESULT WHAT IS SHOWN IN THE SCREEN)
    const userNames = renameKeys(showNonFriends, newKeys);

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



    if (debt && users) {

   
      return (
        <div className="row">
          <div className="col-md-4">
            <table className="table table-borderless">
              <thead className="thead-inverse border-bottom">
                <tr>
                  <th>
                    <button
                      // to={`/client/${client.id}`}
                      onClick={this.addFriends}
                      className="btn btn-outline-primary btn-xs"
                    >
                      <i className="fas fa-plus fa-xs" />{' '} Your friends 
                      
                    </button>
                  </th>
                  <th />
                </tr>
                
              </thead>
              <React.Fragment>
                {myFriends.map((friend) => (
                  <React.Fragment>
                    {friend.id && friend.label !== 'none' ?
                      <tbody>
                        <tr
                         key={friend.id}
                         >       
                          <td>   

                            <div className="logo">
                              <div className="photo">
                                <img src="https://demos.creative-tim.com/black-dashboard/assets/img/anime3.png" />
                              </div>
                              {' '}  <button
                                // to={`/client/${client.id}`}
                                onClick={this.showUserDetail.bind(this, friend.id)}
                                className="btn btn-outline-primary btn-sm"
                              >
                                {friend.label}{' '}{friend.lastName}
                              </button>                
                            </div>

                            
                          </td>
                        </tr>
                      </tbody>
                      : <p>You did't add any friends yet</p>}
                  </React.Fragment>
                ))}
              </React.Fragment>
            </table>
          </div>
            <div className="col-md-8 pt-4">


            <table className="table table-borderless mt-5">
              <thead className="thead-inverse border-bottom">
                {/* <tr>
                  <th>Records of your debt with Friends
                    
                  </th>
                  <th />
                </tr> */}

              </thead>
              <React.Fragment>
                {this.state.detailRecordOfFriend.map((w, index) => (
                  
                  <React.Fragment>
                    
                    {this.state.detailRecordOfFriend[0] !== 'null' ?
                      <tbody className='pointer'>

                        <tr
                          key={w.id}
                          // className={(this.state.showLine && this.state.idecko === a.id ? "strikeout" : null)}
                          // onClick={this.onClickHandler.bind(this, a.id)}
                          onClick={this.onRecordClick.bind(this, w.id)}
                        >
                          <div class="card style_prevu_kit ml-0 mt-3" 
                          //onClick={this.onRecordClick}
                          >
                            <th className="row" style={{ padding: '0px 0px 0px 22px' }} >
                              <td className='col-md-2' >
                                <span><i className="fas fa-circle fa-xs"  style={{ color: Object.values(w.status).map(a => a)[0]}}></i></span>
                                   {' '}     {Object.values(w.status).map(a => a)[1]}
                               <span >
                                 

                                 {/* {Object.values(w.paidBy).map(a => a)[1]} */}
                                  
                               </span>
                              </td>
                              <td className='col-md-2' >15 Jun</td>
                              <td className='col-md-2' >{w.description}</td>
                              <td className='col-md-3' >{Object.values(w.paidBy).map(a => a)[1]}{' '}{'EUR'}{' '}{w.balance}</td>
                              <td className='col-md-1' ><i style={{color: 'green'}}className="fas fa-long-arrow-alt-up fa-lg"></i></td>
                            </th>
                          </div>
                        </tr>
                        {this.state.showClickedRecord && this.state.recordId === w.id ?

                          <div>
                          
                          {this.state.allRecordForRow.map(record => (



                            <div className="card text-center ml-0 mt-2" style={{'max-width': '90%'}}>
                              {/* <div class="card-header">
                                Featured
                                    </div> */}
                              <div className="card-body">
                                <div className="col-6">



                                </div>
                                <div className="col-6">
                                  <i class="fas fa-user-circle fa-3x clientAvatar" />
                                  <h5 className="card-title">Peter Zigray</h5>
                                  <p>{record.date} </p>
                                  <p style={{ color: 'red' }}>${record.balance}</p>
                                </div>
                              </div>
                              <div className="card-footer text-muted">
                                2 days ago
                                    </div>

                            </div>


                          )


                          )}




                          </div>



                          : null}
                      </tbody> : <p> pick one of the friends </p>
                    }

                  </React.Fragment>

                ))}
              </React.Fragment>
            </table>

          </div>

          <div className="col-md-3">
            {this.state.addFriends ?
              <div className='popup'>
                <div className='popup_inner'>
                  <div className='row-1 mt-5 ml-3 mr-3'
                    style={{ height: "25%" }}>
                    <i className="fas fa-backspace fa-2x float-right"
                      onClick={this.addFriends}
                    // onClick={this.setState({ addFriends: !this.state.addFriends  })}
                    ></i>
                    <h1>Invite friends</h1>
                  </div>
                  <div className='row ml-3 mr-3'
                    style={{ height: "55%" }}
                  >
                    <h1>asasa</h1>
                    <Select
                      value={selectedOption}
                      onChange={this.onFriendsListChange}
                      options={userNames}
                      multi={this.state.multi}
                    />
                  </div>
                  <div className='row'
                    style={{ height: "25%" }}
                  >
                    <div class="col ml-3">
                      <i class="fas fa-envelope fa-2x"></i>{' '}<small className={' d-none d-lg-block '}>your message will be send as an invitation</small>
                    </div>
                    <div class="col mr-3">
                      <button
                        onClick={this.onSubmitFriends}
                        className="btn btn-outline-primary btn-sm float-right"
                      >Send invites</button>
                    </div>
                  </div>
                </div>
              </div>
              : null
            }
          </div>
        </div>
      )
    }


    else {
      return <Spinner />;
    }
  }
}














friends.propTypes = {
  firebase: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  settings: PropTypes.object.isRequired,

  firestore: PropTypes.object.isRequired,
  clients: PropTypes.array,
  debt: PropTypes.array
}

export default compose(
  firestoreConnect([{ collection: 'debt' }]),
  firestoreConnect([{ collection: 'users' }]),


  connect((state, props) => ({
    debt: state.firestore.ordered.debt,
    // clients: state.firestore.ordered.clients,

    auth: state.firebase.auth,
    settings: state.settings,
    users: state.firestore.ordered.users
  })),
  connect((state, props) => ({
    debt: state.firestore.ordered.debt,

  })),

  // connect(({ firestore: { ordered } }, props) => ({
  //   users: ordered.users && ordered.users[0]
  // }))
  // connect(({ firestore: { ordered } }, props) => ({
  //   client: ordered.client && ordered.client[0]
  // }))
)(friends);