import React, { useState, useEffect, useContext}  from 'react';
import Styled from 'styled-components';
import cx from 'classnames';

import {FirebaseContext} from '../FirebaseContext';

import * as Stz from '../style';
import {leaveTeam} from '../db';
import {prettyTimeFromSeconds, dayNames, mapArrayToRank, nonNullMinIndicesFromArray, getDateFromWeekNumber} from '../helpers';
import {Card} from './ui/ui';
import DropdownMenu from './ui/DropdownMenu';

export default function Team(props) {
  const [times, setTimes] = useState({ timesByDay: null, totalWins: null, totalTime: null });
  const [teamInfo, setTeamInfo] = useState({ name: '', members: Array() });
  const context = useContext(FirebaseContext);

  const {db, user, openModal} = context;
  const {id, weekNo, weekNoYear} = props;

  useEffect(() => {


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
  }, [id]);

  useEffect(() => {

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
          var dayWinners = nonNullMinIndicesFromArray(timesByDay[d]);

          for (var win in dayWinners) {
            totalWins[dayWinners[win]]++;
          }
        }
  
        setTimes({timesByDay: timesByDay, totalWins: totalWins, totalTime: totalTime});
      })
    }

  }, [weekNo, teamInfo.members]);

  const {timesByDay, totalWins, totalTime} = times;
  const winsRanks = mapArrayToRank(totalWins, true);

  const dropdownOptions = [
    {label: "Get Invite Link", action: () => { openModal("inviteLink", {teamId: id}) }},
    {label: "Leave Team", action: () => { leaveTeam(db, user.uid, id) }}
  ];

  const getCxForRank = (rank, isTie) => {
    let classArray = [];

    if(teamInfo.members.length > 3) {
      rank === 1 && classArray.push('standing-first');
      rank === 2 && classArray.push('standing-second');
      rank === 3 && classArray.push('standing-third');

      if(isTie) { classArray.push('standing-tie-olympic'); }
    } else {
      rank === 1 && classArray.push('standing-highest');
      rank === teamInfo.members.length && classArray.push('standing-lowest');

      if(isTie) { classArray.push('standing-tie'); }
    }

    return classArray;
  }

  return (
    <TeamScrollWrapper>
      <TeamCard>
        <TitleRow>
          <TeamTitle>{teamInfo.name}</TeamTitle>
          <DropdownMenu
            anchor={EllipsisButton}
            options={dropdownOptions}
          />
        </TitleRow>

        <ResultsTable>
          <thead>
            <tr>
              <td></td>
              {teamInfo.members.length > 0 && teamInfo.members.map((m, i) => {
                return <NameCell key={i}>{m.name}</NameCell>
              })}
            </tr>
            <ShadedRow className="times-row">
              <TitleCell className="shaded">Wins</TitleCell>
              {teamInfo.members.map((m, i) => {
                const winsRank = winsRanks[i];
                const isTie = winsRanks.indexOf(winsRank) !== winsRanks.lastIndexOf(winsRank);

                const classArray = getCxForRank(winsRank, isTie);

                return (
                  <TimeCell key={i}>
                    <TimeContainer
                      className={cx(classArray)}
                    >
                      {totalWins && totalWins[i]}
                    </TimeContainer>
                  </TimeCell>);
              })}
            </ShadedRow>
            <ShadedRow className="wins-row">
              <TitleCell className="shaded">Time</TitleCell>
              {teamInfo.members.map((m, i) => {
                return <TimeCell key={i}>{totalTime && prettyTimeFromSeconds(totalTime[i])}</TimeCell>
              })}
            </ShadedRow>
          </thead>
          <tbody>

            {timesByDay && Object.keys(timesByDay).map((day) => {
                var dayRanks = mapArrayToRank(timesByDay[day]);
                return (
                    <tr key={day}>
                      <TitleCell>{dayNames()[day]}</TitleCell>
                      {timesByDay[day].map((member, i) => {
                        const dayRank = dayRanks[i];
                        const isTie = dayRanks.indexOf(dayRank) !== dayRanks.lastIndexOf(dayRank);

                        const classArray = getCxForRank(dayRank, isTie);

                        const isEditable = user.uid === teamInfo.members[i].id;
                        const date = getDateFromWeekNumber(weekNo, weekNoYear);
                        date.setDate(date.getDate() + Number(day));
                        const timeInputDateString = date.toJSON().slice(0, 10); 

                        return (
                          <TimeCell key={day + "-" + i}>
                            <TimeContainer
                              className={cx({ "editable": isEditable }, classArray)}
                              onClick={isEditable
                                ? () => openModal("timeInput", { initialDate: timeInputDateString })
                                : undefined}
                            >
                              {member && prettyTimeFromSeconds(member)}
                            </TimeContainer>
                          </TimeCell>
                        );
                      })}
                    </tr>
                );
            })}
          </tbody>
        </ResultsTable>
      </TeamCard>
      <Spacer />
    </TeamScrollWrapper>
  );
}

// hello

const EllipsisButton = Styled.button`
  height: 24px;
  width: 24px;
  margin-top: -4px;
  background-image: ${Stz.icons.ellipsis};
`;


const TeamScrollWrapper = Styled.div`
  max-width: 100vw;
  overflow: auto;

  padding: 4px;
  box-sizing: border-box;

  display: flex;
  margin-bottom: 16px;
`;

const Spacer = Styled.div`
  flex: 0 0 12px;
`;

const TeamCard = Styled(Card)`
  padding: 20px;
  margin: 0px;
  margin-left: 12px;

  max-width: none;
  width: auto;
`;

const TitleRow = Styled.div`
  display: flex;
  align-items: center;

  margin-bottom: 12px;
`;

const TeamTitle = Styled.div`
  font-family: stymie, serif;
  font-size: 21px;

  flex: 1 1 auto;
`;

const ResultsTable = Styled.table`

  &, tr, td {
    border: none;
    border-collapse: collapse;
  }

  thead tr:first-child td {
    padding-bottom: 8px;
  }

  tbody tr:first-child td {
    padding-top: 8px;
  }
`;

const TitleCell = Styled.td`
  padding: 0px 24px 0px 12px;
  text-align: right;
  color: ${Stz.colors.gray99};
`;

const NameCell = Styled.td`
  text-align: center;
  font-weight: bold;
`;

const TimeCell = Styled.td`
  text-align: center;
  padding: 1px 4px;
`;

const TimeContainer = Styled.div`
  width: 72px;
  height: 28px;
  line-height: 28px;

  &.standing-highest {
    background-color: ${Stz.colors.lightGreen};
  }

  &.standing-lowest {
    background-color: ${Stz.colors.lightRed};
  }

  &.standing-tie {
    background-color: ${Stz.colors.lightYellow};
  }

  &.standing-first {
    background-color: ${Stz.colors.gold};
  }

  &.standing-second {
    background-color: ${Stz.colors.silver};
  }

  &.standing-third {
    background-color: ${Stz.colors.bronze};
  }

  &.standing-tie-olympic {
    font-weight: bold;
  }

  &.editable {
    cursor: pointer;
  }
`;

const ShadedRow = Styled.tr`
  background-color: ${Stz.colors.grayF5};

  td:last-child {
    padding-right: 8px;
  }

  &.times-row td {
    padding-top: 8px;
  }

  &.wins-row td {
    padding-bottom: 8px;
  }

  ${TitleCell} {
    color: black;
    background-color: ${Stz.colors.grayEB};
  }
`;
