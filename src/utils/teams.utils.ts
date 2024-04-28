import { getTeamsService, TeamsService } from '../services/teams.service';

const teamsService: TeamsService = getTeamsService();

export const findTeamById = async (teamId: string) =>
  await teamsService.getTeamById(teamId);
