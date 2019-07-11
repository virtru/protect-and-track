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
const Button = ({ variant, fullWidth, small, verySmall, children, ...props }) => {
  return (
    // eslint-disable-next-line react/button-has-type
    <button className={cn({ [variant]: true, button: true, small, verySmall })} {...props}>
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
