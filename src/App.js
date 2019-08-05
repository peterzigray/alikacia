import React, { Component } from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import { UserIsAuthenticated, UserIsNotAuthenticated } from './helpers/auth'
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';

import {Provider} from 'react-redux';
import store from './store';


import Friends from './components/clients/Friends';
import addDebt from "./components/clients/addDebt";
import ClientDetail from "./components/clients/ClientDetail";
import EditClient from "./components/clients/EditClient";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import Settings from './components/settings/Settings';
import NotAuthenticated from './components/layout/NotAuthenticated';
import Clients from './components/clients/Clients';


import './css/LoginCss.css';

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router>
          <div className="App">
            {/* <AppNavbar /> */}
            <div className="container-fluid"
              style={{ 'background-color': 'rgb(242, 244, 248)'}}>
              <Route exact path="/" component={UserIsAuthenticated(Clients)} />
              <Route exact path="/:id"  component={UserIsAuthenticated(Clients)}/>
              <Route  path="/Friends/:id" component={UserIsAuthenticated(Clients)} />
               
                {/* <Route
                  exact
                  path="/client/add"
                  component={UserIsAuthenticated(AddDebt)}
                /> */}
                {/* <Route
                  exact
                  path="/client/edit/:id"
                  component={UserIsAuthenticated(EditClient)}
                />
                <Route
                  exact
                  path="/client/:id"
                  component={UserIsAuthenticated(ClientDetail)}
                /> */}
                {/* <Route
                  
                  path="/Dashboard"
                  component={UserIsAuthenticated(Dashboard)}
                /> */}
                {/* <Route
                  exact
                  path="/login"
                  component={UserIsNotAuthenticated(Login)}
                /> */}
                <Route
                  exact
                  path="/login"
                  component={UserIsNotAuthenticated(NotAuthenticated)}
                />
                <Route
                  exact
                  path="/settings"
                  component={UserIsAuthenticated(Settings)}
                />
         
            </div>
          </div>
        </Router>
      </Provider>
    );
  }
}

export default App;
