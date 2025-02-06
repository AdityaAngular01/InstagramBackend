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
// app.use(morgan("tiny"));

// Routes Import
const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const postRoutes = require("./routes/post.routes");
const commentRoutes = require("./routes/comment.routes");
const likeRoutes = require("./routes/like.routes");
const followerFollowingRoutes = require("./routes/followerFollowing.routes");
const mediaRoutes = require("./routes/media.routes");
const hashtagRoutes = require("./routes/hashtag.routes");
const messageRoutes = require("./routes/message.routes");
const notificationRoutes = require("./routes/notification.routes");

// Routes
app.use("/auth", authRoutes);
app.use("/user", auth, userRoutes);
app.use("/post", auth, postRoutes);
app.use("/comment", auth, commentRoutes);
app.use("/like", auth, likeRoutes);
app.use("/follow", auth, followerFollowingRoutes);
app.use("/media", auth, mediaRoutes);
app.use("/hashtag", auth, hashtagRoutes);
app.use("/message", auth, messageRoutes);
app.use("/notification", auth, notificationRoutes);

// Export app without starting the server
module.exports = { app, connectToDb };
