const Order = require("../models/Order");
const { Resend } = require("resend");

// ── Resend email client ───────────────────────────────────────────────────────
const resend = new Resend(process.env.RESEND_API_KEY);

// ── Send order confirmation email ─────────────────────────────────────────────
const sendOrderConfirmationEmail = async (order) => {
  const itemsHTML = order.items
    .map(
      (item) => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #f0f0f0;">
          <strong>${item.title}</strong><br/>
          <span style="color:#888; font-size:13px;">${item.size} · ${item.color}</span>
        </td>
        <td style="padding: 10px; border-bottom: 1px solid #f0f0f0; text-align:center;">${item.quantity}</td>
        <td style="padding: 10px; border-bottom: 1px solid #f0f0f0; text-align:right;">Rs ${item.itemTotal.toLocaleString()}</td>
      </tr>
    `
    )
    .join("");

  const emailHTML = `
    <div style="font-family: 'Georgia', serif; max-width: 600px; margin: 0 auto; background: #fff;">
      
      <!-- Header -->
      <div style="background: #000; padding: 30px; text-align: center;">
        <h1 style="color: #fff; font-size: 28px; letter-spacing: 6px; margin: 0;">AURI</h1>
      </div>

      <!-- Body -->
      <div style="padding: 40px 30px;">
        <h2 style="font-size: 22px; color: #000; margin-bottom: 6px;">Order Confirmed! 🎉</h2>
        <p style="color: #555; font-size: 15px; margin-bottom: 30px;">
          Thank you for shopping with Auri. We've received your order and will be in touch soon.
        </p>

        <!-- Order Info -->
        <div style="background: #f9f9f9; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
          <p style="margin: 0 0 8px;"><strong>Order ID:</strong> <span style="color:#555;">${order._id}</span></p>
          <p style="margin: 0 0 8px;"><strong>Payment Method:</strong> <span style="color:#555;">${order.paymentMethod === "COD" ? "Cash on Delivery" : "Bank Transfer"}</span></p>
          <p style="margin: 0;"><strong>Delivery Address:</strong> <span style="color:#555;">${order.address}</span></p>
        </div>

        <!-- Items Table -->
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <thead>
            <tr style="background: #000; color: #fff;">
              <th style="padding: 10px; text-align:left; font-weight:normal; letter-spacing:1px;">ITEM</th>
              <th style="padding: 10px; text-align:center; font-weight:normal; letter-spacing:1px;">QTY</th>
              <th style="padding: 10px; text-align:right; font-weight:normal; letter-spacing:1px;">PRICE</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHTML}
          </tbody>
        </table>

        <!-- Total -->
        <div style="text-align: right; margin-bottom: 30px;">
          <p style="font-size: 18px; font-weight: bold; color: #000;">
            Total: Rs ${order.totalAmount.toLocaleString()}
          </p>
        </div>

        <p style="color: #555; font-size: 14px; line-height: 1.7;">
          If you have any questions, reply to this email or contact us on WhatsApp.<br/>
          We appreciate your support! 🖤
        </p>
      </div>

      <!-- Footer -->
      <div style="background: #f5f5f5; padding: 20px; text-align: center;">
        <p style="color: #999; font-size: 12px; margin: 0; letter-spacing: 2px;">
          AURI OFFICIAL · auri.lk · shop.auriofficial@gmail.com
        </p>
      </div>

    </div>
  `;

  await resend.emails.send({
    from: "AURI OFFICIAL <onboarding@resend.dev>",
    to: order.email,
    subject: "Your Auri Order is Confirmed! 🖤",
    html: emailHTML,
  });
};

// ── Clean price ───────────────────────────────────────────────────────────────
const cleanPrice = (price) => {
  if (typeof price === "number") return price;
  const cleaned = parseFloat(String(price).replace(/[^0-9.]/g, ""));
  return Number.isNaN(cleaned) ? 0 : cleaned;
};

// ── Create Order ──────────────────────────────────────────────────────────────
exports.createOrder = async (req, res) => {
  try {
    const { items, email, userId, paymentMethod, bankReference, address } = req.body;

    console.log("Incoming order body:", req.body);

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: "Cart items are required" });
    }

    if (!email || !email.trim()) {
      return res.status(400).json({ success: false, message: "Email is required" });
    }

    if (!paymentMethod || !["COD", "BANK_TRANSFER"].includes(paymentMethod)) {
      return res.status(400).json({ success: false, message: "Valid payment method is required" });
    }

    if (!address || !address.trim()) {
      return res.status(400).json({ success: false, message: "Address is required" });
    }

    if (paymentMethod === "BANK_TRANSFER" && !bankReference?.trim()) {
      return res.status(400).json({ success: false, message: "Bank transfer reference is required" });
    }

    const formattedItems = items.map((item, index) => {
      const unitPrice = cleanPrice(item.price);
      const quantity  = Number(item.quantity) || 1;

      if (!item.title || !String(item.title).trim()) {
        throw new Error(`Item title is missing at position ${index + 1}`);
      }
      if (unitPrice <= 0) {
        throw new Error(`Invalid item price at position ${index + 1}`);
      }

      return {
        productId: item.id || "",
        title:     String(item.title).trim(),
        color:     item.selectedColor || "",
        size:      item.selectedSize  || "",
        image:     item.img           || "",
        unitPrice,
        quantity,
        itemTotal: unitPrice * quantity,
      };
    });

    const totalItems  = formattedItems.reduce((sum, item) => sum + item.quantity, 0);
    const totalAmount = formattedItems.reduce((sum, item) => sum + item.itemTotal, 0);

    const order = await Order.create({
      userId:        userId || "",
      email:         email.trim().toLowerCase(),
      paymentMethod,
      paymentStatus: paymentMethod === "COD" ? "pending" : "awaiting_verification",
      orderStatus:   "placed",
      bankReference: paymentMethod === "BANK_TRANSFER" ? bankReference.trim() : "",
      address:       address.trim(),
      items:         formattedItems,
      totalItems,
      totalAmount,
    });

    // ── Send confirmation email ────────────────────────────────────────────────
    sendOrderConfirmationEmail(order)
      .then(() => console.log("✅ Email sent to:", order.email))
      .catch((err) => console.error("❌ Email send failed:", err));

    return res.status(201).json({
      success: true,
      message: "Order created successfully",
      order,
    });
  } catch (error) {
    console.error("CREATE ORDER ERROR:", error);
    return res.status(500).json({ success: false, message: error.message || "Failed to create order" });
  }
};

// ── Get All Orders ────────────────────────────────────────────────────────────
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    return res.status(200).json({ success: true, orders });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to fetch orders", error: error.message });
  }
};

// ── Get Single Order ──────────────────────────────────────────────────────────
exports.getSingleOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }
    return res.status(200).json({ success: true, order });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to fetch order", error: error.message });
  }
};

// ── Update Order Status ───────────────────────────────────────────────────────
exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderStatus, paymentStatus } = req.body;

    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      {
        ...(orderStatus  ? { orderStatus }  : {}),
        ...(paymentStatus ? { paymentStatus } : {}),
      },
      { new: true, runValidators: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    return res.status(200).json({ success: true, message: "Order updated successfully", order: updatedOrder });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to update order", error: error.message });
  }
};

// ── Get Orders By User ────────────────────────────────────────────────────────
exports.getOrdersByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      return res.status(400).json({ success: false, message: "User ID is required" });
    }
    const orders = await Order.find({ userId }).sort({ createdAt: -1 });
    return res.status(200).json({ success: true, orders });
  } catch (error) {
    console.error("GET USER ORDERS ERROR:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch user orders", error: error.message });
  }
};