export const DIGEST_ALGORITHM = 'sha256' as const;

export const JWT = {
  secret: process.env.JWT_SECRET,
};
