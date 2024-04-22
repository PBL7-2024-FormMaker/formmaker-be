import { Router } from 'express';

import { ROUTES } from '../constants';
import {
  getTeamsController,
  TeamsController,
} from '../controllers/teams.controller';
import {
  checkTeamExistence,
  checkUserExistence,
  validateAddTeamMemberSchema,
  validateCreateTeamSchema,
  validateRemoveTeamMemberSchema,
  validateUpdateTeamSchema,
  verifyToken,
} from '../middlewares';

const teamsRoute = Router();

const teamsController: TeamsController = getTeamsController();

teamsRoute.get(
  ROUTES.TEAM.GET_TEAM_DETAILS,
  verifyToken,
  checkUserExistence,
  checkTeamExistence,
  teamsController.getTeamDetails,
);
teamsRoute.get(
  ROUTES.ROOT.PATH,
  verifyToken,
  checkUserExistence,
  teamsController.getAllMyTeams,
);
teamsRoute.post(
  ROUTES.ROOT.PATH,
  verifyToken,
  checkUserExistence,
  validateCreateTeamSchema,
  teamsController.createTeam,
);
teamsRoute.patch(
  ROUTES.TEAM.UPDATE_TEAM,
  verifyToken,
  checkUserExistence,
  checkTeamExistence,
  validateUpdateTeamSchema,
  teamsController.updateTeam,
);
teamsRoute.patch(
  ROUTES.TEAM.ADD_MEMBER,
  verifyToken,
  checkUserExistence,
  checkTeamExistence,
  validateAddTeamMemberSchema,
  teamsController.addTeamMember,
);
teamsRoute.patch(
  ROUTES.TEAM.REMOVE_MEMBER,
  verifyToken,
  checkUserExistence,
  checkTeamExistence,
  validateRemoveTeamMemberSchema,
  teamsController.removeTeamMember,
);
teamsRoute.delete(
  ROUTES.TEAM.DELETE_TEAM,
  verifyToken,
  checkUserExistence,
  checkTeamExistence,
  teamsController.deleteTeam,
);

export default teamsRoute;
