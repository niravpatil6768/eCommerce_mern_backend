const { isValidObjectId } = require("mongoose");
const Product = require("./product.model");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const { Console } = require("console");
const moment = require("moment");


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Define the directory where uploaded files will be stored
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname); // Define the filename
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 },
});

exports.getProducts = (req, res, next) => {
  Product.find()
    .exec() //use to return query. it also return promise
    .then((products) => {
      res.status(200).json({
        products,
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
        message: "Failed to get all Products",
      });
    });
};

//show products for client
// exports.getProductsClient = (req, res, next) => {
//   const sellerId = req.params.userId; // Assuming sellerId is passed in the URL params
//   console.log(sellerId);
//   Product.find({ seller: sellerId })
//     .exec()
//     .then((products) => {
//       res.status(200).json({
//         products,
//       });
//     })
//     .catch((err) => {
//       res.status(500).json({
//         error: err,
//         message: "Failed to get all Products",
//       });
//     });
// };

//find products by category
exports.getProductcategory = (req, res, next) => {
  const category = req.params.category;
  console.log("category");
  Product.find({ category })
    .exec()
    .then((products) => {
      res.status(200).json({
        products,
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
        message: "Failed to get all Products",
      });
    });
};

//sort product by price
exports.getProductsortByPrice = (req, res, next) => {
    const sortBy = req.query.sortBy;
    console.log(sortBy)
    let sortQuery = {};
  
    if (sortBy === 'Low to High') {
      sortQuery = { price: 1 }; // Sort by price in ascending order
    } else if (sortBy === 'High to Low') {
      sortQuery = { price: -1 }; // Sort by price in descending order
    }
  
    Product.find({})
      .sort(sortQuery) // Apply the sorting query
      .exec()
      .then((products) => {
        res.status(200).json({
          products,
        });
      })
      .catch((err) => {
        res.status(500).json({
          error: err,
          message: "Failed to get all Products",
        });
      });
  };

  exports.getProductsortByDate = (req, res, next) => {
    const sortBy = req.query.sortBy;
    console.log(sortBy)
    let sortQuery = {};

    if (sortBy === 'Old to New') {
        sortQuery = { createdAt: 1 }; // Sort by createdAt in ascending order
    } else if (sortBy === 'New to Old') {
        sortQuery = { createdAt: -1 }; // Sort by createdAt in descending order
    }

    Product.find({})
        .sort(sortQuery) // Apply the sorting query
        .exec()
        .then((products) => {
            res.status(200).json({
                products,
            });
        })
        .catch((err) => {
            res.status(500).json({
                error: err,
                message: "Failed to get all Products",
            });
        });
};

  exports.getProductsortByPriceRange = (req, res, next) => {
    const minPrice = req.query.minPrice;
    const maxPrice = req.query.maxPrice;

    // Define the query object to filter products by price range
    const query = {
        price: { $gte: minPrice, $lte: maxPrice }
    };

    Product.find(query)
        .exec()
        .then((products) => {
            res.status(200).json({
                products,
            });
        })
        .catch((err) => {
            res.status(500).json({
                error: err,
                message: "Failed to get products within the specified price range",
            });
        });
};

  

//find product by brand
exports.getProductbrand = (req, res, next) => {
  const brand = req.params.brand;
  console.log("brand");
  Product.find({ brand })
    .exec()
    .then((products) => {
      res.status(200).json({
        products,
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
        message: "Failed to get all Products",
      });
    });
};

//find product by occasion
exports.getProductoccasion = (req, res, next) => {
  const occasion = req.params.occasion;
  Product.find({ occasion })
    .exec()
    .then((products) => {
      res.status(200).json({
        products,
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
        message: "Failed to get all Products",
      });
    });
};

//find product ny discount
exports.getProductdiscount = (req, res, next) => {
    try {
    //   const discount = decodeURIComponent(req.params.discount); // Decode the URL parameter
    const discount = req.params.discount;
      Product.find({ discount })
        .exec()
        .then((products) => {
          res.status(200).json({
            products,
          });
        })
        .catch((err) => {
          res.status(500).json({
            error: err,
            message: "Failed to get all Products",
          });
        });
    } catch (error) {
      res.status(400).json({
        error: error.message,
        message: "URI Malformed",
      });
    }
  };
  

// exports.getProduct = (req, res, next) => {
//   Product.findById(req.body.id)
//     .exec()
//     .then((product) => {
//       if (product != null) {
//         res.status(200).json({
//           message: "Product found Successfully",
//           product,
//         });
//       } else {
//         res.status(404).json({
//           message: "Product not found",
//         });
//       }
//     })
//     .catch((err) => {
//       res.status(500).json({
//         error: err,
//         message: "Failed to get Product",
//       });
//     });
// };

//create product
exports.createProduct = (req, res, next) => {
    const formattedDate = moment().format("YYYY-MM-DD");

    upload.single("productImage")(req, res, (err) => {
        if (err) {
            console.error("Error uploading file:", err);
            return res.status(500).json({
                message: "Error uploading file",
                error: err
            });
        }

        //create object
        const product = new Product({
            name: req.body.name,
            brand: req.body.brand,
            price: req.body.price,
            category: req.body.category,
            discount: req.body.discount,
            productImage: req.file ? `upload/${req.file.filename}` : undefined,
            occasion: req.body.occasion,
            createdAt: formattedDate,
        });

        // Save the product to the database
        product
            .save()
            .then((product) => {
                res.status(201).json({
                    message: "Product added successfully",
                    product,
                });
            })
            .catch((err) => {
                console.error("Error saving product to database:", err);
                res.status(500).json({
                    message: "Error while creating product",
                    error: err,
                });
            });
    });
};


//delete product
exports.deleteProduct = async (req, res) => {
  const productId = req.params.id;

  if (!isValidObjectId(productId)) {
    return res.status(400).json({
      message: "Invalid product ID",
      id: productId,
    });
  }

  try {
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    await Product.findByIdAndDelete(productId);

    res.status(200).json({
      message: "Product deleted successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Error while deleting product",
      error: err.message,
    });
  }
};

//update product
exports.updateProduct = async (req, res, next) => {
  const productId = req.params.id;

  if (!isValidObjectId(productId)) {
    return res.status(400).json({
      message: "Product not found with given id",
      productId: productId,
    });
  }

  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      {
        $set: {
          //update product based on provided value in body
          name: req.body.name,
          brand: req.body.brand,
          price: req.body.price,
          category: req.body.category,
          discount: req.body.discount,
          productImage: req.file ? `upload/${req.file.filename}` : undefined,
          occasion: req.body.occasion,
        },
      },
      { new: true }
    );

    if (updatedProduct) {
        console.log(updatedProduct);
      res.status(200).json({
        message: "Product updated successfully",
        Product: updatedProduct,
      });
    } else {
      res.status(404).json({
        message: "Product not found",
      });
    }
  } catch (err) {
    res.status(500).json({
      message: "Error while updating product",
      error: err,
    });
  }
};

//get single product
exports.getProduct = (req, res, next) => {
  Product.findById(req.params.id)
    .exec()
    .then((product) => {
      if (product != null) {
        res.status(200).json({
          message: "Product found Successfully",
          product,
        });
      } else {
        res.status(404).json({
          message: "Product not found",
        });
      }
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
        message: "Failed to get product",
      });
    });
};
