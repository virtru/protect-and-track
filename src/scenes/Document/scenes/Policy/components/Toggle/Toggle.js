import React from 'react';
import './Toggle.css';

function Toggle({ children, id }) {
  return (
    <div className="Toggle" id={id}>
      <input type="checkbox" id={id + '-input'} />
      <label htmlFor={id + '-input'}>{children}</label>
    </div>
  );
}

export default Toggle;
