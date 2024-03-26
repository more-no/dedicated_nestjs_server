import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { CustomRequest } from 'common/types';
import { Observable } from 'rxjs';

// reference https://docs.nestjs.com/interceptors#basics
// Intercept incoming request and modify it before reaching the route handler

@Injectable()
export class TokenInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<Request> {
    const request: CustomRequest = context.switchToHttp().getRequest();
    const token = request.headers.authorization.split(' ')[1];
    request.token = token;

    return next.handle();
  }
}
