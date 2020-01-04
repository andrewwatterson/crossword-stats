import dateFormat from 'dateformat';
import chrono from 'chrono-node';

import * as firebase from 'firebase/app';
import 'firebase/firestore';

export function prettyTimeFromSeconds(timeInSeconds) {
    var hours = Math.floor(timeInSeconds / 3600);
    var minutes = Math.floor((timeInSeconds % 3600) / 60);
    var seconds = timeInSeconds % 60;

    if(hours) {
        return hours + ":" + String(minutes).padStart(2, '0') + ":" + String(timeInSeconds % 60).padStart(2, '0');
    } else {
        return minutes + ":" + String(timeInSeconds % 60).padStart(2, '0');
    }

}
  
export function shortDateFromTimestamp(date) {
    return dateFormat(date, "ddd, d mmm");
}

export function shortDateFromCrosswordDate(crosswordDate) {
    var date = new Date(crosswordDate.year, crosswordDate.month - 1, crosswordDate.date);
    return dateFormat(date, "ddd, d mmm");
}

export function dayNames() {
    return ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
}

export function parseTime(time) {
    var cleanTime = time.replace(/\s/g,'');
    var parts = cleanTime.split(":");

    var parsedTime = null;

    if(parts.length === 2) {
        parsedTime = Number(parts[0] * 60) + Number(parts[1]);
    } else if(parts.length === 3) {
        parsedTime = Number(parts[0] * 3600) + Number(parts[1] * 60) + Number(parts[2]);
    }

    return parsedTime;
}

export function parseTimeWithCheck(time) {
    var cleanTime = time.replace(/\s/g,'');
    var parsedTime = parseTime(cleanTime);

    if(prettyTimeFromSeconds(parsedTime) === cleanTime) {
        return parsedTime;
    } else {
        return null;
    }
}

export function getWeekNumber(d) {

    d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay()||7));
    var yearStart = new Date(Date.UTC(d.getUTCFullYear(),0,1));
    var weekNo = Math.ceil(( ( (d - yearStart) / 86400000) + 1)/7);
    return { weekNoYear: d.getUTCFullYear(), weekNo: weekNo };
}

export function getPrettyDateFromWeekNumber(weekNo, weekNoYear) {
    var simple = new Date(weekNoYear, 0, 1 + (weekNo - 1) * 7);
    var dow = simple.getDay();
    var ISOweekStart = simple;
    if (dow <= 4)
        ISOweekStart.setDate(simple.getDate() - simple.getDay() + 1);
    else
        ISOweekStart.setDate(simple.getDate() + 8 - simple.getDay());
    return dateFormat(ISOweekStart, "d mmm, yyyy");
}

export function parseHumanDateToCrosswordDateObject(timestamp) {
    var chronoParse = chrono.parse(timestamp);
    var parsedDate = chronoParse[0].start.date();
    
    return {
        year: parsedDate.getFullYear(),
        month: Number(parsedDate.getMonth()) + 1,
        date: parsedDate.getDate(),
        dayOfWeek: (parsedDate.getDay() + 6) % 7,
        ...getWeekNumber(parsedDate)
    }
}

export function parseHumanDateToJSDate(timestamp) {
    var chronoParse = chrono.parse(timestamp);
    var parsedDate = chronoParse[0].start.date();

    return parsedDate;
}

export function parseHumanDateToFirebaseTimestamp(timestamp) {
    var parsedDate = parseHumanDateToJSDate(timestamp);
    var firebaseDate = firebase.firestore.Timestamp.fromDate(parsedDate);

    if(firebaseDate) {
        return firebaseDate;
    } else {
        return null;
    }
}

export function nonNullMinIndexFromArray(arr) {
    var min;
    for(var a in arr) {
        if(arr[a] && (min == null || arr[a] < arr[min])) { min = a; }
    }

    return min;
}

export function nonNullMaxIndexFromArray(arr) {
    var max;
    for(var a in arr) {
        if(arr[a] && (max == null || arr[a] > arr[max])) { max = a; }
    }

    return max;
}