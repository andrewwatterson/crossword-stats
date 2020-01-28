import React from 'react';

import {Modal, ModalForm} from './Modal';
import {Button, InputGroup} from './ui';

export default function InviteLink(props) {

  function copyLink(evt) {
    evt.preventDefault();

    var copyText = document.getElementById("invitelink_link");
    
    copyText.select();
    copyText.setSelectionRange(0, 99999); /*For mobile devices*/
    
    document.execCommand("copy");
  }

  function buildInviteLink() {
    const origin = window.location.origin;
    const path = window.location.pathname;
    const qString = "?joinTeam="
    const {teamId} = props;

    return origin + path + qString + teamId;
  }

  return(
    <Modal
      title="Invite"
    >
      <ModalForm>
        <InputGroup>
          <label htmlFor="invitelink_link">Link</label>
          <input name="invitelink_link" type="text" readOnly id="invitelink_link" value={buildInviteLink()} />
        </InputGroup>
        <Button onClick={(evt) => { copyLink(evt); }}>Copy Link</Button>
      </ModalForm>
    </Modal>
  );
}