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
  // clickOnCard = (w) => {
  //   console.log(w.id)
  //   return (<Link to={`/Friends/${w.id}`} />)
    
  
  // }


  render() {

    const { users, debt, auth ,onBalanceChange, debtors, debtorsLeft} = this.props;

    


    if (debtors.length < 1 && debtorsLeft < 1) {
      return (
        <div className="mt-5 ml-5">
          <h3>You dont have any debts to show yet</h3>
          <h4>settle up your debts with friends {':)'}</h4>
          <h5>in order to do it, click on section add bills</h5>
        </div>
      )
      
    } 

    else if (debt && users) {

      var myName = users.filter(user => {
        if (user.id === auth.uid) {
          return user
        }
      })[0]
      const { firstName, lastName } = myName;

      return (
        <div className="row h-100">
          <div className="col-md-4 pt-2">
            <div className="card mb-3 shadow-lg bg-white rounded mt-4" style={{ "max-width": "100%" }}>

              <div className="card-body bg-info cardHeader1">
                <h4 className='text-white'> My groups </h4>
                <h6 clssName="card-subtitle text-white m-b-0 op-5" style={{ color: "white", opacity: '0.5' }}> Check your groups here </h6>

              </div>
              <div className="UserPicsDash mr-2 ">
                <img src="https://demos.creative-tim.com/black-dashboard/assets/img/anime3.png" />
              </div> 

              <div className="card-body mt-4">
                <h3 className="pt-3 pl-4">{firstName} {' '} {lastName}</h3>
              </div>

              <div className="card-body text-success mt-4 pl-5 ml-5">

               
                    <frameElement>
                  < button
                    //onClick={this.showGroupDetail.bind(this, group.id)}
                    className="btn btn-success btn-rounded btn-md btnUserDash"
                    
                  >
                   <h4> Groups</h4>
                        </button>
                      
                        {/* < button
                          //onClick={this.showGroupDetail.bind(this, group.id)}
                          className="btn btn-success btn-sm btn-block btn-icon-split mb-1"
                        >
                         friends
                        </button> */}
                  

                    </frameElement>
              
              </div>
              <div className="card-body row mt-4">
                  

                <div className="col-4 ">
                  <h3 >
                    10
                  </h3>
                  <small>
                      Friends
                  </small>
                </div>
                <div className="col-4">
                  <h3>
                    2
                  </h3>
                  <small>
                    Groups
                  </small>
                </div>
                <div className="col-4">
                  <h3>
                    8
                  </h3>
                  <small>
                    Debts
                  </small>
                </div>

              </div>

            </div>
          </div>
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
                    style={{cursor: "pointer"}}
                    >
   
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
                ))}
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