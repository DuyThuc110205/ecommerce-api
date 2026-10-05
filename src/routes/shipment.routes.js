import express from "express";

import {
    getShipmentsByOrder,
    updateShipmentStatus
} from "../controllers/shipment.controller.js";

import authMiddleware from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/order/:oid", authMiddleware, getShipmentsByOrder);

router.put("/:shipid", authMiddleware, updateShipmentStatus);

export default router;