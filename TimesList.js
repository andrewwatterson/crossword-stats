import React from 'react';

import {FirebaseContext} from './FirebaseContext';

import {prettyTimeFromSeconds, shortDateFromTimestamp} from './helpers';

function TimeRow(props) {
  const rowDate = props.data.date.toDate();

  return(<tr className="time-row"><td>{shortDateFromTimestamp(rowDate)}</td><td>{prettyTimeFromSeconds(props.data.time)}</td></tr>)
}

export default class TimesList extends React.Component {
  
  constructor(props) {
    super(props);

    this.state = {
      rows: Array()
    }
  }

  componentDidMount() {
    const {db, user} = this.context;

    const userId = user.uid;
    
    const query = db.collection("times").where("user", "==", userId).orderBy("date", "desc");

    let newRows = Array();

    query.get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        newRows.push({id: doc.id, data: doc.data()});
      })
      this.setState({rows: newRows});
    })
  }

  render() {

    return (
      <div className="times-list">
        <h3>My Times</h3>
        <table>
          <tbody>
            {this.state.rows.map((row) => {
              return <TimeRow key={row.id} data={row.data} />;
            })}
          </tbody>
        </table>
      </div>
    );
  }
}

TimesList.contextType = FirebaseContext;