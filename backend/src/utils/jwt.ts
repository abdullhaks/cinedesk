import jwt, { JwtPayload } from 'jsonwebtoken';

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || 'cinedesk_pro_access_secret_key_2024';
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'cinedesk_pro_refresh_secret_key_2024';
const ACCESS_TOKEN_EXPIRY = process.env.ACCESS_TOKEN_EXPIRY || '15m';
const REFRESH_TOKEN_EXPIRY = process.env.REFRESH_TOKEN_EXPIRY || '7d';

export interface TokenPayload {
  userId: string;
}

export const generateAccessToken = (data: TokenPayload): string => {
  return jwt.sign({ userId: data.userId }, ACCESS_TOKEN_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRY,
  } as jwt.SignOptions);
};

export const generateRefreshToken = (data: TokenPayload): string => {
  return jwt.sign({ userId: data.userId }, REFRESH_TOKEN_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRY,
  } as jwt.SignOptions);
};

export const verifyAccessToken = (token: string): (JwtPayload & TokenPayload) | null => {
  try {
    const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET) as JwtPayload & TokenPayload;
    return decoded;
  } catch {
    return null;
  }
};

export const verifyRefreshToken = (token: string): (JwtPayload & TokenPayload) | null => {
  try {
    const decoded = jwt.verify(token, REFRESH_TOKEN_SECRET) as JwtPayload & TokenPayload;
    return decoded;
  } catch {
    return null;
  }
};
