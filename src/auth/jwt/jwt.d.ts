export type JwtPayload = {
  name: string;
  email: string;
  sub: number;
  iat: number;
  exp: number;
};
