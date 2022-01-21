const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

const authRouter = require("./routes/auth");
const usersRouter = require("./routes/user");
const productsRouter = require("./routes/product");
const orderRouter = require("./routes/order");
const cartRouter = require("./routes/cart");
const checkOutRouter = require("./routes/stripe");

dotenv.config();

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("Db Connected"))
  .catch((error) => console.error("DB connection Failed", error));

app.use(cors());
app.use(express.json());

//routes
app.use("/api/auth", authRouter);
app.use("/api/users", usersRouter);
app.use("/api/products", productsRouter);
app.use("/api/orders", orderRouter);
app.use("/api/carts", cartRouter);
app.use("/api/checkout", checkOutRouter);

app.listen(process.env.PORT || 5001, () => {
  console.log("star Server in 5000");
});
