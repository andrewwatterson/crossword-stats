import React from 'react';
import Styled from 'styled-components';

import {FirebaseContext} from './FirebaseContext';

import {parseTimeWithCheck, parseHumanDateToCrosswordDateObject} from './helpers';
import {Form, InputGroup, SubmitButton} from './ui';

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

    return (
      <ModalFader>
        <ModalWrapper>
          <CloseButtonRow>
            <CloseButton onClick={() => {this.props.closeModalCallback()}} />
          </CloseButtonRow>
          <div className="time-input">
            <ModalTitle>Add a Time</ModalTitle>
            <ModalForm>
              <InputGroup>
                <label htmlFor="timeinput_date">Date</label>
                <input name="timeinput_date" type="date" id="timeinput_date" onChange={(evt) => this.handleChange(evt)} />
              </InputGroup>
              <InputGroup>
                <label htmlFor="timeinput_time">Time</label>
                <input name="timeinput_time" type="text" id="timeinput_time" onChange={(evt) => this.handleChange(evt)} />
              </InputGroup>
              <SubmitButton onClick={(evt) => {this.addTime(evt)}}>Add Time</SubmitButton>
            </ModalForm>    
          </div>
        </ModalWrapper>
      </ModalFader>
    );
  }
}

TimeInput.contextType = FirebaseContext;

const ModalFader = Styled.div`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: rgba(255,255,255, .95);
`;

const ModalWrapper = Styled.div`
  max-width: 500px;
  margin: 0 auto;
`;

const ModalTitle = Styled.div`
  font-family: stymie, serif;
  font-size: 36px;
  text-align: center;

  margin-bottom: 36px;
`;

const ModalForm = Styled(Form)`
  padding-left: 0px;
  padding-right: 0px;
`;

const CloseButtonRow = Styled.div`
  display: flex;
  justify-content: flex-end;

  margin-top: 12px;
  margin-bottom: 24px;
`;

const CloseButton = Styled.button`
  height: 32px;
  width: 32px;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cpath fill='%23000000' d='M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z'/%3E%3Cpath d='M0 0h24v24H0z' fill='none'/%3E%3C/svg%3E");
  background-size: 32px 32px;
  border: none;
`;