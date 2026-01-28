import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { UserService } from "./user.service";
import { paginationHelpers } from "../../helpers/paginationHelpers";

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

const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const role = req?.user?.role;
  const { search, status } = req.query;
  const options = paginationHelpers(req.params);

  const isSearch = typeof search === "string" ? search : undefined;
  const isStatus = typeof status === "string" ? status : undefined;

  const result = await UserService.getAllUsers({
    options,
    search: isSearch,
    role,
    status: isStatus,
  });

  res.status(200).json({
    success: true,
    message: "Users fetched successfully!",
    data: result,
  });
});

const updateUserStatus = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const data = req.body;

  const result = await UserService.updateUserStatus(id as string, data);

  res.status(201).json({
    success: true,
    message: "User status updated!",
    data: result,
  });
});

const deleteUser = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await UserService.deleteUser(id as string);

  res.status(200).json({
    success: true,
    message: "User delete successfully!",
    data: result,
  });
});

export const UserController = {
  getUser,
  updateUser,
  getAllUsers,
  updateUserStatus,
  deleteUser
};
