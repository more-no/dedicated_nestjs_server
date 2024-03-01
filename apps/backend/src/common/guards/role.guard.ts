import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RolesEnum } from '@prisma/client';
import { JwtPayload } from '../../common/types';

// reference https://docs.nestjs.com/security/authorization#basic-rbac-implementation

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  // The Reflector class is provided by NestJS and is used to retrieve metadata associated with classes, methods, or parameters.
  // In this case, it's used to retrieve the roles metadata associated with a handler or controller class.

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // It's called by NestJS to determine whether the route or endpoint guarded by this guard can be activated or not. It takes an ExecutionContext object as an argument, which provides contextual information about the current execution, including details about the route handler, request, and response.

    // Get the roles from the decorator
    const requiredRoles = this.reflector.getAllAndOverride<RolesEnum[]>(
      'roles',
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles) {
      throw new ForbiddenException('Role not found');
    }

    // Get the user from the request object
    const request = context.switchToHttp().getRequest();
    const user = request.user as JwtPayload;

    if (!user) {
      throw new ForbiddenException('Invalid user or roles');
    }

    // Check if the user has the required role
    const hasRequiredRole = requiredRoles.some((role) =>
      user.role_name.includes(role),
    );

    if (!hasRequiredRole) {
      throw new ForbiddenException('Unauthorized');
    }

    return true;
  }
}
