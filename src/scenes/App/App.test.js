import React from 'react';
import ReactDOM from 'react-dom';
import { Pure as App } from './App';

describe('App', () => {
  test('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<App appIdBundle={false} setAppIdBundle={() => {}} />, div);
    ReactDOM.unmountComponentAtNode(div);
  });
});
