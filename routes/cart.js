const { Router } = require("express");
const express = require("express");
const fetchuser = require("../middleware/fetchuser");
const router = express.Router();
const Cart = require("../models/Cart");

// Add Items to cart using : POST "/api/cart/addtocart", Requires a auth token
router.post("/addtocart", fetchuser, [], async (req, res) => {
  try {
    const { cart } = req.body;
    const existingUser = await Cart.findOne({ user: req.user.id });
    if (existingUser) {
      let existingProduct = false;
      const checkingProduct = await existingUser.cart.forEach((element) => {
        if (element.product._id === cart.product._id) {
          return (existingProduct = true);
        }
      });
      if (existingProduct === false) {
        existingUser.cart.push(cart);
        await existingUser.save();
        res.json({ message: "Item added to cart successfully" });
      }
    } else {
      const newCart = new Cart({
        user: req.user.id,
        cart: cart,
      });
      await newCart.save();
      res.json({ message: "Item added to cart successfully" });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

// delete an item from cart using : DELETE "/api/cart/deletecartitem/:id", Requires a auth token
router.delete("/deletecartitem/:id", fetchuser, async (req, res) => {
  try {
    const findUser = await Cart.findOne({ user: req.user.id });
    const objectIndex = await findUser.cart.findIndex(
      (item) => item.product._id === req.params.id
    );

    if (objectIndex !== -1) {
      findUser.cart.splice(objectIndex, 1);
      const updatedCart = await Cart.findOneAndUpdate(
        { user: req.user.id },
        { $set: { cart: findUser.cart } },
        { new: true }
      )
        .then((result) => {
          res
            .status(200)
            .json({ message: "Cart updated successfully", result });
        })
        .catch((error) => {
          console.error(error.message);
        });
    } else {
      res.status(404).json({ message: "Product not found in cart" });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

// update cart array using : PUT "/api/cart/updatecart", Requires a auth token
router.put("/updatecart/:id", fetchuser, [], async (req, res) => {
  try {
    const findUser = await Cart.findOne({ user: req.user.id });
    const { qty } = req.body
    const objectIndex = await findUser.cart.findIndex(
      (item) => item.product._id === req.params.id
    );

    if (objectIndex !== -1) {
      findUser.cart[objectIndex].quantity = qty;
      const updatedCart = await Cart.findOneAndUpdate(
        { user: req.user.id },
        { $set: { cart: findUser.cart } },
        { new: true }
      )
        .then((result) => {
          res
            .status(200)
            .json({ message: "Cart updated successfully", result });
        })
        .catch((error) => {
          console.error(error.message);
        });
    } else {
      res.status(404).json({ message: "Product not found in cart" });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

// fetch all cart items using : GET "/api/cart/allcartitems", Requires a auth token
router.get("/allcartitems", fetchuser, [], async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id });
    res.json(cart);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

// update cart quantity using : PUT "/api/cart/updatecartquantity/:id", Requires a auth token
router.put("/updatecartquantity/:id", fetchuser, async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.id);
    if (!cart) {
      return res.status(404).json({ msg: "Item not found" });
    }
    const { quantity } = req.body;
    cart.quantity = quantity;
    await cart.save();
    res.json({ msg: "Product quantity updated" });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
