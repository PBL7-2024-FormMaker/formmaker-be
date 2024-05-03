import { Team } from '@prisma/client';
import { NextFunction, Request, Response } from 'express';
import status from 'http-status';

import { TEAM_ERROR_MESSAGES } from '../constants';
import { getTeamsService, TeamsService } from '../services/teams.service';
import { CustomRequest } from '../types/customRequest.types';
import { errorResponse, findTeamById } from '../utils';

const teamsService: TeamsService = getTeamsService();

export const checkTeamExistence = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { teamId } = req.params;
    const existingTeam = await findTeamById(teamId);
    if (!existingTeam) {
      return errorResponse(
        res,
        TEAM_ERROR_MESSAGES.TEAM_NOT_FOUND,
        status.BAD_REQUEST,
      );
    }
    req.body.team = existingTeam;
    next();
  } catch (error) {
    return errorResponse(res);
  }
};

export const checkMemberExistsInTeam = async (
  req: CustomRequest<{ team: Team }>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { userId } = req.session;
    const { team } = req.body;

    const userExistsInTeam = await teamsService.checkMemberExistsInTeam(
      team.id,
      userId,
    );
    if (!userExistsInTeam) {
      return errorResponse(
        res,
        TEAM_ERROR_MESSAGES.USER_NOT_IN_TEAM,
        status.BAD_REQUEST,
      );
    }

    next();
  } catch (error) {
    return errorResponse(res);
  }
};
