import { NextFunction, Request, Response } from "express";
import { auth } from "../lib/auth";
import { Role } from "../../generated/prisma/enums";
import { prisma } from "../lib/prisma";

export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    let session;
    const { id } = req.params;
    const { session: isSession } = req.query;
    if (id && isSession === "false") {
      session = await prisma.session.findFirst({
        where: {
          userId: id as string,
        },
        select: {
          user: true,
        },
      });
    } else
      session = await auth.api.getSession({
        headers: req.headers as any,
      });

    if (!session) {
      return res
        .status(401)
        .json({ success: false, message: "You are not authorize." });
    }

    // if (!session.user.emailVerified) {
    //   return res.status(401).json({
    //     success: false,
    //     message: "You Email is not verified. Please Verified your email.",
    //   });
    // }

    req.user = {
      id: session.user.id,
      name: session.user.name,
      email: session.user.email,
      role: session.user.role as Role,
      emailVerified: session.user.emailVerified,
    };
    next();
  } catch (err) {
    throw err;
  }
};
