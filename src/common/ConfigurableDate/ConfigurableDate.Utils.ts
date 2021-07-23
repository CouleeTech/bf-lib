import {
  ConfigurableDate,
  ConfigurableDateType,
  ISODATE,
  RelativeConfigurableDate,
  RelativeDateDirection,
  RelativeDateDuration,
  StaticConfigurableDate,
} from 'bf-types';
import { ExpandedRelativeDate } from './ConfigurableDate.Types';

/* ~~~ Data Generators ~~~ */

export function staticConfigurableDate(date: string, time: string): StaticConfigurableDate {
  return {
    type: ConfigurableDateType.STATIC,
    value: new Date(`${date} ${time}`).toISOString(),
  };
}

export function relativeConfigurableDate(
  quantifier: number,
  duration: RelativeDateDuration,
  direction: RelativeDateDirection,
): RelativeConfigurableDate {
  return {
    type: ConfigurableDateType.RELATIVE,
    value: `${quantifier} ${duration} ${direction}`,
  };
}

/* ~~~ Data Testers ~~~ */

export function isRelativeDate(date: ConfigurableDate): date is RelativeConfigurableDate {
  return date.type === ConfigurableDateType.RELATIVE;
}

export function isStaticDate(date: ConfigurableDate): date is StaticConfigurableDate {
  return date.type === ConfigurableDateType.STATIC;
}

/* ~~~ Helper Functions ~~~ */

export function parseRelativeDate(date: RelativeConfigurableDate): ExpandedRelativeDate {
  const chunks = date.value.split(/\s+/).filter((chunk) => Boolean(chunk));
  const quantifier = Number(chunks[0]);
  const duration = durationOrDefault(chunks[1]);
  const direction = directionOrDefault(chunks.slice(2).join(' '));
  return {
    quantifier,
    duration,
    direction,
  };
}

export function durationOrDefault(duration: string): RelativeDateDuration {
  switch (duration) {
    case RelativeDateDuration.DISABLED:
    case RelativeDateDuration.DAY:
    case RelativeDateDuration.DAYS:
    case RelativeDateDuration.WEEK:
    case RelativeDateDuration.WEEKS:
    case RelativeDateDuration.MONTH:
    case RelativeDateDuration.MONTHS:
    case RelativeDateDuration.YEAR:
    case RelativeDateDuration.YEARS: {
      return duration;
    }
  }
  return RelativeDateDuration.WEEK;
}

export function isPluralDuration(duration: RelativeDateDuration): boolean {
  switch (duration) {
    case RelativeDateDuration.DAYS:
    case RelativeDateDuration.WEEKS:
    case RelativeDateDuration.MONTHS:
    case RelativeDateDuration.YEARS: {
      return true;
    }
  }
  return false;
}

export function depluralizeDuration(duration: RelativeDateDuration): RelativeDateDuration {
  switch (duration) {
    case RelativeDateDuration.DISABLED: {
      return RelativeDateDuration.DISABLED;
    }
    case RelativeDateDuration.DAYS: {
      return RelativeDateDuration.DAY;
    }
    case RelativeDateDuration.WEEKS: {
      return RelativeDateDuration.WEEK;
    }
    case RelativeDateDuration.MONTHS: {
      return RelativeDateDuration.MONTH;
    }
    case RelativeDateDuration.YEARS: {
      return RelativeDateDuration.YEAR;
    }
  }

  return duration;
}

export function pluralizeDuration(duration: RelativeDateDuration): RelativeDateDuration {
  switch (duration) {
    case RelativeDateDuration.DISABLED: {
      return RelativeDateDuration.DISABLED;
    }
    case RelativeDateDuration.DAY: {
      return RelativeDateDuration.DAYS;
    }
    case RelativeDateDuration.WEEK: {
      return RelativeDateDuration.WEEKS;
    }
    case RelativeDateDuration.MONTH: {
      return RelativeDateDuration.MONTHS;
    }
    case RelativeDateDuration.YEAR: {
      return RelativeDateDuration.YEARS;
    }
  }

  return duration;
}

export function directionOrDefault(direction: string): RelativeDateDirection {
  switch (direction) {
    case RelativeDateDirection.AFTER_TODAY:
    case RelativeDateDirection.BEFORE_TODAY:
    case RelativeDateDirection.TODAY: {
      return direction;
    }
  }
  return RelativeDateDirection.AFTER_TODAY;
}

export function relativeDateToStatic(relativeDate: RelativeConfigurableDate): StaticConfigurableDate {
  const date = new Date();
  date.setHours(0);
  date.setMinutes(0);
  date.setSeconds(0);
  date.setMilliseconds(0);
  const { quantifier, duration, direction } = parseRelativeDate(relativeDate);

  switch (duration) {
    case RelativeDateDuration.DAY:
    case RelativeDateDuration.DAYS: {
      switch (direction) {
        case RelativeDateDirection.BEFORE_TODAY: {
          const currentDay = date.getDate();
          date.setDate(currentDay - quantifier);
          break;
        }

        case RelativeDateDirection.AFTER_TODAY: {
          const currentDay = date.getDate();
          date.setDate(currentDay + quantifier);
          break;
        }
      }
      break;
    }

    case RelativeDateDuration.WEEK:
    case RelativeDateDuration.WEEKS: {
      switch (direction) {
        case RelativeDateDirection.BEFORE_TODAY: {
          const currentDay = date.getDate();
          date.setDate(currentDay - quantifier * 7);
          break;
        }

        case RelativeDateDirection.AFTER_TODAY: {
          const currentDay = date.getDate();
          date.setDate(currentDay + quantifier * 7);
          break;
        }
      }
      break;
    }

    case RelativeDateDuration.MONTH:
    case RelativeDateDuration.MONTHS: {
      switch (direction) {
        case RelativeDateDirection.BEFORE_TODAY: {
          const currentMonth = date.getMonth();
          date.setMonth(currentMonth - quantifier);
          break;
        }

        case RelativeDateDirection.AFTER_TODAY: {
          const currentMonth = date.getMonth();
          date.setMonth(currentMonth + quantifier);
          break;
        }
      }
      break;
    }

    case RelativeDateDuration.YEAR:
    case RelativeDateDuration.YEARS: {
      switch (direction) {
        case RelativeDateDirection.BEFORE_TODAY: {
          const currentYear = date.getFullYear();
          date.setFullYear(currentYear - quantifier);
          break;
        }

        case RelativeDateDirection.AFTER_TODAY: {
          const currentYear = date.getFullYear();
          date.setFullYear(currentYear + quantifier);
          break;
        }
      }
      break;
    }
  }

  return {
    type: ConfigurableDateType.STATIC,
    value: date.toISOString(),
  };
}

export function getConfigureDateISOString(date: ConfigurableDate): ISODATE {
  if (isRelativeDate(date)) {
    return relativeDateToStatic(date).value;
  }
  return date.value;
}

export function getConfigurableDateString(date: ConfigurableDate): string {
  let isoDateString = date.value;
  if (isRelativeDate(date)) {
    isoDateString = relativeDateToStatic(date).value;
  }

  const dateStringChunks = isoDateString.split('T')[0].split('-');
  const dateString = `${dateStringChunks[1]}/${dateStringChunks[2]}/${dateStringChunks[0]}`;
  return dateString[0] === '0' ? dateString.substr(1) : dateString;
}
