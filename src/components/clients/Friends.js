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
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import UserDetails from './UserDetails';



const Table = (property) => {
  var {otherProps} = property;
  var {id} = property.match.params
  var {auth}= property;



  console.log('-----------Doslo to sem----------')
    console.log(property)
  
  if(id !== "null")
  {

 
return (
 <UserDetails otherProps={otherProps} auth={auth} />
)
} 
}


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
    addGroup: false,
    multi: true,
    selectedOption: {},
    friendsList: '',
    actualUsersDebts: [{id: 'null'}],
    valueField: 'id',
    labelField: 'label',

    detailRecordOfFriend: [{ id: 'null', 
                             paidBy: {id: 1, label: 'none'}, 
                             status: {color: 'none', state: 'none'},
                             debt:['none'],
                             debtor:['none'],
                             date:'nonenonenonenoneone'
                             }],
    showClickedRecord: false,
    recordId:'',
    allRecordForRow: ''
  };



 














  // SHOW POP UP FOR ADDING NEW FRIENDS
  addFriends = (e) => {
    e.preventDefault();
    this.setState({addFriends: !this.state.addFriends})
  }
  addGroup = (e) => {
    e.preventDefault();
    this.setState({ addGroup: !this.state.addGroup })
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
    let stateCopyForDetail = Object.assign({}, this.state);




    // // FILTER OUT EMPTY OBJECTS
    // newDebtLeft = newDebtLeft.filter(d => Object.keys(d).length !== 0).filter(debt => debt.paidBy === id)
    // // FILTER DEBT JUST WHERE ACTUAL ID IS PAYER
  
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////DETAIL OF DEBT OF CLICKED USER////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    // COPY OF DEBT
    console.log('----------po tomto pozeram2----------')
    var debt2 = JSON.parse(JSON.stringify(debt));
  
    // RETURN ALL DEBTS WHERE I AM PAYER OR DEBTOR TO CLICKED FRIEND OR CLICKED FRIEND IS PAYER OR DEBTOR WITH ME
    var detailRecordOfFriend = debt2.map(function(d){
      const{id}= d.paidBy
      var res = d.debtTo.map(function(c){
          if (c.id === idecko && id === auth.uid){
            return Object.assign(d, 
              {debt: d.debtTo.map(n => n.id === idecko? n.actualDebt: null).filter(a => a !== null),
                debtor: d.debtTo.map(n => n.id === idecko ? n.id : null).filter(a => a !== null)
              })
         
            
          }  
        if (c.id === auth.uid && id === idecko){
          return Object.assign(d, 
            {
              debt: d.debtTo.map(n => n.id === auth.uid ? n.actualDebt : null).filter(a => a !== null),
            debtor: d.debtTo.map(n => n.id === auth.uid ? n.id : null).filter(a => a !== null)
           })
          
        }
        }
      ).filter(a => a)
        return res
      }
    ).flat()
  
    
    if (detailRecordOfFriend.length < 1){
      stateCopyForDetail.detailRecordOfFriend = [{ id: 'none', 
                             paidBy: {id: 1, label: 'none'}, 
                             status: {color: 'none', state: 'none'},
                             debt:['none'],
                             debtor:['none'],
                             date:'nonenonenonenoneone'
                             }]
      this.setState(stateCopyForDetail)
    } else {
      stateCopyForDetail.detailRecordOfFriend = detailRecordOfFriend
      this.setState(stateCopyForDetail)
    }
    console.log('------toto chcem odsledovat teraz----------')
    console.log(stateCopyForDetail.detailRecordOfFriend)

    
   
  }
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
 

  render() {
    const { selectedOption } = this.state;
    const { users, debt, auth, pathname } = this.props;

    console.log('------------------------FRIENDS---------------------------')
    console.log('----------------------------------------------------------')
  
   
//.match(/(?!.*\/).+/)
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
    console.log('-------------usernames------------------')
    console.log(userNames)
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

  
    var userDetailProps2;
    if (debt && users) {

      console.log('--------------toto je ten parameter--------------------')
      if (pathname) {
        var parameter = pathname.match(/(?!.*\/).+/)[0]
        console.log(parameter)
      

        /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                   //                SAME AS IN THE FUNCTION MERGE LATER
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
console.log('----------po tomto pozeram----------')
          var debt2 = JSON.parse(JSON.stringify(debt));

          // RETURN ALL DEBTS WHERE I AM PAYER OR DEBTOR TO CLICKED FRIEND OR CLICKED FRIEND IS PAYER OR DEBTOR WITH ME
          userDetailProps2 = debt2.map(function(d){
          const{id}= d.paidBy
          var res = d.debtTo.map(function(c){
              if (c.id === parameter && id === auth.uid){
                return Object.assign(d, 
                  {debt: d.debtTo.map(n => n.id === parameter? n.actualDebt: null).filter(a => a !== null),
                    debtor: d.debtTo.map(n => n.id === parameter ? n.id : null).filter(a => a !== null)
                  }
                )    
             }  
            if (c.id === auth.uid && id === parameter){
              return Object.assign(d, 
                {
                  debt: d.debtTo.map(n => n.id === auth.uid ? n.actualDebt : null).filter(a => a !== null),
                debtor: d.debtTo.map(n => n.id === auth.uid ? n.id : null).filter(a => a !== null)
              }
            )  
          }
        }).filter(a => a)
            return res
      }).flat()
    }

console.log(userDetailProps2)
//stateCopyForDetailUser.detailRecordOfFriend = userDetailProps2;

//this.setState(stateCopyForDetailUser)

//this.setState({ detailRecordOfFriend: userDetailProps})

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

console.log('all I need is this')
console.log(this.state.detailRecordOfFriend)
var clickedUserDetailProps = this.state.detailRecordOfFriend


// userDetailProps[0].id === 'null' && userDetailProps[0].id !== 'none' ? userDetailProps2: userDetailProps



   
      return (
        <div className="row">
          <div className="col-md-3">

            <div className="card border-success mb-3" style={{ "max-width":"18rem"}}>
              <div className="card-header bg-transparent border-success">Groups</div>
              <div className="card-body text-success">
                <h5 className="card-title">Add your group</h5>
                <p className="card-text">You haven't added any
                group yet. let's change it {':)'} </p>
              </div>
              <div className="card-footer bg-transparent border-success">
                <button
                  // to={`/client/${client.id}`}
                  onClick={this.addGroup}
                  className="btn btn-success btn-sm btn-block btn-icon-split"
                >
                  <i className="fas fa-plus fa-sm" />{' '}
                  <span className="text">
                    add group
                        </span>
                </button>
              </div>
            </div>


            <div className="card border-primary mb-3" style={{ "max-width": "18rem" }}>
              <div className="card-header bg-transparent border-primary">Your friends</div>
              <div className="card-body text-primary">
                <button
                  // to={`/client/${client.id}`}
                  onClick={this.addFriends}
                  className="btn btn-primary btn-sm btn-block btn-icon-split"
                >
                  
                    <i className="fas fa-plus fa-sm " />{' '}
              
                  <span className="text">
                    Your friends
                        </span>
                </button>
              </div>
              <div className="card-footer bg-transparent border-primary">
                  
                {myFriends.map((friend) => (
                  <React.Fragment>
                    {friend.id && friend.label !== 'none' ?
                      // <tr
                      //   key={friend.id}
                      // >
                        

                          <div className="logo" style={{width: '100%'}}>
                            <div className="photo">
                              <img src="https://demos.creative-tim.com/black-dashboard/assets/img/anime3.png" />
                            </div>
                            <button className="btn btn-primary btn-circle btn-sm">
                              <i class="fas fa-envelope fa-sm"></i>
                            </button>
                            <button className="btn btn-danger btn-circle btn-sm">
                              <i className="fas fa-trash fa-sm" ></i>
                            </button>
                        <Link to={`/Friends/${friend.id}`} >
                            {' '}  <button
                              // to={`/client/${client.id}`}
                              onClick={this.showUserDetail.bind(this, friend.id)}
                              className="btn btn-outline-primary btn-sm btn-block mt-2"
                            >
                              {friend.label}{' '}{friend.lastName} </button></Link>

                              
                           
                          </div>


                        
                      //</tr>

                      : <p>You did't add any friends yet</p>}
                  </React.Fragment>
                ))}


              </div>
            </div>
          </div>


        {/* <Route path="/:id" component={Table} /> */}

        <div className="col-9">

     
         
       
       <Route path="/Friends/:id"            
        render={(props) => <Table {...props}   otherProps = {this.state.detailRecordOfFriend[0].id === 'null' && this.state.detailRecordOfFriend[0].id !== 'none' ? userDetailProps2: clickedUserDetailProps} auth={auth} />}
       />       

            
        
      { !userDetailProps2
       // userDetailProps[0].id === 'null'
         ? 
        <div className="mt-5 ml-5"> 
          <h3>You didn't choose any detail</h3> 
          <h5>Plese click on your friends</h5>
        </div>
      
      :null
      }
             
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            </div>
            
            
          



























          <div className="col-md-3">
            {this.state.addFriends ?
              <div className='popup'>
                <div className='popup_inner'>



                <div className="card" style={{width: "100%", height:'100%'}} >
 
                  <div className="card-body">
                      <h5 className="card-title">Invite friends 
                      <i className="fas fa-backspace fa-sm float-right"
                      onClick={this.addFriends}
                       // onClick={this.setState({ addFriends: !this.state.addFriends  })}
                       >
                      </i>
                    </h5>
                      <p className="card-text"></p>
                  </div>
                      <ul className="list-group list-group-flush">
                      <li className="list-group-item border-0">
                        <Select
                          labelField={this.state.labelField}
                          valueField={this.state.valueField}
                          value={selectedOption}
                          onChange={this.onFriendsListChange}
                          options={userNames}
                          multi={this.state.multi}
                        />
                        </li>
                      <li className="list-group-item border-0">
                          <textarea  className="form-control" name="" id="" cols="30" rows="2"></textarea>
                        </li>
                       
                      </ul>
                    <div className="card-body">
                      <i class="fas fa-envelope fa-2x"></i>{' '}<small className=''>your message will be send as an invitation</small>
                      <button
                        onClick={this.onSubmitFriends}
                        className="btn btn-outline-primary btn-sm ml-5"
                      >Send invites 
                      </button>
                    </div>
                </div>
                </div>
              </div>
              : null
            }
            {this.state.addGroup ?
              <div className='popup'>
                <div className='popup_inner'>



                  <div className="card" style={{ width: "100%", height: '100%' }} >

                    <div className="card-body">
                      <h5 className="card-title">Invite friends to your group
                      <i className="fas fa-backspace fa-sm float-right"
                          onClick={this.addGroup}
                        // onClick={this.setState({ addFriends: !this.state.addFriends  })}
                        >
                        </i>
                      </h5>
                      <p className="card-text"></p>
                    </div>
                    <ul className="list-group list-group-flush">
                      <li className="list-group-item border-0">
                        <Select
                          labelField={this.state.labelField}
                          valueField={this.state.valueField}
                          value={selectedOption}
                          onChange={this.onFriendsListChange}
                          options={userNames}
                          multi={this.state.multi}
                        />
                      </li>
                      <li className="list-group-item border-0">
                        <textarea className="form-control" name="" id="" cols="30" rows="2"></textarea>
                      </li>

                    </ul>
                    <div className="card-body">
                      <i class="fas fa-envelope fa-2x"></i>{' '}<small className=''>your message will be send as an invitation</small>
                      <button
                        onClick={this.onSubmitFriends}
                        className="btn btn-outline-primary btn-sm ml-5"
                      >Send invites
                      </button>
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
  debt: PropTypes.array,
  pathname : PropTypes.string.isRequired
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