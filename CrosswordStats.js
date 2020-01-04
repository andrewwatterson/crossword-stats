import React from 'react';

import withFirebaseAuth from 'react-with-firebase-auth';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

import {FirebaseContext} from './FirebaseContext';
import secrets from './webSecrets';

import RegisterForm from './RegisterForm';
import LoginForm from './LoginForm';
import TimesList from './TimesList';
import TimeInput from './TimeInput';
import MyTeams from './MyTeams';

import './crossword-stats.css';

const firebaseConfig = secrets.firebaseWebConfig;

const firebaseApp = firebase.initializeApp(firebaseConfig);
const firebaseAppAuth = firebaseApp.auth();
const db = firebaseApp.firestore();

const providers = {

}

class CrosswordStats extends React.Component {

  constructor(props) {
    super(props);

  }

  render() {
    const {
      user,
      signOut,
      signInWithEmailAndPassword,
      createUserWithEmailAndPassword
    } = this.props;
  
    var loggedOutState =
      <React.Fragment>
        <RegisterForm createAccountCallback={createUserWithEmailAndPassword}></RegisterForm>
        <LoginForm loginCallback={signInWithEmailAndPassword}></LoginForm>
      </React.Fragment>;
    
    var loggedInState =
      <React.Fragment>
        logged in as {user && user.email}! <a href="#" onClick={signOut}>logout</a>
        <TimeInput />
        <MyTeams />
        {/*<TimesList />*/}
      </React.Fragment>;
    
    return (
      <FirebaseContext.Provider value={{app: firebaseApp, user: user, db: db}}>
        {user ? loggedInState : loggedOutState}
      </FirebaseContext.Provider>
    );
  }

}

export default withFirebaseAuth({
  providers,
  firebaseAppAuth
})(CrosswordStats);