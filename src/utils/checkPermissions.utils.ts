import { Prisma } from '@prisma/client';

import { PERMISSIONS } from '../types/permissions.types';

export const canView = (
  userId: string,
  permissionsObject: Prisma.JsonObject,
) => {
  if (!permissionsObject) return false;

  const userPermissions = permissionsObject[userId] as Prisma.JsonArray;
  if (!userPermissions) return false;

  return userPermissions.includes(PERMISSIONS.VIEW);
};

export const canEdit = (
  userId: string,
  permissionsObject: Prisma.JsonObject,
) => {
  if (!permissionsObject) return false;

  const userPermissions = permissionsObject[userId] as Prisma.JsonArray;
  if (!userPermissions) return false;

  return userPermissions.includes(PERMISSIONS.EDIT);
};

export const canDelete = (
  userId: string,
  permissionsObject: Prisma.JsonObject,
) => {
  if (!permissionsObject) return false;

  const userPermissions = permissionsObject[userId] as Prisma.JsonArray;
  if (!userPermissions) return false;

  return userPermissions.includes(PERMISSIONS.DELETE);
};
