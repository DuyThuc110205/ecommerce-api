import express from "express";

import {
    getOrders,
    createOrder,
    getOrderById
} from "../controllers/order.controller.js";

import authMiddleware from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", authMiddleware, getOrders);
router.post("/", authMiddleware, createOrder);
router.get("/:oid", authMiddleware, getOrderById);

export default router;