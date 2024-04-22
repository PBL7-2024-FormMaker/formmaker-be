import {
  DATE_ACTIONS,
  OTHER_FIELDS_ACTIONS,
  SORT_DIRECTIONS,
} from '@/constants';

export const isSortDirection = (str: string) =>
  Object.values(SORT_DIRECTIONS).includes(str as SORT_DIRECTIONS);

export const isDateActions = (str: string) =>
  Object.values(DATE_ACTIONS).includes(str as DATE_ACTIONS);

export const isOtherFieldsActions = (str: string) =>
  Object.values(OTHER_FIELDS_ACTIONS).includes(str as OTHER_FIELDS_ACTIONS);
