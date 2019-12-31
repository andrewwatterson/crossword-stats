import React from 'react';

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
      <div className="register-form">
        <h3>Register for an Account</h3>
        <form action=''>
          <input name="register_username" id="register_username" onChange={(evt) => this.handleChange(evt)} />
          <input name="register_password" id="register_password" type="password" onChange={(evt) => this.handleChange(evt)} />
          <input name="register_submit" id="register_submit" type="submit" onClick={(evt) => this.registerAccount(evt)} />
        </form>
      </div>
    );
  }
}
