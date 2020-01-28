import React, {useContext} from 'react';
import Styled from 'styled-components';

import {FirebaseContext} from './FirebaseContext';

import {Form} from './ui';
import * as Stz from './style.js';

function Modal(props) {

  const context = useContext(FirebaseContext);

  var closeFunction = props.closeCallback ? props.closeCallback : context.closeModal;

  return (
    <ModalFader onClick={(e) => {e.stopPropagation();}}>
    <ModalWrapper>
      <CloseButtonRow>
        <CloseButton onClick={closeFunction} />
      </CloseButtonRow>
      <ModalContentWrapper>
        <ModalTitle>{props.title}</ModalTitle>
        {props.children}
      </ModalContentWrapper>
    </ModalWrapper>
    </ModalFader>
  );
}

const ModalFader = Styled.div`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: rgba(255,255,255, .95);
  z-index: 10;
`;

const ModalWrapper = Styled.div`
  max-width: 500px;
  margin: 0 auto;
`;

const ModalTitle = Styled.div`
  font-family: ${Stz.fonts.headline};
  font-size: 36px;
  text-align: center;

  margin-bottom: 36px;
`;

const ModalContentWrapper = Styled.div`
  padding: 24px 24px 48px 24px;
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
  background-image: ${Stz.icons.close};
  background-size: 32px 32px;
  border: none;
`;

export {Modal as default, Modal, ModalForm};