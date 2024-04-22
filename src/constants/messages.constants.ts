export const ERROR_MESSAGES = {
  ID_NOT_FOUND: 'Form ID can not be empty',
  INTERNAL_SERVER_ERROR: 'Internal Server Error',
  ACCESS_DENIED: 'Access denied',
  NOT_FOUND_ROUTES: 'No routes found',
  NO_EMPTY_REQUEST_BODY: 'Request body cannot be empty',
  REQUIRED_FIELD: 'This field is required',
  NO_EMPTY_FIELD: 'This field cannot be empty',
  REQUIRED_STRING_TYPE: 'This field must be a string',
  REQUIRED_NUMBER_TYPE: 'This field must be a number',
  REQUIRED_BOOLEAN_TYPE: 'This field must be a boolean',
  REQUIRED_OBJECT_TYPE: 'This field must be an object',
  REQUIRED_ARRAY_TYPE: 'This field must be an array',
  INVALID_SORT_FIELD: 'Invalid sort field',
  INVALID_SORT_DIRECTION: 'Invalid sort direction',
  INVALID_QUERY_PARAMS: 'Invalid query params',
  NUMBER_MUST_BE_POSITIVE: 'Value must be greater than 0',
  NUMBER_MUST_BE_NONNEGATIVE: 'Value must be greater than or equal to 0',
};

export const SUCCESS_MESSAGES = {
  DEFAULT: 'Success',
};

export const USER_SUCCESS_MESSAGES = {
  USER_CREATED: 'User created successfully',
  LOGIN_SUCCESS: 'Login successfully',
  GET_LIST_USER: 'Get list of users successfully',
  GET_USER: 'Get information of user successfully',
  DELETE_USER_SUCCESS: 'Delete user successfully',
  UPDATE_USER_SUCCESS: 'Update user successfully',
  CHANGE_PW_SUCCESS: 'Change password successfully',
};

export const USER_ERROR_MESSAGES = {
  USER_ALREADY_EXISTS:
    'User with this email has already existed. Please try another email',
  USER_NOT_FOUND: 'User does not exist',
  INCORRECT_INFORMATION: 'Incorrect email or password',
  NO_TOKEN_PROVIDED: 'No token provided',
  INVALID_TOKEN: 'Invalid token',
  REQUIRED_ID: 'User ID is required',
  REQUIRED_EMAIL: 'Email is required',
  NO_EMPTY_EMAIL: 'Email cannot be empty',
  INVALID_EMAIL: 'Invalid email',
  REQUIRED_PASSWORD: 'Password is required',
  REQUIRED_LONG_PASSWORD: 'Must be 8 or more characters long',
  REQUIRED_UPPER_CASE_PASSWORD: 'Must contain at least one uppercase letter',
  REQUIRED_LOWER_CASE_PASSWORD: 'Must contain at least one lowercase letter',
  REQUIRED_SPECIAL_CHARS: 'Must contain at least one special character',
  REQUIRED_USERNAME: 'Username is required',
  NO_EMPTY_USERNAME: 'Username cannot be empty',
  INCORRECT_PASSWORD: 'Incorrect password',
  INVALID_NEW_PASSWORD: 'New password must be different from your old password',
};

export const FORM_SUCCESS_MESSAGES = {
  CREATE_FORM_SUCCESS: 'Form created successfully',
  UPDATE_FORM_SUCCESS: 'Form updated successfully',
  SOFT_DELETE_SUCCESS: 'Form has been moved to trash successfully',
  HARD_DELETE_SUCCESS: 'Form has been permanently deleted',
  RESTORE_FORM_SUCCESS: 'Form has been restored successfully',
  ADD_TO_FAVOURITES_SUCCESS: 'This form has been added to your favourite forms',
  REMOVE_FROM_FAVOURITES_SUCCESS:
    'This form has been removed from your favourite forms',
  ADD_TO_FOLDER_SUCCESS: 'This form has been added to folder successfully',
  REMOVE_FROM_FOLDER_SUCCESS:
    'This form has been removed from folder successfully',
  MOVE_TO_TEAM_SUCCESS: 'This form has been moved to team successfully',
  REMOVE_FROM_TEAM_SUCCESS:
    'This form has been moved back to your forms successfully',
};

export const FORM_ERROR_MESSAGES = {
  IS_DISABLED: 'Form is disabled',
  FORM_NOT_FOUND: 'Form not found',
  INVALID_TYPE_OF_ELEMENT: 'Invalid type of element',
  REQUIRED_FIELD_IN_HEADING_CONFIG:
    "This field is required in property 'config' of the heading element",
  REQUIRED_FIELD_IN_FULLNAME_CONFIG:
    "This field is required in property 'config' of the fullname element",
  REQUIRED_FIELD_IN_EMAIL_CONFIG:
    "This field is required in property 'config' of the email element",
  REQUIRED_FIELD_IN_ADDRESS_CONFIG:
    "This field is required in property 'config' of the address element",
  REQUIRED_FIELD_IN_PHONE_CONFIG:
    "This field is required in property 'config' of the phone element",
  REQUIRED_FIELD_IN_DATEPICKER_CONFIG:
    "This field is required in property 'config' of the datepicker element",
  REQUIRED_FIELD_IN_APPOINTMENT_CONFIG:
    "This field is required in property 'config' of the appointment element",
  REQUIRED_FIELD_IN_SHORT_TEXT_CONFIG:
    "This field is required in property 'config' of the short text element",
  REQUIRED_FIELD_IN_LONG_TEXT_CONFIG:
    "This field is required in property 'config' of the long text element",
  REQUIRED_FIELD_IN_DROPDOWN_CONFIG:
    "This field is required in property 'config' of the dropdown element",
  REQUIRED_FIELD_IN_SINGLE_CHOICE_CONFIG:
    "This field is required in property 'config' of the single choice element",
  REQUIRED_FIELD_IN_MULTIPLE_CHOICE_CONFIG:
    "This field is required in property 'config' of the multiple choice element",
  REQUIRED_FIELD_IN_NUMBER_CONFIG:
    "This field is required in property 'config' of the number element",
  REQUIRED_FIELD_IN_IMAGE_CONFIG:
    "This field is required in property 'config' of the image element",
  REQUIRED_FIELD_IN_FILE_UPLOAD_CONFIG:
    "This field is required in property 'config' of the file upload element",
  REQUIRED_FIELD_IN_TIME_CONFIG:
    "This field is required in property 'config' of the time element",
  REQUIRED_FIELD_IN_SUBMIT_CONFIG:
    "This field is required in property 'config' of the submit element",
  REQUIRED_FIELD_IN_INPUT_TABLE_CONFIG:
    "This field is required in property 'config' of the input table element",
  REQUIRED_FIELD_IN_STAR_RATING_CONFIG:
    "This field is required in property 'config' of the star rating element",
  REQUIRED_FIELD_IN_SCALE_RATING_CONFIG:
    "This field is required in property 'config' of the scale rating element",
  REQUIRED_FIELD_IN_DIVIDER_CONFIG:
    "This field is required in property 'config' of the divider element",
  REQUIRED_FIELD_IN_PAGE_BREAK_CONFIG:
    "This field is required in property 'config' of the page break element",
};

export const IMAGE_ERROR_MESSAGES = {
  ERROR_UPLOADING_IMAGE: 'Error uploading image',
  NO_FILE_UPLOADED: 'No file uploaded',
};

export const IMAGE_SUCCESS_MESSAGES = {
  UPLOAD_FILE_SUCCESS: 'Upload file successfully',
};

export const FOLDER_SUCCESS_MESSAGES = {
  CREATE_FOLDER_SUCCESS: 'Folder created successfully',
  UPDATE_FOLDER_SUCCESS: 'Folder updated successfully',
  DELETE_FOLDER_SUCCESS: 'Folder has been deleted',
};

export const FOLDER_ERROR_MESSAGES = {
  FOLDER_NOT_FOUND: 'Folder not found',
};

export const TEAM_SUCCESS_MESSAGES = {
  CREATE_TEAM_SUCCESS: 'Team created successfully',
  UPDATE_TEAM_SUCCESS: 'Team updated successfully',
  DELETE_TEAM_SUCCESS: 'Team deleted successfully',
  ADD_TEAM_MEMBER_SUCCESS: 'Add new team member successfully',
  REMOVE_TEAM_MEMBER_SUCCESS: 'Remove team member successfully',
};

export const TEAM_ERROR_MESSAGES = {
  TEAM_NOT_FOUND: 'Team not found',
  USER_EXISTS_IN_TEAM: 'This user already exists in the team',
  USER_NOT_IN_TEAM: 'This user does not exist in the team',
  FOLDER_NOT_IN_TEAM: 'This folder does not belong to the team',
  NO_MEMBERS_IN_TEAM: 'There are no members in the team',
  CAN_NOT_REMOVE_TEAM_OWNER: 'Team owner can not be removed from the team',
};

export const RESPONSES_SUCCESS_MESSAGES = {
  RESPONSE_CREATED: 'Response created successfully',
  RESPONSE_UPDATED: 'Response updated successfully',
  RESPONSE_DELETED: 'Response deleted successfully',
  RESPONSE_GET_SUCCESS: 'Response get successfully',
} as const;

export const RESPONSES_ERROR_MESSAGES = {
  INVALID_FIELD_FILTER: 'Invalid field filter',
  INVALID_SORT_DIRECTION: 'Invalid sort direction',
  RESPONSE_NOT_FOUND: 'Response not found',
  ID_PARAMS_NOT_FOUND: 'Id parameters not found',
  FORM_NOT_ACCEPTING_RESPONSES:
    'This form is currently not accepting responses',
} as const;
