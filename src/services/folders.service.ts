import { Prisma, PrismaClient } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';
import _omit from 'lodash.omit';

import prisma from '../configs/db.config';
import { TEAM_ERROR_MESSAGES } from '../constants';
import { CreateFolderSchemaType } from '../schemas/folders.schemas';
import { PERMISSIONS } from '../types/permissions.types';

let instance: FoldersService | null = null;

export const getFoldersService = () => {
  if (!instance) {
    instance = new FoldersService();
  }
  return instance;
};

export class FoldersService {
  public createFolder = (userId: number, name: string) =>
    prisma.folder.create({
      data: {
        name,
        permissions: {
          [userId]: [PERMISSIONS.VIEW, PERMISSIONS.EDIT, PERMISSIONS.DELETE],
        },
        creator: {
          connect: {
            id: userId,
          },
        },
      },
    });

  public createFolderInTeam = (
    userId: number,
    payload: CreateFolderSchemaType & { teamId: number },
  ) =>
    prisma.$transaction(async (tx) => {
      const membersInTeam = await tx.team
        .findUnique({
          where: {
            id: payload.teamId,
          },
        })
        .members();
      const memberIds = membersInTeam?.map((member) => member.id);

      // grant all members in team access to the newly created folder
      let folderPermissions = {};
      if (!memberIds) {
        throw Error(TEAM_ERROR_MESSAGES.NO_MEMBERS_IN_TEAM);
      }
      memberIds.map(
        (memberId) =>
          (folderPermissions = {
            ...folderPermissions,
            [memberId]: [
              PERMISSIONS.VIEW,
              PERMISSIONS.EDIT,
              PERMISSIONS.DELETE,
            ],
          }),
      );

      const createdFolder = await tx.folder.create({
        data: {
          name: payload.name,
          permissions: folderPermissions,
          creator: {
            connect: {
              id: userId,
            },
          },
          team: {
            connect: {
              id: payload.teamId,
            },
          },
        },
      });

      return createdFolder;
    });

  public getAllFoldersOfUser = (userId: number, teamId?: number | null) =>
    prisma.folder.findMany({
      where: {
        creatorId: userId,
        teamId,
      },
    });

  public getTotalFoldersByUserId = (userId: number) =>
    prisma.folder.count({
      where: {
        creatorId: userId,
      },
    });

  public getFolderById = (folderId: number) =>
    prisma.folder.findUnique({
      where: {
        id: folderId,
      },
      include: {
        forms: true,
      },
    });

  public updateFolder = async (folderId: number, name?: string) =>
    prisma.folder.update({
      where: { id: folderId },
      data: {
        name,
      },
    });

  public deleteFolder = async (folderId: number) =>
    prisma.$transaction(async (tx) => {
      // Find all forms belong to the folder to be deleted
      const formsInFolder = await tx.form.findMany({
        where: {
          folderId: folderId,
        },
        select: {
          id: true,
        },
      });

      // Delete each form sequentially
      const deleteFormPromises = formsInFolder.map((form) =>
        tx.form.delete({
          where: {
            id: form.id,
          },
        }),
      );

      // Wait for all forms to be deleted before delete the folder
      await Promise.all(deleteFormPromises);

      // After delete all forms, delete the folder
      await tx.folder.delete({
        where: {
          id: folderId,
        },
      });
    });

  public removeFolderPermissions = async (
    tx: Omit<
      PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
      '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
    >,
    folderId: number,
    memberIds: number[],
  ) => {
    const folder = await tx.folder.findUnique({
      where: {
        id: folderId,
      },
      select: {
        permissions: true,
      },
    });
    const folderPermissions = folder?.permissions as Prisma.JsonObject;

    const newFolderPermissions = _omit(folderPermissions, memberIds);

    await tx.folder.update({
      where: {
        id: folderId,
      },
      data: {
        permissions: newFolderPermissions,
      },
    });
  };
}
