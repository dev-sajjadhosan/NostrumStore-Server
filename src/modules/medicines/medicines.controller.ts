import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { paginationHelpers } from "../../helpers/paginationHelpers";
import { MedicinesService } from "./medicines.service";
import { string } from "better-auth/*";
import { MedicinesUpdateInput } from "../../../generated/prisma/models";

const getAllMedicines = catchAsync(async (req: Request, res: Response) => {
  const { search } = req.query;
  const isSearch = typeof search === "string" ? search : undefined;
  const tags = req.query.tags ? (req.query.tags as string).split(",") : [];
  const options = paginationHelpers(req.query);

  const { data, pagination } = await MedicinesService.getAllMedicines({
    search: isSearch,
    tags,
    options,
  });

  if (data.length <= 0) {
    return res.status(200).json({
      success: true,
      message: "Medicine fetched success.",
      empty: true,
      data: [],
    });
  }

  res.status(200).json({
    success: true,
    message: "Medicine fetched success.",
    data: { data, pagination },
  });
});

const createMedicine = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  const data = req.body;
  const result = await MedicinesService.createMedicine({ user, data });

  res.status(201).json({
    success: true,
    message: "Medicine created successfully.",
    data: result,
  });
});

const getSingleMedicineById = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    const result = await MedicinesService.getSingleMedicineById(id as string);

    res.status(200).json({
      success: true,
      message: "Medicine data fetched successfully.",
      data: result,
    });
  },
);

const updateMedicine = catchAsync(async (req: Request, res: Response) => {
  const user = req?.user;
  const { id } = req.params;
  const data = req.body as MedicinesUpdateInput;

  const result = await MedicinesService.updateMedicine({ id, user, data });
  res.status(201).json({
    success: true,
    message: "Medicine updated successfully.",
    data: result,
  });
});

const deleteMedicine = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await MedicinesService.deleteMedicine(id as string);
  res.status(200).json({
    success: true,
    message: "Medicine delete successfully.",
    data: result,
  });
});

export const MedicinesController = {
  getAllMedicines,
  getSingleMedicineById,
  createMedicine,
  updateMedicine,
  deleteMedicine,
};
