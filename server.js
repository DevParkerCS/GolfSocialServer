const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const connectDB = require("./config/db");
const cors = require("cors");
const routes = require("./routes");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const app = express();
app.use(
  cors({
    origin: "http://localhost:3001", // Frontend origin
    credentials: true, // Allow cookies to be sent
  })
);

app.use(express.json());
app.use(cookieParser());
connectDB();

const port = process.env.PORT || 3000;

app.use("/api", routes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
