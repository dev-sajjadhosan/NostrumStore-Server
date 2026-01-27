import { Router } from "express";
import { MedicinesController } from "./medicines.controller";
import { protect } from "../../middleware/protect";
import { restrictRole } from "../../middleware/restrictRoles";

const router = Router();

router.get("/", MedicinesController.getAllMedicines);
router.post(
  "/",
  //   protect,
  //   restrictRole("SELLER"),
  MedicinesController.createMedicine,
); // protect,

router.patch(
  "/:id",
  //   protect,
  //   restrictRole("SELLER"),
  MedicinesController.updateMedicine,
);

export const MedicinesRoutes = router;
