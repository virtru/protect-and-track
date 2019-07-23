import React from 'react';
import RadioButton from '../RadioButton/RadioButton';
import SectionHeader from '../SectionHeader/SectionHeader';
import Toggle from '../Toggle/Toggle';
import { generatePolicyChanger, NOPE } from '../../services/policyChanger';
import { ReactComponent as HourglassIcon } from './hourglass.svg';
import './Expiration.css';

// now - exposed for testing
function Expiration({ policy, updatePolicy, now = new Date() }) {
  // NOTE(DSAT-59) Chrome `datetime-local` expects ISO dates with no trailing `Z`
  // But the Virtru policy requires them. So use the right one to convert from a JS Date to
  // the appropriate field value.
  const d2sZ = d => d.toISOString();
  const d2s = d => d.toISOString().slice(0, -1);
  const policyChange = change => generatePolicyChanger(policy, updatePolicy, change);
  const withDate = (toChange, ...args) => {
    let d = new Date(toChange);
    d.setDate(...args);
    return d;
  };
  const withHours = (toChange, ...args) => {
    let d = new Date(toChange);
    d.setHours(...args);
    return d;
  };
  const withMinutes = (toChange, ...args) => {
    let d = new Date(toChange);
    d.setMinutes(...args);
    return d;
  };
  const fiveMinutesFromNow = withMinutes(now, now.getMinutes() + 5, 0, 0);
  const today = withHours(now, 0, 0, 0, 0);
  const oneDayFromNow = withDate(today, today.getDate() + 2);
  const oneWeekFromNow = withDate(today, today.getDate() + 15);
  const onToggleChange = policyChange((builder, e) => {
    return e.target.checked
      ? builder.enableExpirationDeadline(d2sZ(fiveMinutesFromNow))
      : builder.disableExpirationDeadline();
  });
  const onRadioChange = newDate =>
    policyChange(
      (builder, e) => e.target.checked && builder.enableExpirationDeadline(d2sZ(newDate)),
    );
  const onInputChange = policyChange((builder, e) => {
    const d2 = isNaN(new Date(e.target.value || NaN)) ? false : new Date(e.target.value);
    if (!d2) {
      return NOPE;
    }
    builder.enableExpirationDeadline(d2sZ(d2));
  });
  const currentDeadlineString = policy.getExpirationDeadline() || '';
  const currentDeadline = isNaN(new Date(currentDeadlineString))
    ? false
    : new Date(currentDeadlineString);
  const currentDeadlineTime = currentDeadline && currentDeadline.getTime();
  const isNone = !currentDeadlineTime;
  const isDay = currentDeadlineTime === oneDayFromNow.getTime();
  const isWeek = currentDeadlineTime === oneWeekFromNow.getTime();
  const isCustom = !(isNone || isDay || isWeek);

  return (
    <div className="Expiration">
      <SectionHeader>
        <HourglassIcon />
        <h4>Expiration</h4>
        <Toggle id="expiration" checked={!isNone} onChange={onToggleChange} />
      </SectionHeader>
      {policy.getExpirationDeadline() && (
        <>
          <div className="Expiration-form">
            <RadioButton
              id="Expiration-day"
              name="expiry"
              value="day"
              checked={isDay}
              onChange={onRadioChange(oneDayFromNow)}
            >
              In 1 day
              {isDay && <i> — {d2s(oneDayFromNow)}</i>}
            </RadioButton>

            <RadioButton
              id="Expiration-week"
              name="expiry"
              value="week"
              checked={isWeek}
              onChange={onRadioChange(oneWeekFromNow)}
            >
              In 1 week
              {isWeek && <i> — {d2s(oneWeekFromNow)}</i>}
            </RadioButton>

            <RadioButton
              id="Expiration-custom"
              name="expiry"
              value="custom"
              checked={isCustom}
              onChange={onRadioChange(fiveMinutesFromNow)}
            >
              Custom
              {isCustom && (
                <>
                  {' '}
                  -
                  <input
                    type="datetime-local"
                    id="custom-time"
                    name="custom-datetime"
                    // value="2017-06-01T08:30"
                    value={d2s(currentDeadline)}
                    min={d2s(today)}
                    max={d2s(oneWeekFromNow)}
                    onChange={onInputChange}
                  />
                </>
              )}
            </RadioButton>
          </div>
          <hr className="Policy-rule" />
        </>
      )}
    </div>
  );
}

export default Expiration;
