import { Router } from "express";
import { MedicinesController } from "./medicines.controller";
import { protect } from "../../middleware/protect";
import { restrictRole } from "../../middleware/restrictRoles";

const router = Router();

router.get("/medicines", MedicinesController.getAllMedicines); // Public
router.get("/medicines/:id", MedicinesController.getSingleMedicineById); // Public
router.post(
  "/seller/medicines",
    protect,
    restrictRole("SELLER"),
  MedicinesController.createMedicine,
);

router.put(
  "/seller/medicines/:id",
    protect,
    restrictRole("SELLER"),
  MedicinesController.updateMedicine,
);

router.delete(
  "/seller/medicines/:id",
  protect,
  restrictRole("SELLER"),
  MedicinesController.deleteMedicine,
);

export const MedicinesRoutes = router;
