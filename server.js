const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const routes = require("./routes");

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors()); // Enable CORS for all routes

// Connect to the database
connectDB();

// Use the routes
app.use("/api", routes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
