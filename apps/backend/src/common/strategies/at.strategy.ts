import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from '../types';

// access token strategy

@Injectable()

// here passport take care of the validation of the token
export class AtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get<string>('AT_SECRET'),
    });

    // Within the constructor of AtStrategy, the super() call invokes the constructor of the superclass PassportStrategy.
    // It passes an object containing options for configuring JWT authentication:

    // jwtFromRequest: This option specifies how the JWT should be extracted from the request. In this case, it's using
    // ExtractJwt.fromAuthHeaderAsBearerToken() to extract the JWT from the Authorization header as a Bearer token.

    // secretOrKey: This option specifies the secret key or public key used to verify the JWT's signature.
    // It's retrieved from the ConfigService using config.get<string>('AT_SECRET').
  }

  // In summary, super() is used to call the constructor of the superclass PassportStrategy, providing options for configuring JWT authentication using the Strategy class from the passport-jwt library. This allows AtStrategy to inherit behavior and functionality from PassportStrategy while customizing it for JWT authentication with specific options.

  // the validate method is inherited from PassportStrategy.
  validate(payload: JwtPayload) {
    return payload;
  }
}
