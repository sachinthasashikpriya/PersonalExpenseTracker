// backend/src/types/express.d.ts
import { Document } from 'mongoose';

declare global {
  namespace Express {
    interface Request {
      user?: Document & {
        _id: Types.ObjectId | string;
        firstname: string;
        lastname: string;
        username: string;
        email: string;
        // Add any other user properties you need access to
      };
    }
  }
}

// Need this empty export to make TypeScript treat this as a module
export { };
