import pool from "../db.js";

export const getProducts = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT pid, pname, price, quantity
            FROM "Product"
            ORDER BY pid
        `);

        res.json(result.rows);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Lỗi server"
        });
    }
};

export const createProduct = async (req, res) => {
    try {
        const { pname, price, quantity } = req.body;

        if (!pname || price === undefined || quantity === undefined) {
            return res.status(400).json({
                message: "Vui lòng nhập đầy đủ thông tin sản phẩm"
            });
        }

        const result = await pool.query(
            `INSERT INTO "Product" (pname, price, quantity)
             VALUES ($1, $2, $3)
             RETURNING pid, pname, price, quantity`,
            [pname, price, quantity]
        );

        res.status(201).json({
            message: "Tạo sản phẩm thành công",
            product: result.rows[0]
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Lỗi server"
        });
    }
};

export const getProductById = async (req, res) => {
    try {
        const { pid } = req.params;

        const result = await pool.query(
            `SELECT pid, pname, price, quantity
             FROM "Product"
             WHERE pid = $1`,
            [pid]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Không tìm thấy sản phẩm"
            });
        }

        res.json(result.rows[0]);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Lỗi server"
        });
    }
};

export const updateProduct = async (req, res) => {
    try {
        const { pid } = req.params;
        const { pname, price, quantity } = req.body;

        if (!pname || price === undefined || quantity === undefined) {
            return res.status(400).json({
                message: "Vui lòng nhập đầy đủ thông tin sản phẩm"
            });
        }

        const result = await pool.query(
            `UPDATE "Product"
             SET pname = $1,
                 price = $2,
                 quantity = $3
             WHERE pid = $4
             RETURNING pid, pname, price, quantity`,
            [pname, price, quantity, pid]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Không tìm thấy sản phẩm"
            });
        }

        res.json({
            message: "Cập nhật sản phẩm thành công",
            product: result.rows[0]
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Lỗi server"
        });
    }
};

export const deleteProduct = async (req, res) => {
    try {
        const { pid } = req.params;

        const result = await pool.query(
            `DELETE FROM "Product"
             WHERE pid = $1
             RETURNING pid, pname, price, quantity`,
            [pid]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Không tìm thấy sản phẩm"
            });
        }

        res.json({
            message: "Xóa sản phẩm thành công",
            product: result.rows[0]
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Lỗi server"
        });
    }
};