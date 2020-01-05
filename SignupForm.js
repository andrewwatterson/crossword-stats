import React from 'react';
import {FrontPageForm, InputGroup, SubmitButton} from './ui';

export default class RegisterForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
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
      .catch((error)=> {
        console.log(error.code, error.message);
      })
  }

  render() {
    return (
      <FrontPageForm>
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
      </FrontPageForm>
    );
  }
}
