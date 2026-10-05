import pool from "../db.js";

export const getShipmentsByOrder = async (req, res) => {
    try {
        const { oid } = req.params;

        // Kiểm tra đơn hàng có thuộc user đang đăng nhập không
        const orderResult = await pool.query(
            `SELECT oid
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

        const result = await pool.query(
            `SELECT shipid, oid, status
             FROM "Shipment"
             WHERE oid = $1
             ORDER BY shipid`,
            [oid]
        );

        res.json(result.rows);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Lỗi server"
        });
    }
};

export const updateShipmentStatus = async (req, res) => {
    try {
        const { shipid } = req.params;
        const { status } = req.body;

        if (!status) {
            return res.status(400).json({
                message: "Status không được để trống"
            });
        }

        const result = await pool.query(
            `UPDATE "Shipment" s
             SET status = $1
             FROM "Order" o
             WHERE s.shipid = $2
               AND s.oid = o.oid
               AND o.uid = $3
             RETURNING s.shipid, s.oid, s.status`,
            [status, shipid, req.user.uid]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Không tìm thấy Shipment"
            });
        }

        res.json({
            message: "Cập nhật trạng thái Shipment thành công",
            shipment: result.rows[0]
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Lỗi server"
        });
    }
};