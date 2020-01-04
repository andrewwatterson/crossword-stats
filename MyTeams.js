import React from 'react';
import cx from 'classnames';

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
        <div className="dateRow">
          <a href="#" onClick={() => { this.prevWeek(); }}>prev week</a>
          <div className="weekNumber">Week of {getPrettyDateFromWeekNumber(weekNo, weekNoYear)}</div>
          <a href="#" className={cx({'disabled': !nextWeekExists})} onClick={() => { this.nextWeek(); }}>next week</a>
        </div>
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
