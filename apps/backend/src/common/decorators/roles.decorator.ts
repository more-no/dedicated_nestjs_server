import { SetMetadata } from '@nestjs/common';
import { RolesEnum } from '@prisma/client';

// reference https://docs.nestjs.com/security/authorization#basic-rbac-implementation

export const ROLES_KEY = 'roles';
export const Roles = (...roles: RolesEnum[]) => SetMetadata(ROLES_KEY, roles);
