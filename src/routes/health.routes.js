import express from "express";
import pool from "../db.js";

const router = express.Router();

router.get("/", (req, res) => {
    res.json({
        status: "ok",
        service: "ecommerce-api"
    });
});

router.get("/db", async (req, res) => {
    try {
        await pool.query("SELECT 1");

        res.json({
            status: "ok",
            database: "connected"
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            status: "error",
            database: "disconnected"
        });
    }
});

export default router;