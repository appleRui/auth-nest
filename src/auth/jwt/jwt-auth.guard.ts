import { ExecutionContext, Injectable } from '@nestjs/common';
import jwt_decode from 'jwt-decode';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from 'src/user/users.service';
import { JwtPayload } from 'src/auth/jwt/jwt';
import { unAuthorizedErrorHandle } from 'src/utils/httpErrorHandleUtils';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private usersService: UsersService) {
    super();
  }

  /**
   * リクエストからJWTと確認トークンを配列で返す
   * @param request
   * @returns [authorization, verifytoken]
   */
  private pullJwtTokenAndVerifyToken = (request: Request): string[] => {
    return [request.headers['authorization'], request.headers['verifytoken']];
  };

  /**
   * 確認トークンが正しいか確認
   * @param request
   * @returns boolean
   */
  private checkVerifyToken = async (request: Request): Promise<boolean> => {
    const [jwtToken, verifyToken] = this.pullJwtTokenAndVerifyToken(request);
    if (!jwtToken) return false;
    if (!verifyToken) return false;
    // JWTが正しい形式でない時、エラーが発生したするのでfalseを返す
    try {
      const payload: JwtPayload = jwt_decode(jwtToken);
      const userDetail = await this.usersService.findOne(payload.sub);
      // メール認証していない時もfalse
      if (!userDetail.isVerify) return false;
      return userDetail.verifyToken === verifyToken;
    } catch {
      return false;
    }
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
    if (!isValidVerifyToken) unAuthorizedErrorHandle();
    // JWT検証
    return super.canActivate(context) as boolean;
  }
}
