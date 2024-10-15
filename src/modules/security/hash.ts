import { createHash } from 'crypto';
import { DIGEST_ALGORITHM } from './security.const';

export function digester(password: string): string {
  const hash = createHash(DIGEST_ALGORITHM);
  return hash.update(password).digest('hex');
}

export function compare(password: string, digest: string): boolean {
  return digester(password) === digest;
}
