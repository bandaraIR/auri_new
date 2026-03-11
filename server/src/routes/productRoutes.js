const express = require("express");
const router  = express.Router();

const {
  createProduct,
  getProducts,
  getAllProductsAdmin,
  getProductById,
  updateProduct,
  deleteProductImage,
  deleteProduct,
  permanentDeleteProduct,
} = require("../controllers/productController");

const { protect, adminOnly } = require("../middleware/auth");
const upload                  = require("../middleware/upload");

// ── Admin routes FIRST ────────────────────────────────────────────────────────
// IMPORTANT: must be above /:id or "admin" gets treated as a MongoDB ObjectId

router.get(
  "/admin",
  protect,
  adminOnly,
  getAllProductsAdmin
);

router.get(
  "/admin/:id",
  protect,
  adminOnly,
  getProductById
);

router.post(
  "/admin",
  protect,
  adminOnly,
  upload.array("images", 10),
  createProduct
);

router.put(
  "/admin/:id",
  protect,
  adminOnly,
  upload.array("images", 10),
  updateProduct
);

router.delete(
  "/admin/:id/permanent",
  protect,
  adminOnly,
  permanentDeleteProduct
);

router.delete(
  "/admin/:id/images/:publicId",
  protect,
  adminOnly,
  deleteProductImage
);

router.delete(
  "/admin/:id",
  protect,
  adminOnly,
  deleteProduct
);

// ── Public routes LAST ────────────────────────────────────────────────────────
// These must come after /admin routes

router.get("/",    getProducts);
router.get("/:id", getProductById);

module.exports = router;