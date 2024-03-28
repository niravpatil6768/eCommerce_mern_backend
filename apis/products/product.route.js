const express = require("express");
const router = express.Router();
const ProductController = require("./product.controller");
const multer = require("multer"); //use to handle file-uploads in node.js

router.get("/category/:category", ProductController.getProductcategory);
router.get("/brand/:brand", ProductController.getProductbrand);
router.get("/discount/:discount", ProductController.getProductdiscount);
router.get("/occasion/:occasion", ProductController.getProductoccasion);
router.get("/products", ProductController.getProductsortByPrice);
router.get("/productsBydate", ProductController.getProductsortByDate);
router.get("/products/price-range", ProductController.getProductsortByPriceRange);
router.get("/", ProductController.getProducts);
router.get("/product/:id", ProductController.getProduct);
router.post("/addproduct", ProductController.createProduct);
router.delete("/deleteproduct/:id", ProductController.deleteProduct);
router.put("/updateproduct/:id", ProductController.updateProduct);
//router.get('/getProduct/:id', ProductController.getProduct);
//router.post('/getUploadURL/:key',ProductController.getUploadURL);

module.exports = router;
