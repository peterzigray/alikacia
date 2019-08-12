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





function getAllRelatedDebtsToMe (debt2,parameter,auth){

          
  console.log('----------po tomto pozeram----------')
  var response;

  // RETURN ALL DEBTS WHERE I AM PAYER OR DEBTOR TO CLICKED FRIEND OR CLICKED FRIEND IS PAYER OR DEBTOR WITH ME
  response = debt2.map(function(d){
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
return response

}

/**
 * 
 * @param {array} property one object od debt
 * @return {array} result of matched id's from users and friends
 */
const Table = (property) => {
  var {otherProps} = property;
  var {id} = property.match.params
  var {auth}= property;
    console.log('-----------Doslo to sem----------')
    console.log(property)
    if(id !== "null") {
      return (<UserDetails otherProps={otherProps} auth={auth} />)
     } 
   }
//-------------------------------------------------------------------------------------------------------------------------->
/**
 * 
 * @param {array} users one object od debt
 * @param {array} friends object mine authorization
 * @return {array} result of matched id's from users and friends
 */
function getMyNonFriends(users,friends){
  var result = [];
  for (var i in users){
      var matched = false
      for (var j in friends){
        if (users[i].id === friends[j].id){
          matched = true
        }
      }
      if(!matched){
        result.push(users[i])
      }
    }
  return result   
}
//-------------------------------------------------------------------------------------------------------------------------->
/**
 * 
 * @param {array} users one object od debt
 * @param {array} friends object mine authorization
 * @return {array} result of matched id's from users and friends
 */
function getAllMyFriends(copyofU, auth){
    var friends = copyofU.map(user => user.id === auth.uid && user.friends).filter(arr => arr !== false).flat()
    if (typeof(friends[0]) !== 'undefined'){
        
        return friends
      } else {   
        
        return friends = [{label: 'none', id: 'null' }]
    }
  }
//-------------------------------------------------------------------------------------------------------------------------->
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
//-------------------------------------------------------------------------------------------------------------------------->



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
    groupList: '',
    groupName: '',

    friendExist: false,
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

  onFriendDelete = (id) => {
    console.log(id)
    const { firestore , auth , users, debt } = this.props;

    var debtForDelete = JSON.parse(JSON.stringify(debt));
    var respons = getAllRelatedDebtsToMe (debtForDelete,id,auth)
    console.log(respons)
    if(respons.length > 0){
      window.alert("Unfortunately, you can't delete this user, because you have mutual debt")
    } else {

      var usersForDelete = JSON.parse(JSON.stringify(users));
      var myFriendsForDelete = getAllMyFriends(usersForDelete, auth)
  
      
      var newFriendsList = myFriendsForDelete.filter((friend) => friend.id !== id)
  
      var pathFirestore = firestore.collection('users').doc(auth.uid);
  
      if (newFriendsList && newFriendsList.length !== 0){
        
        // Remove the 'capital' field from the document
        pathFirestore.update({
          friends: newFriendsList
        });
      } else {
        pathFirestore.update({
          friends: newFriendsList
        });
        pathFirestore.update({
          friends: firestore.FieldValue.delete()
        });
      }
    }
    
    // if (friendsForGruop[0].label === 'none'){
    //   window.alert("you must first add at least one firend :)")
    // }

   

    // firestore
    //   .delete({ collection: 'users', doc: auth.uid })
  }
  //-------------------------------------------------------------------------------------------------------------------------->

  addGroup = (friendsForGruop) => {
    

    //friendsForGruop[0].label === 'none' ? this.setState({ friendExist: false }) : this.setState({ friendExist: true })

    console.log('ako to je mozne')
    console.log(friendsForGruop)
  
    if (!this.state.addGroup ){
      //friendsForGruop[0].label === 'none' ? this.setState({ friendExist: false }) : this.setState({ friendExist: true })
      if (friendsForGruop[0].label === 'none'){
            window.alert("you must first add at least one firend :)")
        } else {
            this.setState({ addGroup: !this.state.addGroup })
      }
    } else {
      this.setState({ addGroup: !this.state.addGroup })
    }
   
    
  }
  //-------------------------------------------------------------------------------------------------------------------------->
  
  // SET ALL FRIENDS TO FRIENDSLIST STATE PICKED FROM COMBO BOX
  onFriendsListChange = (selectedOption) => {
    var stateCopyFriends = Object.assign({}, this.state);
    stateCopyFriends.friendsList = selectedOption;
    this.setState(stateCopyFriends);
    console.log('HAHAHAH')
    console.log(stateCopyFriends.friendsList)
  }
  //-------------------------------------------------------------------------------------------------------------------------->
  // SET ALL FRIENDS FOR GROUP
  onGroupFriendsChange = (e) => {
    var stateCopyGroupFriends = Object.assign({}, this.state);
    stateCopyGroupFriends.groupList = e;
    this.setState(stateCopyGroupFriends);
  }
  //-------------------------------------------------------------------------------------------------------------------------->
  // SET NAME OF THE GROUP 
  onGroupNameChange = (e) => {
  var stateCopyGroupName = Object.assign({}, this.state);
  stateCopyGroupName.groupName = e.target.value;
  this.setState(stateCopyGroupName);  
}
  //-------------------------------------------------------------------------------------------------------------------------->
  // SUBMIT PICKED FRIENDS
  onSubmitFriends = (e) => {
    const {
      state,
      props: { firestore, history, users, auth}
    } = this;
 
    //var stateCopy6 = Object.assign({}, this.state);
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
    for(var i in myUserFriends) {
      newPickedFriends.push(myUserFriends[i])
    }
    console.log(newPickedFriends)
      
    firestore.collection('users').doc(auth.uid).set({ friends: newPickedFriends }, { merge: true })
    this.setState({ addFriends: !this.state.addFriends })
    
  }

  onSubmitGroups = (e) => {
    const {
      state,
      props: { firestore, history, users, auth}
    } = this;
    
    console.log(' group submitted')
    var groupList = JSON.parse(JSON.stringify(this.state.groupList));
    var myUser = users.filter(user => user.id === auth.uid).filter(user => user.id === auth.uid)

    // KEY DECLARATION FOR RENAME ALL FIRSTNAME FOR NONFRIENDS IN ORTER TO FIT INTO COMBOMOX
    const newKeys = { label: "firstName" };

    // RETURN RENAMED USER NAMES KEYS: LABEL INSTEAD OF NAME (IN ORDER TO WORK WITH COMBOBOX FOR SHOWING USERS AS MY NONFRIENDS)
    const group = renameKeys(groupList, newKeys);

    //console.log(Object.assign({}, { name: this.state.groupName, members: myUser.concat(group)} ))
    //Array.prototype.push.apply(myUser, ); 
    // var stateCopy6 = Object.assign({}, this.state);
    if(this.state.groupName.length < 1 || this.state.groupList.length < 1) {
      window.alert("Please fill everything :)")
      // stateCopy6.selectedOption = {};
      // this.setState(stateCopy6)
    }
    

    // UPDATE MY USER WITH NEW FRIENDS
    // var copyofUser = JSON.parse(JSON.stringify(users));
    

    // // FILTER MY USER
    // var myUserFriends = copyofUser.filter(user => user.id === auth.uid).filter(user => user.id === auth.uid)
    // console.log('sadjkkskfksdkjsk')
    // console.log(myUserFriends)
      
    // if (!('friends' in myUserFriends[0])){
    //   myUserFriends = [];
    // } else {
    //   myUserFriends = myUserFriends[0].friends.filter(friend => friend)
    // }


    // // FILTER PICKED USERS FROM MULTICHOICE COMBO BOX
    // console.log(this.state.friendsList)
    // var newPickedFriends = this.state.friendsList
    
    // // MERGE MYUSERSFRIEND WITH FRIENDSLIST
    // for(var i in myUserFriends){
    //   newPickedFriends.push(myUserFriends[i])
    // }
    // console.log(newPickedFriends)
      
    // firestore.collection('users').doc(auth.uid).set({ friends: newPickedFriends }, { merge: true })
    // this.setState({ addFriends: !this.state.addFriends })

    //------------------------------------------------------------------------------------------------------
    firestore
      .add({ collection: "groups" }, Object.assign({}, { name: this.state.groupName, members: myUser.concat(group) }))
     // .then(() => history.push("/"));
     //.then(this.setState(nieco))
}
  //-------------------------------------------------------------------------------------------------------------------------->

  
  //-------------------------------------------------------------------------------------------------------------------------->

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
  //-------------------------------------------------------------------------------------------------------------------------->

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
  //-------------------------------------------------------------------------------------------------------------------------->

  render() {
    const { selectedOption } = this.state;
    const { users, debt, auth, pathname, groups } = this.props;

    console.log('------------------------FRIENDS---------------------------')
    console.log('----------------------------------------------------------')
    console.log(groups)
    // COPY OFF REAL USERS AS PREVENT FROM MUTATE 
    var copyofU = JSON.parse(JSON.stringify(users));



    //-------------------------------------------------------------------------------------------------------------------------->
    // RETURN ALL MY FRIENDS AND IF THERE IS NO ONE RETURN {LABEL: NONE} 
    var stateForRender = Object.assign({}, this.state);
    var myFriends =  getAllMyFriends(copyofU, auth)
    console.log('-------myFriends---------')
  
   

    // RETURN ALL MY NONFRIENDS
    var myNonFriends = getMyNonFriends(copyofU,myFriends)
    console.log('--nonfriends---')
    console.log(myNonFriends)
   
    // KEY DECLARATION FOR RENAME ALL FIRSTNAME FOR NONFRIENDS IN ORTER TO FIT INTO COMBOMOX
    const newKeys = { firstName: "label" };

    // RETURN RENAMED USER NAMES KEYS: LABEL INSTEAD OF NAME (IN ORDER TO WORK WITH COMBOBOX FOR SHOWING USERS AS MY NONFRIENDS)
    const userNames = renameKeys(myNonFriends, newKeys);
    console.log('-------------usernames------------------')
    console.log(userNames)
    //-------------------------------------------------------------------------------------------------------------------------->

    const friendsForGruop = renameKeys(myFriends, newKeys);
    console.log('-------------- friends for groups --------------------')
    console.log(friendsForGruop)
  




    
    if (debt && users) {

      console.log('--------------toto je ten parameter--------------------')
      if (pathname) {
        var parameter = pathname.match(/(?!.*\/).+/)[0]
        console.log(parameter)
      

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                   //                SAME AS IN THE FUNCTION MERGE LATER
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
          var debt2 = JSON.parse(JSON.stringify(debt));
          var userDetailProps2 = getAllRelatedDebtsToMe(debt2,parameter,auth)

          
   
      console.log(this.state.detailRecordOfFriend)
  }




var clickedUserDetailProps = this.state.detailRecordOfFriend
//-------------------------------------------------------------------------------------------------------------------------->

      return (
        <div className="row">
          <div className="col-md-3">

            <div className="card mb-3 shadow-lg bg-white rounded" style={{ "max-width":"100%"}}>

            <div className="card-body bg-info cardHeader1">
                <h4 className='text-white'> My groups </h4>
                <h6 clssName="card-subtitle text-white m-b-0 op-5" style={{color: "white", opacity: '0.5'}}> Check your groups here </h6>
              
              </div>
              <h2 className="add-ct-btn">
              <button
                  // to={`/client/${client.id}`}
                  value="groupButton"
                  onClick={this.addGroup.bind(this, friendsForGruop)}
                  className="btn btn-circle btn-lg waves-effect waves-dark btn-primary"
                  style={{opacity: '0.9'}}
                >
                  <i className="fas fa-plus fa-sm" />{' '}
                  
                </button>
                </h2>
            
              <div className="card-body text-success mt-4">

                {groups ? <div>{ groups.map((group) =>
                  (
                    <frameElement>
                    
                  < button
                    // to={`/client/${client.id}`}
                    // value="groupButton"
                    // onClick={this.addGroup.bind(this, friendsForGruop)}
                    className="btn btn-success btn-sm btn-block btn-icon-split mb-1"
                  >
                    {group.name}
                  </button>
                    </frameElement>
                ))} </div>:<div><h5 className="card-title">Add your group</h5>
                  <p className="card-text">You haven't added any
                group yet. let's change it {':)'} </p></div> }
                


              </div>
             
            </div>


            <div className="card shadow-lg bg-white rounded " style={{ "max-width": "100%" }}>
              <div className="card-body bg-info cardHeader">
                <h4 className='text-white'> My contacts </h4>
                <h6 clssName="card-subtitle text-white m-b-0 op-5" style={{color: "white", opacity: '0.5'}}> Check your contact here </h6>
              
              </div>
              <h2 className="add-ct-btn">


                <button
                  // to={`/client/${client.id}`}
                  style={{opacity: '0.9'}}
                  onClick={this.addFriends}
                  className="btn btn-circle btn-lg btn-success waves-effect waves-dark"
                >
                  
                    <i className="fas fa-plus fa-sm " />{' '}
              
                
                </button>




              </h2>
              <div className="card-body bg-transparent border-primary mt-2">
                  
                {myFriends.map((friend) => (
                  <React.Fragment>
                    {friend.id && friend.label !== 'none' ?
                      // <tr
                      //   key={friend.id}
                      // >
                        

                          <div className="logo border-bottom" style={{width: '100%'}}>
                            <div className="photo">
                              <img src="https://demos.creative-tim.com/black-dashboard/assets/img/anime3.png" />
                            </div>
                            <button className="btn btn-primary btn-circle btn-sm">
                              <i class="fas fa-envelope fa-sm"></i>
                            </button>
                            <button 
                          onClick={() => {
                            if (window.confirm("Are you sure you wish to delete this Friend?"))
                              this.onFriendDelete(friend.id)
                          }
                        }
                                className="btn btn-danger btn-circle btn-sm">
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

        <div className="col-7">

     
         
       
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
                          value="iconBack"
                          onClick={this.addGroup}
                        // onClick={this.setState({ addFriends: !this.state.addFriends  })}
                        >
                        </i>
                      </h5>
                      <p className="card-text"></p>
                    </div>
                    
                    <ul className="list-group list-group-flush">
                    <div className="form-group">
                    <label htmlFor="description">Enter Group Name</label>
                    <input
                      type="text"
                      className="form-control"
                      name="description"
                     // value={this.state.description}
                      minLength="2"
                      required
                     onChange={this.onGroupNameChange}
                      // value={this.state.lastName}
                    />
                  </div>
                      <li className="list-group-item border-0">
                        <Select
                          labelField={this.state.labelField}
                          valueField={this.state.valueField}
                          value={selectedOption}
                          onChange={this.onGroupFriendsChange}
                          options={friendsForGruop}
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
                        onClick={this.onSubmitGroups}
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
  groups: PropTypes.array,
  pathname : PropTypes.string.isRequired

}

export default compose(
  firestoreConnect([{ collection: 'debt' }]),
  firestoreConnect([{ collection: 'users' }]),
  firestoreConnect([{ collection: 'groups' }]),


  connect((state, props) => ({
    debt: state.firestore.ordered.debt,
    // clients: state.firestore.ordered.clients,

    auth: state.firebase.auth,
    settings: state.settings,
    users: state.firestore.ordered.users,
    groups: state.firestore.ordered.groups
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