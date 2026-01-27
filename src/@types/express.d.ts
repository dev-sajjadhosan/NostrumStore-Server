import { Role } from "../../generated/prisma/enums";

export type RequestUser = {
  id: string;
  name: string;
  email: string;
  role: Role;
  emailVerified: boolean;
};

declare global {
  namespace Express {
    interface Request {
      user?: RequestUser;
    }
  }
}
