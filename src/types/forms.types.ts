export interface GetFormsArgs {
  offset: number;
  limit: number;
  searchText: string;
  isDeleted: boolean;
  isFavourite: boolean;
  sortField: string;
  sortDirection: string;
  folderId?: number;
  teamId?: number;
}

export enum ELEMENT_TYPE {
  HEADING = 'Heading',
  EMAIL = 'Email',
  FULLNAME = 'Fullname',
  ADDRESS = 'Address',
  PHONE = 'Phone',
  DATEPICKER = 'Datepicker',
  APPOINTMENT = 'Appointment',
  SHORT_TEXT = 'Short Text',
  LONG_TEXT = 'Long Text',
  DROPDOWN = 'Dropdown',
  SINGLE_CHOICE = 'Single Choice',
  MULTIPLE_CHOICE = 'Multiple Choice',
  NUMBER = 'Number',
  IMAGE = 'Image',
  FILE_UPLOAD = 'File Upload',
  TIME = 'Time',
  SUBMIT = 'Submit',
  INPUT_TABLE = 'Input Table',
  STAR_RATING = 'Star Rating',
  SCALE_RATING = 'Scale Rating',
  DIVIDER = 'Divider',
  PAGE_BREAK = 'Page Break',
}
