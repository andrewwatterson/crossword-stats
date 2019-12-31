import React from 'react';

import withFirebaseAuth from 'react-with-firebase-auth';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

import {FirebaseContext} from './FirebaseContext';

import RegisterForm from './RegisterForm';
import LoginForm from './LoginForm';
import TimesList from './TimesList';
import TimeInput from './TimeInput';

const firebaseConfig = {
  apiKey: "AIzaSyDvcwBdxwxxUvcdVzzNzgQX5CxbcsYJOZ0",
  authDomain: "crossword-stats.firebaseapp.com",
  databaseURL: "https://crossword-stats.firebaseio.com",
  projectId: "crossword-stats",
  storageBucket: "crossword-stats.appspot.com",
  messagingSenderId: "1056376664586",
  appId: "1:1056376664586:web:b8a165bde61c448d"
};

const firebaseApp = firebase.initializeApp(firebaseConfig);
const firebaseAppAuth = firebaseApp.auth();
const db = firebaseApp.firestore();

const providers = {

}

function CrosswordStats(props) {
  const {
    user,
    signOut,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword
  } = props;

  var loggedOutState =
    <React.Fragment>
      <RegisterForm createAccountCallback={createUserWithEmailAndPassword}></RegisterForm>
      <LoginForm loginCallback={signInWithEmailAndPassword}></LoginForm>
    </React.Fragment>;
  
  var loggedInState =
    <React.Fragment>
      logged in as {user && user.email}! <a href="#" onClick={signOut}>logout</a>
      <TimeInput />
      <TimesList />
    </React.Fragment>;
  
  return (
    <FirebaseContext.Provider value={{app: firebaseApp, user: user, db: db}}>
      {user ? loggedInState : loggedOutState}
    </FirebaseContext.Provider>
  );
}

export default withFirebaseAuth({
  providers,
  firebaseAppAuth
})(CrosswordStats);