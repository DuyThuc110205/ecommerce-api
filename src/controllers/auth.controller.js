import bcrypt from "bcrypt";
import pool from "../db.js";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
    try {
        const { username, fullname, password, roleid, mid } = req.body;

        if (!username || !fullname || !password || !roleid || !mid) {
            return res.status(400).json({
                message: "Vui lòng nhập đầy đủ thông tin"
            });
        }

        const existingUser = await pool.query(
            'SELECT uid FROM "User" WHERE username = $1',
            [username]
        );

        if (existingUser.rows.length > 0) {
            return res.status(409).json({
                message: "Username đã tồn tại"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await pool.query(
            `INSERT INTO "User"
                (username, fullname, password, roleid, mid)
             VALUES ($1, $2, $3, $4, $5)
             RETURNING uid, username, fullname, roleid, mid`,
            [username, fullname, hashedPassword, roleid, mid]
        );

        res.status(201).json({
            message: "Đăng ký thành công",
            user: result.rows[0]
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Lỗi server"
        });
    }
};

export const login = async (req, res) => {
    console.log(">>> LOGIN CONTROLLER");
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({
                message: "Vui lòng nhập username và password"
            });
        }

        const result = await pool.query(
            `SELECT uid, username, fullname, password, roleid, mid
             FROM "User"
             WHERE username = $1`,
            [username]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({
                message: "Username hoặc password không đúng"
            });
        }

        const user = result.rows[0];

        const isPasswordCorrect = await bcrypt.compare(
            password,
            user.password
        );

        if (!isPasswordCorrect) {
            return res.status(401).json({
                message: "Username hoặc password không đúng"
            });
        }

        const token = jwt.sign(
            {
                uid: user.uid,
                username: user.username,
                roleid: user.roleid,
                mid: user.mid
            },
            process.env.JWT_SECRET,
            {
                expiresIn: process.env.JWT_EXPIRES_IN || "1d"
            }
        );

        res.json({
            message: "Đăng nhập thành công",
            token
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Lỗi server"
        });
    }
};