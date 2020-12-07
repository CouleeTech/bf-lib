import { RelativeDateDirection, RelativeDateDuration } from 'bf-types';

export type ExpandedRelativeDate = {
  quantifier: number;
  duration: RelativeDateDuration;
  direction: RelativeDateDirection;
};
