import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RolesEnum } from '@prisma/client';
import { JwtPayload } from '../../common/types';
import { PrismaService } from '../../../prisma/prisma.service';

// reference https://docs.nestjs.com/security/authorization#basic-rbac-implementation

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<RolesEnum[]>(
      'roles',
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles) {
      throw new ForbiddenException('Role not found');
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user as JwtPayload;

    // Ensure the user roles exist in the JWT payload
    if (!user) {
      throw new ForbiddenException('Invalid user or roles');
    }

    // Check if any of the required roles are present in the user's roles
    const hasRequiredRole = requiredRoles.some((role) =>
      user.role_name.includes(role),
    );

    if (!hasRequiredRole) {
      throw new ForbiddenException('Unauthorized');
    }

    return true;
  }
}
