import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { MedicinesService } from "./medicines.service";
import { MedicinesUpdateInput } from "../../../generated/prisma/models";
import { IQueryParams } from "../../interface/query.interface";

const getSellerAllMedicines = catchAsync(
  async (req: Request, res: Response) => {
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

    const { data, meta } = await MedicinesService.getSellerAllMedicines(
      query,
      user?.id as string,
    );

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
      data: { data, meta },
    });
  },
);

const getAllMedicines = catchAsync(async (req: Request, res: Response) => {
  const query: IQueryParams = {
    searchTerm: req.query.searchTerm as string,
    page: req.query.page as string,
    limit: req.query.limit as string,
    sortBy: req.query.sortBy as string,
    sortOrder: (req.query.sortOrder as "asc" | "desc") || "desc",
    fields: req.query.fields as string,
    includes: req.query.includes as string,
  };

  const { data, meta } = await MedicinesService.getAllMedicines(query);

  res.status(200).json({
    success: true,
    message: "Medicine fetched success.",
    data: { data, meta },
  });
});

const createMedicine = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  const data = req.body;
  const result = await MedicinesService.createMedicine({ user, data });

  console.log(result);

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

const updateMedicineStock = catchAsync(async (req: Request, res: Response) => {
  const user = req?.user;
  const { id } = req.params;
  const data = req.body as any;

  const result = await MedicinesService.updateMedicineStock({ id, user, data });
  res.status(201).json({
    success: true,
    message: "Medicine stock updated successfully.",
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
  updateMedicineStock,
  getSellerAllMedicines,
};
