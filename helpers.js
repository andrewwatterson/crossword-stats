import dateFormat from 'dateformat';
import chrono from 'chrono-node';

import * as firebase from 'firebase/app';
import 'firebase/firestore';

export function prettyTimeFromSeconds(timeInSeconds) {
    return Math.floor(timeInSeconds / 60) + ":" + (timeInSeconds % 60);
}
  
export function shortDateFromTimestamp(date) {
    return dateFormat(date, "ddd, d mmm");
}

export function parseTimeWithCheck(time) {
    var cleanTime = time.replace(/\s/g,'');
    var parts = cleanTime.split(":");

    var parsedTime = null;

    if(parts.length === 2) {
        parsedTime = Number(parts[0] * 60) + Number(parts[1]);
    } else if(parts.length === 3) {
        parsedTime = Number(parts[0] * 3600) + Number(parts[1] * 60) + Number(parts[2]);
    }

    if(prettyTimeFromSeconds(parsedTime) === cleanTime) {
        return parsedTime;
    } else {
        return null;
    }
}

export function parseHumanDateToFirebaseTimestamp(timestamp) {
    var chronoParse = chrono.parse(timestamp);
    var parsedDate = chronoParse[0].start.date();
    var firebaseDate = firebase.firestore.Timestamp.fromDate(parsedDate);

    if(firebaseDate) {
        return firebaseDate;
    } else {
        return null;
    }
}