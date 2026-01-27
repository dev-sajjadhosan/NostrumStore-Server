import { Router } from "express";
import { MedicinesController } from "./medicines.controller";

const router = Router();

router.get("/", MedicinesController.getAllMedicines);

export const MedicinesRoutes = router;

