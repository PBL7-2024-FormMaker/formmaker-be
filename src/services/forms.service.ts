import { Prisma, PrismaClient } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';
import _omit from 'lodash.omit';

import prisma from '../configs/db.config';
import { TEAM_ERROR_MESSAGES } from '../constants';
import {
  CreateFormSchemaType,
  UpdateFormSchemaType,
} from '../schemas/forms.schemas';
import { GetFormsArgs } from '../types/forms.types';
import { PERMISSIONS } from '../types/permissions.types';

let instance: FormsService | null = null;

export const getFormsService = () => {
  if (!instance) {
    instance = new FormsService();
  }

  return instance;
};

export class FormsService {
  public createForm = (userId: string, payload: CreateFormSchemaType) =>
    prisma.form.create({
      data: {
        title: payload.title,
        logoUrl: payload.logoUrl,
        settings: payload.settings,
        elements: payload.elements,
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

  public createFormInTeam = (
    userId: string,
    payload: CreateFormSchemaType & { teamId: string },
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

      // grant all members in team access to the newly created form
      let formPermissions = {};
      if (!memberIds) {
        throw Error(TEAM_ERROR_MESSAGES.NO_MEMBERS_IN_TEAM);
      }
      memberIds.map(
        (memberId) =>
          (formPermissions = {
            ...formPermissions,
            [memberId]: [
              PERMISSIONS.VIEW,
              PERMISSIONS.EDIT,
              PERMISSIONS.DELETE,
            ],
          }),
      );

      const createdForm = await tx.form.create({
        data: {
          title: payload.title,
          logoUrl: payload.logoUrl,
          settings: payload.settings,
          elements: payload.elements,
          permissions: formPermissions,
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

      return createdForm;
    });

  public createFormInMyFolder = (
    userId: string,
    payload: CreateFormSchemaType & { folderId: string },
  ) =>
    prisma.form.create({
      data: {
        title: payload.title,
        logoUrl: payload.logoUrl,
        settings: payload.settings,
        elements: payload.elements,
        permissions: {
          [userId]: [PERMISSIONS.VIEW, PERMISSIONS.EDIT, PERMISSIONS.DELETE],
        },
        creator: {
          connect: {
            id: userId,
          },
        },
        folder: {
          connect: {
            id: payload.folderId,
          },
        },
      },
    });

  public createFormInFolderOfTeam = (
    userId: string,
    payload: CreateFormSchemaType & { folderId: string; teamId: string },
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

      // grant all members in team access to the newly created form
      let formPermissions = {};
      if (!memberIds) {
        throw Error(TEAM_ERROR_MESSAGES.NO_MEMBERS_IN_TEAM);
      }
      memberIds.map(
        (memberId) =>
          (formPermissions = {
            ...formPermissions,
            [memberId]: [
              PERMISSIONS.VIEW,
              PERMISSIONS.EDIT,
              PERMISSIONS.DELETE,
            ],
          }),
      );

      const createdForm = await tx.form.create({
        data: {
          title: payload.title,
          logoUrl: payload.logoUrl,
          settings: payload.settings,
          elements: payload.elements,
          permissions: formPermissions,
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
          folder: {
            connect: {
              id: payload.folderId,
            },
          },
        },
      });

      return createdForm;
    });

  public getFormsByUserId = (userId: string, args: GetFormsArgs) =>
    prisma.form.findMany({
      skip: args.offset,
      take: args.limit,
      where: {
        permissions: {
          path: [userId.toString()],
          array_contains: [
            PERMISSIONS.VIEW,
            PERMISSIONS.EDIT,
            PERMISSIONS.DELETE,
          ],
        },
        folderId: args.folderId || undefined,
        teamId: args.teamId || null,
        OR: [
          {
            title: {
              contains: args.searchText,
            },
          },
          {
            title: {
              contains:
                args.searchText.charAt(0).toUpperCase() +
                args.searchText.slice(1).toLowerCase(),
            },
          },
          {
            title: {
              contains: args.searchText.toUpperCase(),
            },
          },
          {
            title: {
              contains: args.searchText.toLowerCase(),
            },
          },
        ],
        deletedAt: args.isDeleted ? { not: null } : null,
        favouritedByUsers: args.isFavourite
          ? { some: { id: userId } }
          : undefined,
      },
      orderBy: {
        [args.sortField]: args.sortDirection,
      },
      include: {
        favouritedByUsers: {
          select: {
            id: true,
            email: true,
          },
        },
        folder: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

  public getSharedFormsOfUser = async (
    userId: string,
    args: Omit<
      GetFormsArgs,
      'isDeleted' | 'isFavourite' | 'isSharedForms' | 'folderId' | 'teamId'
    >,
  ) =>
    prisma.form.findMany({
      skip: args.offset,
      take: +args.limit,
      where: {
        permissions: {
          path: [userId.toString()],
          array_contains: [PERMISSIONS.VIEW, PERMISSIONS.EDIT],
        },
        OR: [
          {
            title: {
              contains: args.searchText,
            },
          },
          {
            title: {
              contains:
                args.searchText.charAt(0).toUpperCase() +
                args.searchText.slice(1).toLowerCase(),
            },
          },
          {
            title: {
              contains: args.searchText.toUpperCase(),
            },
          },
          {
            title: {
              contains: args.searchText.toLowerCase(),
            },
          },
        ],
      },
      orderBy: {
        [args.sortField]: args.sortDirection,
      },
    });

  public getTotalSharedFormsByUserId = (
    userId: string,
    args: Pick<GetFormsArgs, 'searchText'>,
  ) =>
    prisma.form.count({
      where: {
        permissions: {
          path: [userId.toString()],
          array_contains: [PERMISSIONS.VIEW, PERMISSIONS.EDIT],
        },
        OR: [
          {
            title: {
              contains: args.searchText,
            },
          },
          {
            title: {
              contains:
                args.searchText.charAt(0).toUpperCase() +
                args.searchText.slice(1).toLowerCase(),
            },
          },
          {
            title: {
              contains: args.searchText.toUpperCase(),
            },
          },
          {
            title: {
              contains: args.searchText.toLowerCase(),
            },
          },
        ],
      },
    });

  public getTotalFormsByUserId = (
    userId: string,
    args: Pick<
      GetFormsArgs,
      | 'isDeleted'
      | 'isFavourite'
      | 'isSharedForms'
      | 'folderId'
      | 'teamId'
      | 'searchText'
    >,
  ) =>
    prisma.form.count({
      where: {
        permissions: {
          path: [userId.toString()],
          array_contains: args.isSharedForms
            ? [PERMISSIONS.VIEW, PERMISSIONS.EDIT]
            : [PERMISSIONS.VIEW, PERMISSIONS.EDIT, PERMISSIONS.DELETE],
        },
        folderId: args.folderId || undefined,
        teamId: args.teamId || null,
        OR: [
          {
            title: {
              contains: args.searchText,
            },
          },
          {
            title: {
              contains:
                args.searchText.charAt(0).toUpperCase() +
                args.searchText.slice(1).toLowerCase(),
            },
          },
          {
            title: {
              contains: args.searchText.toUpperCase(),
            },
          },
          {
            title: {
              contains: args.searchText.toLowerCase(),
            },
          },
        ],
        deletedAt: args.isDeleted ? { not: null } : null,
        favouritedByUsers: args.isFavourite
          ? { some: { id: userId } }
          : undefined,
      },
    });

  public getFormById = (formId: string) =>
    prisma.form.findUnique({
      where: {
        id: formId,
      },
    });

  public updateForm = (formId: string, payload: UpdateFormSchemaType) =>
    prisma.form.update({
      where: {
        id: formId,
      },
      data: {
        title: payload.title,
        logoUrl: payload.logoUrl,
        settings: payload.settings,
        elements: payload.elements,
      },
    });

  public updateDisabledStatus = (formId: string, disabled: boolean) =>
    prisma.form.update({
      where: {
        id: formId,
      },
      data: {
        disabled: disabled,
      },
    });

  public updateDisabledNotificationStatus = (
    formId: string,
    disabledNotification: boolean,
  ) =>
    prisma.form.update({
      where: {
        id: formId,
      },
      data: {
        disabledNotification: disabledNotification,
      },
    });

  public softDeleteForm = (formId: string) =>
    prisma.form.update({
      where: {
        id: formId,
      },
      data: {
        deletedAt: new Date(),
      },
    });

  public restoreForm = (formId: string) =>
    prisma.form.update({
      where: {
        id: formId,
      },
      data: {
        deletedAt: null,
      },
    });

  public hardDeleteForm = (formId: string) =>
    prisma.$transaction(async (tx) => {
      await tx.response.deleteMany({
        where: {
          formId,
        },
      });

      await tx.form.delete({
        where: {
          id: formId,
        },
      });
    });

  public addToFavourites = (formId: string, userId: string) =>
    prisma.form.update({
      where: {
        id: formId,
      },
      data: {
        favouritedByUsers: {
          connect: {
            id: userId,
          },
        },
      },
      include: {
        favouritedByUsers: {
          select: {
            id: true,
            email: true,
          },
        },
      },
    });

  public removeFromFavourites = (formId: string, userId: string) =>
    prisma.form.update({
      where: {
        id: formId,
      },
      data: {
        favouritedByUsers: {
          disconnect: {
            id: userId,
          },
        },
      },
      include: {
        favouritedByUsers: {
          select: {
            id: true,
            email: true,
          },
        },
      },
    });

  public removeFormPermissions = async (
    tx: Omit<
      PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
      '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
    >,
    formId: string,
    memberIds: string[],
  ) => {
    const form = await tx.form.findUnique({
      where: {
        id: formId,
      },
      select: {
        permissions: true,
      },
    });
    const formPermissions = form?.permissions as Prisma.JsonObject;

    const newFormPermissions = _omit(formPermissions, memberIds);

    await tx.form.update({
      where: {
        id: formId,
      },
      data: {
        permissions: newFormPermissions,
      },
    });
  };

  public addToFolder = (formId: string, folderId: string) =>
    prisma.form.update({
      where: {
        id: formId,
      },
      data: {
        folder: {
          connect: {
            id: folderId,
          },
        },
      },
    });

  public removeFromFolder = (formId: string) =>
    prisma.form.update({
      where: {
        id: formId,
      },
      data: {
        folder: {
          disconnect: true,
        },
      },
    });

  public moveToTeam = (formId: string, teamId: string) =>
    prisma.$transaction(async (tx) => {
      const membersInTeam = await tx.team
        .findUnique({
          where: {
            id: teamId,
          },
        })
        .members();
      const memberIds = membersInTeam?.map((member) => member.id);

      // grant all members in team access to the form
      let newFormPermissions = {};
      if (!memberIds) {
        throw Error(TEAM_ERROR_MESSAGES.NO_MEMBERS_IN_TEAM);
      }
      memberIds.map(
        (memberId) =>
          (newFormPermissions = {
            ...newFormPermissions,
            [memberId]: [
              PERMISSIONS.VIEW,
              PERMISSIONS.EDIT,
              PERMISSIONS.DELETE,
            ],
          }),
      );

      await tx.form.update({
        where: {
          id: formId,
        },
        data: {
          permissions: newFormPermissions,
          team: {
            connect: {
              id: teamId,
            },
          },
          folder: {
            disconnect: true,
          },
        },
      });
    });

  public moveBackToMyForms = (userId: string, formId: string, teamId: string) =>
    prisma.$transaction(async (tx) => {
      const membersInTeam = await tx.team
        .findUnique({
          where: {
            id: teamId,
          },
        })
        .members();
      const memberIds = membersInTeam?.map((member) => member.id);

      const form = await tx.form.findUnique({
        where: {
          id: formId,
        },
        select: {
          permissions: true,
        },
      });
      const formPermissions = form?.permissions as Prisma.JsonObject;

      const newFormPermissions = {
        ..._omit(formPermissions, memberIds!),
        [userId]: [PERMISSIONS.VIEW, PERMISSIONS.EDIT, PERMISSIONS.DELETE],
      };

      await tx.form.update({
        where: {
          id: formId,
        },
        data: {
          permissions: newFormPermissions,
          team: {
            disconnect: true,
          },
          folder: {
            disconnect: true,
          },
        },
      });
    });

  public addFormMember = (formId: string, memberId: string) =>
    prisma.$transaction(async (tx) => {
      // get current permissions in form
      const form = await tx.form.findUnique({
        where: {
          id: formId,
        },
        select: {
          permissions: true,
        },
      });
      const formPermissions = form?.permissions as Prisma.JsonObject;

      // update permissions for form
      await tx.form.update({
        where: {
          id: formId,
        },
        data: {
          permissions: {
            ...formPermissions,
            [memberId]: [PERMISSIONS.VIEW, PERMISSIONS.EDIT],
          },
        },
      });
    });

  public removeFormMember = (formId: string, memberIds: string[]) =>
    prisma.$transaction(async (tx) => {
      const form = await tx.form.findUnique({
        where: {
          id: formId,
        },
        select: {
          permissions: true,
        },
      });
      const formPermissions = form?.permissions as Prisma.JsonObject;

      const newFormPermissions = _omit(formPermissions, memberIds);

      // update permissions for form
      await tx.form.update({
        where: {
          id: formId,
        },
        data: {
          permissions: newFormPermissions,
        },
      });
    });
}
