import React, {useState, useContext, useEffect} from 'react';
import cx from 'classnames';
import Styled from 'styled-components';

import { useDocumentData } from 'react-firebase-hooks/firestore';
import {watchTeams} from './db';

import Team from './Team';

import {FirebaseContext} from './FirebaseContext';
import {getPrettyDateFromWeekNumber, getWeekNumber} from './helpers';

export default function MyTeams(props) {
  var context = useContext(FirebaseContext);

  const weekNumberObj = getWeekNumber(new Date());

  const [selectedDate, setSelectedDate] = useState({
    weekNo: weekNumberObj.weekNo,
    weekNoYear: weekNumberObj.weekNoYear
  });

  const {db, user} = context;

  const userId = user.uid;

  const [userDoc, loading, error] = useDocumentData(db.collection("profile").doc(userId));

  function nextWeekExists() {
    const currentWeek = getWeekNumber(new Date());

    return !(selectedDate.weekNo === currentWeek.weekNo && selectedDate.weekNoYear === currentWeek.weekNoYear)
  }

  function prevWeek() {
    if(selectedDate.weekNo === 1) {
      setSelectedDate({weekNoYear: selectedDate.weekNoYear - 1, weekNo: 52})
    } else {
      setSelectedDate({weekNo: selectedDate.weekNo - 1, weekNoYear: selectedDate.weekNoYear})
    }
  }

  function nextWeek() {

    if(nextWeekExists()) {
      if(selectedDate.weekNo === 52) {
        setSelectedDate({weekNoYear: selectedDate.weekNoYear + 1, weekNo: 1});
      } else {
        setSelectedDate({weekNo: selectedDate.weekNo + 1, weekNoYear: selectedDate.weekNoYear});
      }
    }
  }

  const teams = userDoc && userDoc.teams;
  const {weekNo, weekNoYear} = selectedDate;

  return (
    <div className="teams">
      {teams &&
        <DateRow>
          <LeftArrow href="#" onClick={prevWeek} alt="Previous Week"></LeftArrow>
          <div className="weekNumber">Week of {getPrettyDateFromWeekNumber(weekNo, weekNoYear)}</div>
          <RightArrow href="#" className={cx({'disabled': !nextWeekExists()})} onClick={nextWeek} alt="Next Week"></RightArrow>
        </DateRow>
      }
      {teams === undefined && 
        <div>you don't have any teams</div>
      }
      {teams && teams.map((team) => {
        return <Team {...{
          key: team,
          weekNo,
          weekNoYear,
          id: team
        }} />
      })}
      {teams && teams.length == 0 &&
        <div>join some teams!</div>
      }
    </div>
  );
}

const DateRow = Styled.div`
  font-family: stymie, serif;
  font-size: 21px;
  padding: 0px 8px 0px 16px;
  margin-bottom: 24px;

  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const LeftArrow = Styled.a`
  height: 24px;
  width: 24px;

  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cpath d='M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z'/%3E%3Cpath fill='none' d='M0 0h24v24H0V0z'/%3E%3C/svg%3E");
`;

const RightArrow = Styled(LeftArrow)`
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cpath d='M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z'/%3E%3Cpath fill='none' d='M0 0h24v24H0V0z'/%3E%3C/svg%3E");

  &.disabled {
    cursor: not-allowed;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cpath fill='%23999999' d='M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z'/%3E%3Cpath fill='none' d='M0 0h24v24H0V0z'/%3E%3C/svg%3E");
  }
`;