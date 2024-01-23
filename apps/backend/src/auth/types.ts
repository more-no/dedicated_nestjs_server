export type Tokens = {
  access_token: string;
  refresh_token: string;
};

export type JwtPayload = {
  sub: number;
  username: string;
  email: string;
  roleId: number;
};

export type JwtPayloadWithRt = JwtPayload & { refreshToken: string };

export type UserCreateInput = {
  username: string;
  email: string;
  password_hash: string;
  user_role: {
    create: {
      role: {
        connect: {
          id: number;
        };
      };
    };
  };
};
