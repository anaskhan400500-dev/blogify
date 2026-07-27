const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const path = require("path");
const dotenv = require("dotenv");
dotenv.config();

const userRouter = require("./routes/user");
const blogRouter = require("./routes/blog");
const blog = require("./model/blog");
const comment = require("./model/comments");
const { checkTokenAtEveryReq } = require("./middleware/authentication");

const app = express();
const port = process.env.PORT || 8000;

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("mongo db is connected"))
  .catch((err) => console.log("error is" + err));

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));
app.use(express.static("public"));

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(checkTokenAtEveryReq("token"));

app.use("/user", userRouter);
app.use("/blog", blogRouter);

app.get("/", async (req, res) => {
  const allBlogs = await blog.find({});
  res.render("home", {
    user: req.user,
    blogs: allBlogs,
  });
});

app.get("/me", async (req, res) => {
  if (!req.user) {
    return res.end("Please login");
  }
  const myBlogs = await blog.find({ createdBy: req.user.id });
  res.render("me", {
    user: req.user,
    blogs: myBlogs,
  });
});

app.get("/delete/:id", async (req, res) => {
  const Id = req.params.id;
  await blog.deleteOne({ _id: Id });
  await comment.deleteMany({ blogId: Id });
  res.redirect("/me");
});

app.listen(port, () => console.log(`server started at port: ${port}`));
