import pool from "../db.js";

export const getMe = async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT
                uid,
                username,
                fullname,
                roleid,
                mid
             FROM "User"
             WHERE uid = $1`,
            [req.user.uid]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Không tìm thấy người dùng"
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