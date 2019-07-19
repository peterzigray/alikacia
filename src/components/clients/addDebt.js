import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { compose } from "redux";
import { connect } from "react-redux";
import { firestoreConnect } from "react-redux-firebase";
import PropTypes from "prop-types";
import ReactDOM from 'react-dom'; 
import Select from "react-dropdown-select";
import { runInNewContext } from 'vm';
import DatePicker from "react-datepicker";


 
import "react-datepicker/dist/react-datepicker.css";

function compare(selectedOption, listOfUsers) {
  const finalArray = [...listOfUsers];
  listOfUsers.forEach((e1) => selectedOption.forEach((e2) => {
    if (e1.id === e2.id) {
      finalArray.splice(listOfUsers.indexOf(e1), 1)
    }
  }))
  return finalArray.filter(value => Object.keys(value).length !== 0);
}

class addDebt extends Component {
  state = {
    balance: '',
   
    description: '',
    paidBy: '',
    debtTo: '',
    selectedOption: {},
    multi: true,
    listOfUsers:'',
    usersWithoutMe:'',

    isPayerChoosen: false,
    isDebterChoosen: false,
    isBalanceChoosen: false,

    valueField: 'id',
    labelField: 'label',


    date: new Date()
  };
  

  componentDidMount = () => {
    // var utc = new Date();
    // var dd = String(utc.getDate()).padStart(2, "0");
    // const monthNames = [
    //   "January",
    //   "February",
    //   "March",
    //   "April",
    //   "May",
    //   "June",
    //   "July",
    //   "August",
    //   "September",
    //   "October",
    //   "November",
    //   "December"
    // ];
    // var currentDate = String(dd + " " + monthNames[utc.getMonth()]);
    // this.setState({ date: currentDate}) 



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
    var deleteCount = 1;
    var count = usersWithoutMe.map(o => o.id).indexOf(auth.uid)

    if(count === -1){
      count = 0;
          deleteCount = 0;
     }
    usersWithoutMe.splice(count, deleteCount);
   

    console.log('......userswithoyutme......')
    console.log(count)
    console.log(auth.uid)
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
      balance: state.balance === "" ? "0" : state.balance,
      date: state.date === null ? new Date() : state.date
    };

    const { selectedOption, multi, usersWithoutMe, listOfUsers,isPayerChoosen,isDebterChoosen,isBalanceChoosen,valueField,labelField, ...rest } = newDebt
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

  onDate(date, e) {
    console.log('________________________date message')
    console.log(date)
    this.setState({
      date: date
    });
  }

  onChange = (e) => {

    if(e.target.name === "balance" && e.target.value.length != 0){
      this.setState({isBalanceChoosen: true}) 
    }
    if(e.target.name === "balance" && e.target.value.length === 0 ){
    this.setState({isBalanceChoosen: false}) 
    } 

    if(e.target.name === "balance" && e.target.value.match(/[^0-9]/g) && e.target.value.length !== 0 ){
    this.setState({isBalanceChoosen: false}) 
    window.alert("balance must be only number :) ");
    }
   
    this.setState({ [e.target.name]: e.target.value })
}
  // SET UP PERSON WHO IS IN DEPT
  // onChange2 = (e) => {
  //   this.setState({ debtTo: e.target.value})
  // }
  // SET UP PERSON WHO CREATED DEPT
  onChange3 = (selectedOption, e) => {

    console.log('--------selectedOption----------')
    console.log(selectedOption)
    var stateCopy9 = Object.assign({}, this.state);

    if (stateCopy9.listOfUsers) {
      console.log('--------ano----------')
      var listOfUnclicked = compare(selectedOption, stateCopy9.listOfUsers)
    }
    console.log(listOfUnclicked)

    stateCopy9.isPayerChoosen = false

    if (selectedOption.length !== 0) {
      stateCopy9.isPayerChoosen = true
      const { id ,label } = selectedOption[0];
      stateCopy9.paidBy = {id: id, label: label} 
    }

    // stateCopy9.listOfUsers = listOfUnclicked
    this.setState(stateCopy9)
   
  }

  handleChange = (selectedOption, e) => {

    var stateCopy3 = Object.assign({}, this.state);
    if (this.state.listOfUsers){
      var listOfUnclickedUsers = compare(selectedOption, this.state.listOfUsers)
    }
   


    console.log('--------selectedOption----------')
    console.log(selectedOption)
    console.log(listOfUnclickedUsers)
    // stateCopy3.listOfUsers = listOfUnclickedUsers 
   // this.setState({listOfUsers: false}

    stateCopy3.isDebterChoosen = false
    
    if(selectedOption.length !== 0){
      
    stateCopy3.debtTo = selectedOption;
    stateCopy3.isDebterChoosen = true
    console.log('------------------')
    console.log(selectedOption)
      this.setState(stateCopy3);
    }
  };

  onEquallysplit = (e) => {
    e.preventDefault();
    
    //IF PAYER IS ALSO DEBTOR
    const { paidBy, debtTo} = this.state

    var clicked = debtTo.filter(obj => {
      return (obj.id === paidBy.id)
    })

    // IF EQUALLY WAS CLICKED DO NOTHING, OTHERWISE ADD PAYER TO DOBTOR AND SET ACTUALBALLANCE FOR ALL DEBTORS
    if(clicked.length){
      console.log('ok')
    } else {
  
    // PAYER IS ALSO DEBTOR AND HERE I SET UP DEBT TO FOR HIM ALSO
    var stateCopy1 = Object.assign({}, this.state);
    stateCopy1.debtTo.push({id: paidBy.id, label: paidBy.label})
    this.setState(stateCopy1);

    
    // PAYER IS ALSO DEBTOR AND HERE I SPLIT TOTAL BALANCE FOR ALL DEBTORS AS ACTUALDEBT
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

}

  render() {
   
    const { selectedOption } = this.state;
    return (
      <div>
        <div className="row mb-0 mt-2 m9">
          
          <div className="col-md-6 pl-4 mr-0 mt-2">
            <div className="card">
              <div className="card-header">Add an expense</div>
              <div className="card-body">
                 <form onSubmit={this.onSubmit}>
                  <div className="form-group">

                    <label htmlFor="name">With you and</label>
                      <Select
                      labelField={this.state.labelField}
                      valueField={this.state.valueField}
                        value={selectedOption}
                        onChange={this.handleChange}
                        options={this.state.listOfUsers}
                        multi={this.state.multi}
                      />
                  </div>

            
                    <label htmlFor="name">Payd by</label>
                      <Select
                    labelField={this.state.labelField}
                    valueField={this.state.valueField}
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
                      <DatePicker
                        selected={this.state.date}
                        onChange={this.onDate.bind(this)}
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


                    {
                        this.state.isPayerChoosen && this.state.isDebterChoosen && this.state.isBalanceChoosen ?
                       <button 
                        type="button" 
                        className="btn btn-outline-primary btn-sm btn-block"
                        onClick={this.onEquallysplit}
                       >
                         Equally
                      </button> :

                      <button 
                      onClick={(e) => window.alert("Please set up your debt firstly :)")}
                      type="button" 
                      className="btn btn-outline-primary btn-sm btn-block"
             
                      
                     >
                       Equally
                    </button>
                  }
                  </div>

                  
                  <div className="col">
                  {
                        this.state.isPayerChoosen && this.state.isDebterChoosen && this.state.isBalanceChoosen ?
                  <button type="button" className="btn btn-outline-primary btn-sm btn-block">Exact</button> :
                  <button type="button" className="btn btn-outline-primary btn-sm btn-block" onClick={(e) => window.alert("Please set up your debt firstly :)")}>Exact</button> }
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
            <img src={require("../../pics/app.jpg")} style={{height:"100%", width:"100%"}} />
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
