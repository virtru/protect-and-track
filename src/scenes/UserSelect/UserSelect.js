import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { FormBox, FormBoxButton } from 'components/FormBox/FormBox';
import './UserSelect.css';

class UserSelect extends React.Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
  };

  handleSubmit(history) {
    const emailStr = document.getElementById('email').value.trim();

    if (!emailStr) {
      alert('A valid email address must be included');
      console.error('Ensure an email address is provided');
      return;
    }

    const loc = `auth?id=${emailStr}`;
    history.push(loc);
  }
  render() {
    const { history } = this.props;
    return (
      <FormBox
        onSubmit={e => {
          e.preventDefault();
          this.handleSubmit(history);
        }}
        title="Protect and Track"
        instruction="Welcome! Enter your e-mail below and click 'Start' to begin the demo."
      >
        <input
          type="email"
          className="UserSelect-input"
          id="email"
          placeholder="some-user@domain.com"
          autoFocus
        />
        <FormBoxButton
          id="startbutton"
          onClick={e => {
            e.preventDefault();
            this.handleSubmit(history);
          }}
        >
          Select
        </FormBoxButton>
      </FormBox>
    );
  }
}

export default withRouter(UserSelect);
