import React from 'react';
import { shallow } from 'enzyme';
import { Pure as App } from './App';

describe('App', () => {
  test('renders without crashing', () => {
    const div = document.createElement('div');
    const wrapper = shallow(
      <App
        appIdBundle={false}
        setAppIdBundle={() => {}}
        isLoading={true}
        setIsLoading={() => {}}
      />,
      div,
    );
    expect(wrapper.text()).toContain('Loading');
  });
});
