import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { paginationHelpers } from "../../helpers/paginationHelpers";
import { MedicinesService } from "./medicines.service";

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

  console.log(data.length <= 0);

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

export const MedicinesController = { getAllMedicines };
