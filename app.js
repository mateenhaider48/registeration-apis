const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();

const fileUploader = require("express-fileupload");

/* ---------- Middlewares ---------- */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  fileUploader({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

/* ---------- Routes imports ---------- */
const authRoutes = require("./routes/auth.routes");
const productRoutes = require("./routes/product.route");

/* ---------- Routes ---------- */
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);

module.exports = app;
