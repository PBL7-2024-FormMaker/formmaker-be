import { Router } from 'express';

import { checkFolderExistence } from '@/middlewares/folders.middlewares';

import { ROUTES } from '../constants';
import {
  FormsController,
  getFormsController,
} from '../controllers/forms.controller';
import {
  checkMemberExistsInTeam,
  checkTeamExistence,
  checkUserExistence,
  validateConfigSchema,
  validateCreateFormSchema,
  validateGetFormQueryParamsSchema,
  validateUpdateFormSchema,
  verifyToken,
} from '../middlewares';
import { checkFormExistence } from '../middlewares/forms.middlewares';

const formsRoute = Router();

const formsController: FormsController = getFormsController();

formsRoute.get(
  ROUTES.FORM.GET_FORM_DETAILS,
  checkFormExistence,
  formsController.getFormDetails,
);
formsRoute.get(
  ROUTES.ROOT.PATH,
  verifyToken,
  checkUserExistence,
  validateGetFormQueryParamsSchema,
  formsController.getAllForms,
);
formsRoute.post(
  ROUTES.ROOT.PATH,
  verifyToken,
  checkUserExistence,
  validateCreateFormSchema,
  validateConfigSchema,
  formsController.createForm,
);
formsRoute.post(
  ROUTES.FORM.CREATE_FORM_IN_TEAM,
  verifyToken,
  checkUserExistence,
  checkTeamExistence,
  checkMemberExistsInTeam,
  validateCreateFormSchema,
  validateConfigSchema,
  formsController.createFormInTeam,
);
formsRoute.post(
  ROUTES.FORM.CREATE_FORM_IN_MY_FOLDER,
  verifyToken,
  checkUserExistence,
  checkFolderExistence,
  validateCreateFormSchema,
  validateConfigSchema,
  formsController.createFormInMyFolder,
);
formsRoute.post(
  ROUTES.FORM.CREATE_FORM_IN_FOLDER_OF_TEAM,
  verifyToken,
  checkUserExistence,
  checkFolderExistence,
  checkTeamExistence,
  checkMemberExistsInTeam,
  validateCreateFormSchema,
  validateConfigSchema,
  formsController.createFormInFolderOfTeam,
);
formsRoute.patch(
  ROUTES.FORM.UPDATE_DISABLED_STATUS,
  verifyToken,
  checkUserExistence,
  checkFormExistence,
  formsController.updateDisabledStatus,
);
formsRoute.patch(
  ROUTES.FORM.UPDATE_FORM,
  verifyToken,
  checkUserExistence,
  checkFormExistence,
  validateUpdateFormSchema,
  validateConfigSchema,
  formsController.updateForm,
);
formsRoute.delete(
  ROUTES.FORM.DELETE_FORM,
  verifyToken,
  checkUserExistence,
  checkFormExistence,
  formsController.deleteForm,
);
formsRoute.patch(
  ROUTES.FORM.RESTORE_FORM,
  verifyToken,
  checkUserExistence,
  checkFormExistence,
  formsController.restoreForm,
);
formsRoute.patch(
  ROUTES.FORM.FAVOURITES,
  verifyToken,
  checkUserExistence,
  checkFormExistence,
  formsController.addToFavourites,
);
formsRoute.patch(
  ROUTES.FORM.ADD_TO_FOLDER,
  verifyToken,
  checkUserExistence,
  checkFormExistence,
  checkFolderExistence,
  formsController.addToFolder,
);
formsRoute.patch(
  ROUTES.FORM.REMOVE_FROM_FOLDER,
  verifyToken,
  checkUserExistence,
  checkFormExistence,
  checkFolderExistence,
  formsController.removeFromFolder,
);
formsRoute.patch(
  ROUTES.FORM.MOVE_TO_TEAM,
  verifyToken,
  checkUserExistence,
  checkFormExistence,
  checkTeamExistence,
  checkMemberExistsInTeam,
  formsController.moveToTeam,
);
formsRoute.patch(
  ROUTES.FORM.MOVE_BACK_TO_MY_FORMS,
  verifyToken,
  checkUserExistence,
  checkFormExistence,
  checkTeamExistence,
  checkMemberExistsInTeam,
  formsController.moveBackToMyForms,
);

export default formsRoute;
