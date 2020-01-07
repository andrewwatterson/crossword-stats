import React, {useState} from 'react';
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
    error,
    loading,
    signOut,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword
  } = props;

  let [popups, setPopups] = useState({timeInput: false});

  var loggedInState =
    <React.Fragment>
      logged in as {user && user.email}! <a href="#" onClick={signOut}>logout</a>
      <MyTeams />
      {/*<TimesList />*/}
      {popups.timeInput
        ?
          <TimeInput closeModalCallback={() => { setPopups({timeInput:false}); }} />
        :
          <TimeInputFAB alt="Add Time" onClick={() => { setPopups({timeInput: true}); }}/>
      }
    </React.Fragment>;

  return (
    <FirebaseContext.Provider value={{app: firebaseApp, loading: loading, error: error, user: user, db: db}}>
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

const TimeInputFAB = Styled.button`
  position: fixed;
  bottom: 16px;
  right: 16px;
  height: 56px;
  width: 56px;
  border-radius: 28px;
  background-color: #4F85E5;

  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cpath d='M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z' fill='%23FFFFFF'/%3E%3Cpath d='M0 0h24v24H0z' fill='none'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: center center;
  box-shadow: 0 3px 5px -1px rgba(0,0,0,.2), 0 6px 10px 0 rgba(0,0,0,.14), 0 1px 18px 0 rgba(0,0,0,.12)
`;

export default withFirebaseAuth({
  providers,
  firebaseAppAuth
})(CrosswordStats);