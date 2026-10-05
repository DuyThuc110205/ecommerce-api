import express from "express";

import {
    getProducts,
    createProduct,
    getProductById,
    updateProduct,
    deleteProduct
} from "../controllers/product.controller.js";

import authMiddleware from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", getProducts);

router.get("/:pid", getProductById);

router.post("/", authMiddleware, createProduct);

router.put("/:pid", authMiddleware, updateProduct);

router.delete("/:pid", authMiddleware, deleteProduct);

export default router;