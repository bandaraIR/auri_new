const express = require("express");
const {
  createOrder,
  getAllOrders,
  getSingleOrder,
  updateOrderStatus,
  getOrdersByUser,
} = require("../controllers/orderController");

const router = express.Router();

router.post("/", createOrder);
router.get("/", getAllOrders);
router.get("/user/:userId", getOrdersByUser);
router.get("/use/:userId", getOrdersByUser); // temporary, for old frontend support
router.get("/:id", getSingleOrder);
router.put("/:id", updateOrderStatus);

module.exports = router;