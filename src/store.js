import { createStore, combineReducers, compose } from 'redux';
import firebase from 'firebase';
import firebaseui from 'firebase';
import 'firebase/firestore';
import { reactReduxFirebase, firebaseReducer } from 'react-redux-firebase';
import { reduxFirestore, firestoreReducer } from "redux-firestore";
//Reducers
import notifyReducer from './reducers/notifyReducer';
import settingsReducer from './reducers/settingsReducer';

import 'firebase/auth';
import 'firebase/database';
import React from "react";
import { render } from "react-dom";
import { Provider } from "react-redux";

const firebaseConfig = {
  apiKey: "AIzaSyCnzEkmUpRR2NGAhlajKKi_pnXn3GGykHY",
  authDomain: "reactclientpanel-f644d.firebaseapp.com",
  databaseURL: "https://reactclientpanel-f644d.firebaseio.com",
  projectId: "reactclientpanel-f644d",
  storageBucket: "reactclientpanel-f644d.appspot.com",
  messagingSenderId: "479455297062"
};

// react-redux-firebase config
const rrfConfig = {
  userProfile: "users",
  useFirestoreForProfile: true, // Firestore for Profile instead of Realtime DB

};


//initial firebase instance
firebase.initializeApp(firebaseConfig);
//initial firestore
const firestore = firebase.firestore();


// Add reactReduxFirebase enhancer when making store creator
const createStoreWithFirebase = compose(
  reactReduxFirebase(firebase, rrfConfig), 
  reduxFirestore(firebase) 
)(createStore);

// Add firebase to reducers
const rootReducer = combineReducers({
  firebase: firebaseReducer,
  firestore: firestoreReducer,
  notify: notifyReducer,
  settings: settingsReducer
})

const uiConfig = {
  signInFlow: "popup",
  signInOptions: [firebase.auth.FacebookAuthProvider.PROVIDER_ID],
  callbacks: {
    signInSuccess: () => false
  }
};

//Check for settings in localStorage
if(localStorage.getItem('settings') == null) {
  //Default settings
  const defaultSettings = {
    disableBalanceOnAdd: false,
    disableBalanceOnEdit: false,
    allowRegistration: true
  }
  // Set to localStorage
  localStorage.setItem('settings', JSON.stringify(defaultSettings))
}

// Create initial state 
const initialState = {settings : JSON.parse(localStorage.getItem('settings'))};

// //Create store
// const store = createStoreWithFirebase(
//   rootReducer, 
//   initialState,
//   compose(
//     reactReduxFirebase(firebase),
//     window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
// ));

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

//Create store
const store = createStoreWithFirebase(
  rootReducer,
  initialState,
  composeEnhancers(
    reactReduxFirebase(firebase),

  )
);

export default store;