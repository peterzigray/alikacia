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

      for (var i in debt ) {
        newDebtRight.push(giveMePayer(debt[i], users, auth))
        newDebtRight2.push(giveMePayer2(debt[i], auth))
        newDebtLeft.push(giveMePayerForOvrview(debt[i], users))
      }


      function giveMePayer2(debt, auth){
        const {id} = debt.paidBy;
        var result = [];
        
        if(id === auth.uid){
          console.log('preslo')
          if(debt.debtTo.length !== 0){
            debt.debtTo.forEach(d => result.push(d) )
          }
        }
        var finalResult = result.filter((obj) => { return obj.id !== auth.uid}).flat()
        console.log('result')
        console.log(finalResult)
        return finalResult
      }
      
      var allDebtorsmerged = [].concat.apply([], newDebtRight2);
      console.log('toto hladam')
      console.log(allDebtorsmerged)
      
      

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
                {newDebtRight.map((w) => (
                  <React.Fragment>
                      <tbody >
                       <div style={{ 'height': '105px' }}>
                          <tr key={w.id} style={{'line-height': '25px'}}>          
                            <i class="fas fa-user-circle fa-3x clientAvatar" />
                              <td>{w.label}{''}{w.lastName}{''}{'owes you'}{w.actualDebt}</td>
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