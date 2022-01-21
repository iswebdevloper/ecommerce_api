const router = require("express").Router();
const Cart = require("../modules/Cart");
const {
  verifyAuthorization,
  verifyToken,
  verifyAuthorizationIsAdmin,
} = require("./verifyToken");

//create
router.post("/", verifyToken, async (req, res) => {
  try {
    const newCart = new Cart(req.body);
    const saveCart = await newCart.save();
    res.status(200).json(saveCart);
  } catch (error) {
    res.status(500).json(error);
  }
});

//update
router.put("/:id", verifyAuthorization, async (req, res) => {
  try {
    const updateCart = await Cart.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updateCart);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

//delete
router.delete("/:id", verifyAuthorization, async (req, res) => {
  try {
    const deleteCart = await Cart.findByIdAndDelete(req.params.id);
    res.status(200).json(`Product Deleted ID: ${deleteCart._id}`);
  } catch (error) {
    res.status(500).json(error);
  }
});

//get Cart
router.get("/find/:userid", verifyAuthorization, async (req, res) => {
  try {
    const getCart = await Cart.findOne({ userId: req.params.userid });
    res.status(200).json(getCart);
  } catch (error) {
    res.status(500).json(error);
  }
});

//get All

router.get("/", verifyAuthorizationIsAdmin, async (req, res) => {
  try {
    const carts = await Cart.find();
    res.status(200).json(carts);
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
