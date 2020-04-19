import React from 'react';
import { render } from 'react-dom';
import CrosswordStats from './components/CrosswordStats.js';

window.addEventListener('load', () => {
  render(<CrosswordStats />, document.getElementById('app'));
});