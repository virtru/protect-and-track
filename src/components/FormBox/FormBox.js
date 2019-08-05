// MIT License
//
// Copyright (c) 2019 Virtru Corporation
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

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
