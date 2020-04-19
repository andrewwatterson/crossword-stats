import React from 'react';

import {FirebaseContext} from '../FirebaseContext';

import {parseTimeWithCheck, parseHumanDateToCrosswordDateObject} from '../helpers';
import {FormError, InputGroup, SubmitButton} from './ui/ui';
import {Modal, ModalForm} from './ui/Modal';

export default class TimeInput extends React.Component {
  
  constructor(props) {
    super(props);

    const today = new Date();
    const todayAsInputString = today.toJSON().slice(0,10);

    this.state = {
      timeinput_time: '',
      timeinput_date: todayAsInputString,
      timeinput_disabled: false,
      timeinput_error: null
    }
  }

  handleChange(evt) {
    this.setState({[evt.target.name]: evt.target.value});
  }

  addTime(evt) {
    evt.preventDefault();
    this.setState({timeinput_disabled: true, timeinput_error: null});

    var parsedTime = parseTimeWithCheck(this.state.timeinput_time);
    var parsedTimestamp = parseHumanDateToCrosswordDateObject(this.state.timeinput_date);

    const {db, user, closeModal} = this.context;

    const userId = user.uid;

    if(parsedTime === null || parsedTimestamp === null) {
        console.log('value error!', parsedTime, parsedTimestamp);
        this.setState({
          timeinput_error: "Please enter your time as either MM:SS or HH:MM:SS",
          timeinput_disabled: false
        })
    } else {
      console.log('committing', parsedTime, parsedTimestamp);
      
      const dupQuery = db.collection("times")
        .where("user", "==", userId)
        .where("year", "==", parsedTimestamp.year)
        .where("month", "==", parsedTimestamp.month)
        .where("date", "==", parsedTimestamp.date);

      dupQuery.get().then((querySnapshot) => {
        if(querySnapshot.size > 0) {
          
          var previousTimes = Array();
          
          querySnapshot.forEach((doc) => {
            previousTimes.push(db.collection("times").doc(doc.id).delete());
          });

          return Promise.all(previousTimes);
        }
      }).then(() => {
        return db.collection("times").add({
          time: parsedTime,
          user: userId,
          ...parsedTimestamp
        }).catch((err) => console.log(err))
      }).then(closeModal);
    }
  }

  render() {

    return (
      <Modal
        title="Add a time"
      >
        <ModalForm>
          {this.state.timeinput_error && <FormError>{this.state.timeinput_error}</FormError>}
          <InputGroup>
            <label htmlFor="timeinput_date">Date</label>
            <input name="timeinput_date" type="date" id="timeinput_date" defaultValue={this.state.timeinput_date} onChange={(evt) => this.handleChange(evt)} />
          </InputGroup>
          <InputGroup>
            <label htmlFor="timeinput_time">Time</label>
            <input name="timeinput_time" type="text" id="timeinput_time" onChange={(evt) => this.handleChange(evt)} />
          </InputGroup>
          <SubmitButton disabled={this.state.timeinput_disabled} onClick={(evt) => {this.addTime(evt)}}>Add Time</SubmitButton>
        </ModalForm>
      </Modal>
    );
  }
}

TimeInput.contextType = FirebaseContext;