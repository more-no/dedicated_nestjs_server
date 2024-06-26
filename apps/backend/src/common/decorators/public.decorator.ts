import { SetMetadata } from '@nestjs/common';

// reference https://docs.nestjs.com/security/authentication#enable-authentication-globally

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
