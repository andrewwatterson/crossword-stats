import React from 'react';

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
    console.log('logging in with', this.state.login_username, this.state.login_password);
    this.props.loginCallback(this.state.login_username, this.state.login_password)
      .catch((error)=> {
        console.log(error.code, error.message);
      })
  }

  render() {
    return (
      <div className="login-form">
        <h3>Login</h3>
        <form action=''>
          <input name="login_username" id="login_username" onChange={(evt) => this.handleChange(evt)} />
          <input name="login_password" id="login_password" type="password" onChange={(evt) => this.handleChange(evt)} />
          <input name="login_submit" id="login_submit" type="submit" onClick={(evt) => this.doLogin(evt)} />
        </form>
      </div>
    );
  }
}
