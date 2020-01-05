import React from 'react';
import {FrontPageForm, InputGroup, SubmitButton} from './ui';

export default class LoginForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      login_username: '',
      login_password: ''
    }
  }

  handleChange(evt) {
    this.setState({[evt.target.name]: evt.target.value});
  }

  doLogin(evt) {
    evt.preventDefault();
    this.props.loginCallback(this.state.login_username, this.state.login_password)
      .catch((error)=> {
        console.log(error.code, error.message);
      })
  }

  render() {
    return (
      <FrontPageForm>
        <InputGroup>
          <label htmlFor="login_username">Email</label>
          <input name="login_username" id="login_username" type="text" onChange={(evt) => this.handleChange(evt)} />
        </InputGroup>
        <InputGroup>
          <label htmlFor="login_password">Password</label>
          <input name="login_password" id="login_password" type="password" onChange={(evt) => this.handleChange(evt)} />
        </InputGroup>

        <SubmitButton onClick={(evt) => this.doLogin(evt)}>Log In</SubmitButton>
      </FrontPageForm>
    );
  }
}