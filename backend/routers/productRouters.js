const express = require("express");
const {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductDetail,
  createProductReview,
  getProductReview,
  deleteReview,
} = require("../controllers/ProductController");
const { isAuthenticatedUser, authorizeRole } = require("../middleware/auth");

const router = express.Router();

router.route("/products").get(getAllProducts);

router
  .route("/product/new")
  .post(isAuthenticatedUser, authorizeRole("admin"), createProduct);

router
  .route("/product/:id")
  .put(isAuthenticatedUser, authorizeRole("admin"), updateProduct)
  .delete(isAuthenticatedUser, authorizeRole("admin"), deleteProduct);

router.route("/product/:id").get(getProductDetail);

router.route("/review").put(isAuthenticatedUser, createProductReview);

router
  .route("/reviews")
  .get(getProductReview)
  .delete(isAuthenticatedUser, deleteReview);

module.exports = router;
