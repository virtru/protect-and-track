import React from 'react';
import './RadioButton.css';

function RadioButton({ children, checked, id, name, value, onChange }) {
  return (
    <div className="RadioButton" id={id}>
      <input type="radio" checked={checked} name={name} id={id + '-input'} onChange={onChange} />
      <label value={value} htmlFor={id + '-input'}>
        {children}
      </label>
    </div>
  );
}

export default RadioButton;
