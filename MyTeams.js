import React from 'react';

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
    
    const query = db.collection("teams").where("members", "array-contains-any", [userId]);

    var teams = Array();

    query.get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        teams.push(doc.data());
      })
      this.setState({teams: teams});
    })
  }

  render() {
    const {weekNo, weekNoYear} = this.state;
    return (
      <div className="teams">
        <div className="weekNumber">Week of {getPrettyDateFromWeekNumber(weekNo, weekNoYear)}</div>
        {this.state.teams.map((team) => {
            return <Team {...{
              key: team.name,
              weekNo,
              weekNoYear,
              ...team
            }} />
        })}
      </div>
    );
  }
}

MyTeams.contextType = FirebaseContext;
