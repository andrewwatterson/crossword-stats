import React from 'react';
import { render } from 'react-dom';
import CrosswordStats from './CrosswordStats.js';

window.addEventListener('load', () => {
  render(<CrosswordStats />, document.getElementById('app'));
});