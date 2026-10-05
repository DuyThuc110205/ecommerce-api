import pool from "../db.js";

export const getOrders = async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT oid, uid, createat
             FROM "Order"
             WHERE uid = $1
             ORDER BY createat DESC`,
            [req.user.uid]
        );

        res.json(result.rows);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Lỗi server"
        });
    }
};

export const createOrder = async (req, res) => {
    const client = await pool.connect();

    try {
        const { items } = req.body;

        if (!Array.isArray(items) || items.length === 0) {
            return res.status(400).json({
                message: "Danh sách sản phẩm không được để trống"
            });
        }

        await client.query("BEGIN");

        const orderResult = await client.query(
            `INSERT INTO "Order" (uid, createat)
             VALUES ($1, NOW())
             RETURNING oid, uid, createat`,
            [req.user.uid]
        );

        const order = orderResult.rows[0];

        for (const item of items) {
            const { pid, qty } = item;

            if (!pid || !qty || qty <= 0) {
                throw new Error("Thông tin sản phẩm không hợp lệ");
            }

            const productResult = await client.query(
                `SELECT pid, price, quantity
                 FROM "Product"
                 WHERE pid = $1`,
                [pid]
            );

            if (productResult.rows.length === 0) {
                throw new Error(`Product ${pid} không tồn tại`);
            }

            const product = productResult.rows[0];

            if (product.quantity < qty) {
                throw new Error(`Product ${pid} không đủ số lượng`);
            }

            await client.query(
                `INSERT INTO "OrderDetail"
                    (oid, pid, qty, unit_price)
                 VALUES ($1, $2, $3, $4)`,
                [order.oid, pid, qty, product.price]
            );

            await client.query(
                `UPDATE "Product"
                 SET quantity = quantity - $1
                 WHERE pid = $2`,
                [qty, pid]
            );
        }

        await client.query("COMMIT");

        res.status(201).json({
            message: "Tạo đơn hàng thành công",
            order
        });

    } catch (error) {
        await client.query("ROLLBACK");

        console.error(error);

        res.status(400).json({
            message: error.message
        });

    } finally {
        client.release();
    }
};

export const getOrderById = async (req, res) => {
    try {
        const { oid } = req.params;

        const orderResult = await pool.query(
            `SELECT oid, uid, createat
             FROM "Order"
             WHERE oid = $1
               AND uid = $2`,
            [oid, req.user.uid]
        );

        if (orderResult.rows.length === 0) {
            return res.status(404).json({
                message: "Không tìm thấy đơn hàng"
            });
        }

        const order = orderResult.rows[0];

        const detailResult = await pool.query(
            `SELECT
                od.pid,
                p.pname,
                od.qty,
                od.unit_price
             FROM "OrderDetail" od
             JOIN "Product" p
               ON od.pid = p.pid
             WHERE od.oid = $1`,
            [oid]
        );

        res.json({
            order,
            items: detailResult.rows
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Lỗi server"
        });
    }
};