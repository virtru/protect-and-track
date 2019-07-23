import React from 'react';
import './Toggle.css';

function Toggle({ name, checked, children, id, onChange }) {
  name = name || id || false;
  return (
    <div className="Toggle" id={id}>
      <input type="checkbox" checked={checked} id={id + '-input'} onChange={onChange} name={name} />
      <label htmlFor={id + '-input'}>{children}</label>
    </div>
  );
}

export default Toggle;
