import React from 'react';
import Styled from 'styled-components';

import {FirebaseContext} from './FirebaseContext';

import {parseTimeWithCheck, parseHumanDateToCrosswordDateObject} from './helpers';
import {Form, InputGroup, SubmitButton} from './ui';
import {Modal, ModalForm} from './Modal';

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
    var parsedTimestamp = parseHumanDateToCrosswordDateObject(this.state.timeinput_date);

    const {db, user} = this.context;

    const userId = user.uid;

    if(parsedTime === null || parsedTimestamp === null) {
        console.log('value error!', parsedTime, parsedTimestamp);
    } else {
      console.log('committing', parsedTime, parsedTimestamp);
      
      const dupQuery = db.collection("times")
        .where("user", "==", userId)
        .where("year", "==", parsedTimestamp.year)
        .where("month", "==", parsedTimestamp.month)
        .where("date", "==", parsedTimestamp.date);

      dupQuery.get().then((querySnapshot) => {
        if(querySnapshot.size > 0) {
          querySnapshot.forEach((doc) => {
            db.collection("times").doc(doc.id).update({time: parsedTime});
            this.props.closeModalCallback();
          });
        } else {
          const query = db.collection("times").add({
            time: parsedTime,
            user: userId,
            ...parsedTimestamp
          }).then(this.props.closeModalCallback);
        }
      })
    }
  }

  render() {

    const today = new Date();
    const todayAsInputString = today.toJSON().slice(0,10);

    return (
      <Modal
        title="Add a time"
      >
        <ModalForm>
          <InputGroup>
            <label htmlFor="timeinput_date">Date</label>
            <input name="timeinput_date" type="date" id="timeinput_date" value={todayAsInputString} onChange={(evt) => this.handleChange(evt)} />
          </InputGroup>
          <InputGroup>
            <label htmlFor="timeinput_time">Time</label>
            <input name="timeinput_time" type="text" id="timeinput_time" onChange={(evt) => this.handleChange(evt)} />
          </InputGroup>
          <SubmitButton onClick={(evt) => {this.addTime(evt)}}>Add Time</SubmitButton>
        </ModalForm>
      </Modal>
    );
  }
}

TimeInput.contextType = FirebaseContext;