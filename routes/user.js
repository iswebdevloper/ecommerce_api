const router = require("express").Router();
const User = require("../modules/User");
const {
  verifyAuthorization,
  verifyAuthorizationIsAdmin,
} = require("./verifyToken");

//update
router.put("/:id", verifyAuthorization, async (req, res) => {
  if (req.body.password) {
    req.body.password = CryptoJS.AES.encrypt(
      req.body.password,
      process.env.PASSKEY
    ).toString();
  }
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    const { password, __v, ...info } = updatedUser._doc;
    res.status(200).json({ ...info });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

//delete
router.delete("/:id", verifyAuthorization, async (req, res) => {
  try {
    const deleteUser = await User.findByIdAndDelete(req.params.id);
    res.status(200).json(`User Deleted ID: ${deleteUser._id}`);
  } catch (error) {
    res.status(500).json(error);
  }
});

//get User
router.get("/find/:id", verifyAuthorizationIsAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const { password, __v, ...info } = user._doc;
    res.status(200).json(info);
  } catch (error) {
    res.status(500).json(error);
  }
});

//get all User
router.get("/", verifyAuthorizationIsAdmin, async (req, res) => {
  try {
    const query = req.query.new;
    const users = query
      ? await User.find().sort({ _id: -1 }).limit(5)
      : await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json(error);
  }
});

//get User State

router.get("/state", verifyAuthorizationIsAdmin, async (req, res) => {
  const date = new Date();
  const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));
  try {
    const data = await User.aggregate([
      { $match: { createdAt: { $gte: lastYear } } },
      {
        $project: {
          month: { $month: "$createdAt" },
        },
      },
      {
        $group: {
          _id: "$month",
          total: { $sum: 1 },
        },
      },
    ]);
    res.status(200).json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

module.exports = router;
