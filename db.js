import * as firebase from 'firebase/app';
import 'firebase/firestore';

function createTeam(db, creator, teamName) {

  return db.collection("teams").add({
    name: teamName,
    creator: creator,
  }).then((response) => {
    return response.id;
  });
}

function joinTeam(db, userId, teamId) {
  return db.collection("profile").doc(userId).update({
    teams: firebase.firestore.FieldValue.arrayUnion(teamId)
  });
}

function leaveTeam(db, userId, teamId) {
  return db.collection("profile").doc(userId).update({
    teams: firebase.firestore.FieldValue.arrayRemove(teamId)
  });
}

export {createTeam, joinTeam, leaveTeam};