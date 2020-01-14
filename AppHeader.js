import React, {useContext, useState} from 'react';
import Styled from 'styled-components';
import cx from 'classnames';

import {FirebaseContext} from './FirebaseContext';

function HeaderButton(props) {
  return(
    <button onClick={props.onClick} className={props.icon && ("icon-" + props.icon)}>
      <ButtonIcon />
      {props.children}
    </button>
  );
}

export default function AppHeader(props) {

  const context = useContext(FirebaseContext);

  const [state, setState] = useState({expanded: false})

  const {signOutCallback} = props;

  return(
    <AppHeaderWrapper
      className={cx({'expanded': state.expanded})}
      onClick={() => { setState({expanded: !state.expanded}); }}
    >
      <AppHeaderBody>
        {context.user && <LoginInfo>Welcome, {context.user.email}!</LoginInfo>}
        <ButtonGroup>
          <HeaderButton
            icon="newgroup"
          >
            Create Team
          </HeaderButton>
          <HeaderButton
            icon="logout"
            onClick={signOutCallback}
          >
            Logout
          </HeaderButton>
        </ButtonGroup>
      </AppHeaderBody>
      <AppHeaderTab><strong>Crossword</strong>Stats</AppHeaderTab>
    </AppHeaderWrapper>
  );
}

const headerBodyHeight = 148;
const headerTabHeight = 40;
const shadowBlur = 3;
const shadowOffset = 3;

const AppHeaderWrapper = Styled.div`
  height: ${headerBodyHeight + headerTabHeight}px;
  width: 100%;
  position: absolute;

  transform: translate(0px, ${-1 * (headerBodyHeight + shadowBlur + shadowOffset)}px);

  transition: transform 250ms ease-out;

  &.expanded {
    transform: translate(0px, 0px);
  }
`;

const AppHeaderTab = Styled.div`
  height: ${headerTabHeight}px;
  width: 160px;
  box-sizing: border-box;
  cursor: pointer;

  background-color: white;
  box-shadow: 0px ${shadowOffset}px ${shadowBlur}px 0px rgba(0,0,0,.15);
  border-radius: 0px 0px 3px 3px;

  font-family: stymie, serif;
  font-size: 18px;
  text-align: center;
  line-height: 24px;

  margin: 0 auto;
  padding: 10px 0px 6px 0px;
`;

const AppHeaderBody = Styled.div`
  height: ${headerBodyHeight}px;
  box-sizing: border-box;

  padding: 16px 0px;

  background-color: white;
  box-shadow: 0px ${shadowOffset}px ${shadowBlur}px 0px rgba(0,0,0,.15);
`;

const LoginInfo = Styled.div`
  font-size: 12px;
  text-align: center;
`;

const ButtonGroup = Styled.div`
  text-align: center;

  button {
    border: none;
    outline: none;
    background: none;

    display: inline-flex;
    flex-direction: column;
    align-items: center;

    margin-top: 24px;

    &:not(:last-of-type) {
      margin-right: 56px;
    }
  }
`;

const ButtonIcon = Styled.div`
  height: 48px;
  width: 48px;
  margin-bottom: 4px;

  border-radius: 24px;
  background-color: #4F85E5;
  background-position: center;
  background-repeat: no-repeat;

  .icon-logout & {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cpath fill='%23FFFFFF' d='M10.09 15.59L11.5 17l5-5-5-5-1.41 1.41L12.67 11H3v2h9.67l-2.58 2.59zM19 3H5c-1.11 0-2 .9-2 2v4h2V5h14v14H5v-4H3v4c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z'/%3E%3C/svg%3E");
  }

  .icon-newgroup & {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cpath fill='%23FFFFFF' d='M8 10H5V7H3v3H0v2h3v3h2v-3h3v-2zm10 1c1.66 0 2.99-1.34 2.99-3S19.66 5 18 5c-.32 0-.63.05-.91.14.57.81.9 1.79.9 2.86s-.34 2.04-.9 2.86c.28.09.59.14.91.14zm-5 0c1.66 0 2.99-1.34 2.99-3S14.66 5 13 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm6.62 2.16c.83.73 1.38 1.66 1.38 2.84v2h3v-2c0-1.54-2.37-2.49-4.38-2.84zM13 13c-2 0-6 1-6 3v2h12v-2c0-2-4-3-6-3z'/%3E%3C/svg%3E");
  }
`;