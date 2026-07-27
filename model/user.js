const { Schema, model } = require("mongoose");
const bcrypt = require("bcrypt");
const { createTokenForUser } = require("../services/authentication");

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    profileImageUrl: {
      type: String,
      default: "/images/download.jpg",
    },
    role: {
      type: String,
      enum: ["USER", "ADMIN"],
      default: "USER",
    },
  },
  { timestamps: true },
);

userSchema.pre("save", async function (next) {
  const user = this;
  if (!user.isModified("password")) return;

  const hashedPassword = await bcrypt.hash(user.password, 10);
  user.password = hashedPassword;
});

userSchema.static(
  "isMatchedPasswordAndGenerateToken",
  async function (email, password) {
    const entry = await this.findOne({ email });
    if (!entry) throw new Error("User not found");

    const isMatch = await bcrypt.compare(password, entry.password);
    if (!isMatch) throw new Error("Password is incorrect");
    const token = createTokenForUser(entry);
    return token;
  },
);

const user = model("user", userSchema);
module.exports = user;
