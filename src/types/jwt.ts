export type JwtPayload = {
  sub: number;
  email: string;
  role_name: string;
};

declare module '@fastify/jwt' {
  interface FastifyJWT {
    payload: JwtPayload;
    user: JwtPayload;
  }
}
