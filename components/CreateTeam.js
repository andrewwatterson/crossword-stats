import React, {useState, useContext} from 'react';

import {createTeam, joinTeam} from '../db';

import {Modal, ModalForm} from './ui/Modal';
import {InputGroup, SubmitButton} from './ui/ui';

import {FirebaseContext} from '../FirebaseContext';

export default function CreateTeam(props) {

  const context = useContext(FirebaseContext);
  const [form, handleForm] = useState({createteam_name: ""});

  function handleChange(evt) {
    handleForm({[evt.target.name]: evt.target.value});
  }

  function submitNewTeam(evt) {
    evt.preventDefault();

    const {db, user} = context;

    const userId = user.uid;

    if(form.createteam_name !== '') {
      createTeam(db, userId, form.createteam_name).then((teamId) => {
        joinTeam(db, userId, teamId);
      });
    } else {
      // you need to enter a name
    }
  }

  return(
    <Modal
      title="Create Team"
    >
      <ModalForm>
        <InputGroup>
            <label htmlFor="createteam_name">Name</label>
            <input name="createteam_name" type="text" id="createteam_name" onChange={(evt) => handleChange(evt)} />
          </InputGroup>
          <SubmitButton onClick={(evt) => { submitNewTeam(evt); }}>Create Team</SubmitButton>
      </ModalForm>
    </Modal>
  );
}