import React, {useState} from 'react';
import Styled from 'styled-components';
import cx from 'classnames';

import SignupForm from './SignupForm';
import LoginForm from './LoginForm';


export default function LoginSignupPage(props) {
  const [selectedTab, setTab] = useState({tab: 'login'});

  return (
    <>
      <HomepageTitle><strong>Crossword</strong><br />Stats</HomepageTitle>
      <CardWrapper>
        <CardTabs>
          <CardTab
            className={cx({'selected': selectedTab.tab == 'login'})}
            onClick={(e) => { setTab({tab: 'login'}); }}
          >
            Log In
          </CardTab>
          <CardTab
            className={cx({'selected': selectedTab.tab == 'signup'})}
            onClick={(e) => { setTab({tab: 'signup'}); }}
          >
            Sign Up
          </CardTab>
        </CardTabs>
        {selectedTab.tab === 'signup' &&
          <SignupForm createAccountCallback={props.createAccountCallback}></SignupForm>}
        {selectedTab.tab === 'login' &&
          <LoginForm loginCallback={props.loginCallback}></LoginForm>}
      </CardWrapper>
    </>
  );
}

const HomepageTitle = Styled.div`
  font-family: stymie;

  font-size: 40px;
  line-height: 1;

  text-align: center;

  margin-top: 80px;
  margin-bottom: 60px;
`;

const CardWrapper = Styled.div`
  border-radius: 3px;
  margin: 0px 24px;
  max-width: 500px;
  box-shadow: 0px 0px 4px 0px rgba(0,0,0,.25);
`;

const CardTabs = Styled.div`
  display: flex;
`;

const CardTab = Styled.button`

  font-family: stymie !important;
  font-size: 21px;
  padding: 16px 0px;

  cursor: pointer;
  outline: none;
  flex: 1 1 auto;
  background-color: #f2f2f2;
  box-shadow: inset 0px 1px 0px 0px white;

  border: 1px solid #cccccc;
  border-top-color: transparent;

  &:first-of-type {
    border-radius-top-left: 3px;
    border-left-color: transparent;
    box-shadow: inset 1px 1px 0px 0px white;
  }

  &:last-of-type {
    border-radius-top-right: 3px;
    border-right-color: transparent;
    box-shadow: inset -1px 1px 0px 0px white;
  }

  &.selected {
    border-color: transparent;
    background-color: white;
  }
`;