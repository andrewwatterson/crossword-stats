import React from 'react';
import Styled from 'styled-components';

import withFirebaseAuth from 'react-with-firebase-auth';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

import {FirebaseContext} from './FirebaseContext';
import secrets from './webSecrets';

import {AppWrapper} from './ui';

import LoginSignupPage from './LoginSignupPage';
import TimesList from './TimesList';
import TimeInput from './TimeInput';
import MyTeams from './MyTeams';

import './crossword-stats.css';

const firebaseConfig = secrets.firebaseWebConfig;

const firebaseApp = firebase.initializeApp(firebaseConfig);
const firebaseAppAuth = firebaseApp.auth();
const db = firebaseApp.firestore();

const providers = {};

function CrosswordStats(props) {

  const {
    user,
    signOut,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword
  } = props;
  
  var loggedInState =
    <React.Fragment>
      logged in as {user && user.email}! <a href="#" onClick={signOut}>logout</a>
      <TimeInput />
      <MyTeams />
      {/*<TimesList />*/}
    </React.Fragment>;
  
  return (
    <FirebaseContext.Provider value={{app: firebaseApp, user: user, db: db}}>
      <AppWrapper>
        {user
          ?
            loggedInState
          :
            <LoginSignupPage
              createAccountCallback={createUserWithEmailAndPassword}
              loginCallback={signInWithEmailAndPassword}
            />
        }
      </AppWrapper>
    </FirebaseContext.Provider>
  );
}

export default withFirebaseAuth({
  providers,
  firebaseAppAuth
})(CrosswordStats);