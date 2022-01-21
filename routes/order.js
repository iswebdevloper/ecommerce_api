const router = require("express").Router();
const Order = require("../modules/Order");
const {
  verifyAuthorization,
  verifyToken,
  verifyAuthorizationIsAdmin,
} = require("./verifyToken");

//create
router.post("/", verifyToken, async (req, res) => {
  try {
    const newOrder = new Order(req.body);
    const saveOrder = await newOrder.save();
    res.status(200).json(saveOrder);
  } catch (error) {
    res.status(500).json(error);
  }
});

//update
router.put("/:id", verifyAuthorization, async (req, res) => {
  try {
    const updateOrder = await Order.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updateOrder);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

//delete
router.delete("/:id", verifyAuthorization, async (req, res) => {
  try {
    const deleteOrder = await Order.findByIdAndDelete(req.params.id);
    res.status(200).json(`Product Deleted ID: ${deleteOrder._id}`);
  } catch (error) {
    res.status(500).json(error);
  }
});

//get Cart
router.get("/find/:userid", verifyAuthorization, async (req, res) => {
  try {
    const getOrder = await Order.find({ userId: req.params.userid });
    res.status(200).json(getOrder);
  } catch (error) {
    res.status(500).json(error);
  }
});

//get All

router.get("/", verifyAuthorizationIsAdmin, async (req, res) => {
  try {
    const orders = await Order.find();
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json(error);
  }
});
//get Monthly income
router.get("/income", verifyAuthorizationIsAdmin, async (req, res) => {
  const date = new Date();
  const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
  const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1));
  try {
    const data = await Order.aggregate([
      { $match: { createdAt: { $gte: previousMonth } } },
      {
        $project: {
          month: { $month: "$createdAt" },
          sales: "$amount",
        },
      },
      {
        $group: {
          _id: "$month",
          total: { $sum: "$sales" },
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
