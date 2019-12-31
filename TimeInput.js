import React from 'react';

import {FirebaseContext} from './FirebaseContext';

import {parseTimeWithCheck, parseHumanDateToFirebaseTimestamp} from './helpers';

export default class TimeInput extends React.Component {
  
  constructor(props) {
    super(props);

    this.state = {
        timeinput_time: '',
        timeinput_date: ''
    }
  }

  handleChange(evt) {
    this.setState({[evt.target.name]: evt.target.value});
  }

  addTime(evt) {
    evt.preventDefault();

    var parsedTime = parseTimeWithCheck(this.state.timeinput_time);
    var parsedTimestamp = parseHumanDateToFirebaseTimestamp(this.state.timeinput_date);

    const {db, user} = this.context;

    const userId = user.uid;
    
    if(parsedTime === null || parsedTimestamp === null) {
        console.log('value error!', parsedTime, parsedTimestamp);
    } else {
      console.log('committing', parsedTime, parsedTimestamp);
  
      const query = db.collection("times").add({
        date: parsedTimestamp,
        time: parsedTime,
        user: userId
      });
    }
  }

  render() {

    return (
      <div className="time-input">
        <h3>Enter a Time</h3>
        <form action=''>
            <label htmlFor="timeinput_date">Date</label>
            <input name="timeinput_date" id="timeinput_date" onChange={(evt) => this.handleChange(evt)} />
            <label htmlFor="timeinput_time">Time</label>
            <input name="timeinput_time" id="timeinput_time" onChange={(evt) => this.handleChange(evt)} />
            <button onClick={(evt) => {this.addTime(evt)}}>Do a Thing</button>
        </form>    
      </div>
    );
  }
}

TimeInput.contextType = FirebaseContext;