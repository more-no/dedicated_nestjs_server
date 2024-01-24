import { SetMetadata } from '@nestjs/common';

// reference https://docs.nestjs.com/security/authentication#enable-authentication-globally

export const Public = () => SetMetadata('isPublic', true);
