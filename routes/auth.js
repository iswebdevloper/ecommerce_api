const router = require("express").Router();
const User = require("../modules/User");
const cryptoJs = require("crypto-js");
const jwt = require("jsonwebtoken");
router.post("/register", async (req, res) => {
  try {
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: cryptoJs.AES.encrypt(
        req.body.password,
        process.env.PASSKEY
      ).toString(),
    });
    const saveUser = await newUser.save();
    res.status(201).json(saveUser);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.post("/login", async (req, res) => {
  try {
    const findUser = await User.findOne({ username: req.body.username });
    if (!findUser) res.status(401).json("wrong Credential");
    const hashPass = cryptoJs.AES.decrypt(
      findUser.password,
      process.env.PASSKEY
    ).toString(cryptoJs.enc.Utf8);
    if (hashPass !== req.body.password)
      res.status(401).json("wrong Credential");
    const accessToken = jwt.sign(
      {
        id: findUser._id,
        isAdmin: findUser.isAdmin,
      },
      process.env.JWTKEY,
      { expiresIn: "3d" }
    );
    const { password, __v, ...info } = findUser._doc;
    res.status(200).json({ ...info, accessToken });
  } catch (error) {
    res.status(401).json(error);
  }
});
module.exports = router;
