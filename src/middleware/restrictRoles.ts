import { NextFunction, Request, Response } from "express";
import { Role } from "../../generated/prisma/enums";

export const restrictRole = (...roles: Role[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (roles.length && !roles.includes(req?.user?.role as Role)) {
      return res.status(403).json({
        success: false,
        message:
          "Forbidden! You don't have permission to access this resources!",
      });
    }

    next();
  };
};
