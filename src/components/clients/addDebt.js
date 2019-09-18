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

// function addActualDebt(debtTo, priceForOneDebtor) {
//   console.log('som vo vnutri funkcie')
//   console.log(debtTo)
//   console.log(priceForOneDebtor)
//   var result = debtTo.forEach(debtor => {
//     Object.assign(debtor, { actualDebt: priceForOneDebtor })
//   })
  
//   return result
// }

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
    paidBy: [],
    debtTo: '',
    selectedOption: [{none:'none'}],
    multi: true,
    uersForDebtAssign:'',
    usersForPaidBy:'',
    status: { state:'Pending', color:'#F8BC35' },
  
    areRequestedArrFilled: false,
    existDebtorAndPayer: false,
    equallButtonClicked: '',
    exactButtonClicked: false,

    allowExact: false,
    currentId: '',

    valueField: 'id',
    labelField: 'label',


    date: new Date(),
    newDate: ''
  };
  

  componentDidMount = () => {
    console.log('-------tento-----------componentDidMount')
    // const { disableBalanceOnAdd } = this.props.settings;
    const { auth, users } = this.props;

    const newKeys = { firstName: "label" };
    // var copyofUsers = users
    var friendNames = users.filter(user => user.id === auth.uid)[0].friends

 
    



    var usersWithoutMe = renameKeys(friendNames, newKeys);

    // RENAME firstName keys in all array to label for input use
    function renameKeys(userNames, newKeys) {
      var newArrOfChngedKeys = [];
      for (var i in userNames) {
        newArrOfChngedKeys.push(giveBackNewArray(userNames[i], newKeys))
      }
      return newArrOfChngedKeys
    }

    // RETURN changed key for every single object in array one by one
    function giveBackNewArray(userNames, newKeys) {
      const keyValues = Object.keys(userNames).map(key => {
        const newKey = newKeys[key] || key;
        return { [newKey]: userNames[key] };
      }
    );
      return Object.assign({}, ...keyValues);
  }

  
    // RENEMAE EVERY FOUND LABEL TO FIRSTNAME + LASTNAME
    usersWithoutMe.forEach(u => {
      if (u.label) {
        u.label = u.label + " " + u.lastName
      }
    })

    // Add me to the array

    

    // DESTRACTURING ONLY NAME(LABEL) AND ID
    var usersWithoutMe2 = [];
    usersWithoutMe.forEach(ar => {
      let { lastName, email, friends, ...rest } = ar;
      usersWithoutMe2.push(rest)
      return usersWithoutMe2
    }
  )

  // // DESTRACTURING ONLY NAME(LABEL) AND ID WITHOUT ACTUAL USER
  //   var usersWithoutMe = [...newar]
  //   var deleteCount = 1;
  //   var count = usersWithoutMe.map(o => o.id).indexOf(auth.uid)

  //   if(count === -1){
  //     count = 0;
  //         deleteCount = 0;
  //    }
  //   usersWithoutMe.splice(count, deleteCount);
    var userWithMe = JSON.parse(JSON.stringify(usersWithoutMe2));
    userWithMe.unshift({ id: auth.uid, label: 'Me' })
    // console.log('......userswithoyutme......')
    // console.log(count)
    // console.log(auth.uid)
    // console.log(usersWithoutMe)
    // console.log(newar)
    // console.log('............')
    this.setState({ usersForPaidBy: userWithMe })
    this.setState({ uersForDebtAssign: usersWithoutMe2})
    console.log(userWithMe)
    console.log(usersWithoutMe2)
  }

  onSubmit = e => {
    e.preventDefault();


    var stateCopy4 = Object.assign({}, this.state);

    if (stateCopy4.debtTo[0] && stateCopy4.debtTo.length <= 1) {

      Object.assign(stateCopy4.debtTo[0], { actualDebt: stateCopy4.balance })
      this.setState(stateCopy4);
    }

    // IN CASE EXACT AMOUNT AND TOTAL BALANCE IS NOT COVERAGE, ADD DEBT FOR PAYER AS WELL

    //if (this.state.exactButtonClicked && )
    const {
      state,
      props: { firestore, history }
    } = this;
    

    const newDebt = {
      ...state,
      balance: state.balance === "" ? "0" : state.balance,
      date: state.newDate === '' ? this.state.date.toString() : state.newDate
    };


    const { selectedOption, multi, usersForPaidBy, uersForDebtAssign,isPayerChoosen,isDebterChoosen,isBalanceChoosen,valueField,labelField,newDate, 
      areRequestedArrFilled, currentId, equallButtonClicked, exactButtonClicked, existDebtorAndPayer, allowExact, ...rest } = newDebt
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
    console.log( typeof date.toString())
    console.log( this.state.date.toString())
    this.setState({
      newDate: date
    });
  }

  onDescriptionChange = (e) => {
    this.setState({ areRequestedArrFilled: false })
      if (e.target.value.length !== 0 && this.state.balance.length !==0) {
        this.setState({ areRequestedArrFilled: true })
      }
    this.setState({ [e.target.name]: e.target.value })
  }

  onBalanceChange = (e) => {
    this.setState({areRequestedArrFilled: false})
    if (e.target.value.length !== 0 && this.state.description.length !== 0) {
      this.setState({ areRequestedArrFilled: true })
    }
    if(e.target.name === "balance" && e.target.value.match(/[^0-9]/g) && e.target.value.length !== 0 ){
      this.setState({ areRequestedArrFilled: false}) 
      window.alert("only numbers are accepted :) ");
    }
    this.setState({ [e.target.name]: e.target.value })
}

  handleInputChangefromArr = (d, selectedOption) => {
    console.log('handle input change')
// console.log(d)

  console.log(selectedOption)
    if (selectedOption.length > 0) {
    // button equall has not been clicked
    var stateCopyInput = Object.assign({}, this.state);
    stateCopyInput.existDebtorAndPayer = false
    
    if (this.state.equallButtonClicked){

                        console.log('klikol som aj na equallbutton')
                        // stateCopyInput.equallButtonClicked = false
      if (d === 'payer') {
        console.log('klikol som aj na equallbutton a zmenil payera')

        

                          const { id, label } = selectedOption[0];
                          stateCopyInput.paidBy = { id: id, label: label }

        var isDebtorSameWithPayer1 = stateCopyInput.debtTo.some(object => object.id === id ? true : false)

        if (!isDebtorSameWithPayer1){
          stateCopyInput.debtTo.push({ id: stateCopyInput.paidBy.id, label: stateCopyInput.paidBy.label, actualDebt: ''})
        }
        var devidedBy1 = stateCopyInput.debtTo.length;
        var actualBalance1 = stateCopyInput.balance;
        const priceForOneDebtor1 = Number.parseFloat(actualBalance1 / devidedBy1).toFixed(2);

        stateCopyInput.debtTo.forEach(debtor => debtor.actualDebt = priceForOneDebtor1 )
        




                          if (selectedOption.length !== 0 && stateCopyInput.debtTo.length !== 0) {
                            stateCopyInput.existDebtorAndPayer = true
                          }

                        }

      if (d === 'debt') { 
                          console.log('klikol som aj na equallbutton a zmenil debt')
                         

     
        ////////////////////////////////////////////////////////////////////////////////////////////////////////

        var isDebtorSameWithPayer = selectedOption.some(object => object.id === stateCopyInput.paidBy.id ? true : false)


        if (!isDebtorSameWithPayer){
          selectedOption.push({ id: stateCopyInput.paidBy.id, label: stateCopyInput.paidBy.label })
        }
        
        stateCopyInput.debtTo = selectedOption;

       



                          if (selectedOption.length !== 0 && stateCopyInput.paidBy.length !== 0) {
                            stateCopyInput.existDebtorAndPayer = true
                          }
                        
                        }  
    }

    // button equall has not been clicked
    
    if (!this.state.equallButtonClicked) {
                      console.log('equallbutton neni kliknuty')
                      //SET UP PAYER
      if (d === 'payer'){
                      console.log('som v payer')
                      stateCopyInput.existDebtorAndPayer = false
                      if (selectedOption.length !== 0 ) {
                        const { id, label } = selectedOption[0];
                        stateCopyInput.paidBy = { id: id, label: label }
                      } 
                      console.log('equallbutton neni kliknuty a zmenil som payera')
                      if (selectedOption.length !== 0 && stateCopyInput.debtTo.length !== 0) {
                        stateCopyInput.existDebtorAndPayer = true    
                      } 
                    
                    }
                    
                    // SET UP DEBTOR
                    if(d === 'debt'){
                      console.log('equallbutton neni kliknuty a zmenil som debt')   
                          stateCopyInput.existDebtorAndPayer = false
                          stateCopyInput.debtTo = selectedOption; 
                      if (selectedOption.length !== 0 && stateCopyInput.paidBy.length !== 0 ) {
                        stateCopyInput.existDebtorAndPayer = true 
                      } 
                    
                    }
  }
    this.setState(stateCopyInput);

   

    } else {
      return null
    }
   
  }
  


  // onChange3 = (selectedOption, e) => {

  //   console.log('--------selectedOption----------')
  //   console.log(selectedOption)
  //   var stateCopy9 = Object.assign({}, this.state);

  //   // if (stateCopy9.uersForDebtAssign) {
  //   //   console.log('--------ano----------')
  //   //   var listOfUnclicked = compare(selectedOption, stateCopy9.uersForDebtAssign)
  //   // }
  //   // console.log(listOfUnclicked)

  //   stateCopy9.isPayerChoosen = false

  //   if (selectedOption.length !== 0) {
  //     stateCopy9.isPayerChoosen = true
  //     const { id ,label } = selectedOption[0];
  //     stateCopy9.paidBy = {id: id, label: label} 
  //   }

  //   // stateCopy9.listOfUsers = listOfUnclicked
  //   this.setState(stateCopy9)
   
  // }

  // handleChange = (selectedOption, e) => {

  //   var stateCopy3 = Object.assign({}, this.state);
  //   // if (this.state.listOfUsers){
  //   //   var listOfUnclickedUsers = compare(selectedOption, this.state.listOfUsers)
  //   // }
   
  //   if (e === 'd'){

  //   console.log('--------selectedOption----------')
    
  //   // console.log(listOfUnclickedUsers)
  //   // stateCopy3.listOfUsers = listOfUnclickedUsers 
  //  // this.setState({listOfUsers: false}
  //  // IF THERE IS NO PICKED USER I SETTED UP "NONE" FOR SETUP EXACT SUM ON CUSTOMERS
  //   stateCopy3.isDebterChoosen = false
  //   if(selectedOption.length === 0){
  //     selectedOption = [{label: 'You should set at leat one debtor'}];
    
  
    
    
  // }else{
      
  //   stateCopy3.debtTo = selectedOption;
  //   stateCopy3.isDebterChoosen = true
  //   console.log('------------------')
  //   console.log(selectedOption)
  //     this.setState(stateCopy3);
  //   }
  // }
  // };

  onExactSplit = (e) => {
    e.preventDefault();

    if (!this.state.areRequestedArrFilled && !this.state.existDebtorAndPayer) {
      window.confirm("Please add deptor and balance first")
    }
   





    var stateCopyExact = Object.assign({}, this.state);

    // //IF PAYER IS ALSO DEBTOR
    // const { paidBy, debtTo } = stateCopyExact
    // var copyDebt1 = JSON.parse(JSON.stringify(debtTo));

    // if (!this.state.equallButtonClicked) {

    //   copyDebt1.forEach(debtor => {
    //     Object.assign(debtor, { actualDebt: 0 })
    //   })
    //   console.log(copyDebt1)
    //   stateCopyExact.debtTo = copyDebt1;

    // }
    stateCopyExact.exactButtonClicked = true
    stateCopyExact.equallButtonClicked = false;
    this.setState(stateCopyExact)
 















 
    
  }

    onTodoChange(value){
  var stateCopyChange = Object.assign({}, this.state);

    
      //IF PAYER IS ALSO DEBTOR
    // const { paidBy, debtTo } = stateCopyChange
    // var copyDebtChange = JSON.parse(JSON.stringify(debtTo));

    // if (!this.state.equallButtonClicked) {

    //   copyDebt1.forEach(debtor => {
    //     if( debtor.id === value)
    //     Object.assign(debtor, { actualDebt: 0 })
    //   })
    //   console.log(copyDebt1)
    //   stateCopyChange.debtTo = copyDebt1;

    // }
    var currentId = '';
    var currentValue ='';
    if(value.length > 20){
      stateCopyChange.currentId = value
    }
  

      if (value.length < 20){
        stateCopyChange.debtTo.forEach(debtor => debtor.id === stateCopyChange.currentId  ? Object.assign(debtor, { actualDebt: value }): null)
             
    }

      
      console.log(stateCopyChange.currentId)
      console.log(value)
      this.setState(stateCopyChange)
    //   if(value.length < 20){
    //     stateCopyExact.debtTo.forEach(debtor => {
    //               if(debtor.id === value){
    //                 Object.assign(debtor, { actualDebt: priceForOneDebtor })
    //               }

    //             }

    //     this.setState({
    //       balance: value
    //     });
    //   } else {


    //     // stateCopyExact.debtTo.forEach(debtor => {
    //     //   if(debtor.id === value){
    //     //     Object.assign(debtor, { actualDebt: priceForOneDebtor })
    //     //   }
          
    //     // }
    //    return null
    //   }
      
    }
  

  onEquallysplit = (e) => {
    console.log('-----------------------------onEquallysplit')
    e.preventDefault();
    var stateCopyEqually = Object.assign({}, this.state);

    //IF PAYER IS ALSO DEBTOR
    const { paidBy, debtTo } = stateCopyEqually
    var copyDebt = JSON.parse(JSON.stringify(debtTo));

    //Obtain if Equall button has been clicked
    // var clicked = debtTo.filter(obj => {
    //   return (obj.id === paidBy.id)
    // })
    if (!this.state.areRequestedArrFilled && !this.state.existDebtorAndPayer) {
      window.confirm("Please add deptor and balance first")
    }

    // var clicked = debtTo.some(obj => Object.keys(obj)[2] === 'actualDebt'? true: false)
   
    // IF EQUALL BUTTON WAS CLICKED DO NOTHING, OTHERWISE ADD PAYER TO DOBTOR AND SET ACTUALBALLANCE FOR ALL DEBTORS
   
    var isDebtorSameWithPayer = copyDebt.some(object => object.id === paidBy.id? true: false)
    
   

    if (!this.state.equallButtonClicked){
      stateCopyEqually.equallButtonClicked = true;
      // PAYER IS ALSO DEBTOR AND HERE I SET UP DEBT TO FOR HIM ALSO
      
      if (!isDebtorSameWithPayer){
        console.log('Am I already debtor?')
       
        copyDebt.push({ id: paidBy.id, label: paidBy.label })
        stateCopyEqually.selectedOption = copyDebt

      }
      


      console.log('pridal som payera do debt')
      // PAYER IS ALSO DEBTOR AND HERE I SPLIT TOTAL BALANCE FOR ALL DEBTORS AS ACTUALDEBT
      var devidedBy = copyDebt.length;
      var actualBalance = stateCopyEqually.balance;
      const priceForOneDebtor = Number.parseFloat(actualBalance / devidedBy).toFixed(2);
   
     
    
      // ADD ACTUAL DEBT FOR ALL PICKED DEBTORS
      console.log('debtTo')
      
     copyDebt.forEach(debtor => {
        Object.assign(debtor, { actualDebt: priceForOneDebtor })
      })
      console.log(copyDebt)
      stateCopyEqually.debtTo = copyDebt;

    
      
    } else {



     console.log('was clicked')
    }
    // stateCopyEqually.equallButtonClicked = clicked;
    stateCopyEqually.exactButtonClicked = true
    this.setState(stateCopyEqually)
  

}


  render() {
   
    console.log("---------------------------------render-----s")
    console.log(this.state.debtTo)
    if(this.state.equallButtonClicked){
      var devidedBy = this.state.debtTo.length;
      var actualBalance = this.state.balance;
      const priceForOneDebtor = Number.parseFloat(actualBalance / devidedBy).toFixed(2);
      var selectedObtions = JSON.parse(JSON.stringify(this.state.debtTo));
      
       selectedObtions.forEach(debtor => {
        Object.assign(debtor, { actualDebt: priceForOneDebtor })
      })

     
      console.log(selectedObtions)

    }

    




 
    const { selectedOption } = this.state;
    return (
      <div>
        <div className="row mb-0 mt-2 m9">
          
          <div className="col-md-5 pl-4 mr-0 ">
            <div className="card">
              {/* <div className="card-header">Add an expense</div> */}
              <div className="card-body">
                 <form onSubmit={this.onSubmit}>
                  <div className="form-group">

                    <label htmlFor="name">Debt assign</label>
                      <Select
                      labelField={this.state.labelField}
                      valueField={this.state.valueField}
                        value={selectedOption}
                        name="debt"
                      onChange={this.handleInputChangefromArr.bind(this, "debt")}
                      //onChange={this.handleInputChange}
                      //  onChange={this.handleChange.bind(this, 'd')}
                        options={this.state.uersForDebtAssign}
                        multi={this.state.multi}
                      />
                  </div>

            
                    <label htmlFor="name">Payd by</label>
                      <Select
                    labelField={this.state.labelField}
                    valueField={this.state.valueField}
                    name="payed"
                    //onChange={this.handleInputChange}
                    onChange={this.handleInputChangefromArr.bind(this, "payer")}
                      //onChange={this.onChange3} 
                      value={selectedOption}
                      options={this.state.usersForPaidBy}
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
                      onChange={this.onDescriptionChange}
                      // value={this.state.lastName}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="date">Date</label>
                      <DatePicker
                      selected={this.state.newDate}
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
                      onChange={this.onBalanceChange}
                      value={this.state.balance}
                      required
                      // disabled={disableBalanceOnAdd}
                    />
                  </div>

                  <div className="row mb-3">

                  <div className="col">


                      {this.state.areRequestedArrFilled && this.state.existDebtorAndPayer?
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
                      {this.state.areRequestedArrFilled && this.state.existDebtorAndPayer?

                  <button 
                    type="button" 
                    className="btn btn-outline-primary btn-sm btn-block"
                    onClick={this.onExactSplit}>
                    Exact
                  </button> :
                  <button type="button" className="btn btn-outline-primary btn-sm btn-block" onClick={(e) => window.alert("Please set up your debt firstly :)")}>Exact</button> }
                  </div>
                 </div>

                  {
                    this.state.areRequestedArrFilled && this.state.existDebtorAndPayer ?
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
         
       
      <div className="col-md-7">
      {this.state.debtTo? this.state.debtTo.map(name => 
          <div className="card in-left">
          <div class="row no-gutters">
            <div className="col-md-4 ">
              
                <img src="https://demos.creative-tim.com/black-dashboard/assets/img/anime3.png" />
          
              
            </div>
              <div class="col-md-8">
            <ul className="list-group list-group-flush">
              <li className="list-group-item ">
                <div class="card-body">

                {/* <div class="row no-gutters">
                  <div class="col-md-4">
                    <img src="..." class="card-img" alt="...">
                     </div>
                    <div class="col-md-8">
                      <div class="card-body">
                        <h5 class="card-title">Card title</h5>
                        <p class="card-text">This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</p>
                        <p class="card-text"><small class="text-muted">Last updated 3 mins ago</small></p>
                      </div>
                    </div>
                  </div> */}
                    <h3>{name.label}</h3> 

                 

                 

                  
                 { !this.state.equallButtonClicked ?
                      <div className="input-group ">
                    
                    {this.state.exactButtonClicked?
                          <React.Fragment>
                     <input type="text"
                   
                        className="form-control" 
                          // value={name.actualDebt} 
                            aria-label="Amount (to the nearest dollar)"
                            key={name.id}
                             onChange={(e)=> this.onTodoChange(e.target.value)}
                         // onChange={onTodoChange}
                             onClick={this.onTodoChange.bind(this, name.id)}
                        //  onClick={(([e.target.value], key) => this.onTodoChange(e, val))}
                   />

                     <div class="input-group-append">
                      
                       <span class="input-group-text">$</span>
                       {/* <span class="input-group-text">0.00</span> */}
                        </div>
                            </React.Fragment>
                        : null } 
                      </div>
                    : 
                    <div>

                   
                      <p>Owed {' '} {selectedObtions[0].actualDebt} {"EUR"} </p> 
                  
                    
                    </div>}
                  



                   
                
                

                </div>
              </li>
           </ul>
              </div>
          </div>
        </div>
      ) : <h3>Please choose at least one of your friends</h3>}
      </div>
     




          {/* <div className="col-md-3">
          <img src={require("../../pics/app.jpg")} style={{height:"100%", width:"100%"}} />
          </div> */}

          
        
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
