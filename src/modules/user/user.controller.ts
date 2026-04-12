import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { UserService } from "./user.service";
import { Role } from "../../../generated/prisma/enums";
import { IQueryParams } from "../../interface/query.interface";

const getUser = catchAsync(async (req: Request, res: Response) => {
  const user = req?.user;
  const result = await UserService.getUser(user);
  res.status(200).json({
    data: result,
    success: true,
    message: "User fetched success.",
  });
});
const getProfile = catchAsync(async (req: Request, res: Response) => {
  const user = req?.user;
  const result = await UserService.getProfile(user);
  res.status(200).json({
    data: result,
    success: true,
    message: "Profile fetched success.",
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
  const user = req?.user;
  const query: IQueryParams = {
    searchTerm: req.query.searchTerm as string,
    page: req.query.page as string,
    limit: req.query.limit as string,
    sortBy: req.query.sortBy as string,
    sortOrder: (req.query.sortOrder as "asc" | "desc") || "desc",
    fields: req.query.fields as string,
    includes: req.query.includes as string,
  };

  const result = await UserService.getAllUsers(query, user?.id as string);

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

const updateUserRole = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const data = req.body;

  const result = await UserService.updateUserRole(id as string, data);

  res.status(201).json({
    success: true,
    message: "User Role updated!",
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

const adminMetaData = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.adminMetaData();
  res.status(200).json({
    data: result,
    success: true,
    message: "admin meta fetched success.",
  });
});

const sellerMetaData = catchAsync(async (req: Request, res: Response) => {
  const user = req?.user;
  console.log(user);
  const result = await UserService.sellerMetaData(user?.id as string);
  res.status(200).json({
    data: result,
    success: true,
    message: "seller meta fetched success.",
  });
});

const updateProfile = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  const data = req.body;
  const result = await UserService.updateProfile(user?.id as string, data);

  res
    .status(201)
    .json({ data: result, success: true, message: "Profile update success." });
});

export const UserController = {
  getUser,
  updateUser,
  getAllUsers,
  updateUserStatus,
  deleteUser,
  updateUserRole,
  sellerMetaData,
  adminMetaData,
  updateProfile,
  getProfile,
};
