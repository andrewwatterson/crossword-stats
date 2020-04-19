import * as firebase from 'firebase/app';
import 'firebase/firestore';

import sampleData from './sampleData.json';

import {parseTime, parseHumanDateToCrosswordDateObject} from '../helpers';

import secrets from './secrets';

const firebaseConfig = secrets.firebaseWebConfig;

const firebaseApp = firebase.initializeApp(firebaseConfig, "populate");
const db = firebaseApp.firestore();

var pUids = ['UpK76bxsZbOz7UdGPl7YBzJgHf33', 'oEhHGOTMTbbqzj3tNVfzkc5HqK32', 'AJYuSFbXJEbqv0iH4n1fY0hA9Wb2'];

for(var s in sampleData) {

    for(var i in pUids) {
        var naturalI = Number(i) + 1;
        if(sampleData[s]["p" + naturalI]) {
            var jsDate = parseHumanDateToCrosswordDateObject(sampleData[s]["date"]);
            var dbTime = parseTime(sampleData[s]["p" + naturalI]);

            var dbObj = {
                user: pUids[i],
                time: dbTime,
                ...jsDate
            }

            // commented out for safety
            //const query = db.collection("people").doc(pUids[i]).collection("times").add(dbObj);
        }
    }
}