import { Router } from "express";
import { healthCheck } from "../controllers/healthCheck.controllers.js";

const router = Router()

router.route("/", healthCheck)

export default router