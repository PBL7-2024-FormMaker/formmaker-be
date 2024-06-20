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
            teamId: true,
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

  public addTeamMember = async (teamId: string, memberId: string) => {
    try {
      // Step 1: Get current permissions in team
      const team = await prisma.team.findUnique({
        where: {
          id: teamId,
        },
        select: {
          permissions: true,
        },
      });
      const teamPermissions = team?.permissions as Prisma.JsonObject;

      // Step 2: Get all forms in team
      const formsInTeam = await prisma.form.findMany({
        where: {
          teamId,
        },
      });

      // Step 3: Get all folders in team
      const foldersInTeam = await prisma.folder.findMany({
        where: {
          teamId,
        },
      });

      // Step 4: Update the permissions in a transaction
      await prisma.$transaction(async (tx) => {
        // Update permissions for the team
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

        // Update permissions for all forms
        for (const item of formsInTeam) {
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
        }

        // Update permissions for all folders
        for (const item of foldersInTeam) {
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
        }
      });
    } catch (error) {
      console.log({ error });
    }
  };

  public removeTeamMember = async (teamId: string, memberIds: string[]) => {
    try {
      // Step 1: Get current permissions in team
      const team = await prisma.team.findUnique({
        where: {
          id: teamId,
        },
        select: {
          permissions: true,
        },
      });
      const teamPermissions = team?.permissions as Prisma.JsonObject;
      const newTeamPermissions = _omit(teamPermissions, memberIds);

      // Step 2: Get all forms in team
      const formsInTeam = await prisma.form.findMany({
        where: {
          teamId,
        },
      });

      // Step 3: Get all folders in team
      const foldersInTeam = await prisma.folder.findMany({
        where: {
          teamId,
        },
      });

      // Step 4: Update the permissions in a transaction
      await prisma.$transaction(async (tx) => {
        // Remove members from team and update permissions for team
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

        // Update permissions for all forms
        for (const form of formsInTeam) {
          await this.formsService.removeFormPermissions(tx, form.id, memberIds);
        }

        // Update permissions for all folders
        for (const folder of foldersInTeam) {
          await this.foldersService.removeFolderPermissions(
            tx,
            folder.id,
            memberIds,
          );
        }
      });
    } catch (error) {
      console.log({ error });
    }
  };
}
