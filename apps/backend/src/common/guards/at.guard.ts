import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable() // added the Injectable decorator, while not strictly necessary is considered good practice..
export class AtGuard extends AuthGuard('jwt') {}
