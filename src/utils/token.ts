import { JwtPayload, SignOptions } from "jsonwebtoken";
import { jwtUtils } from "./jwt";
import { Response } from "express";
import { CookieUtils } from "./cookie";
import { config } from "../config";


const getAccessToken = (payload: JwtPayload) => {
  const token = jwtUtils.createToken(payload, config.ACCESS_TOKEN_SECRET as string, {
    expiresIn: config.ACCESS_TOKEN_EXPIRES_IN,
  } as SignOptions);
  return token;
};

const getRefreshToken = (payload: JwtPayload) => {
  const refreshToken = jwtUtils.createToken(
    payload,
    config.REFRESH_TOKEN_SECRET as string,
    {
      expiresIn: config.REFRESH_TOKEN_EXPIRES_IN,
    } as SignOptions,
  );

  return refreshToken;
};

const setAccessTokenCookie = (res: Response, token: string) => {
  CookieUtils.setCookie(res, "accessToken", token, {
    httpOnly: true,
    secure: true,
    sameSite: true,
    path: "/",
    maxAge: 60 * 60 * 24 * 1000,
  });
};

const setRefreshTokenCookie = (res: Response, token: string) => {
  CookieUtils.setCookie(res, "refreshToken", token, {
    httpOnly: true,
    secure: true,
    sameSite: true,
    path: "/",
    maxAge: 60 * 60 * 24 * 7 * 1000,
  });
};

const setBetterAuthSessionCookie = (res: Response, token: string) => {
  CookieUtils.setCookie(res, "better-auth.session_token", token, {
    httpOnly: true,
    secure: true,
    sameSite: true,
    path: "/",
    maxAge: 60 * 60  * 24 * 1000,
  });
};

export const tokenUtils = {
  getAccessToken,
  getRefreshToken,
  setAccessTokenCookie,
  setRefreshTokenCookie,
  setBetterAuthSessionCookie,
};
