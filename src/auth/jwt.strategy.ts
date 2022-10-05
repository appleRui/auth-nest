import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { jwtConstants } from 'src/auth/constants';

type Payload = {
  name: string;
  email: string;
  sub: number;
  iat: number;
  exp: number;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    // https://docs.nestjs.com/security/authentication#implementing-passport-jwt
    // secretOrKey:https://github.com/mikenicholson/passport-jwt#extracting-the-jwt-from-the-request
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    });
  }

  async validate(payload: Payload) {
    return { userId: payload.sub, email: payload.email, name: payload.name };
  }
}
