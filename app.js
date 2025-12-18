const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");

const app = express();

const fileUploader = require('express-fileupload');

/* ---------- Middlewares ---------- */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("dev"));
app.use(fileUploader({
    useTempFiles:true,
    tempFileDir:'/tmp/'
}));

/* ---------- Routes imports ---------- */
const authRoutes = require("./routes/auth.routes");
const productRoutes = require('./routes/product.route')

/* ---------- Routes ---------- */
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);

/* ---------- Test Route ---------- */
app.get("/", (req, res) => {
    res.send("API is running...");
});

module.exports = app;
