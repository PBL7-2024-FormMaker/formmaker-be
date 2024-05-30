import { Prisma } from '@prisma/client';
import _omit from 'lodash.omit';

import prisma from '../configs/db.config';
import { PERMISSIONS } from '../types/permissions.types';

import { FoldersService, getFoldersService } from './folders.service';
import { FormsService, getFormsService } from './forms.service';

let instance: TeamsService | null = null;

export const getTeamsService = () => {
  if (!instance) {
    instance = new TeamsService();
  }

  return instance;
};

export class TeamsService {
  private formsService: FormsService;
  private foldersService: FoldersService;

  public constructor() {
    this.formsService = getFormsService();
    this.foldersService = getFoldersService();
  }

  public getTeamsByUserId = (userId: string) =>
    prisma.team.findMany({
      where: {
        members: { some: { id: userId } },
      },
      include: {
        members: {
          select: {
            id: true,
            email: true,
            username: true,
            avatarUrl: true,
            createdAt: true,
            updatedAt: true,
            deletedAt: true,
          },
        },
        folders: {
          select: {
            id: true,
            name: true,
            color: true,
          },
        },
      },
    });

  public createTeam = (
    name: string,
    logoUrl: string | undefined,
    userId: string,
  ) =>
    prisma.team.create({
      data: {
        name,
        logoUrl,
        permissions: {
          [userId]: [PERMISSIONS.VIEW, PERMISSIONS.EDIT, PERMISSIONS.DELETE],
        },
        creator: {
          connect: {
            id: userId,
          },
        },
        members: {
          connect: {
            id: userId,
          },
        },
      },
      include: {
        members: {
          select: {
            id: true,
            email: true,
            username: true,
          },
        },
      },
    });

  public getTeamById = (teamId: string) =>
    prisma.team.findUnique({
      where: {
        id: teamId,
      },
      include: {
        members: {
          select: {
            id: true,
            email: true,
            username: true,
            avatarUrl: true,
            createdAt: true,
            updatedAt: true,
            deletedAt: true,
          },
        },
        folders: {
          select: {
            id: true,
            name: true,
            color: true,
          },
        },
      },
    });

  public updateTeam = (
    teamId: string,
    name: string | undefined,
    logoUrl: string | undefined,
  ) =>
    prisma.team.update({
      where: {
        id: teamId,
      },
      data: {
        name,
        logoUrl,
      },
    });

  public deleteTeam = (teamId: string) =>
    prisma.$transaction(async (tx) => {
      // get all forms in team
      const formsInTeam = await tx.form.findMany({
        where: {
          teamId,
        },
      });

      // delete a form and its responses
      await Promise.all(
        formsInTeam.map(async (form) => {
          await tx.response.deleteMany({
            where: {
              formId: form.id,
            },
          });

          await tx.form.delete({
            where: {
              id: form.id,
            },
          });
        }),
      );

      // delete all folders in team
      await tx.folder.deleteMany({
        where: {
          teamId,
        },
      });

      // delete the team
      await tx.team.delete({
        where: {
          id: teamId,
        },
      });
    });

  public checkMemberExistsInTeam = async (teamId: string, memberId: string) => {
    const team = await prisma.team.findUnique({
      where: {
        id: teamId,
        members: {
          some: {
            id: memberId,
          },
        },
      },
    });
    return team !== null;
  };

  public checkFolderExistsInTeam = async (teamId: string, folderId: string) => {
    const team = await prisma.team.findUnique({
      where: {
        id: teamId,
        folders: {
          some: {
            id: folderId,
          },
        },
      },
    });
    return team !== null;
  };

  public addTeamMember = (teamId: string, memberId: string) =>
    prisma.$transaction(async (tx) => {
      // get current permissions in team
      const team = await tx.team.findUnique({
        where: {
          id: teamId,
        },
        select: {
          permissions: true,
        },
      });
      const teamPermissions = team?.permissions as Prisma.JsonObject;

      // add member to team and update permissions for team
      await tx.team.update({
        where: {
          id: teamId,
        },
        data: {
          members: {
            connect: {
              id: memberId,
            },
          },
          permissions: {
            ...teamPermissions,
            [memberId]: [PERMISSIONS.VIEW, PERMISSIONS.EDIT],
          },
        },
      });

      // get all forms in team
      const formsInTeam = await tx.form.findMany({
        where: {
          teamId,
        },
      });

      // update permissions for all forms
      await Promise.all(
        formsInTeam.map(async (item) => {
          const form = await tx.form.findUnique({
            where: {
              id: item.id,
            },
            select: {
              permissions: true,
            },
          });
          const formPermissions = form?.permissions as Prisma.JsonObject;
          await tx.form.update({
            where: {
              id: item.id,
            },
            data: {
              permissions: {
                ...formPermissions,
                [memberId]: [
                  PERMISSIONS.VIEW,
                  PERMISSIONS.EDIT,
                  PERMISSIONS.DELETE,
                ],
              },
            },
          });
        }),
      );

      // get all folders in team
      const foldersInTeam = await tx.folder.findMany({
        where: {
          teamId,
        },
      });

      // update permissions for all folders
      await Promise.all(
        foldersInTeam.map(async (item) => {
          const folder = await tx.folder.findUnique({
            where: {
              id: item.id,
            },
            select: {
              permissions: true,
            },
          });
          const folderPermissions = folder?.permissions as Prisma.JsonObject;
          await tx.folder.update({
            where: {
              id: item.id,
            },
            data: {
              permissions: {
                ...folderPermissions,
                [memberId]: [
                  PERMISSIONS.VIEW,
                  PERMISSIONS.EDIT,
                  PERMISSIONS.DELETE,
                ],
              },
            },
          });
        }),
      );
    });

  public removeTeamMember = (teamId: string, memberIds: string[]) =>
    prisma.$transaction(async (tx) => {
      const team = await tx.team.findUnique({
        where: {
          id: teamId,
        },
        select: {
          permissions: true,
        },
      });
      const teamPermissions = team?.permissions as Prisma.JsonObject;

      const newTeamPermissions = _omit(teamPermissions, memberIds);

      // remove members from team and update permissions for team
      await tx.team.update({
        where: {
          id: teamId,
        },
        data: {
          members: {
            disconnect: memberIds.map((memberId) => ({
              id: memberId,
            })),
          },
          permissions: newTeamPermissions,
        },
      });

      // get all forms in team
      const formsInTeam = await tx.form.findMany({
        where: {
          teamId,
        },
      });

      // update permissions for all forms
      await Promise.all(
        formsInTeam.map((form) =>
          this.formsService.removeFormPermissions(tx, form.id, memberIds),
        ),
      );

      // get all folders in team
      const foldersInTeam = await tx.folder.findMany({
        where: {
          teamId,
        },
      });

      // update permissions for all folders
      await Promise.all(
        foldersInTeam.map((folder) =>
          this.foldersService.removeFolderPermissions(tx, folder.id, memberIds),
        ),
      );
    });
}
