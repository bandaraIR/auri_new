import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import "../styles/Cart.css";

const ArrowLeftIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor" width="16" height="16">
    <path d="M19 12H5M5 12l7 7M5 12l7-7" />
  </svg>
);

const TrashIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor" width="15" height="15">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6l-1 14H6L5 6" />
    <path d="M10 11v6M14 11v6" />
    <path d="M9 6V4h6v2" />
  </svg>
);

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5050";

const CartPage = () => {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [bankReference, setBankReference] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const getTotal = () =>
    cart.items.reduce((total, item) => {
      const price = parseFloat(String(item.price).replace(/[^0-9.]/g, ""));
      return total + price * item.quantity;
    }, 0);

  const totalQuantity = cart.items.reduce((a, i) => a + i.quantity, 0);

  const handlePayment = async () => {
    setError("");

    if (cart.items.length === 0) return;

    if (!user?.email) {
      setError("Please sign in before confirming your order.");
      navigate("/login", { state: { from: "/cart" } });
      return;
    }

    if (!address.trim()) {
      setError("Please enter your delivery address.");
      return;
    }

    if (paymentMethod === "BANK_TRANSFER" && !bankReference.trim()) {
      setError("Please enter the bank transfer reference number.");
      return;
    }

    const orderPayload = {
      items: cart.items,
      email: user.email,
      userId: user?._id || user?.id || "",
      paymentMethod,
      bankReference: paymentMethod === "BANK_TRANSFER" ? bankReference.trim() : "",
      address: address.trim(),
    };

    try {
      setLoading(true);

      const res = await fetch(`${API_BASE}/api/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderPayload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.message || "Failed to place order. Please try again.");
        return;
      }

      setAddress("");
      setBankReference("");
      setPaymentMethod("COD");

      if (clearCart) clearCart();

      alert("✅ Order placed successfully! Thank you for shopping with AURI.");
      navigate("/");
    } catch (err) {
      console.error("Order error:", err);
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cart-page">

      {/* NAVBAR */}
      <nav className="cart-navbar">
        <div className="cart-navbar-inner">
          <span className="cart-navbar-logo">AURI</span>
        </div>
      </nav>

      <div className="cart-content">

        {/* BACK + HEADING */}
        <div className="cart-header">
          <button className="cart-back-btn" onClick={() => navigate(-1)}>
            <ArrowLeftIcon /> Back
          </button>
          <div className="cart-title-block">
            <h1 className="cart-title">Shopping Cart</h1>
            <span className="cart-count">{cart.items.length} {cart.items.length === 1 ? "item" : "items"}</span>
          </div>
        </div>

        {cart.items.length === 0 ? (
          <div className="cart-empty">
            <h2>Your cart is empty</h2>
            <p>Explore our collection to add items</p>
          </div>
        ) : (
          <div className="cart-layout">

            {/* LEFT — Items */}
            <div className="cart-items-panel">
              {cart.items.map((item, index) => (
                <div
                  className="cart-item"
                  key={index}
                  style={{ animationDelay: `${index * 60}ms` }}
                >
                  {/* Image */}
                  <img src={item.img} alt={item.title} className="cart-item-img" />

                  {/* Info */}
                  <div className="cart-info">
                    <h3 className="cart-item-title">{item.title}</h3>
                    <p className="cart-item-meta">{item.selectedSize} · {item.selectedColor}</p>
                    <p className="cart-item-price">{item.price}</p>
                  </div>

                  {/* Quantity */}
                  <div className="cart-quantity">
                    <button
                      className="cart-qty-btn"
                      onClick={() => updateQuantity(item, item.quantity - 1)}
                      aria-label="Decrease quantity"
                    >−</button>
                    <span className="cart-qty-value">{item.quantity}</span>
                    <button
                      className="cart-qty-btn"
                      onClick={() => updateQuantity(item, item.quantity + 1)}
                      aria-label="Increase quantity"
                    >+</button>
                  </div>

                  {/* Subtotal */}
                  <div className="cart-item-subtotal">
                    Rs {(parseFloat(String(item.price).replace(/[^0-9.]/g, "")) * item.quantity).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>

                  {/* Remove */}
                  <button
                    className="cart-remove-btn"
                    onClick={() => removeFromCart(item)}
                    aria-label="Remove item"
                  >
                    <TrashIcon />
                  </button>
                </div>
              ))}
            </div>

            {/* RIGHT — Summary */}
            <div className="cart-summary-panel">
              <h3 className="cart-summary-heading">Order Summary</h3>

              <div className="cart-summary-row">
                <span>Total items</span>
                <span>{totalQuantity}</span>
              </div>

              <div className="cart-summary-row">
                <span>Email</span>
                <span className="cart-summary-email">{user?.email || "Please sign in"}</span>
              </div>

              <div className="cart-summary-divider" />

              <div className="cart-summary-row cart-summary-total">
                <span>Total</span>
                <span>Rs {getTotal().toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>

              <div className="cart-address-section">
                <h4 className="cart-payment-heading">Delivery Address</h4>
                <textarea
                  className="cart-address-input"
                  placeholder="Enter your full delivery address..."
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  rows={3}
                />
              </div>

              <div className="cart-summary-divider" />

              <div className="cart-payment-section">
                <h4 className="cart-payment-heading">Payment Method</h4>

                <label className="cart-payment-option">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="COD"
                    checked={paymentMethod === "COD"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <span>Cash on Delivery (COD)</span>
                </label>

                <label className="cart-payment-option">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="BANK_TRANSFER"
                    checked={paymentMethod === "BANK_TRANSFER"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <span>Bank Transfer</span>
                </label>

                {paymentMethod === "BANK_TRANSFER" && (
                  <div className="cart-bank-box">
                    <p><strong>Bank:</strong> HNB</p>
                    <p><strong>Account Name:</strong> LWST Bandara</p>
                    <p><strong>Account Number:</strong> 084020389600</p>
                    <p><strong>Branch:</strong> Kadawatha</p>
                    <input
                      type="text"
                      className="cart-bank-reference-input"
                      placeholder="Enter bank transfer reference number"
                      value={bankReference}
                      onChange={(e) => setBankReference(e.target.value)}
                    />
                  </div>
                )}
              </div>

              {error && <p className="cart-error-msg">{error}</p>}

              <button
                className={`cart-pay-btn${loading ? " cart-pay-btn--loading" : ""}`}
                onClick={handlePayment}
                disabled={loading}
              >
                {loading ? "Placing Order..." : "Confirm Order"}
              </button>
            </div>

          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;