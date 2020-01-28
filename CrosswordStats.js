import React, {useState} from 'react';
import Styled from 'styled-components';

import { useAuthState } from 'react-firebase-hooks/auth';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

import {FirebaseContext} from './FirebaseContext';
import secrets from './webSecrets';

import * as Stz from './style.js';
import {AppWrapper, AppContent} from './ui';

import LoginSignupPage from './LoginSignupPage';
import AppHeader from './AppHeader';
import TimesList from './TimesList';
import TimeInput from './TimeInput';
import CreateTeam from './CreateTeam';
import InviteLink from './InviteLink';
import MyTeams from './MyTeams';

import './crossword-stats.css';

const firebaseConfig = secrets.firebaseWebConfig;

const firebaseApp = firebase.initializeApp(firebaseConfig);
const firebaseAppAuth = firebaseApp.auth();
const db = firebaseApp.firestore();

export default function CrosswordStats(props) {

  const [user, loading, error] = useAuthState(firebaseAppAuth);

  let [modals, setModals] = useState({open: false, options: {}});

  var openModal = (name, options) => {
    setModals({open: name, options: options});
  }

  var closeModal = () => {
    setModals({open: false, options: {}});
  }

  var loggedInState = (
    <React.Fragment>
      <AppHeader
        signOutCallback={() => { firebaseAppAuth.signOut(); }}
      />
      <AppContent>
        <MyTeams />
        {/*<TimesList />*/}
      </AppContent>
      {modals.open === "timeInput" && <TimeInput />}
      {modals.open === "createTeam" && <CreateTeam />}
      {modals.open === "inviteLink" && <InviteLink teamId={modals.options.teamId} />}
      <TimeInputFAB alt="Add Time" onClick={() => { openModal("timeInput"); }}/>
    </React.Fragment>);

  var loggedOutState = (
    <LoginSignupPage
      createAccountCallback={(email, password) => { return firebaseAppAuth.createUserWithEmailAndPassword(email, password);}}
      loginCallback={(email, password) => { return firebaseAppAuth.signInWithEmailAndPassword(email, password); }}
    />
  );

  var loadingState = (
    <div>loading...</div>
  );

  var context = {
    app: firebaseApp,
    loading: loading,
    error: error,
    user: user,
    db: db,
    openModal: openModal,
    closeModal: closeModal
  }

  if(!loading && user) {
    const querystring = new URLSearchParams(window.location.search);  
    const teamToJoin = querystring.get("joinTeam");
    
    if(teamToJoin && teamToJoin !== '') {
      const teamQuery = db.collection("teams").doc(teamToJoin);

      teamQuery.get().then((doc) => {
        var teamExists = doc.exists;

        if(teamExists) {
          joinTeam(db, user.uid, teamToJoin);
        } else {
          return;
        }
      })
    }
  }

  return (
    <FirebaseContext.Provider value={context}>
      <AppWrapper>
        {loading ? loadingState :
          user ? loggedInState : loggedOutState
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
  background-color: ${Stz.colors.blue};

  background-image: ${Stz.icons.plus};
  background-repeat: no-repeat;
  background-position: center center;
  box-shadow: 0 3px 5px -1px rgba(0,0,0,.2), 0 6px 10px 0 rgba(0,0,0,.14), 0 1px 18px 0 rgba(0,0,0,.12)
`;

// export default withFirebaseAuth({
//   providers,
//   firebaseAppAuth
// })(CrosswordStats);