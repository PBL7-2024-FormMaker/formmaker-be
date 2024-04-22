import { Prisma, Team } from '@prisma/client';
import { Request, Response } from 'express';
import status from 'http-status';

import { CustomRequest } from '@/types/customRequest.types';

import {
  ERROR_MESSAGES,
  TEAM_ERROR_MESSAGES,
  TEAM_SUCCESS_MESSAGES,
  USER_ERROR_MESSAGES,
} from '../constants';
import {
  AddTeamMemberSchemaType,
  CreateTeamSchemaType,
  RemoveTeamMemberSchemaType,
  UpdateTeamSchemaType,
} from '../schemas/teams.schemas';
import { AuthService, getAuthService } from '../services/auth.service';
import { getTeamsService, TeamsService } from '../services/teams.service';
import { getUsersService, UsersService } from '../services/users.service';
import { canEdit, canView, errorResponse, successResponse } from '../utils';

let instance: TeamsController | null = null;

export const getTeamsController = () => {
  if (!instance) {
    instance = new TeamsController();
  }

  return instance;
};

export class TeamsController {
  private teamsService: TeamsService;
  private authService: AuthService;
  private usersService: UsersService;

  public constructor() {
    this.teamsService = getTeamsService();
    this.authService = getAuthService();
    this.usersService = getUsersService();
  }

  public getAllMyTeams = async (req: Request, res: Response) => {
    try {
      const { userId } = req.session;

      const teams = await this.teamsService.getTeamsByUserId(userId);
      return successResponse(res, teams);
    } catch (error) {
      return errorResponse(res);
    }
  };

  public getTeamDetails = async (
    req: CustomRequest<{ team: Team }>,
    res: Response,
  ) => {
    try {
      const { userId } = req.session;

      const { team } = req.body;

      if (!canView(userId, team.permissions as Prisma.JsonObject)) {
        return errorResponse(
          res,
          ERROR_MESSAGES.ACCESS_DENIED,
          status.FORBIDDEN,
        );
      }

      return successResponse(res, team);
    } catch (error) {
      return errorResponse(res);
    }
  };

  public createTeam = async (
    req: CustomRequest<CreateTeamSchemaType>,
    res: Response,
  ) => {
    try {
      const { name, logoUrl } = req.body;

      const { userId } = req.session;

      const newTeam = await this.teamsService.createTeam(name, logoUrl, userId);
      return successResponse(
        res,
        newTeam,
        TEAM_SUCCESS_MESSAGES.CREATE_TEAM_SUCCESS,
        status.CREATED,
      );
    } catch (error) {
      return errorResponse(res);
    }
  };

  public updateTeam = async (
    req: CustomRequest<UpdateTeamSchemaType & { team: Team }>,
    res: Response,
  ) => {
    try {
      const { userId } = req.session;

      const { name, logoUrl, team } = req.body;

      if (!canEdit(userId, team.permissions as Prisma.JsonObject)) {
        return errorResponse(
          res,
          ERROR_MESSAGES.ACCESS_DENIED,
          status.FORBIDDEN,
        );
      }

      const updatedTeam = await this.teamsService.updateTeam(
        team.id,
        name,
        logoUrl,
      );
      return successResponse(
        res,
        updatedTeam,
        TEAM_SUCCESS_MESSAGES.UPDATE_TEAM_SUCCESS,
      );
    } catch (error) {
      return errorResponse(res);
    }
  };

  public deleteTeam = async (
    req: CustomRequest<{ team: Team }>,
    res: Response,
  ) => {
    try {
      const { userId } = req.session;

      const { team } = req.body;

      if (team.creatorId !== userId) {
        return errorResponse(
          res,
          ERROR_MESSAGES.ACCESS_DENIED,
          status.FORBIDDEN,
        );
      }

      await this.teamsService.deleteTeam(team.id);

      return successResponse(
        res,
        {},
        TEAM_SUCCESS_MESSAGES.DELETE_TEAM_SUCCESS,
      );
    } catch (error) {
      return errorResponse(res);
    }
  };

  public addTeamMember = async (
    req: CustomRequest<AddTeamMemberSchemaType & { team: Team }>,
    res: Response,
  ) => {
    try {
      const { userId } = req.session;

      const { email, team } = req.body;

      if (!canEdit(userId, team.permissions as Prisma.JsonObject)) {
        return errorResponse(
          res,
          ERROR_MESSAGES.ACCESS_DENIED,
          status.FORBIDDEN,
        );
      }

      const foundUser = await this.authService.getUserByEmail(email);
      if (!foundUser) {
        return errorResponse(
          res,
          USER_ERROR_MESSAGES.USER_NOT_FOUND,
          status.NOT_FOUND,
        );
      }

      const memberExistsInTeam =
        await this.teamsService.checkMemberExistsInTeam(team.id, foundUser.id);

      if (memberExistsInTeam) {
        return errorResponse(
          res,
          TEAM_ERROR_MESSAGES.USER_EXISTS_IN_TEAM,
          status.BAD_REQUEST,
        );
      }

      await this.teamsService.addTeamMember(team.id, foundUser.id);

      return successResponse(
        res,
        {},
        TEAM_SUCCESS_MESSAGES.ADD_TEAM_MEMBER_SUCCESS,
      );
    } catch (error) {
      return errorResponse(res);
    }
  };

  public removeTeamMember = async (
    req: CustomRequest<RemoveTeamMemberSchemaType & { team: Team }>,
    res: Response,
  ) => {
    try {
      const { userId } = req.session;

      const { memberIds, team } = req.body;

      if (!canEdit(userId, team.permissions as Prisma.JsonObject)) {
        return errorResponse(
          res,
          ERROR_MESSAGES.ACCESS_DENIED,
          status.FORBIDDEN,
        );
      }

      for (const memberId of memberIds) {
        if (memberId === team.creatorId) {
          return errorResponse(
            res,
            TEAM_ERROR_MESSAGES.CAN_NOT_REMOVE_TEAM_OWNER,
            status.BAD_REQUEST,
          );
        }

        const existingUser = await this.usersService.getUserByID(memberId);
        if (!existingUser) {
          return errorResponse(
            res,
            `User with ID: ${memberId} does not exist`,
            status.BAD_REQUEST,
          );
        }

        const memberExistsInTeam =
          await this.teamsService.checkMemberExistsInTeam(team.id, memberId);
        if (!memberExistsInTeam) {
          return errorResponse(
            res,
            `User with ID: ${memberId} is not a member in the team`,
            status.BAD_REQUEST,
          );
        }
      }

      await this.teamsService.removeTeamMember(team.id, memberIds);

      return successResponse(
        res,
        {},
        TEAM_SUCCESS_MESSAGES.REMOVE_TEAM_MEMBER_SUCCESS,
      );
    } catch (error) {
      return errorResponse(res);
    }
  };
}
