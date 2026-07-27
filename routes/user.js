const { Router } = require("express");
const user = require("../model/user");
const { createTokenForUser } = require("../services/authentication");

const router = Router();
router.get("/signup", (req, res) => {
  res.render("signup");
});
router.get("/login", (req, res) => {
  res.render("login");
});

router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const entry = await user.create({
      name,
      email,
      password,
    });

    const token = createTokenForUser(entry);
    res.cookie("token", token);

    res.redirect("/");
  } catch (error) {
    console.log(error);
  }
});
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const token = await user.isMatchedPasswordAndGenerateToken(email, password);
    res.cookie("token", token);
    res.redirect("/");
  } catch (error) {
    res.render("login", {
      err: "incorrect email or password",
    });
  }
});

router.get("/logout", (req, res) => {
  res.clearCookie("token").redirect("/");
});

module.exports = router;
