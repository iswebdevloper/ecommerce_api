const router = require("express").Router();
const Product = require("../modules/Product");
const {
  verifyAuthorization,
  verifyAuthorizationIsAdmin,
} = require("./verifyToken");

//create
router.post("/", verifyAuthorizationIsAdmin, async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    const saveProduct = await newProduct.save();
    res.status(200).json(saveProduct);
  } catch (error) {
    res.status(500).json(error);
  }
});

//update
router.put("/:id", verifyAuthorizationIsAdmin, async (req, res) => {
  try {
    const updateproduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updateproduct);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

//delete
router.delete("/:id", verifyAuthorizationIsAdmin, async (req, res) => {
  try {
    const deleteProduct = await Product.findByIdAndDelete(req.params.id);
    res.status(200).json(`Product Deleted ID: ${deleteProduct._id}`);
  } catch (error) {
    res.status(500).json(error);
  }
});

//get Product
router.get("/find/:id", async (req, res) => {
  try {
    const getproduct = await Product.findById(req.params.id);
    res.status(200).json(getproduct);
  } catch (error) {
    res.status(500).json(error);
  }
});

//get all Products
router.get("/", async (req, res) => {
  const qNew = req.query.new;
  const qCategory = req.query.category;
  try {
    let products;
    if (qNew) {
      products = await Product.find().sort({ createdAt: -1 }).limit(5);
    } else if (qCategory) {
      products = await Product.find({
        categories: {
          $in: [qCategory],
        },
      });
    } else {
      products = await Product.find();
    }
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json(error);
  }
});

//get User State

router.get("/state", verifyAuthorizationIsAdmin, async (req, res) => {
  const date = new Date();
  const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));
  try {
    const data = await Product.aggregate([
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
