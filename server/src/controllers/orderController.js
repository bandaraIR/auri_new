const Order = require("../models/Order");

const cleanPrice = (price) => {
  if (typeof price === "number") return price;
  const cleaned = parseFloat(String(price).replace(/[^0-9.]/g, ""));
  return Number.isNaN(cleaned) ? 0 : cleaned;
};

exports.createOrder = async (req, res) => {
  try {
    const {
      items,
      email,
      userId,
      paymentMethod,
      bankReference,
      address,
    } = req.body;

    console.log("Incoming order body:", req.body);
    console.log("Incoming items:", items);
    console.log("Incoming email:", email);
    console.log("Incoming payment method:", paymentMethod);
    console.log("Incoming address:", address);

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Cart items are required",
      });
    }

    if (!email || !email.trim()) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    if (!paymentMethod || !["COD", "BANK_TRANSFER"].includes(paymentMethod)) {
      return res.status(400).json({
        success: false,
        message: "Valid payment method is required",
      });
    }

    if (!address || !address.trim()) {
      return res.status(400).json({
        success: false,
        message: "Address is required",
      });
    }

    if (paymentMethod === "BANK_TRANSFER" && !bankReference?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Bank transfer reference is required",
      });
    }

    const formattedItems = items.map((item, index) => {
      const unitPrice = cleanPrice(item.price);
      const quantity = Number(item.quantity) || 1;

      if (!item.title || !String(item.title).trim()) {
        throw new Error(`Item title is missing at position ${index + 1}`);
      }

      if (unitPrice <= 0) {
        throw new Error(`Invalid item price at position ${index + 1}`);
      }

      return {
        productId: item.id || "",
        title: String(item.title).trim(),
        color: item.selectedColor || "",
        size: item.selectedSize || "",
        image: item.img || "",
        unitPrice,
        quantity,
        itemTotal: unitPrice * quantity,
      };
    });

    const totalItems = formattedItems.reduce((sum, item) => sum + item.quantity, 0);
    const totalAmount = formattedItems.reduce((sum, item) => sum + item.itemTotal, 0);

    console.log("Formatted items:", formattedItems);
    console.log("Total items:", totalItems);
    console.log("Total amount:", totalAmount);

    const order = await Order.create({
      userId: userId || "",
      email: email.trim().toLowerCase(),
      paymentMethod,
      paymentStatus: paymentMethod === "COD" ? "pending" : "awaiting_verification",
      orderStatus: "placed",
      bankReference: paymentMethod === "BANK_TRANSFER" ? bankReference.trim() : "",
      address: address.trim(),
      items: formattedItems,
      totalItems,
      totalAmount,
    });

    return res.status(201).json({
      success: true,
      message: "Order created successfully",
      order,
    });
  } catch (error) {
    console.error("CREATE ORDER ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to create order",
    });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    return res.status(200).json({ success: true, orders });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
      error: error.message,
    });
  }
};

exports.getSingleOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    return res.status(200).json({ success: true, order });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch order",
      error: error.message,
    });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderStatus, paymentStatus } = req.body;

    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      {
        ...(orderStatus ? { orderStatus } : {}),
        ...(paymentStatus ? { paymentStatus } : {}),
      },
      { new: true, runValidators: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Order updated successfully",
      order: updatedOrder,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update order",
      error: error.message,
    });
  }
};

exports.getOrdersByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    const orders = await Order.find({ userId }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error("GET USER ORDERS ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch user orders",
      error: error.message,
    });
  }
};