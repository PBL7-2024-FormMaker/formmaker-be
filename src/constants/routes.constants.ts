export const ROUTES = {
  ROOT: {
    PATH: '/',
  },
  API_DOCS: {
    PATH: '/api-docs',
  },
  AUTH: {
    PATH: '/auth',
    SIGN_UP: '/signup',
    LOGIN: '/login',
    FORGOT_PASSWORD: '/forgot-password',
    RESET_PASSWORD: '/reset-password',
  },
  USER: {
    PATH: '/users',
    MY_PROFILE: '/my-profile',
    DELETE_USER: '/:userId',
    CHANGE_PASSWORD: '/change-password',
  },
  IMAGE: {
    PATH: '/images',
    UPLOAD: '/upload',
  },
  FILE: {
    PATH: '/files',
    UPLOAD: '/upload',
  },
  FORM: {
    PATH: '/forms',
    GET_FORM_DETAILS: '/:formId',
    GET_USERS_IN_FORM: '/:formId/members',
    INVITE_MEMBER: '/:formId/invite-member',
    ADD_MEMBER: '/:formId/add-member',
    REMOVE_MEMBER: '/:formId/remove-member',
    UPDATE_FORM: '/:formId',
    DELETE_FORM: '/:formId',
    UPDATE_DISABLED_STATUS: '/:formId/disabled/:disabled',
    UPDATE_DISABLE_ON_SPECIFIC_DATE:
      '/:formId/disabled-on-specific-date/:disabledOnSpecificDate',
    UPDATE_DISABLED_NOTIFICATION_STATUS:
      '/:formId/disabled-notification/:disabledNotification',
    RESTORE_FORM: '/:formId/restore',
    FAVOURITES: '/:formId/favourites',
    CREATE_FORM_IN_TEAM: '/team/:teamId',
    CREATE_FORM_IN_MY_FOLDER: '/folder/:folderId',
    CREATE_FORM_IN_FOLDER_OF_TEAM: '/folder/:folderId/team/:teamId',
    ADD_TO_FOLDER: '/:formId/folder/:folderId/add',
    REMOVE_FROM_FOLDER: '/:formId/folder/:folderId/remove',
    MOVE_TO_TEAM: '/:formId/team/:teamId/add',
    MOVE_BACK_TO_MY_FORMS: '/:formId/team/:teamId/remove',
  },
  FOLDER: {
    PATH: '/folders',
    GET_INDEPENDENT_FOLDERS: '/independent',
    GET_FOLDER_DETAILS: '/:folderId',
    UPDATE_FOLDER: '/:folderId',
    DELETE_FOLDER: '/:folderId',
    CREATE_FOLDER_IN_TEAM: '/team/:teamId',
  },
  TEAM: {
    PATH: '/teams',
    GET_TEAM_DETAILS: '/:teamId',
    UPDATE_TEAM: '/:teamId',
    DELETE_TEAM: '/:teamId',
    ADD_MEMBER: '/:teamId/add-member',
    INVITE_MEMBER: '/:teamId/invite-member',
    REMOVE_MEMBER: '/:teamId/remove-member',
  },
  RESPONSE: {
    PATH: '/responses',
    GET_RESPONSES_BY_FORMID: '/:formId',
    CREATE_RESPONSE: '/:formId',
    DELETE_RESPONSE: '/:formId/:responseId',
    DELETE_MANY_RESPONSES: '/:formId',
  },
  OPEN_AI: {
    PATH: '/open-ai',
    GET_QUESTION: '/get-question',
  },
};
