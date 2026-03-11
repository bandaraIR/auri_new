import React, { useState, useEffect } from 'react';

import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Profile.css';

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5050";

const ORDER_STATUS_COLORS = {
  placed:    { bg: "#f0f0f0", color: "#555"    },
  confirmed: { bg: "#dbeafe", color: "#1d4ed8" },
  shipped:   { bg: "#ede9fe", color: "#6d28d9" },
  delivered: { bg: "#dcfce7", color: "#16a34a" },
  cancelled: { bg: "#fee2e2", color: "#dc2626" },
};

const PAYMENT_STATUS_COLORS = {
  pending:               { bg: "#fef9c3", color: "#a16207" },
  awaiting_verification: { bg: "#dbeafe", color: "#1d4ed8" },
  paid:                  { bg: "#dcfce7", color: "#16a34a" },
  failed:                { bg: "#fee2e2", color: "#dc2626" },
};

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate         = useNavigate();
  const [activeTab, setActiveTab]         = useState('account');
  const [orders, setOrders]               = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersError, setOrdersError]     = useState('');
  const [expandedOrder, setExpandedOrder] = useState(null);

  useEffect(() => {
    if (activeTab !== 'orders' || !user) return;
    const userId = user._id || user.id;
    if (!userId) return;
    const fetchOrders = async () => {
      setOrdersLoading(true);
      setOrdersError('');
      try {
        const res  = await fetch(`${API_BASE}/api/orders/user/${userId}`);
        const data = await res.json();
        if (!res.ok || !data.success) { setOrdersError('Failed to load orders.'); return; }
        setOrders(data.orders);
      } catch {
        setOrdersError('Network error. Could not fetch orders.');
      } finally {
        setOrdersLoading(false);
      }
    };
    fetchOrders();
  }, [activeTab, user]);

  const handleLogout = () => {
    logout();
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to permanently delete your account?"
    );

    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `${process.env.REACT_APP_API_URL || "http://localhost:5050"}/api/auth/delete-account`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Failed to delete account");
        return;
      }

      logout();
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      alert("Your account has been deleted.");
      navigate("/");

    } catch (err) {
      console.error(err);
      alert("Server error while deleting account");
    }
  };

  if (!user) {
    return (
      <div className="pf-gate">
        <motion.div
          className="pf-gate-card"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="pf-gate-logo">AURI</div>
          <h2>Sign in to continue</h2>
          <p>Your profile awaits.</p>
          <button className="pf-gate-btn" onClick={() => navigate('/login')}>
            Sign In
          </button>
          <button className="pf-gate-link" onClick={() => navigate('/')}>
            ← Back to store
          </button>
        </motion.div>
      </div>
    );
  }

  const initials = `${user.firstName?.charAt(0) || ''}${user.lastName?.charAt(0) || ''}`;

  const tabs = [
    { id: 'account',  label: 'Account'  },
    { id: 'orders',   label: 'Orders'   },
    { id: 'wishlist', label: 'Wishlist' },
    { id: 'settings', label: 'Settings' },
  ];

  return (
    <div className="pf-root">

      {/* ── Ambient background ── */}
      <div className="pf-bg">
        <div className="pf-bg-orb pf-bg-orb--1" />
        <div className="pf-bg-orb pf-bg-orb--2" />
      </div>

      {/* ── Top bar ── */}
      <header className="pf-topbar">
        <button className="pf-back" onClick={() => navigate('/')}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          Back
        </button>
        <div className="pf-topbar-logo">AURI</div>
        <button className="pf-logout-top" onClick={handleLogout}>
          Sign out
        </button>
      </header>

      <div className="pf-layout">

        {/* ── Left panel ── */}
        <motion.aside
          className="pf-sidebar"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Avatar */}
          <div className="pf-avatar-wrap">
            {user.photo ? (
              <img src={user.photo} alt={user.firstName} className="pf-avatar-img" />
            ) : (
              <div className="pf-avatar">{initials}</div>
            )}
            <div className="pf-avatar-ring" />
          </div>

          <div className="pf-user-name">
            {user.firstName} {user.lastName}
          </div>
          <div className="pf-user-email">{user.email}</div>

          <div className="pf-member-badge">
            {user.role === 'admin' ? '★ Admin' : '◆ Member'}
          </div>

          {/* Nav tabs */}
          <nav className="pf-nav">
            {tabs.map(tab => (
              <button
                key={tab.id}
                className={`pf-nav-item ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <motion.div className="pf-nav-indicator" layoutId="nav-indicator" />
                )}
              </button>
            ))}
          </nav>

          <button className="pf-logout-btn" onClick={handleLogout}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/>
            </svg>
            Sign Out
          </button>
        </motion.aside>

        {/* ── Right content ── */}
        <motion.main
          className="pf-main"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
        >

          {/* Account tab */}
          {activeTab === 'account' && (
            <div className="pf-panel">
              <div className="pf-panel-header">
                <h2>Account Information</h2>
                <p>Your personal details</p>
              </div>

              <div className="pf-info-grid">
                {[
                  { label: 'First Name',    value: user.firstName },
                  { label: 'Last Name',     value: user.lastName  },
                  { label: 'Email Address', value: user.email     },
                  { label: 'Account Type',  value: user.role === 'admin' ? 'Administrator' : 'Customer' },
                  { label: 'Sign-in Method', value: user.googleId ? 'Google' : 'Email & Password' },
                  { label: 'Member Since',   value: 'January 2024' },
                ].map((item, i) => (
                  <motion.div
                    key={item.label}
                    className="pf-info-card"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.06 }}
                  >
                    <div className="pf-info-label">{item.label}</div>
                    <div className="pf-info-value">{item.value || '—'}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Orders tab */}
          {activeTab === 'orders' && (
            <div className="pf-panel">
              <div className="pf-panel-header">
                <h2>Order History</h2>
                <p>Track your purchases</p>
              </div>

              {ordersLoading && (
                <div className="pf-empty-state">
                  <span style={{ color: '#aaa', fontSize: '13px', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Loading orders...</span>
                </div>
              )}

              {ordersError && (
                <div className="pf-empty-state">
                  <span style={{ color: '#c0392b', fontSize: '13px' }}>{ordersError}</span>
                </div>
              )}

              {!ordersLoading && !ordersError && orders.length === 0 && (
                <div className="pf-empty-state">
                  <div className="pf-empty-icon">🛍</div>
                  <strong>No orders yet</strong>
                  <span>Your orders will appear here once you make a purchase.</span>
                  <button className="pf-cta-btn" onClick={() => navigate('/')}>
                    Start Shopping
                  </button>
                </div>
              )}

              {!ordersLoading && orders.length > 0 && (
                <div className="pf-orders-list">
                  {orders.map((order) => {
                    const oStatus = ORDER_STATUS_COLORS[order.orderStatus]     || { bg: '#f0f0f0', color: '#555' };
                    const pStatus = PAYMENT_STATUS_COLORS[order.paymentStatus] || { bg: '#f0f0f0', color: '#555' };
                    const isOpen  = expandedOrder === order._id;
                    return (
                      <motion.div
                        key={order._id}
                        className="pf-order-card"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        <div
                          className="pf-order-header"
                          onClick={() => setExpandedOrder(isOpen ? null : order._id)}
                        >
                          <div className="pf-order-meta">
                            <span className="pf-order-id">{order.orderId}</span>
                            <span className="pf-order-date">
                              {new Date(order.createdAt).toLocaleDateString('en-GB', {
                                day: '2-digit', month: 'short', year: 'numeric'
                              })}
                            </span>
                          </div>
                          <div className="pf-order-right">
                            <span className="pf-order-badge" style={{ background: oStatus.bg, color: oStatus.color }}>
                              {order.orderStatus}
                            </span>
                            <span className="pf-order-badge" style={{ background: pStatus.bg, color: pStatus.color }}>
                              {order.paymentStatus.replace('_', ' ')}
                            </span>
                            <span className="pf-order-total">${parseFloat(order.totalAmount).toFixed(2)}</span>
                            <span className="pf-order-chevron" style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s', display: 'inline-block', color: '#aaa' }}>▾</span>
                          </div>
                        </div>

                        {isOpen && (
                          <div className="pf-order-items">
                            <div className="pf-order-address">
                              <span>📍</span> {order.address}
                            </div>
                            {order.items.map((item, i) => (
                              <div className="pf-order-item" key={i}>
                                {item.image && <img src={item.image} alt={item.title} className="pf-order-item-img" />}
                                <div className="pf-order-item-info">
                                  <p className="pf-order-item-title">{item.title}</p>
                                  <p className="pf-order-item-meta">
                                    {[item.size, item.color].filter(Boolean).join(' · ')} · Qty: {item.quantity}
                                  </p>
                                </div>
                                <div className="pf-order-item-price">${item.itemTotal.toFixed(2)}</div>
                              </div>
                            ))}
                            <div className="pf-order-footer">
                              <span>{order.paymentMethod === 'COD' ? 'Cash on Delivery' : 'Bank Transfer'}</span>
                              <span className="pf-order-footer-total">Total: ${parseFloat(order.totalAmount).toFixed(2)}</span>
                            </div>
                          </div>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Wishlist tab */}
          {activeTab === 'wishlist' && (
            <div className="pf-panel">
              <div className="pf-panel-header">
                <h2>Wishlist</h2>
                <p>Items you love</p>
              </div>
              <div className="pf-empty-state">
                <div className="pf-empty-icon">♡</div>
                <strong>Your wishlist is empty</strong>
                <span>Save items you love and find them here.</span>
                <button className="pf-cta-btn" onClick={() => navigate('/')}>
                  Explore Collection
                </button>
              </div>
            </div>
          )}

          {/* Settings tab */}
          {activeTab === 'settings' && (
            <div className="pf-panel">
              <div className="pf-panel-header">
                <h2>Settings</h2>
                <p>Manage your preferences</p>
              </div>
              <div className="pf-settings-list">
                {[
                  { title: 'Email Notifications', desc: 'Receive updates about orders and offers', toggle: true  },
                  { title: 'Newsletter',           desc: 'Stay updated with new arrivals',          toggle: false },
                  { title: 'Two-factor Auth',      desc: 'Add extra security to your account',      toggle: false },
                ].map((s, i) => (
                  <motion.div
                    key={s.title}
                    className="pf-setting-row"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.08 }}
                  >
                    <div>
                      <div className="pf-setting-title">{s.title}</div>
                      <div className="pf-setting-desc">{s.desc}</div>
                    </div>
                    <div className={`pf-toggle ${s.toggle ? 'on' : ''}`}>
                      <div className="pf-toggle-knob" />
                    </div>
                  </motion.div>
                ))}

                <div className="pf-danger-zone">
                  <h4>Danger Zone</h4>
                  <button className="pf-danger-btn" onClick={handleDeleteAccount}>
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
          )}

        </motion.main>
      </div>
    </div>
  );
};

export default Profile;