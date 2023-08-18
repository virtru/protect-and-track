import React from 'react';
import './FormBox.css';

/** Title elements for form boxes */
function FormBoxTitle(props) {
  return <h1 className="FormBox-title">{props.children}</h1>;
}

/** Subtitle or instruction elements */
function FormBoxInstruction(props) {
  return <h2 className="FormBox-instruction">{props.children}</h2>;
}

/** Horizontal rule styled text break */
function FormBoxAlternative(props) {
  return (
    <h3 className="FormBox-alternative">
      <span className="FormBox-alternative-insider">{props.children}</span>
    </h3>
  );
}

/** Link styled as a button */
function FormBoxButton(props) {
  return (
    <div>
      <a className="FormBox-button" href={props.to}>
        {props.children}
      </a>
    </div>
  );
}

/** A place to put your stuff  */
function FormBox(props) {
  return (
    <form className="FormBox" onSubmit={props.onSubmit} data-testid="formBox">
      {props.title && <FormBoxTitle>{props.title}</FormBoxTitle>}
      {props.instruction && <FormBoxInstruction>{props.instruction}</FormBoxInstruction>}
      {props.children}
    </form>
  );
}

export default FormBox;
export { FormBox, FormBoxTitle, FormBoxInstruction, FormBoxAlternative, FormBoxButton };
