const express = require("express");
const app = express();
const dotenv = require("dotenv").config();
const port = process.env.PORT;
const cookieParser = require("cookie-parser");
var cors = require("cors");
const connectDB = require("./config/db");
const notificationRoutes = require('./routes/notificationRoutes')
const adminRoutes = require('./routes/adminRoutes')


connectDB();

app.use(
    cors({
        origin: ["https://admin-panel-42zh.vercel.app"],
        credentials: true,
      })
);

app.use(express.json());
app.use(cookieParser());

app.use('/admin', adminRoutes)
app.use('/notification', notificationRoutes)

app.listen(port, () => console.log(`Server started at ${port}`));
