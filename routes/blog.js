const { Router } = require("express");
const blog = require("../model/blog");
const comment = require("../model/comments");
const multer = require("multer");
const { findById } = require("../model/user");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../cloudinary");

const router = Router();

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "blog-images",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
  },
});

const upload = multer({ storage });

router.post("/add-new", upload.single("coverImageUrl"), async (req, res) => {
  const { title, body } = req.body;
  const entry = await blog.create({
    title,
    body,
    coverImageUrl: req.file.path,
    createdBy: req.user.id,
  });
  return res.redirect(`/blog/${entry._id}`);
});

router.post("/comment/:blogId", async (req, res) => {
  entryComment = await comment.create({
    content: req.body.content,
    blogId: req.params.blogId,
    createdBy: req.user.id,
  });
  res.redirect(`/blog/${req.params.blogId}`);
});

router.get("/add-new", (req, res) => {
  res.render("addBlog", {
    user: req.user,
  });
});

router.get("/:id", async (req, res) => {
  const Id = req.params.id;
  const blogById = await blog.findById(Id).populate("createdBy");
  // const comments = await comment.findById(Id).populate("createdBy");
  const comments = await comment.find({ blogId: Id }).populate("createdBy");
  res.render("fullBlog", {
    blog: blogById,
    user: req.user,
    comments,
  });
});
module.exports = router;
