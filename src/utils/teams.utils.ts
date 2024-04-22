import { Response } from 'express';
import status from 'http-status';

import { TEAM_ERROR_MESSAGES } from '../constants';
import { getTeamsService, TeamsService } from '../services/teams.service';

import { errorResponse } from './messages.utils';

const teamsService: TeamsService = getTeamsService();

export const findTeamById = async (teamId: number, res: Response) => {
  const existingTeam = await teamsService.getTeamById(teamId);
  if (!existingTeam) {
    return errorResponse(
      res,
      TEAM_ERROR_MESSAGES.TEAM_NOT_FOUND,
      status.NOT_FOUND,
    );
  }
  return existingTeam;
};
