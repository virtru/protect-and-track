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
import PropTypes from 'prop-types';
import cn from 'classnames';

import './Button.css';

/**
 * Enum for button variants
 * @enum {VARIANT}
 */
export const BUTTON_VARIANT = {
  MAIN: 'mainButton',
  ALTERNATE: 'alternateButton',
  SUBMIT: 'submitButton',
  LINK: 'link',
};

/**
 * Renders button with predefined styles
 * @param variant - button style
 * @param selected - defines selected state
 * @param fullWidth - defines if button should grow to 100% width
 * @param children
 * @param props
 * @returns {*}
 * @constructor
 */
const Button = ({ variant, fullWidth, small, verySmall, light, children, ...props }) => {
  return (
    // eslint-disable-next-line react/button-has-type
    <button className={cn(variant, 'button', { small, verySmall, light, fullWidth })} {...props}>
      {children}
    </button>
  );
};

Button.propTypes = {
  variant: PropTypes.oneOf(Object.values(BUTTON_VARIANT)).isRequired,
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  fullWidth: PropTypes.bool,
  small: PropTypes.bool,
  verySmall: PropTypes.bool,
  children: PropTypes.node,
};

Button.defaultProps = {
  type: 'button',
  variant: BUTTON_VARIANT.MAIN,
  fullWidth: false,
  small: false,
  verySmall: false,
  children: null,
};

export default Button;
