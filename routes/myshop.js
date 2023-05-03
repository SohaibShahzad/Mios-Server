const { Router } = require("express");
const express = require("express");
const fetchuser = require("../middleware/fetchuser");
const router = express.Router();
const MyShop = require("../models/MyShop");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;


// Add Items to myshop using : POST "/api/myshop/addtomyshop", Requires a auth token
router.post("/addToMyShop", fetchuser, [], async (req, res) => {
  try {
    const { product } = req.body;
    const existingUser = await MyShop.findOne({ user: req.user.id });
    if (existingUser) {
      const productId = ObjectId(product._id);
      const result = await MyShop.updateOne(
        {
          user: req.user.id,
        },
        { $addToSet: { product: productId } }
      );
      if (result.nModified === 0) {
        res.json({ message: "Product already exists in MyShop" });
      } else {
        res.json({ message: "Product added to MyShop successfully" });
      }
    } else {
      const newMyShop = new MyShop({
        user: req.user.id,
        product: [ObjectId(product._id)],
      });
      await newMyShop.save();
      res.json({ message: "Product added to MyShop successfully" });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});


// fetch all myshop items using : GET "/api/myshop/allmyshopitems", Requires a auth token
router.get("/allmyshopitems", fetchuser, [], async (req, res) => {
  try {
    const myshop = await MyShop.findOne({ user: req.user.id }).populate('product');
    res.json(myshop);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});




module.exports = router;
