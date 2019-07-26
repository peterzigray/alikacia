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
import '../../pics/app.jpg'

//////////////////////////////////RIGHT DEBTORS//////////////////////////////////////////
/**
 * 
 * @param {array} debt array of objects of debts
 * @param {object} auth object mine authorization
 */
function listOfUsersWhoOweMe(debt,auth){
  var result = [];
  for (var i = 0; i < debt.length; i++) {
    result.push(giveMePayer(debt[i], auth))
  }
  return result
}
/**
 * 
 * @param {object} debt one object od debt
 * @param {object} auth object mine authorization
 */
function giveMePayer(debt, auth){
  const {id} = debt.paidBy;
  var result = [];
  if(id === auth.uid){
    if(debt.debtTo.length !== 0){
      debt.debtTo.forEach(d => result.push(d) )
    }
  }
  var finalResult = result.filter((obj) => { return obj.id !== auth.uid}).flat()
  return finalResult
}
//function giveMePayer(a,b){var c=[];a.paidBy.id===b.uid&&0!==a.debtTo.length&&a.debtTo.forEach(function(a){return c.push(a)});return c.filter(function(a){return a.id!==b.uid}).flat()};
/////////////////////////////////////////////////////////////////////////////////////////


//////////////////////////////////LEFT DEBTORS//////////////////////////////////////////

// function listOfUsersIOwe(debt,newDebtRight,auth){
//   for (var i = 0; i < debt.length; i++) {
//       newDebtLeft.push(giveMePayerForOvrview(debt[i], users))
//   }
//   return newDebtRight
// }
/////////////////////////////////////////////////////////////////////////////////////////

class dashboard extends Component {
  state = {
    totalOwed: null,
    isAuthenticated: false,
    showSettings: false,
    showSettleLoan: false,
    id: "DrOldEvSJx0mXM5V8KhD",
    balanceUpdateAmount: '',
    class: '',
    classNumber: '',
    style: ''
  };


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

  static getDerivedStateFromProps(props, state) {
    const { auth } = props;
    if (auth.uid) {
      return { isAuthenticated: true };
    } else {
      return { isAuthenticated: false };
    }
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


  render() {

    const { users, debt, auth } = this.props;

    if (debt && users) {
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//******************************ALL ABOUT DEBTORS DISPLAYED ON RIGHT SIDE OF THE SCREEN OF DASHBOARD************************************** */
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

      // STORE ALL RETURNED DEBTORS WITHOUT ME
      var newDebtRight = listOfUsersWhoOweMe([...debt], auth);

      // CONCAT ALL ARRAYS OF DEBTORS INTO ONE AND GET RID OF INNER ARRAYS SO RESULT IS --> [{},{},{}]
      var allDebtorsMerged = [].concat.apply([], [...newDebtRight]);
      // CREATE DEEP COPY OF DEBTORS ARRAY (NON MUTABLE)     
      var b = JSON.parse(JSON.stringify(allDebtorsMerged));

      // STORE ALL DUPLICATE RECORDS
      const duplicated = b.filter((ele, indx) => {
          return indx !== b.map(p => p['id']).indexOf(ele['id'])
         }
      )
      // STORE IDECKA OF DUPLICATE RECORDS
      const idecka = duplicated.map(d => d.id)
      
      // FOR FIRST RECORDS WHERE ID === DUPLICATED CHANGE ACTUAL DEBT TO SUM OF ALL RECORDS WHERE ID === PARTICULAR DUPLICATED ID
      for (var j = 0; j < idecka.length; j++) {
           gimmeSum(b, idecka[j])
      }
     
        function gimmeSum(ar, idecko) {
          var number = ar.filter(({ id }) => id === idecko).reduce((sum, record) => sum + Number(record.actualDebt), 0)
          // CHANGE ACTUAL DEBT UNDER ONE NAME    
           ar.filter(obj => obj.id === idecko ? Object.assign(obj, { actualDebt: number }) : null)
        }
        
      // STORE ALL DEBTORS WHERE DUPLICATED RECORD HAS BEEN FILTERED AND ONLY RECORD WHERE ACTUAL DEBT HAS BEEN STORED AS SUM OFF ALL RECORD REMAIN
      const debtors = b.filter((pilot, index, array) => {return array.map(a => a['id']).indexOf(pilot['id']) === index})
        
      console.log('----debtors of the right side-----') 
      console.log(debtors)    

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//******************************ALL ABOUT DEBTORS DISPLAYED ON LEFT SIDE OF THE SCREEN OF DASHBOARD************************************** */
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
     
     // STORE ALL RETURNED DEBTORS WITHOUT ME
     var debtLeft = JSON.parse(JSON.stringify(debt));

     var newDebtLeft  = listOfUsersIOwe(debtLeft,auth);

     var allMyDebtsMerged = [].concat.apply([], [...newDebtLeft]);
     console.log('--newDebtLeft---')
      console.log(allMyDebtsMerged)



    function listOfUsersIOwe(debt,auth){
      var result = [];

  for (var i = 0; i < debt.length; i++) {
    result.push(giveMePayerForOvrview(debt[i], users))
  }
  return result
}

     
      // ASSIGN PAYER AND ACTUALDEBT TO EXIST DEBT BASED ON WHO I OWE TO 
      function giveMePayerForOvrview(debt, users) {
        const {id} = debt.paidBy;
        var res = [];
        debt.debtTo.forEach((d) => {
   
              if(d.id === auth.uid && id !== auth.uid){
                console.log('wwwwwwwwwwwwwresultwwwwwwwwwwwwwwww')
                // console.log(debt.paidBy)
                res.push(Object.assign(debt.paidBy,{actualDebt: d.actualDebt}) )
              }
          
            }
            
          )
          console.log(res)
          return res
      //   let result = {}
      //   var haveDebtWithPayer = false;
      //   var value;
      // // SEARCH EVERY DEBT AND RETURN MY USER
      //   debt.debtTo.forEach(d =>{
      //     if(d.id === auth.uid){
      //       haveDebtWithPayer = true;
      //       value = d.actualDebt
      //     }
      //   }
      // )
      
      //   users.forEach(user => {
      //     if (debt.paidBy === user.id && debt.paidBy !== auth.uid && haveDebtWithPayer) {
      //       Object.assign(result, debt, { payer: user.firstName + " " + user.lastName, actualDebt: value ? value: debt.balance })
      //     }
      //   }
      // )
    //   console.log('wwwwwwwwwwwwwresultwwwwwwwwwwwwwwww')
    // console.log(result)
    //     return result
    }
    

      
    //   // FILTER OUT EMPTY OBJECTS
    //   newDebtLeft = newDebtLeft.filter(d => Object.keys(d).length !== 0)
  
    //   var output = [];

    //   //MERGE ALL OBJECT INTO ONE BESED ON WHO PAYD THE BILL
    //   newDebtLeft.forEach(function (item) {
    //     var existing = output.filter(function (v) {
    //       return v.paidBy === item.paidBy;
    //     });
    //     if (existing.length) {
    //       var existingIndex = output.indexOf(existing[0]);
    //       var actualDebt = parseInt(output[existingIndex].actualDebt) + parseInt(item.actualDebt)
    //       output[existingIndex].actualDebt = actualDebt
    //     } else {
    //       if (typeof item.actualDebt == 'string')
    //         item.actualDebt = [item.actualDebt];
    //       output.push(item);
    //     }
    //   });
    //   console.log('ooooooooooooooooooutputoooooooooooooooooooo')
    //   console.log(output)

      


      newDebtRight = newDebtRight.filter((d) => { return d.id !== auth.uid && Object.keys(d).length !== 0 }).flat()

      return (
        <div className="row h-100">
          <div className="col-md-6">
          <table className="table-borderless">
              <thead className="thead-inverse">
                <tr>
                  <th>You are owed</th>
                  <th />
                </tr>
              </thead>
              <React.Fragment>
                {allMyDebtsMerged.map((w) => (
                  <React.Fragment>
           

                      <div className="card in-left">
   
   <ul className="list-group list-group-flush">
     

       <li className="list-group-item ">

      

      
         <div class="card-body">

         <div className="photo">
           <img src="https://demos.creative-tim.com/black-dashboard/assets/img/anime3.png" />
         </div> 
         
         {'You owe '}{' '}{w.label}<p style={{color: 'red'}}>{w.actualDebt}</p>

         </div>
      

       </li>
       </ul>
   </div>




                  </React.Fragment>
                ))}
              </React.Fragment>
            </table>
          </div>


          <div className="col-md-6">
            <table className="table-borderless">
              <thead className="thead-inverse">
                <tr>
                  <th>You are owed</th>
                  <th />
                </tr>
              </thead>
              <React.Fragment>
                {debtors.map((w) => (
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

                      <div className="card in-left">
   
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

         <div className="photo">
           <img src="https://demos.creative-tim.com/black-dashboard/assets/img/anime3.png" />
         </div> 
         {w.label}
         {'owes you'}{' '}<p style={{color: 'green'}}>{w.actualDebt}</p>

         </div>
      

       </li>
       </ul>
   </div>




                  </React.Fragment>
                ))}
              </React.Fragment>
            </table>
          </div>










          
    </div>
  )
}


    else {
      return <Spinner />;
    }
  }
}














dashboard.propTypes = {
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
)(dashboard);