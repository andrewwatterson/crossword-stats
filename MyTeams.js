import React from 'react';
import cx from 'classnames';
import Styled from 'styled-components';

import Team from './Team';

import {FirebaseContext} from './FirebaseContext';
import {getPrettyDateFromWeekNumber, getWeekNumber} from './helpers';

export default class MyTeams extends React.Component {
  constructor(props) {
    super(props);

    const weekNumberObj = getWeekNumber(new Date());

    this.state = {
        teams: Array(),
        weekNo: weekNumberObj.weekNo,
        weekNoYear: weekNumberObj.weekNoYear
    }
  }

  componentDidMount() {
    const {db, user} = this.context;

    const userId = user.uid;
    
    const query = db.collection("profile").doc(userId);

    query.get().then((docSnapshot) => {
      this.setState({teams: docSnapshot.data().teams});
    });
  }

  prevWeek() {
    if(this.state.weekNo === 1) {
      this.setState({weekNoYear: this.state.weekNoYear - 1, weekNo: 52})
    } else {
      this.setState({weekNo: this.state.weekNo - 1})
    }
  }

  nextWeekExists() {
    const currentWeek = getWeekNumber(new Date());

    return !(this.state.weekNo === currentWeek.weekNo && this.state.weekNoYear === currentWeek.weekNoYear)
  }

  nextWeek() {

    if(this.nextWeekExists()) {
      if(this.state.weekNo === 52) {
        this.setState({weekNoYear: this.state.weekNoYear + 1, weekNo: 1});
      } else {
        this.setState({weekNo: this.state.weekNo + 1});
      }
    }
  }

  render() {
    const {weekNo, weekNoYear} = this.state;
    
    const nextWeekExists = this.nextWeekExists();
    return (
      <div className="teams">
        <DateRow>
          <LeftArrow href="#" onClick={() => { this.prevWeek(); }} alt="Previous Week"></LeftArrow>
          <div className="weekNumber">Week of {getPrettyDateFromWeekNumber(weekNo, weekNoYear)}</div>
          <RightArrow href="#" className={cx({'disabled': !nextWeekExists})} onClick={() => { this.nextWeek(); }} alt="Next Week"></RightArrow>
        </DateRow>
        {this.state.teams.map((team) => {
            return <Team {...{
              key: team,
              weekNo,
              weekNoYear,
              id: team
            }} />
        })}
      </div>
    );
  }
}

MyTeams.contextType = FirebaseContext;

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