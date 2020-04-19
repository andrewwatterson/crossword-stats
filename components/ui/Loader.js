import React from 'react';
import Styled from 'styled-components';

export const LoaderWrapper = Styled.div`
  width: 100vw;
  height: 100%;
  max-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const LoaderOuter = Styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  max-width: 57px; /* 3 * cells + 3 * border-right */
`;

const LoaderCell = Styled.div`
  --Loader-animationStep: 200ms;

  height: 18px;
  width: 18px;
  border: 1px solid black;
  margin-top: -1px;
  margin-left: -1px;

  font-size: 14px;
  text-align: center;
  line-height: 18px;

  color: white;

  animation: loader 0s linear 1s;
  animation-fill-mode: forwards;

  &.loader-filled {
    background-color: black;
  }

  &:nth-child(1) { animation-delay: calc(var(--Loader-animationStep) * 1); }
  &:nth-child(2) { animation-delay: calc(var(--Loader-animationStep) * 2); }
  /* filled child at 3 */
  &:nth-child(4) { animation-delay: calc(var(--Loader-animationStep) * 3); }
  &:nth-child(5) { animation-delay: calc(var(--Loader-animationStep) * 4); }
  &:nth-child(6) { animation-delay: calc(var(--Loader-animationStep) * 5); }
  /* filled child at 7 */
  &:nth-child(8) { animation-delay: calc(var(--Loader-animationStep) * 6); }
  &:nth-child(9) { animation-delay: calc(var(--Loader-animationStep) * 7); }
`;

export const Loader = (props) => {
  return(
    <LoaderOuter>
      <LoaderCell>L</LoaderCell>
      <LoaderCell>O</LoaderCell>
      <LoaderCell className="loader-filled" />
      <LoaderCell>A</LoaderCell>
      <LoaderCell>D</LoaderCell>
      <LoaderCell>I</LoaderCell>
      <LoaderCell className="loader-filled" />
      <LoaderCell>N</LoaderCell>
      <LoaderCell>G</LoaderCell>
    </LoaderOuter>
  )
}