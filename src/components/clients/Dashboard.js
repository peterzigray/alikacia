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


function giveMePayer(debt, users, auth) {

  let result = []
  var isDebtor = true;
  users.forEach(user => {
    if (debt.paidBy === user.id && debt.paidBy === auth.uid) {
      result.push(debt.debtTo)
    }
  }
  )
  console.log('oaaaaaaaaaaaaaaa')
  console.log(result)
  return result.flat()

}


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
    
      var newDebtRight2 = [],newDebtRight =[],newDebtLeft = [];

      function giveMeallPayers(debt, newDebtRight2){
        for (var i = 0; i < debt.length; i++) {
          //  newDebtRight.push(giveMePayer(debt[i], users, auth))
          newDebtRight2.push(giveMePayer2(debt[i], auth))
          //   newDebtLeft.push(giveMePayerForOvrview(debt[i], users))
        }
        return newDebtRight2
      }

      giveMeallPayers([...debt], newDebtRight2);


      function giveMePayer2(debt, auth){
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

      console.log(newDebtRight2)
      // merge all arrays with debtors into one array
      var allDebtorsMerged = [].concat.apply([], [...newDebtRight2]);
      console.log('toto hladam')
      
      console.log(allDebtorsMerged)

  
      console.log('toto som ja ' + ' ' + auth.uid)
      // SUM ALL NUMBERS WHERE ID IS SAME
      // console.log(allDebtorsMerged.filter(({id}) => id === "nXw3jJbQSfZy7WML3T19ksthRvg1")
      // .reduce((sum, record) => sum + Number(record.actualDebt), 0))

      ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //   var pilots = [
    //    {actualDebt: "20", id: "8opyA98quZTWchrkkOOa3lzksUz1", label: "Nat"}
    //   ,{actualDebt: "9", id: "nXw3jJbQSfZy7WML3T19ksthRvg1", label: "Jur"}
    //   ,{actualDebt: "20", id: "z6PVhKeR1TMGLjGWJQkPHx5RmRT2", label: "Mi"}
    //   ,{actualDebt: "1", id: "iR9zALQNqMfo3gl6aRWT2U3C05P2", label: "Pet"}
    //   ,{actualDebt: "1", id: "nXw3jJbQSfZy7WML3T19ksthRvg1", label: "Jur"}
    //   ,{actualDebt: "1", id: "z6PVhKeR1TMGLjGWJQkPHx5RmRT2", label: "Mi"}
    //   ]

    //   // GIVE ME DUPLICATED RECORDS
    //   const duplicated = pilots.filter((ele,indx) => {
		// 		return indx!==pilots.map(p => p['id']).indexOf(ele['id'])
		//     }
	  //  )
    //   console.log(duplicated.map(d => d.id))

    //    // SUM ALL ACTUALDEBTS INTO ONE FOR CUSTOMER 
    //   const number = pilots.filter(({id}) => id === "nXw3jJbQSfZy7WML3T19ksthRvg1")
    //                   .reduce((sum, record) => sum + Number(record.actualDebt), 0)
    //   // CHANGE ACTUAL DEBT UNDER ONE NAME              
    //   pilots.map(pilot => pilot.id === "nXw3jJbQSfZy7WML3T19ksthRvg1" ? Object.assign(pilot, {actualDebt: number}): null)
    //   console.log(pilots)

    //   // FILTER ALL DOUBLED RECORDS AND REMIND FIRST ONE WITH ACTUALDEBT FROM ALL NONUNIQUE RECORDS
    //   const allDebtors = pilots.filter((pilot,index,array)=>{
    //     //console.log(array.map(a => a['id']).indexOf(pilot['id'])=== index)
    //     return array.map(a => a['id']).indexOf(pilot['id']) === index
    //   })
    //     console.log(allDebtors)

////////////////////////////////////////////////////////////////////////////////////////////////FUNGUJE/////////////////////////////////////////////////////////////////


// var pilots = [{actualDebt: "20", id: "8opyA98quZTWchrkkOOa3lzksUz1", label: "Nat"}
//       ,{actualDebt: "9", id: "nXw3jJbQSfZy7WML3T19ksthRvg1", label: "Jur"}
//       ,{actualDebt: "20", id: "z6PVhKeR1TMGLjGWJQkPHx5RmRT2", label: "Mi"}
      
//       ,{actualDebt: "1", id: "nXw3jJbQSfZy7WML3T19ksthRvg1", label: "Jur"}
// 	  ,{actualDebt: "1", id: "iR9zALQNqMfo3gl6aRWT2U3C05P2", label: "Pet"}
//       ,{actualDebt: "1", id: "z6PVhKeR1TMGLjGWJQkPHx5RmRT2", label: "Mi"}
//       ]
    
       // filter only nonUnique id
       //const b = [];
     
        var b = JSON.parse(JSON.stringify(allDebtorsMerged));
        //var b = [].concat(allDebtorsMerged);
        console.log('toto je b')
        console.log(allDebtorsMerged)
        console.log(b)
        const duplicated = b.filter((ele, indx) => {
          return indx !== b.map(p => p['id']).indexOf(ele['id'])
        }
        )
        const idecka = duplicated.map(d => d.id)

 
      
        for (var j = 0; j < idecka.length; j++) {
            gimmeSum(b, idecka[j])
        }
     
        function gimmeSum(ar, idecko) {
          var number = ar.filter(({ id }) => id === idecko).reduce((sum, record) => sum + Number(record.actualDebt), 0)
          console.log(number)
          // CHANGE ACTUAL DEBT UNDER ONE NAME    
            return ar.filter(obj => obj.id === idecko ? Object.assign(obj, { actualDebt: number }) : null)
        }
       
        const debtors = b.filter((pilot, index, array) => {
          //console.log(array.map(a => a['id']).indexOf(pilot['id'])=== index)
          return array.map(a => a['id']).indexOf(pilot['id']) === index
        })
        console.log('vysledok')
        console.log(debtors)
      
     
       
    //  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////










      


      // ASSIGN PAYER AND ACTUALDEBT TO EXIST DEBT BASED ON WHO I OWE TO 
      function giveMePayerForOvrview(debt, users) {
        let result = {}
        var haveDebtWithPayer = false;
        var value;
      // SEARCH EVERY DEBT AND RETURN MY USER
        debt.debtTo.forEach(d =>{
          if(d.id === auth.uid){
            haveDebtWithPayer = true;
            value = d.actualDebt
          }
        }
      )
      
        users.forEach(user => {
          if (debt.paidBy === user.id && debt.paidBy !== auth.uid && haveDebtWithPayer) {
            Object.assign(result, debt, { payer: user.firstName + " " + user.lastName, actualDebt: value ? value: debt.balance })
          }
        }
      )
      console.log('wwwwwwwwwwwwwresultwwwwwwwwwwwwwwww')
    console.log(result)
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
      console.log('ooooooooooooooooooutputoooooooooooooooooooo')
      console.log(output)

      


      newDebtRight = newDebtRight.filter((d) => { return d.id !== auth.uid && Object.keys(d).length !== 0 }).flat()

      return (
        <div className="row h-100">
          <div className="col-md-6">
            <table className="table-borderless table-hover">
              <thead className="thead-inverse">

                <tr>
                  <th>You owe</th>
                  <th />
                </tr>

              </thead>
              <React.Fragment>
                {output.map((d) => (
                  <React.Fragment>
                    {d.payer !== null ?
                      <tbody>
                        <div style={{ 'height': '105px'}}>
                        <tr key={d.id}>
                          
                            <td>
                            <i class="fas fa-user-circle fa-3x clientAvatar" />
                            {d.payer}
                            <p style={{color: 'red'}}>
                                {'you owe'}{' '}{'$'}{d.actualDebt}
                            </p>                      
                            </td>                   
                          <td>
                            {/* <button
                              // to={`/client/${client.id}`}
                              onClick={this.settleUpLoan.bind(this, d.id)}
                              className="btn btn-outline-primary btn-sm"

                            >
                              <i className="fas fa-arrow-circle-right" />{" "}
                              Settle up
                             </button> */}
                          </td>
                        </tr>
                      </div>
                    </tbody>: null}
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
                      <tbody >
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
                      </tbody>
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