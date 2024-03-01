import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';

// reference https://docs.nestjs.com/interceptors#basics
// Intercept incoming request and modify it before reaching the route handler

@Injectable()
export class TokenInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // modify the request object
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization.split(' ')[1]; // remove "Bearer " from the string
    request.token = token;

    return next.handle();
    //  The interceptor calls the handle() method on the next object, which represents the next handler in the chain (here the route handler). The handle() method returns an Observable that emits the result of the next handler's execution.
  }
}

//  Interceptors have a set of useful capabilities which are inspired by the Aspect Oriented Programming (AOP) technique. They make it possible to:

//    bind extra logic before / after method execution
//    transform the result returned from a function
//    transform the exception thrown from a function
//    extend the basic function behavior
//    completely override a function depending on specific conditions (e.g., for caching purposes)

// The Observable<any> returned from the intercept method allows NestJS to handle asynchronous operations in a consistent and composable manner. It represents a stream of data or events over time and is used to handle asynchronous operations such as making HTTP requests, working with databases, or performing other asynchronous tasks within the interceptor. In this case, the Observable<any> returned from next.handle() represents the result of executing the next handler in the chain (usually the route handler), and NestJS can subscribe to this Observable to retrieve the result and send it as the response to the client
