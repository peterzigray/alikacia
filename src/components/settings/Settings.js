import React, { Component } from 'react'
import {Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';


import {
  setAllowRegistration,
  setDisableBalanceOnAdd,
  setDisableBalanceOnEdit
 } from '../../actions/settingsActions';

class Settings extends Component {
  disableBalanceOnAddChange = () => {
    const { setDisableBalanceOnAdd } = this. props;
    setDisableBalanceOnAdd();
  }
  disableBalanceOnEditChange = () => {
    const { setDisableBalanceOnEdit } = this.props;
    setDisableBalanceOnEdit();
  }
  disableBalanceOnChange = () => {
    const { setAllowRegistration } = this.props;
    setAllowRegistration();
  }

  render() {
    const {
      disableBalanceOnEdit,
      disableBalanceOnAdd,
      allowRegistration
    } = this.props.settings;
    return (
      <div>
        <div className="row">
          <div className="col-md-6">
            <Link className="btn btn-link">
              <i className="fas fa-arrow-circle-left">Back To Dashboard</i>
            </Link>
          </div>
        </div>
        <div className="card">
          <div className="card-header">Edit Settings</div>
          <div className="card-body">
            <form>
              <div className="form-group">
                <label>Allow Registration</label>{" "}
                <input
                  type="checkbox"
                  className="allowRegistration"
                  checked={!!allowRegistration}
                  onChange={this.disableBalanceOnChange}
                />
              </div>
              <div className="form-group">
                <label>Disable Balance on add</label>{" "}
                <input
                  type="checkbox"
                  className="disableBalanceOnAdd"
                  checked={!!disableBalanceOnAdd}
                  onChange={this.disableBalanceOnAddChange}
                />
              </div>
              <div className="form-group">
                <label>Disable Balance on Edit</label>{" "}
                <input
                  type="checkbox"
                  className="disableBalanceOnEdit"
                  checked={!!disableBalanceOnEdit}
                  onChange={this.disableBalanceOnEditChange}
                />
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

Settings.protoTypes = {
  settings: PropTypes.object.isRequired,
  setDisableBalanceOnAdd: PropTypes.func.isRequired,
  setDisableBalanceOnEdit: PropTypes.func.isRequired,
  setAllowRegistration: PropTypes.func.isRequired
};

export default connect((state, props) => ({
  auth: state.firebase.auth,
  settings: state.settings
}),
 {setAllowRegistration,setDisableBalanceOnAdd,setDisableBalanceOnEdit})
 (Settings);