import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { JwtPayloadWithRt } from '../../common/types';

export const GetCurrentUser = createParamDecorator(
  (data: keyof JwtPayloadWithRt, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();

    //     The switchToHttp() method of the ExecutionContext allows you to switch the context to an HTTP-specific context, providing access to HTTP-specific details such as the request and response objects. This method is useful when you need to access properties or methods specific to the HTTP protocol, such as headers, query parameters, cookies, etc.

    // When you call switchToHttp() on the ExecutionContext, it returns an object that contains the HTTP-specific context, which includes the following properties and methods:

    //     getRequest(): This method returns the current HTTP request object.
    //     getResponse(): This method returns the current HTTP response object.
    //     getNext(): This method returns the next function, which is used to delegate control to the next middleware or handler in the request processing pipeline.

    if (!data) return request.user;
    // if there are no data then the entire user object is returned...

    return request.user[data];
  },
);
