import React from 'react';

import {FirebaseContext} from './FirebaseContext';


export default class Team extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
        teamData: null
    }
  }

  componentDidMount() {
    const {db, user} = this.context;
    
    const {weekNo, weekNoYear} = this.props;

    const query = db.collection("times").where("user", "in", this.props.members).where('weekNo', '==', weekNo).where('weekNoYear', '==', weekNoYear);

    var teamData = {};

    for(var m in this.props.members) {
        teamData[this.props.members[m]] = Array();
    }

    query.get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        console.log(doc.data());
        var docData = doc.data();
        teamData[docData.user][docData.dayOfWeek] = docData.time;
      })
      this.setState({teamData: teamData});
    })
  }

  render() {
    return (
      <div className="team">
        {this.props.name}
        <table>
            {Array(0,1,2,3,4,5,6).map((v, i) => {
                return i;
            })}
        </table>
        {this.state.teamData && Object.keys(this.state.teamData).map((member) => {
            return member;
        })}
      </div>
    );
  }
}

Team.contextType = FirebaseContext;
