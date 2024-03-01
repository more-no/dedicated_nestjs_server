import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, isString } from 'class-validator';

export class AuthLoginDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  username: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  password: string;
}

//    But first (if you use TypeScript), we need to determine the DTO (Data Transfer Object) schema. A DTO is an object that defines how the data will be sent over the network. We could determine the DTO schema by using TypeScript interfaces, or by simple classes. Interestingly, we recommend using classes here. Why? Classes are part of the JavaScript ES6 standard, and therefore they are preserved as real entities in the compiled JavaScript. On the other hand, since TypeScript interfaces are removed during the transpilation, Nest can't refer to them at runtime. This is important because features such as Pipes enable additional possibilities when they have access to the metatype of the variable at runtime.

//    User registration: When a user registers for an account on a website, you might need to collect data from multiple domain objects, such as the user’s name and email address from the User object, and the user’s billing address from the BillingAddress object. By using a DTO, you can encapsulate this data into a single object and pass it around your application as needed.

//    API responses: When building an API, you might want to return only a subset of the data from a domain object to reduce the amount of data that needs to be transferred over the network. For example, you might have a User object with many properties, but only want to return the user’s name and email address in the API response. By using a DTO, you can define a class that contains only the properties you want to return, and return instances of this class from your API endpoints.

//    Data validation: When accepting data from a client, you might want to validate that the data is in the correct format before processing it. By using a DTO, you can define validation logic in the DTO class itself, which can help reduce duplication and make your code more maintainable.
