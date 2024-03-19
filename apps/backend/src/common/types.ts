export type Tokens = {
  access_token: string;
  refresh_token: string;
};

export type JwtPayload = {
  sub: number;
  username: string;
  email: string;
  role_name: string;
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

export type CustomRequest = {
  headers: {
    authorization: string;
  };
  token?: string;
};
