import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { OrderService } from "./orders.service";
import { paginationHelpers } from "../../helpers/paginationHelpers";
import { OrdersStatus } from "../../../generated/prisma/enums";

const createOrder = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  const data = req.body;

  const result = await OrderService.createOrder({ user, data });

  res.status(201).json({
    success: true,
    message: "Order placed successfully!",
    data: result,
  });
});

const getAllUserOrders = catchAsync(async (req: Request, res: Response) => {
  const user = req?.user;
  const { search, status } = req.query;
  const isSearch = typeof search === "string" ? search : undefined;
  const isStatus = typeof status === "string" ? status : undefined;
  const options = paginationHelpers(req.query);

  const result = await OrderService.getAllUserOrders({
    user,
    options,
    search: isSearch,
    status: isStatus,
  });

  res.status(200).json({
    success: true,
    message: "Orders fetched successfully!",
    data: result,
  });
});

const getOrderById = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  const { id } = req.params;

  const result = await OrderService.getOrderById(user, id as string);

  res.status(200).json({
    success: true,
    message: "Order fetched successfully!",
    data: result,
  });
});

const getAllOrders = catchAsync(async (req: Request, res: Response) => {
  const user = req?.user;
  const { search, status } = req.query;
  const isSearch = typeof search === "string" ? search : undefined;
  const isStatus = typeof status === "string" ? status : undefined;
  const options = paginationHelpers(req.query);

  const result = await OrderService.getAllOrders({
    user,
    options,
    search: isSearch,
    status: isStatus,
  });

  res.status(200).json({
    success: true,
    message: "Orders fetched successfully!",
    data: result,
  });
});
const getAllOrdersAdmin = catchAsync(async (req: Request, res: Response) => {
  const user = req?.user;
  const { search, status } = req.query;
  const isSearch = typeof search === "string" ? search : undefined;
  const isStatus = typeof status === "string" ? status : undefined;
  const options = paginationHelpers(req.query);

  const result = await OrderService.getAllOrdersAdmin({
    options,
    search: isSearch,
    status: isStatus,
  });

  res.status(200).json({
    success: true,
    message: "Orders fetched successfully!",
    data: result,
  });
});

const updateOrderStatus = catchAsync(async (req: Request, res: Response) => {
  const user = req?.user;
  const { id } = req.params;
  const body = req.body;

  console.log({id, body});

  const result = await OrderService.updateOrderStatus(id as string, body, user);

  res.status(201).json({
    success: true,
    message: `Order ${result?.customerId} has been updated!`,
    data: result,
  });
});

const updateCustomerOrderStatus = catchAsync(async (req: Request, res: Response) => {
  const user = req?.user;
  const { id } = req.params;
  const body = req.body;

  const result = await OrderService.updateCustomerOrderStatus(id as string, body, user);

  res.status(201).json({
    success: true,
    message: `Order has been updated!`,
    data: result,
  });
});

export const OrderController = {
  createOrder,
  getAllOrders,
  updateOrderStatus,
  getAllUserOrders,
  getOrderById,
  getAllOrdersAdmin,updateCustomerOrderStatus
};
