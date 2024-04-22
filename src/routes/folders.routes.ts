import { Router } from 'express';

import { ROUTES } from '../constants';
import {
  FoldersController,
  getFoldersController,
} from '../controllers/folders.controller';
import {
  checkMemberExistsInTeam,
  checkTeamExistence,
  checkUserExistence,
  validateCreateFolderSchema,
  validateUpdateFolderSchema,
  verifyToken,
} from '../middlewares';
import { checkFolderExistence } from '../middlewares/folders.middlewares';

const foldersRoute = Router();

const foldersController: FoldersController = getFoldersController();

foldersRoute.get(
  ROUTES.FOLDER.GET_INDEPENDENT_FOLDERS,
  verifyToken,
  checkUserExistence,
  foldersController.getIndependentFolders,
);
foldersRoute.get(
  ROUTES.FOLDER.GET_FOLDER_DETAILS,
  verifyToken,
  checkUserExistence,
  checkFolderExistence,
  foldersController.getFolderDetails,
);
foldersRoute.get(
  ROUTES.ROOT.PATH,
  verifyToken,
  checkUserExistence,
  foldersController.getAllFoldersOfUser,
);
foldersRoute.post(
  ROUTES.ROOT.PATH,
  verifyToken,
  checkUserExistence,
  validateCreateFolderSchema,
  foldersController.createFolder,
);
foldersRoute.post(
  ROUTES.FOLDER.CREATE_FOLDER_IN_TEAM,
  verifyToken,
  checkUserExistence,
  checkTeamExistence,
  checkMemberExistsInTeam,
  validateCreateFolderSchema,
  foldersController.createFolderInTeam,
);
foldersRoute.patch(
  ROUTES.FOLDER.UPDATE_FOLDER,
  verifyToken,
  checkUserExistence,
  checkFolderExistence,
  validateUpdateFolderSchema,
  foldersController.updateFolder,
);
foldersRoute.delete(
  ROUTES.FOLDER.DELETE_FOLDER,
  verifyToken,
  checkUserExistence,
  checkFolderExistence,
  foldersController.deleteFolder,
);

export default foldersRoute;
