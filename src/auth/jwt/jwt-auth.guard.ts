import {
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import jwt_decode from 'jwt-decode';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from 'src/users/users.service';
import { JwtPayload } from 'src/auth/jwt/jwt';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private usersService: UsersService) {
    super();
  }

  private pullJwtTokenAndVerifyToken = (request: Request): string[] => {
    return [request.headers['authorization'], request.headers['verifytoken']];
  };

  private checkVerifyToken = async (request: Request): Promise<boolean> => {
    const [jwtToken, verifyToken] = this.pullJwtTokenAndVerifyToken(request);
    if (!jwtToken) return false;
    if (!verifyToken) return false;
    // TODO: JWTが正しい形式でない場合エラー(500)が発生する
    const payload: JwtPayload = jwt_decode(jwtToken);
    const userDetail = await this.usersService.findOne(payload.sub);
    return userDetail.verifyToken === verifyToken;
  };

  /**
   * リフレッシュトークン検証とJWT検証を行う
   * @param context
   * @returns
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    // リフレッシュトークンの検証
    const isValidVerifyToken = await this.checkVerifyToken(request);
    if (!isValidVerifyToken)
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    // JWT検証
    return super.canActivate(context) as boolean;
  }
}
