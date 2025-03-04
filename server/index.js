const express = require("express");
const app = express();
const dotenv = require("dotenv").config();
const port = process.env.PORT;
const cookieParser = require("cookie-parser");
var cors = require("cors");
const connectDB = require("./config/db");
const { protect } = require("./middleware/authMiddleware");


connectDB();

app.use(cors());

app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.json("Admin");
});

app.listen(port, () => console.log(`Server started at ${port}`));
