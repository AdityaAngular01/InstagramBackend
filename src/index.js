const express = require("express");
const { connectToDb } = require("./database/connectToDb");

//Middleware Import
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const {auth} = require('./middleware/auth.middleware')

require("dotenv").config();
const app = express();

// Middlewares
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan("tiny"));

// Routes Import
const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");

// Routes
app.use("/auth", authRoutes);
app.use("/user", auth, userRoutes);

// Export app without starting the server
module.exports = { app, connectToDb };
