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


class clientOverview extends Component {
  state = {
    totalOwed: null,
    isAuthenticated: false,
    showSettings: false,
    showSettleLoan: false,
    idecko: "",
    balanceUpdateAmount: '',
    class: '',
    classNumber: '',
    style: ''
  };

  componentDidMount = () => {
    // let stateCopy = Object.assign({}, this.state);

    // var progress = window.document.getElementsByClassName('progress');
    // var pathLenght = progress[0].getAttribute('r') * 2 * Math.PI;
    // stateCopy.pathLength = pathLenght;
    // stateCopy.number = e.target.value.length;
    // stateCopy.dashoffset = pathLenght - e.target.value.length;
    // this.setState(stateCopy);
    // console.log('toto chcem')
    // console.log(pathLenght)
  }

  // static getDerivedStateFromProps(props, state) {
  //   const { clients } = props;

  //   if (clients) {
  //     //Add balances
  //     const total = clients.reduce((total, client) => {
  //       return total + parseFloat(client.balance.toString());
  //     }, 0);
  //     return { totalOwed: total };
  //   }
  //   return null;
  // }

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
    this.setState({ showSettleLoan: !this.state.showSettleLoan, idecko: id })
    window.scrollTo({
      top: 440,
      behavior: "smooth"
    });

    // const {users } = this.props;
    // const newUser = [...users];
    // const user = newUser.map(user);
    // // ["DrOldEvSJx0mXM5V8KhD", "500", "2 Jun", "nieco@yahoo.com", "Karen", "Smith", "333-333-3333"]
    // console.log(Object.values(user[0]));



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


    // stateCopy.dasharray = pathLenght ;

    // stateCopy.dashoffset = pathLenght - e.target.value.length ;


    this.setState(stateCopy);
    console.log(pathLenght - e.target.value.length)
  }


  render() {
    const { users, debt, auth } = this.props;
    const { totalOwed, cards, showSettings, showSettleLoan, idecko } = this.state;
    // const { auth, isAuthenticated } = this.props;
   
    // // find values for clicked client
    // const newClients = [...clients];
    // const currentClient = newClients.filter(client => client.id === id);
    // // ["DrOldEvSJx0mXM5V8KhD", "500", "2 Jun", "nieco@yahoo.com", "Karen", "Smith", "333-333-3333"]
    // const newId = Object.values(currentClient[0]);
    // var idNew, balanceNew, dateNew, mailNew, name, lastname, nubmer;
    // [idNew,balanceNew,dateNew,mailNew,name,lastname,nubmer] = newId;
    // // Find who has dept
    const finalarray = [];


    // clients.forEach((e1) => debt.forEach((e2) => {
    //   if (e1.id === e2.debtTo) {
    //     finalarray.push(e1.firstName)

    //   }

    // }
    // ))


    // if(debt && users){
    //   debt.forEach((d) => users.forEach((user) => {
    //     for(let i = 0; i < debt.length; i++ ){
    //       if (d.debtTo === user.id) {

    //         Object.assign(debt[i], { name: user.firstName })
    //         // finalarray.push(user.firstName)
    //         console.log(debt[i])
    //       }
    //     }

    //   }))
    // var merged = debt.concat(finalarray);
    // console.log(debt)

  

    // function which remove null from array

    if (debt && users) {

      console.log(auth.uid)
      var newDebt = [];
      for (let i = 0; i < debt.length; i++) {
        newDebt.push(giveMePayer(debt[i], users))
      }



      function giveMePayer(debt, users) {
        let result = {}
        Object.assign(result, debt, { payer: null })
        users.forEach(user => {
          if (debt.paidBy === user.id && debt.paidBy ===  auth.uid) {
            Object.assign(result, debt, { payer: 'You' })
          }
        })
        return result
      }

      var newdebt2 = [];
      for (let i = 0; i < newDebt.length; i++) {
        newdebt2.push(giveMeOwner(newDebt[i], users))
      }
      function giveMeOwner(debt, users) {
        var count = 0;
        let result = {}
        Object.assign(result, debt, { owner: null, actualDebt: null })
        debt.debtTo.forEach((d) => users.forEach((user) => {
          if (d.id === auth.uid) {
            Object.assign(result, debt, { owner: 'you', actualDebt: d.actualDebt })
          }
        }))
        

        return result
      }
      console.log('toto haldam')
      console.log(newdebt2)


      // FIND DEBT REGARDING TO YOUR ID
      // function giveBackYourDebts(d) {
      //   for (let i = 0; i < d.debtTo.length; i++) {
      //     if (d.debtTo[i].id === 'DanQYVZ5beW8rkEgArhe4PSCgij2') {
      //       return d
      //     } else {
      //       return null
      //     }
      //   }
      // }

      // function giveBackYourDebts2(d) {
      //   for (let i = 0; i < d.debtTo.length; i++) {
      //     if (d.debtTo[i].id === 'DanQYVZ5beW8rkEgArhe4PSCgij2') {
      //       return d
      //     } else {
      //       return null
      //     }
      //   }
      // }
      // var relatedDebts = [];
      // [...debt].forEach(d => {
      //   relatedDebts.push(giveBackYourDebts(d))
      // })
      // relatedDebts = relatedDebts.filter(el => el !== null)

      // // return debtor name based on ID
   

      // // RETURN NAME WHERE ID IS MATCHED
      // function returnStringName(relatedDebts, users) {
      //   var result = []
      //   relatedDebts.forEach((d) => users.forEach((client) => {
      //     if (d.paidBy === client.id) {
      //       result.push(Object.assign({}, d, { payer: client.firstName }))
      //     }
      //   }))
      //   return result
      // }
      // var arrDebts = returnStringName(relatedDebts, users)
      // console.log(arrDebts)
      
      // var result = [];
      // arrDebts.forEach(arr => {
      //   result.push(giveBackYourDebts(arr))
      // })
      // result = result.filter(el => el !== null)

   
      // return your name with balance based on ID
      // relatedDebts.forEach((d) => relatedDebts.debtTo.forEach(deb =>

      return (
        <React.Fragment>
          <table className="table table-borderless">
            <tbody >
              <React.Fragment>
                <tr>
                  <div className="card nieco">
                    <th className="row"
                      style={{ 'padding-bottom': '0%'}}
                    >
                            <td className='col-md-2'>Status</td>
                            <td className='col-md-2'>Date</td>
                            <td className='col-md-2'>Description</td>
                            <td className='col-md-2'>Payed</td>
                            <td className='col-md-2'>Amount</td>
                            <td className='col-md-2'></td>
                    </th>
                  </div>
                </tr>
             
                    {newdebt2.map((d) => (
                      <tr key={d.id} >
                        <div class="card style_prevu_kit">
                          <div className="row" style={{ padding: '0px 0px 0px 22px' }}>
                            <td className='col-md-2'>
                              <span><i className="fas fa-circle fa-xs" style={{ color: 'green' }}></i> Complete </span>
                            </td>
                            <td className='col-md-2'>
                              <i class="fas fa-bookmark" />{' '}
                              {d.date}
                              {/* {client.lastName} */}
                            </td>

                            <td className='col-md-2'>
                              {d.description}
                            </td>

                            <td className='col-md-2'>{d.payer}{' '}{'paid'}{' '}{d.balance}
                            </td>

                            <td className='col-md-2'
                              style={{
                                color: 'green',
                                'font-weight': 'bold'
                              }}
                            >{d.balance} EUR
                          </td>

                            <td>
                              <i
                                onClick={() => {
                                  if (window.confirm("Are you sure you wish to delete this item?"))
                                    this.onDeleteClick(d.id)
                                }
                                }
                                style={{ color: 'red' }}
                                className="fas fa-trash-alt">

                              </i>{' '}{' '}
                              <button
                                onClick={this.settleUpLoan.bind(this, d.id)}
                                className="btn btn-outline-primary btn-sm"

                              >
                                <i className="fas fa-arrow-circle-right" />{" "}
                                Settle up
                              </button>
                            </td>
                          </div>
                        </div>
                      



                     <React.Fragment>
                          {showSettleLoan && d.id === this.state.idecko?

                          <div className="card">
                            <h3 className="card-header">
                              {/* Let's wipe out your dept for {name} */}
                            </h3>
                            <div className="card-body">
                              <div className="row">

                                <div className="col-md-8 col-sm-6">
                                  <img style={{ height: '100px' }} src={require("../../pics/piggy.jpg")} />

                                  <h4>
                                    Sum you owed {" "}
                                    <span className="text-secondary">
                                      {/* ${parseFloat(balanceNew).toFixed(2)} */}
                                      <i className="fas fa-pencil-alt"></i>
                                    </span>
                                  </h4>
                                </div>


                              </div>

                              <form onSubmit={this.balanceSubmit}>
                                <div className="input-group">
                                  <input
                                    type="text"
                                    className="form-control"
                                    name="balanceUpdateAmount"
                                    placeholder='Put new sum here'
                                    value={this.state.balanceUpdateAmount}
                                    onChange={this.onChange}



                                  />
                                  <div className="input-group-append">
                                    <input
                                      type="submit"
                                      value="Update"
                                      className="btn btn-outline-dark"


                                    ></input>
                                  </div>
                                </div>
                                <div className="form-group ">




                                  <label for="exampleFormControlTextarea1">Send a message</label>





                                  <div className="card border-dark row">

                                    <textarea
                                      onChange={this.onMessageInputChnge}
                                      className="form-control border-white"
                                      id="exampleFormControlTextarea1"
                                      rows="3">

                                    </textarea>







                                    <svg height='30' width='30' className='svgCircle'>
                                      <circle className='underline'
                                        cx='50%'
                                        cy='50%'
                                        r='10'
                                      />

                                      {/* {this.state.newOffset !== '' ? <circle className='progress'
                          cx='50%'
                          cy='50%'
                          r='10'

                          // style={this.state.style}

                        /> :  */}

                                      <circle
                                        id="progress"
                                        ref="progress"
                                        className={this.state.class}
                                        cx='50%'
                                        cy='50%'
                                        r='10'
                                      />
                                      {/* } */}
                                    </svg>

                                    <div
                                      id="number"
                                      ref="number"
                                      className={this.state.classNumber}>
                                      <p>{this.state.number}</p>
                                    </div>

                                  </div>

                                </div>

                              </form>

                            </div>

                          </div>
                          : null
                        }

                  








 </React.Fragment>
                      </tr>


                      ))}
                </React.Fragment>
                </tbody>
             </table>
</React.Fragment>
      )
    }


    // if (debt && users) {
    //   const array = [];
    //   const arr = [];

    //   debt.forEach((d) => users.forEach((client) => {
    //     if (d.debtTo === client.id) {
    //       array.push(Object.assign({}, d, { debtor: client.firstName }));
    //     }
    //   }))
    //   array.forEach((d) => users.forEach((client) => {
    //     if (d.paidBy === client.id) {
    //       arr.push(Object.assign({}, d, { payer: client.firstName }));
    //     }
    //   }))
  
    // }


    // else {
    //   return <Spinner />;
    // }
  }
}














clientOverview.propTypes = {
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
)(clientOverview);