import React, { useState, useEffect, useContext}  from 'react';
import cx from 'classnames';

import {FirebaseContext} from './FirebaseContext';

import {prettyTimeFromSeconds, dayNames, nonNullMaxIndexFromArray, nonNullMinIndexFromArray} from './helpers';

import './team.css';


export default function Team(props) {
  const [times, setTimes] = useState({ timesByDay: null, totalWins: null, totalTime: null });
  const [teamInfo, setTeamInfo] = useState({ name: '', members: Array() });
  const context = useContext(FirebaseContext);

  useEffect(() => {
    const {db} = context;
    const {id} = props;

    var queries = Array();
    var newTeamInfo = {};

    const nameQuery = db.collection("teams").doc(id);
    queries.push(nameQuery.get());

    const membersQuery = db.collection("profile").where("teams", "array-contains", id);
    queries.push(membersQuery.get());

    Promise.all(queries).then((results) => {
      var nameResult = results[0];
      var membersResult = results[1];

      newTeamInfo.name = nameResult.data().name;
      
      newTeamInfo.members = Array();

      membersResult.forEach((doc) => {
        var docData = doc.data();
        newTeamInfo.members.push({id: doc.id, name: docData.name});
      });
  
      setTeamInfo(newTeamInfo);
    })
  }, [props.id]);

  useEffect(() => {
    const {db, user} = context;
    
    const {weekNo, weekNoYear} = props;
    const {members} = teamInfo;


    if(members.length > 0) {

      var memberIds = members.map((m)=>{return m.id;});

      const query = db.collection("times").where("user", "in", memberIds).where('weekNo', '==', weekNo).where('weekNoYear', '==', weekNoYear);

      query.onSnapshot((querySnapshot) => {
        var timesByDay = {};
        var totalWins = Array(members.length);
        var totalTime = Array(members.length);
    
        for(var d = 0; d < 7; d++) {
          timesByDay[d] = Array(members.length);
  
          for(var m = 0; m < members.length; m++) {
            timesByDay[d][m] = null;
          }
        }
    
        for(var m = 0; m < members.length; m++) {
          totalWins[m] = 0;
          totalTime[m] = 0;
        }

        querySnapshot.forEach((doc) => {

          var docData = doc.data();
          var memberIndex = memberIds.indexOf(docData.user);
          timesByDay[docData.dayOfWeek][memberIndex] = docData.time;
          totalTime[memberIndex] += docData.time;
        })
  
        for(d in timesByDay) {
          totalWins[nonNullMinIndexFromArray(timesByDay[d])]++;
        }
  
        setTimes({timesByDay: timesByDay, totalWins: totalWins, totalTime: totalTime});
      })
    }

  }, [props.weekNo, teamInfo.members]);

  const {timesByDay, totalWins, totalTime} = times;

  return (
    <div className="team">
      {teamInfo.name}
      <table>
        <tbody>
          <tr>
            <td></td>
            {teamInfo.members.length > 0 && teamInfo.members.map((m, i) => {
              return <td key={i}>{m.name}</td>
            })}
          </tr>
          {timesByDay && Object.keys(timesByDay).map((day) => {

              var min = nonNullMinIndexFromArray(timesByDay[day]);
              var max = nonNullMaxIndexFromArray(timesByDay[day]);
              return (
                  <tr key={day}>
                    <td>{dayNames()[day]}</td>
                    {timesByDay[day].map((member, i) => {
                      return (
                        <td
                          key={day + "-" + i}
                          className={cx({
                            'standing-lowest': Number(max) === Number(i),
                            'standing-highest': Number(min) === Number(i)
                          })}
                        >
                          {member && prettyTimeFromSeconds(member)}
                        </td>
                      );
                    })}
                  </tr>
              );
          })}
          <tr>
            <td></td>
            {teamInfo.members.map((m, i) => {
              return <td key={i}>{totalWins && totalWins[i]}</td>
            })}
          </tr>
          <tr>
            <td></td>
            {teamInfo.members.map((m, i) => {
              return <td key={i}>{totalTime && prettyTimeFromSeconds(totalTime[i])}</td>
            })}
          </tr>
        </tbody>
      </table>
    </div>
  );
}