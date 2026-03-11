import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/Admin/AdminDashboard.css";

const API = process.env.REACT_APP_API_URL || "http://localhost:5050";

// ── Icons ─────────────────────────────────────────────────────────────────────
const Icon = ({ d, size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);

const ICO = {
  dashboard: "M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z M9 22V12h6v10",
  users:     "M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2 M9 11a4 4 0 100-8 4 4 0 000 8z M23 21v-2a4 4 0 00-3-3.87 M16 3.13a4 4 0 010 7.75",
  product:   "M12 5v14 M5 12h14",
  logout:    "M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4 M16 17l5-5-5-5 M21 12H9",
  refresh:   "M23 4v6h-6 M1 20v-6h6 M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15",
  check:     "M20 6L9 17l-5-5",
  alert:     "M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z M12 9v4 M12 17h.01",
  tag:       "M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z M7 7h.01",
  package:   "M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z",
  arrow:     "M5 12h14 M12 5l7 7-7 7",
  orders:    "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2 M9 5a2 2 0 002 2h2a2 2 0 002-2 M9 5a2 2 0 012-2h2a2 2 0 012 2",
  trending:  "M23 6l-9.5 9.5-5-5L1 18 M17 6h6v6",
};

// ── Overview Tab ──────────────────────────────────────────────────────────────
function OverviewTab({ me, users, navigate, productCount }) {
  const adminCount  = users.filter(u => u.role === "admin").length;
  const userCount   = users.filter(u => u.role !== "admin").length;

  const stats = [
    { label: "Total Users",  val: users.length, icon: ICO.users,    cls: "users-icon"  },
    { label: "Admins",       val: adminCount,   icon: ICO.check,    cls: "admin-icon"  },
    { label: "Members",      val: userCount,    icon: ICO.tag,      cls: "member-icon" },
    { label: "Products",     val: productCount,  icon: ICO.package,  cls: "product-icon"},
  ];

  return (
    <div className="ad-tab-content">
      <div className="ad-tab-header">
        <div>
          <h2>Overview</h2>
          <p>Quick snapshot of your store.</p>
        </div>
      </div>

      <div className="ad-stat-grid">
        {stats.map(s => (
          <div className="ad-stat-card" key={s.label}>
            <div className={`ad-stat-icon ${s.cls}`}><Icon d={s.icon} size={20} /></div>
            <div className="ad-stat-val">{s.val}</div>
            <div className="ad-stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Quick action — go to Add Product page */}
      <div className="ad-quick-actions">
        <h3 className="ad-section-label">Quick Actions</h3>
        <div className="ad-action-cards">
          <button className="ad-action-card" onClick={() => navigate("/admin/products")}>
            <div className="ad-action-icon product-icon"><Icon d={ICO.package} size={20} /></div>
            <div className="ad-action-text">
              <strong>View Products</strong>
              <span>Manage your store inventory</span>
            </div>
            <Icon d={ICO.arrow} size={16} />
          </button>
          <button className="ad-action-card" onClick={() => navigate("/admin/add-product")}>
            <div className="ad-action-icon product-icon"><Icon d={ICO.product} size={20} /></div>
            <div className="ad-action-text">
              <strong>Add New Product</strong>
              <span>List a new item in the store</span>
            </div>
            <Icon d={ICO.arrow} size={16} />
          </button>
          <button className="ad-action-card" onClick={() => navigate("/admin/dashboard") || null}>
            <div className="ad-action-icon orders-icon"><Icon d={ICO.orders} size={20} /></div>
            <div className="ad-action-text">
              <strong>View Orders</strong>
              <span>Check recent customer orders</span>
            </div>
            <Icon d={ICO.arrow} size={16} />
          </button>
          <button className="ad-action-card" onClick={() => {}}>
            <div className="ad-action-icon trending-icon"><Icon d={ICO.trending} size={20} /></div>
            <div className="ad-action-text">
              <strong>Analytics</strong>
              <span>Sales &amp; traffic overview</span>
            </div>
            <Icon d={ICO.arrow} size={16} />
          </button>
        </div>
      </div>

      {me && (
        <div className="ad-session-card">
          <h3>Logged in as</h3>
          <div className="ad-session-row">
            <div className="ad-session-avatar">
              {me.firstName?.[0]}{me.lastName?.[0]}
            </div>
            <div className="ad-session-info">
              <strong>{me.firstName} {me.lastName}</strong>
              <span>{me.email}</span>
              <span className="ad-pill pill-admin">{me.role}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Users Tab ─────────────────────────────────────────────────────────────────
function UsersTab({ users, loadingUsers, loadUsers, makeAdmin, error }) {
  return (
    <div className="ad-tab-content">
      <div className="ad-tab-header">
        <div>
          <h2>User Management</h2>
          <p>View and manage all registered users.</p>
        </div>
        <button className="ad-btn-secondary ad-refresh-btn"
          onClick={loadUsers} disabled={loadingUsers}>
          <Icon d={ICO.refresh} size={15} />
          {loadingUsers ? "Refreshing…" : "Refresh"}
        </button>
      </div>

      {error && (
        <div className="ad-alert">
          <Icon d={ICO.alert} size={15} /> {error}
        </div>
      )}

      {loadingUsers ? (
        <div className="ad-loading-rows">
          {[1, 2, 3].map(i => <div key={i} className="ad-skeleton-row" />)}
        </div>
      ) : users.length === 0 ? (
        <div className="ad-empty">No users found.</div>
      ) : (
        <div className="ad-table-wrap">
          <table className="ad-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u, i) => (
                <tr key={u._id || u.id}>
                  <td className="ad-idx">{i + 1}</td>
                  <td>{u.firstName} {u.lastName}</td>
                  <td className="ad-email">{u.email}</td>
                  <td>
                    <span className={`ad-pill ${u.role === "admin" ? "pill-admin" : ""}`}>
                      {u.role || "user"}
                    </span>
                  </td>
                  <td>
                    {u.role === "admin" ? (
                      <span className="ad-already-admin">Admin</span>
                    ) : (
                      <button className="ad-promote-btn"
                        onClick={() => makeAdmin(u._id || u.id)}>
                        Make Admin
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function OrdersTab({ orders, loadingOrders, loadOrders, updateOrderStatus, error }) {
  return (
    <div className="ad-tab-content">
      <div className="ad-tab-header">
        <div>
          <h2>Orders</h2>
          <p>View and manage customer orders.</p>
        </div>
        <button
          className="ad-btn-secondary ad-refresh-btn"
          onClick={loadOrders}
          disabled={loadingOrders}
        >
          <Icon d={ICO.refresh} size={15} />
          {loadingOrders ? "Refreshing…" : "Refresh"}
        </button>
      </div>

      {error && (
        <div className="ad-alert">
          <Icon d={ICO.alert} size={15} /> {error}
        </div>
      )}

      {loadingOrders ? (
        <div className="ad-loading-rows">
          {[1, 2, 3].map(i => <div key={i} className="ad-skeleton-row" />)}
        </div>
      ) : orders.length === 0 ? (
        <div className="ad-empty">No orders found.</div>
      ) : (
        <div className="ad-orders-list">
          {orders.map((order) => (
            <div className="ad-order-card" key={order._id}>
              <div className="ad-order-head">
                <div>
                  <h3>{order.orderId}</h3>
                  <p>{new Date(order.createdAt).toLocaleString()}</p>
                </div>
                <div className="ad-order-badges">
                  <span className="ad-pill">{order.orderStatus}</span>
                  <span className="ad-pill">{order.paymentStatus}</span>
                </div>
              </div>

              <div className="ad-order-meta">
                <p><strong>Email:</strong> {order.email}</p>
                <p><strong>Payment:</strong> {order.paymentMethod}</p>
                <p><strong>Address:</strong> {order.address}</p>
                <p><strong>Total Items:</strong> {order.totalItems}</p>
                <p><strong>Total Amount:</strong> ${Number(order.totalAmount || 0).toFixed(2)}</p>
                {order.bankReference && (
                  <p><strong>Bank Ref:</strong> {order.bankReference}</p>
                )}
              </div>

              <div className="ad-order-actions">
                <div className="ad-order-action-group">
                  <label className="ad-order-label">Order Status</label>
                  <select
                    className="ad-order-select"
                    value={order.orderStatus || "placed"}
                    onChange={(e) => updateOrderStatus(order._id, { orderStatus: e.target.value })}
                  >
                    <option value="placed">Placed</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                <div className="ad-order-action-group">
                  <label className="ad-order-label">Payment Status</label>
                  <select
                    className="ad-order-select"
                    value={order.paymentStatus || "pending"}
                    onChange={(e) => updateOrderStatus(order._id, { paymentStatus: e.target.value })}
                  >
                    <option value="pending">Pending</option>
                    <option value="awaiting_verification">Awaiting Verification</option>
                    <option value="paid">Paid</option>
                    <option value="failed">Failed</option>
                  </select>
                </div>
              </div>

              <div className="ad-order-items">
                {order.items?.map((item, index) => (
                  <div className="ad-order-item" key={index}>
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.title}
                        className="ad-order-item-img"
                      />
                    )}

                    <div className="ad-order-item-info">
                      <strong>{item.title}</strong>
                      <span>Color: {item.color || "-"}</span>
                      <span>Size: {item.size || "-"}</span>
                      <span>Qty: {item.quantity}</span>
                      <span>Unit Price: ${Number(item.unitPrice || 0).toFixed(2)}</span>
                      <span>Item Total: ${Number(item.itemTotal || 0).toFixed(2)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Nav config ────────────────────────────────────────────────────────────────
const NAV = [
  { id: "overview", label: "Overview", icon: ICO.dashboard },
  { id: "users",    label: "Users",    icon: ICO.users     },
  { id: "orders",   label: "Orders",   icon: ICO.orders    },
];

// ── Main Dashboard ────────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab]       = useState("overview");
  const [me, setMe]                     = useState(null);
  const [users, setUsers]               = useState([]);
  const [orders, setOrders]             = useState([]);
  const [productCount, setProductCount] = useState(0);
  const [loadingMe, setLoadingMe]       = useState(true);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const loadProductCount = async () => {
    try {
      setLoadingProducts(true);
      const res = await fetch(`${API}/api/products?limit=1000`);
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Failed to load products");
      setProductCount((data.products || []).length);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoadingProducts(false);
    }
  };
  const [error, setError]               = useState("");
  const [sidebarOpen, setSidebarOpen]   = useState(false);

  const token = localStorage.getItem("token");

  // ── Fetch current admin ───────────────────────────────────────────────────
  useEffect(() => {
    if (!token) { navigate("/login"); return; }
    (async () => {
      try {
        setLoadingMe(true);
        const res  = await fetch(`${API}/api/admin/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data?.message || "Not authorized");
        setMe(data.user);
      } catch (e) { setError(e.message); }
      finally { setLoadingMe(false); }
    })();
  }, [token, navigate]);

  // ── Fetch users ───────────────────────────────────────────────────────────
  const loadUsers = async () => {
    try {
      setLoadingUsers(true); setError("");
      const res  = await fetch(`${API}/api/admin/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Failed to load users");
      setUsers(data.users || []);
    } catch (e) { setError(e.message); }
    finally { setLoadingUsers(false); }
  };

  const loadOrders = async () => {
    try {
      setLoadingOrders(true);
      setError("");
      const res = await fetch(`${API}/api/orders`);
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data?.message || "Failed to load orders");
      }
      setOrders(data.orders || []);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoadingOrders(false);
    }
  };

  useEffect(() => { if (token) loadUsers(); }, [token]); // eslint-disable-line

  useEffect(() => {
    loadProductCount();
  }, []); // eslint-disable-line

  useEffect(() => {
    if (activeTab === "orders") {
      loadOrders();
    }
  }, [activeTab]); // eslint-disable-line

  // ── Promote user ──────────────────────────────────────────────────────────
  const updateOrderStatus = async (orderId, updates) => {
    try {
      setError("");
      const res = await fetch(`${API}/api/orders/${orderId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updates),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data?.message || "Failed to update order");
      }

      setOrders((prev) =>
        prev.map((order) =>
          order._id === orderId ? { ...order, ...updates } : order
        )
      );
    } catch (e) {
      setError(e.message);
    }
  };

  const makeAdmin = async (userId) => {
    try {
      setError("");
      const res  = await fetch(`${API}/api/admin/users/${userId}/make-admin`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Failed to promote user");
      await loadUsers();
    } catch (e) { setError(e.message); }
  };

  const logout = () => {
    const confirmLogout = window.confirm("Are you sure you want to logout?");
    if (!confirmLogout) return;

    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const handleNavClick = (id) => {
    setActiveTab(id);
    setSidebarOpen(false);
  };

  return (
    <div className="ad-root">
      {/* Mobile overlay */}
      {sidebarOpen && <div className="ad-overlay" onClick={() => setSidebarOpen(false)} />}

      {/* ── Sidebar ── */}
      <aside className={`ad-sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="ad-brand">
          <Icon d={ICO.package} size={22} />
          <span>Auri Admin</span>
        </div>

        <nav className="ad-nav">
          {NAV.map(n => (
            <button key={n.id}
              className={`ad-nav-item ${activeTab === n.id ? "active" : ""}`}
              onClick={() => handleNavClick(n.id)}>
              <Icon d={n.icon} size={17} />
              <span>{n.label}</span>
            </button>
          ))}

          {/* Products — navigates to separate page */}
          <button
            className="ad-nav-item ad-nav-item--page"
            onClick={() => navigate("/admin/products")}>
            <Icon d={ICO.package} size={17} />
            <span>Products</span>
            <span className="ad-nav-ext"><Icon d={ICO.arrow} size={12} /></span>
          </button>

          {/* Add Product — navigates to separate page */}
          <button
            className="ad-nav-item ad-nav-item--page"
            onClick={() => navigate("/admin/add-product")}>
            <Icon d={ICO.product} size={17} />
            <span>Add Product</span>
            <span className="ad-nav-ext"><Icon d={ICO.arrow} size={12} /></span>
          </button>
        </nav>

        <div className="ad-sidebar-footer">
          {!loadingMe && me && (
            <div className="ad-sidebar-user">
              <div className="ad-mini-avatar">{me.firstName?.[0]}{me.lastName?.[0]}</div>
              <div className="ad-sidebar-user-info">
                <strong>{me.firstName}</strong>
                <span className="ad-pill pill-admin">{me.role}</span>
              </div>
            </div>
          )}
          <button className="ad-logout-btn" onClick={logout}>
            <Icon d={ICO.logout} size={15} /> Logout
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <div className="ad-main">
        {/* Topbar (mobile) */}
        <header className="ad-topbar">
          <button className="ad-hamburger" onClick={() => setSidebarOpen(s => !s)}>
            <span /><span /><span />
          </button>
          <span className="ad-topbar-title">
            {NAV.find(n => n.id === activeTab)?.label ?? "Admin"}
          </span>
          <button className="ad-topbar-logout" onClick={logout}>
            <Icon d={ICO.logout} size={16} />
          </button>
        </header>

        {/* Page content */}
        <main className="ad-content">
          {activeTab === "overview" && (
            <OverviewTab
              me={me}
              users={users}
              navigate={navigate}
              productCount={loadingProducts ? "..." : productCount}
            />
          )}
          {activeTab === "users" && (
            <UsersTab users={users} loadingUsers={loadingUsers}
              loadUsers={loadUsers} makeAdmin={makeAdmin} error={error} />
          )}
          {activeTab === "orders" && (
            <OrdersTab
              orders={orders}
              loadingOrders={loadingOrders}
              loadOrders={loadOrders}
              updateOrderStatus={updateOrderStatus}
              error={error}
            />
          )}
        </main>
      </div>
    </div>
  );
}