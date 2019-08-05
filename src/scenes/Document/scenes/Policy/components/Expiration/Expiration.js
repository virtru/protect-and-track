import React from 'react';
import RadioButton from '../RadioButton/RadioButton';
import SectionHeader from '../SectionHeader/SectionHeader';
import Toggle from '../Toggle/Toggle';
import { ReactComponent as HourglassIcon } from './hourglass.svg';
import classNames from 'classnames';
import './Expiration.css';

// now - exposed for testing
function Expiration({ policy, policyChange, isPolicyRevoked, now = new Date() }) {
  // NOTE(DSAT-59) Chrome `datetime-local` expects ISO dates with no trailing `Z`
  // But the Virtru policy requires them. So use the right one to convert from a JS Date to
  // the appropriate field value.
  const d2sZ = d => d.toISOString();
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
  const today = withHours(now, 0, 0, 0, 0);
  const fiveMinutesFromNow = withMinutes(now, now.getMinutes() + 5, 0, 0);
  const oneDayFromNow = withDate(today, today.getDate(), 2);
  const oneWeekFromNow = withDate(today, today.getDate() + 7);
  const oneMonthFromNow = withDate(today, today.getDate() + 30);
  const onToggleChange = policyChange((builder, e) => {
    return e.target.checked
      ? builder.enableExpirationDeadline(d2sZ(fiveMinutesFromNow))
      : builder.disableExpirationDeadline();
  });
  const onRadioChange = newDate =>
    policyChange(
      (builder, e) => e.target.checked && builder.enableExpirationDeadline(d2sZ(newDate)),
    );

  const currentDeadlineString = policy.getExpirationDeadline() || '';
  const currentDeadline = isNaN(new Date(currentDeadlineString))
    ? false
    : new Date(currentDeadlineString);
  const currentDeadlineTime = currentDeadline && currentDeadline.getTime();
  const isNone = !currentDeadlineTime;
  const isFiveMinutes = currentDeadlineTime === fiveMinutesFromNow.getTime();
  const isDay = currentDeadlineTime === oneDayFromNow.getTime();
  const isWeek = currentDeadlineTime === oneWeekFromNow.getTime();
  const isMonth = currentDeadlineTime === oneMonthFromNow.getTime();

  const disabled = isPolicyRevoked;
  const isToggled = !disabled && !isNone;

  return (
    <div className={classNames('Expiration', { 'Section-disabled': disabled })}>
      <SectionHeader>
        <HourglassIcon />
        <h4>Expiration</h4>
        <Toggle id="expiration" checked={isToggled} disabled={disabled} onChange={onToggleChange} />
      </SectionHeader>
      {isToggled && (
        <>
          <div className="Expiration-form">
            <RadioButton
              id="Expiration-minute"
              name="expiry"
              value="minute"
              checked={isFiveMinutes}
              disabled={disabled}
              onChange={onRadioChange(fiveMinutesFromNow)}
            >
              In 5 minutes
            </RadioButton>
            <RadioButton
              id="Expiration-day"
              name="expiry"
              value="day"
              checked={isDay}
              disabled={disabled}
              onChange={onRadioChange(oneDayFromNow)}
            >
              In 1 day
            </RadioButton>

            <RadioButton
              id="Expiration-week"
              name="expiry"
              value="week"
              checked={isWeek}
              disabled={disabled}
              onChange={onRadioChange(oneWeekFromNow)}
            >
              In 1 week
            </RadioButton>
            <RadioButton
              id="Expiration-month"
              name="expiry"
              value="month"
              checked={isMonth}
              disabled={disabled}
              onChange={onRadioChange(oneMonthFromNow)}
            >
              In 1 month
            </RadioButton>
          </div>
          <hr className="Policy-rule" />
        </>
      )}
    </div>
  );
}

export default Expiration;
