import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { OrderService } from "./orders.service";

const createOrder = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  const data = req.body;

    const result = await OrderService.createOrder({ user, data });

    res.status(201).json({
      success: true,
      message: "Order placed successfully.",
      data: result,
    });
});

export const OrderController = { createOrder };
