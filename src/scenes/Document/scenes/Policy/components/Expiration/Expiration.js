import React from 'react';
import RadioButton from '../RadioButton/RadioButton';
import SectionHeader from '../SectionHeader/SectionHeader';
import Toggle from '../Toggle/Toggle';
import { ReactComponent as HourglassIcon } from './hourglass.svg';
import './Expiration.css';

function Expiration() {
  return (
    <div className="Expiration">
      <SectionHeader>
        <HourglassIcon />
        <h4>Expiration</h4>
        <Toggle id="expiration" />
      </SectionHeader>
      <div className="Expiration-form">
        <RadioButton id="Expiration-day" name="expiry" value="day">
          In 1 day
          <i> — 2019-06-27T00:00:00</i>
        </RadioButton>

        <RadioButton id="Expiration-week" name="expiry" value="week">
          In 1 week
        </RadioButton>

        <RadioButton id="Expiration-custom" name="expiry" value="custom">
          Custom
        </RadioButton>
      </div>
      <hr className="Policy-rule" />
    </div>
  );
}

export default Expiration;
