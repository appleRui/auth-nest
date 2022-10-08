import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { jwtConstants } from 'src/auth/constants';
import { JwtPayload } from 'src/auth/jwt/jwt';

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

  async validate(payload: JwtPayload) {
    return { userId: payload.sub, email: payload.email, name: payload.name };
  }
}
