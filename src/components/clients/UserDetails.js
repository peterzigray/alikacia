import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { compose } from 'redux';
import { connect } from 'react-redux';
import { firestoreConnect } from 'react-redux-firebase';


class UserDetails extends Component {
  state = {
    onRecordClick: false,
    recordId: '',
    allRecordForRow: ''
  };

      onRecordClick = (id) => {
        const {debt} = this.props
        this.setState({ onRecordClick: !this.state.onRecordClick, recordId: id }) 
        var wholeClickedRecord = debt.filter(d => d.id === id)
        console.log('meno meno meno')
        console.log(id)
        console.log(wholeClickedRecord)
        this.setState({ allRecordForRow: wholeClickedRecord })
      }
  render(){
    const { otherProps, auth } = this.props;
 
//const UserDetails = ( property ) => {

    console.log('-----------Nedoslo to sem----------')
    console.log(otherProps)
    // console.log( otherProps.map(w=> w.description))




    // console.log(auth.uid)
    if(otherProps[0].id !== "null")
    {
  return (
    <React.Fragment>
{/* 
              <Route 
                path='/:id' 
                render={ (props) => <Clients {...props} />}
              />  */}

<div className="card border-0" style={{ 'background-color': 'white', height: '100%' }}>
    <div className="card-body">
      <table className="table table-borderless ml-3">
        <thead className="thead-inverse border-bottom">
          {/* <tr>
      <th>Records of your debt with Friends
        
      </th>
      <th />
    </tr> */}
    
        </thead>
        <React.Fragment>
          <tr>
            <div className="card style_prevu_kit2 ml-0 mt-1 border-bottom" >
    
              <th className="row" style={{ padding: '0px 0px 0px 22px' }} >
                <td className='col-md-3' >
                  <span >
                    Stutus
                   </span>
                </td>
                <td className='col-md-2 pl-0 pr-0 ' >Date</td>
                <td className='col-md-3 pl-0 pr-0 ' >
                  Description
                  </td>
                <td className='col-md-2 pl-0 pr-0 ' >
                  {/* {Object.values(w.paidBy).map(a => a)[1]} */}
    
    
                  <span
                    className="float-right"
                  >
                    Balance
                    </span>
                </td>
                <td className='col-md-1 pl-0 pr-0' >
                  <i style={{ color: 'red' }}
    
                  ></i>
                  </td>
              </th>
    
            </div>
    
          </tr>
    
          {otherProps.map((w, index) => (
    
    
            <React.Fragment>
    
    
    
           
                <tbody className='pointer'>
    
    
                  <tr
                    key={w.id}
                    // className={(this.state.showLine && this.state.idecko === a.id ? "strikeout" : null)}
                    // onClick={this.onClickHandler.bind(this, a.id)}
                    // onClick={this.onRecordClick.bind(this, w.id)}
                  >
                    <div class="card style_prevu_kit ml-0 mt-1 border-bottom"
                    onClick={this.onRecordClick.bind(this, w.id)}
                    >
                      <th className="row" style={{ padding: '0px 0px 0px 22px' }} >
                        <td className='col-md-3' >
                          <span><i className="fas fa-circle fa-xs" style={{ color: Object.values(w.status).map(a => a)[0] }}></i></span>
                          {' '}{' '}{Object.values(w.status).map(a => a)[1]}
                          <span >
    
    
                            {/* {Object.values(w.paidBy).map(a => a)[1]} */}
    
                          </span>
                        </td>
                        <td className='col-md-2 pl-0 pr-0 ' >{w.date.substring(4, 10)}</td>
                        <td className='col-md-3 pl-0 pr-0 ' >
                          <p className="mx-auto">{w.description}</p>
                        </td>
                        <td className='col-md-2 pl-0 pr-0 ' >
                        
    
    
                          <span
                            className="float-right"
                            style={{ color: w.debtor[0] === auth.uid ? 'red' : 'green' }}>
                            {w.debt[0]}{' '}{'€'}
                          </span>
                        </td>
                        <td className='col-md-1 pl-0 pr-0' >
                          <i style={{ color: w.debtor[0] === auth.uid ? 'red' : 'green' }}
                            className={w.debtor[0] === auth.uid ?
                              "fas fa-long-arrow-alt-down fa-lg float-right"
                              : "fas fa-long-arrow-alt-up fa-lg float-right"
                            }
                          ></i></td>
                      </th>
                    </div>
                  </tr>
                  
   
                </tbody> 
    
                {/* this.state.showClickedRecord && this.state.recordId */}
              





            </React.Fragment>
    
          ))}


              {this.state.onRecordClick && this.state.recordId ?

               <React.Fragment>

                  {this.state.allRecordForRow.map(record => (



                    <div className="card text-center ml-0 mt-2" key={record.id} style={{ 'max-width': '90%' }}>
                      {/* <div class="card-header">
  Featured
      </div> */}
                      <div className="card-body" >
                        <div className="col-6">



                        </div>
                        <div className="col-6">
                          <i class="fas fa-user-circle fa-3x clientAvatar" />
                          <h5 className="card-title">Peter Zigray</h5>
                          <p>{record.date} </p>
                          <p style={{ color: 'red' }}>${record.balance}</p>
                        </div>
                      </div>
                      <div className="card-footer text-muted">
                        2 days ago
      </div>

                    </div>


                  )


                  )}




               </React.Fragment>



                : null}
        </React.Fragment>
      </table>
    </div>
    </div>
    
    </React.Fragment>

  
  );
            }
}
}

UserDetails.propTypes = {
  otherProps : PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
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
)(UserDetails);

