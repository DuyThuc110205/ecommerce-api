import express from "express";
import healthRouter from "./routes/health.routes.js";
import authRouter from "./routes/auth.routes.js";
import userRouter from "./routes/user.routes.js";
import productRouter from "./routes/product.routes.js";
import orderRouter from "./routes/order.routes.js";
import shipmentRouter from "./routes/shipment.routes.js";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        message: "E-commerce API is running"
    });
});

app.use("/health", healthRouter);
app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/products", productRouter);
app.use("/api/orders", orderRouter);
app.use("/api/shipments", shipmentRouter);

export default app;