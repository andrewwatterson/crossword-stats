import React from 'react';

import {FirebaseContext} from './FirebaseContext';
import {Form, InputGroup, SubmitButton} from './ui';

export default class SignupForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      register_name: '',
      register_username: '',
      register_password: ''
    }
  }

  handleChange(evt) {
    this.setState({[evt.target.name]: evt.target.value});
  }

  registerAccount(evt) {
    evt.preventDefault();
    
    this.props.createAccountCallback(this.state.register_username, this.state.register_password)
      .then((data) => {
        if(data.user.uid) {
          this.context.db.collection("profile").doc(data.user.uid).set({
            user: data.user.uid,
            name: this.state.register_name
          })
        }
      })
      // .catch((err) => {console.log(err);});


  }

  render() {
    return (
      <Form>
        <InputGroup>
          <label htmlFor="register_name">Display Name</label>
          <input name="register_name" id="register_name" type="text" onChange={(evt) => this.handleChange(evt)} />
        </InputGroup>
        <InputGroup>
          <label htmlFor="register_username">Email</label>
          <input name="register_username" id="register_username" type="text" onChange={(evt) => this.handleChange(evt)} />
        </InputGroup>
        <InputGroup>
          <label htmlFor="register_password">Password</label>
          <input name="register_password" id="register_password" type="password" onChange={(evt) => this.handleChange(evt)} />
        </InputGroup>
        <SubmitButton onClick={(evt) => this.registerAccount(evt)}>Create Account</SubmitButton>
      </Form>
    );
  }
}

SignupForm.contextType = FirebaseContext;