import type { UserDocument } from '../../users/schemas';

declare global {
  namespace Express {
    export interface Request {
      user?: UserDocument;
    }
  }
}
