const router = require('express').Router();
const ensureAuthenticated = require('../Middlewares/Auth');
const ProductModel = require('../Models/Product');

router.get('/', ensureAuthenticated, async (req, res) => {
    try {
        const products = await ProductModel.find();
        console.log("Products fetched:", products);

        if (!products.length) {
            return res.status(200).json([]);  // empty array, no error
        }

        res.status(200).json(products);
    } catch (err) {
        console.error("Get products error:", err);
        res.status(500).json({ message: "Failed to fetch products" });
    }
});

module.exports = router;
