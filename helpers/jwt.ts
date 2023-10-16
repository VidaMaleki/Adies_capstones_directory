import jwt, { GetPublicKeyOrSecret, Secret } from "jsonwebtoken";

const DEFAULT_OPTIONS = {
  expireIn: "1h",
};

export const signJwtAccessToken = (
  payload: string,
  options: any = DEFAULT_OPTIONS
) => {
  const secretKey: any = process.env.JWT_SECRET_KEY;
  const token = jwt.sign(payload, secretKey, options);
  return token;
};
export const verifyJwt = (token: any) => {
  try {
    const secretKey: any = process.env.JWT_SECRET_KEY;
    const decoded = jwt.verify(token, secretKey);
    return decoded;
  } catch (e) {
    console.error(e);
    return null;
  }
};
