import React, {useContext, useState} from 'react';
import Styled from 'styled-components';
import cx from 'classnames';

import * as Stz from './style.js';

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
            onClick={() => { context.openModal('createTeam'); }}
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
  background-color: ${Stz.colors.blue};
  background-position: center;
  background-repeat: no-repeat;

  .icon-logout & {
    background-image: ${Stz.icons.logout};
  }

  .icon-newgroup & {
    background-image: ${Stz.icons.groupAdd};
  }
`;