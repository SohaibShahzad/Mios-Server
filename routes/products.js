const express = require('express')
const fetchuser = require('../middleware/fetchuser')
const router = express.Router()
const Product = require('../models/Product')
const userRoleCheck = require('../middleware/userRoleCheck')
const multer = require('multer');
const upload = multer({});
const v2 = require("../cloudinary");


router.post('/addproduct', fetchuser, userRoleCheck, upload.single('file'), async (req, res) => {
  try {
    const { category, skuNumber, title, stock, wholesalePrice, dropshipperPrice, discountedPriceW, discountedPriceD, purchasePrice, weight, featured, onSale, photo, description } = req.body;

    const result = await v2.uploader.upload(photo, { folder: 'mios-products', crop: "scale" });
    const { public_id, url } = result;
    if (!public_id) {
      return res.status(400).send("Server Error");
    }
    const product = await Product.create({ category, skuNumber, title, stock, wholesalePrice, dropshipperPrice, discountedPriceW, discountedPriceD, purchasePrice, weight, featured, onSale, photo: { public_id, url }, description })
    res.status(201).send({ message: 'Product added successfully' })
  } catch (error) {
    res.status(500).send(error)
  }
})



// get Featured Products 
router.get('/featured', fetchuser, async (req, res) => {
  try {
    const featuredProducts = await Product.find({ featured: true })
    res.json({ featuredProducts })
  } catch (error) {
    res.status(500).send(error.message)
  }
})


// in stock products
router.get('/instock', fetchuser, async (req, res) => {
  try {
    const products = await Product.find({ stock: { $gt: 0 } })
    res.json({ products })
  } catch (error) {
    res.status(500).send(error.message)
  }
}
)


// out of stock products
router.get('/outofstock', fetchuser, async (req, res) => {
  try {
    const products = await Product.find({ stock: { $lt: 1 } })
    res.json({ products })
  } catch (error) {
    res.status(500).send(error.message)
  }
}
)


// get all on sale products 
router.get('/onsale', fetchuser, async (req, res) => {
  try {
    let onSaleProducts = [];
    if (req.user.role === "wholeseller") {
      onSaleProducts = await Product.find({ discountedPriceW: { $gt: 0 } })
    } else if (req.user.role === "dropshipper") {
      onSaleProducts = await Product.find({ discountedPriceD: { $gt: 0 } })
    }
    res.json({ onSaleProducts })
  } catch (error) {
    res.status(500).send(error.message)
  }
})


// Fetch all USER SPECIFIC Products from the database  : GET "/api/notes/userproducts", Require a auth token
router.get('/userproducts', fetchuser, userRoleCheck, async (req, res) => {
  try {
    const products = await Product.find({ user: req.user._id });
    res.json({ products })
  } catch (error) {
    res.status(500).send(error.message)
  }
})


// Fetch all Products from the database  : GET "/api//products"
router.get('/allproducts', async (req, res) => {
  try {
    const products = await Product.find().populate({ path: 'category', select: ['name'] });
    res.json({ products })
  } catch (error) {
    res.status(500).send(error.message)
  }
})


// Edit Product using : PUT "/api/products/editproduct/:id", Requires a auth token
router.put('/editproduct/:id', fetchuser, async (req, res) => {
  try {
    const { category, skuNumber, title, stock, wholesalePrice, dropshipperPrice, discountedPriceW, discountedPriceD, purchasePrice, weight, featured, onSale, photo, description } = req.body;
    const data = await Product.findById({ _id: req.params.id })
    if (!(photo?.url)) {
      await v2.uploader.destroy(data?.photo?.public_id, async function (error, result) {
        if (result?.result === 'ok') {
          const result = await v2.uploader.upload(photo, { folder: 'mios-products', crop: "scale" });
          const { public_id, url } = result;
          if (!public_id) {
            return res.status(400).send("Server Error");
          }
          const product = await Product.findByIdAndUpdate({ _id: req.params.id }, { category, skuNumber, title, stock, wholesalePrice, dropshipperPrice, discountedPriceW, discountedPriceD, purchasePrice, weight, featured, onSale, photo: { public_id, url }, description })
          res.status(201).send({ message: 'Product updated successfully' })

        } else {
          res.status(400).send('Image Not Found');
        }
      });
    } else {
      const product = await Product.findByIdAndUpdate({ _id: req.params.id }, { category, skuNumber, title, stock, wholesalePrice, dropshipperPrice, discountedPriceW, discountedPriceD, purchasePrice, weight, featured, onSale, description })
      res.status(201).send({ message: 'Product updated successfully' })
    }
  } catch (error) {
    res.status(500).send(error)
  }

}
)


// Delete Product using : DELETE "/api/products/deleteproduct/:id", Requires a auth token
router.delete('/deleteproduct/:id', fetchuser, async (req, res) => {
  try {
    const _id = req.params.id;
    const data = await Product.findById({ _id });
    if (!data) {
      res.send("Product Not Found");
    }
    await v2.uploader.destroy(data?.photo?.public_id, async function (error, result) {
      if (result?.result === 'ok') {
        await Product.findByIdAndDelete({ _id: req.params.id })
        res.send('Product removed');
      } else {
        res.status(400).send('Image Not Found');
      }
    });

  } catch (error) {
    res.status(500).send(error.message)
  }
}
)


// get products by category 
router.get('/categoryProducts/:id', async (req, res) => {
  try {
    const products = await Product.find({ category: req.params.id }).populate({ path: 'category', select: ['name'] })
    res.json({ products })
  } catch (error) {
    res.status(500).send(error.message)
  }
}
)

// get products by id
router.get('/product/:id', async (req, res) => {
  try {
    const product = await Product.find({ _id: req.params.id })
    res.json(product)
  } catch (error) {
    res.status(500).send(error.message)
  }
}
)
router.get('/catCount', async (req, res) => {
  try {
    const count = await Product.aggregate([
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 }
        }
      }
    ])

    const result = count.reduce((obj, item) => {
      obj[item._id] = item.count;
      return obj;
    }, {});
    res.json({ count: result });
  } catch (error) {
    res.send(error);
  }
})

module.exports = router