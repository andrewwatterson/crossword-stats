import React from 'react';
import Styled from 'styled-components';

import EventListener from 'react-event-listener';

import * as Stz from './style';

export default class DropdownMenu extends React.PureComponent {
  constructor(props) {
    super(props);

    this.anchorRef = React.createRef();

    this.state = {
      open: false
    }
  }

  toggleDropdown() {
    this.setState({open: !this.state.open});
  }

  closeDropdown() {
    this.setState({open: false});
  }

  render() {

    const Anchor = this.props.anchor;

    const anchorHeight = this.anchorRef.current && this.anchorRef.current.getBoundingClientRect().height;

    return(
      <DropdownWrapper>
        <EventListener
          target="window"
          onClick={() => this.closeDropdown()}
        />
        <Anchor ref={this.anchorRef} onClick={(evt) => { evt.stopPropagation(); this.toggleDropdown(); }} />
        {this.state.open &&
          <DropdownOptions topOffset={anchorHeight}>
            {this.props.options && this.props.options.map((opt, i) => {
              return <DropdownItem key={i} onClick={opt.action}>{opt.label}</DropdownItem>
            })}
          </DropdownOptions>
        }
      </DropdownWrapper>
    );
  }
}

const DropdownWrapper = Styled.div`
  position: relative;
`;

const DropdownOptions = Styled.div`
  position: absolute;
  background-color: white;

  padding: 8px 0px;
  border-radius: ${Stz.radius.card};
  box-shadow: ${Stz.shadows.card};

  right: 0px;
  top: ${props => (props.topOffset + 4) + 'px'}
`;

const DropdownItem = Styled.div`
  white-space: nowrap;
  cursor: pointer;

  padding: 8px 16px;

  &:hover {
    background-color: ${Stz.colors.grayEB};
  }
`;