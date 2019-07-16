import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { compose } from "redux";
import { connect } from "react-redux";
import { firestoreConnect } from "react-redux-firebase";
import PropTypes from "prop-types";
import ReactDOM from 'react-dom'; 
import Select from "react-dropdown-select";
import { runInNewContext } from 'vm';

class addDebt extends Component {
  state = {
    balance: '',
    date: '',
    description: '',
    paidBy: '',
    debtTo: '',
    selectedOption: {},
    multi: true,
    listOfUsers:'',
    usersWithoutMe:'',
    isPayerChoosen: false,
    isDebterChoosen: false,
    isBalanceChoosen: false
  };

  componentDidMount = () => {
    var utc = new Date();
    var dd = String(utc.getDate()).padStart(2, "0");
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December"
    ];
    var currentDate = String(dd + " " + monthNames[utc.getMonth()]);
    this.setState({ date: currentDate}) 



    const { disableBalanceOnAdd } = this.props.settings;
    const { auth, users } = this.props;

    const newKeys = { firstName: "label" };
    var copyofUsers = users;
    var userNames = renameKeys(copyofUsers, newKeys);

    // RENAME firstName keys in all array to label for input use
    function renameKeys(copyofUsers, newKeys) {
      var newArrOfChngedKeys = [];
      for (var i in copyofUsers) {
        newArrOfChngedKeys.push(giveBackNewArray(copyofUsers[i], newKeys))
      }
      return newArrOfChngedKeys
    }

    // RETURN changed key for every single object in array one by one
    function giveBackNewArray(copyofUsers, newKeys) {
        const keyValues = Object.keys(copyofUsers).map(key => {
        const newKey = newKeys[key] || key;
        return { [newKey]: copyofUsers[key] };
      }
    );
      return Object.assign({}, ...keyValues);
  }


    // RENEMAE EVERY FOUND LABEL TO FIRSTNAME + LASTNAME
    userNames.forEach(u => {
      if (u.label) {
        u.label = u.label + " " + u.lastName
      }
    })

    // DESTRACTURING ONLY NAME(LABEL) AND ID
    var newar = [];
    userNames.forEach(ar => {
      let { lastName, email, friends, ...rest } = ar;
      newar.push(rest)
      return newar
    }
  )

  // DESTRACTURING ONLY NAME(LABEL) AND ID WITHOUT ACTUAL USER
    var usersWithoutMe = [...newar]
    var count = usersWithoutMe.map(o => o.id).indexOf(auth.uid)
    usersWithoutMe.splice(count, 1);
   

    console.log('......userswithoyutme......')
    console.log(usersWithoutMe)
    console.log(newar)
    console.log('............')
    this.setState({ usersWithoutMe: usersWithoutMe })
    this.setState({ listOfUsers: newar})

  }

  onSubmit = e => {
    e.preventDefault();


    var stateCopy4 = Object.assign({}, this.state);

    if (stateCopy4.debtTo[0] && stateCopy4.debtTo.length <= 1) {

      Object.assign(stateCopy4.debtTo[0], { actualDebt: stateCopy4.balance })
      console.log('na toto sa focusujem')
      console.log(stateCopy4)
      this.setState(stateCopy4);
    }

    const {
      state,
      props: { firestore, history }
    } = this;
    

    const newDebt = {
      ...state,
      balance: state.balance === "" ? "0" : state.balance
    };

    const { selectedOption, multi, usersWithoutMe, listOfUsers, ...rest } = newDebt
    const nieco = {
      balance: '',
      date: '',
      description: '',
      paidBy: '',
      debtTo: [],
      options: ''}

    
    firestore
      .add({ collection: "debt" }, rest)
      // .then(() => history.push("/"));
      .then(this.setState(nieco))
      // ReactDOM.findDOMNode(this.refs.sStrike).value = '-';
      // ReactDOM.findDOMNode(this.refs.sStrike2).value = '-';
  };

  onChange = (e,id) => {
    console.log('--------------sem---------------')
    this.setState({isBalanceChoosen: false})
    
    if(e.target.name === "balance" && e.target.value.match(/^[0-9]*$/g) ){
    this.setState({isBalanceChoosen: true})
    } else {
      window.alert("balance must be only number :) ");
    }


    const { auth , users ,firebase} = this.props
    this.setState({ [e.target.name]: e.target.value })
}
  // SET UP PERSON WHO IS IN DEPT
  // onChange2 = (e) => {
  //   this.setState({ debtTo: e.target.value})
  // }
  // SET UP PERSON WHO CREATED DEPT
  onChange3 = (selectedOption, e) => {
    this.setState({isPayerChoosen: false})
    console.log('--------selected-----------')
    console.log(selectedOption.length !== 0)
    if (selectedOption.length !== 0) {
      this.setState({isPayerChoosen: true})

      console.log('this is what I wanted')
      const { id } = selectedOption[0];
      console.log(id)
      this.setState({ paidBy: id })
    }
   
  }

  handleChange = (selectedOption, e) => {
    this.setState({isDebterChoosen: false})
    
    if(selectedOption.length !== 0){
      var stateCopy3 = Object.assign({}, this.state);
    stateCopy3.debtTo = selectedOption;
    stateCopy3.isDebterChoosen = true
    console.log('------------------')
    console.log(selectedOption)
      this.setState(stateCopy3);
    }
  };

  onEquallysplit = (e) => {
    //IF PAYER IS ALSO DEBTOR
    const { paidBy, debtTo} = this.state
    e.preventDefault();
   
    
    var stateCopy1 = Object.assign({}, this.state);
    stateCopy1.debtTo.push({id: paidBy})
    this.setState(stateCopy1);

    

    var stateCopy = Object.assign({}, this.state);
    var devidedBy = stateCopy.debtTo.length;
    var actualBalance = stateCopy.balance;
    

    if (this.state.balance && this.state.debtTo){

      const priceForOneDebtor = Number.parseFloat(actualBalance / devidedBy).toFixed(2);
      console.log(priceForOneDebtor)
        stateCopy.debtTo.forEach(debtor => {
          Object.assign(debtor, { actualDebt : priceForOneDebtor})
        })
    } else {
      window.confirm("Please add deptor and balance first")
    }
    this.setState(stateCopy)

    console.log(this.state)
  }




  

  render() {
   


    const { selectedOption } = this.state;
    return (
      <div>
        <div className="row">
          
          <div className="col-md-6">
            <div className="card">
              <div className="card-header">Add an expense</div>
              <div className="card-body">
                 <form onSubmit={this.onSubmit}>
                  <div className="form-group">

                    <label htmlFor="name">With you and</label>
                      <Select
                        value={selectedOption}
                        onChange={this.handleChange}
                        options={this.state.usersWithoutMe}
                        multi={this.state.multi}
                      />
                  </div>

            
                    <label htmlFor="name">Payd by</label>
                      <Select
                      onChange={this.onChange3} 
                      value={selectedOption}
                      options={this.state.listOfUsers}
                      multi={!this.state.multi}
                    />

              
   
                  <div className="form-group">
                    <label htmlFor="description">Enter a description</label>
                    <input
                      type="text"
                      className="form-control"
                      name="description"
                      value={this.state.description}
                      minLength="2"
                      required
                      onChange={this.onChange}
                      // value={this.state.lastName}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="date">Date</label>
                    <input
                      type="text"
                      className="form-control"
                      name="date"
                      minLength="2"
                      required
                      onChange={this.onChange}
                      value={this.state.date}
                    />
                  </div>

                  {/* <div className="form-group">
                    <label htmlFor="paidBy">Paid by</label>
                    <input
                      type="text"
                      className="form-control"
                      name="paidBy"
                      // onChange={this.onChange}
                      value={auth.uid}
                  />
                  </div> */}

                  {/* <div className="form-group">
                    <label htmlFor="phone">Phone</label>
                    <input
                      type="text"
                      className="form-control"
                      name="phone"
                      minLength="10"
                      onChange={this.onChange}
                      value={this.state.phone}
                    />
                  </div> */}

                  <div className="form-group">
                    <label htmlFor="balance">Balance</label>
                    <input
                      type="text"
                      className="form-control"
                      name="balance"
                      onChange={this.onChange}
                      value={this.state.balance}
                      required
                      // disabled={disableBalanceOnAdd}
                    />
                  </div>

                  <div className="row mb-3">

                  <div className="col">
                  <button 
                        type="button" 
                        className="btn btn-outline-primary btn-sm btn-block"
                        onClick={this.onEquallysplit}
                       >
                         Equally
                      </button>
                  </div>
                  <div className="col">
                  <button type="button" className="btn btn-outline-primary btn-sm btn-block">Exact</button>
                  </div>
                 </div>

                  {
                    this.state.isPayerChoosen && this.state.isDebterChoosen && this.state.isBalanceChoosen ?
                  <button
                  type="submit"
                  value="Submit"
                  className="btn btn-dark btn-block">submit</button>:
                  <button className="btn btn-dark btn-block" disabled>submit</button>                    
                }

                </form>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <img src={require("../../pics/app.jpg")} />
          </div>
        
        </div>
      </div>
    );
  }
}

addDebt.propTypes = {
  firestore: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
 
  settings: PropTypes.object.isRequired
};




export default compose(
  firestoreConnect([{ collection: 'users' }]),
  connect((state, props) => ({
    settings: state.settings,
    users: state.firestore.ordered.users,
    auth: state.firebase.auth
  }))
)(addDebt);
