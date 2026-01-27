import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { UserService } from "./user.service";

const getUser = catchAsync(async (req: Request, res: Response) => {
  const user = req?.user;
  const result = await UserService.getUser(user);
  res.status(200).json({
    data: result,
    success: true,
    message: "User fetched success.",
  });
});

const updateUser = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  const data = req.body;
  const result = await UserService.updateUser(user, data);

  res
    .status(201)
    .json({ data: result, success: true, message: "User update success." });
});

export const UserController = { getUser,updateUser };
