import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/Admin/AdminProduct.css";

const API = process.env.REACT_APP_API_URL || "http://localhost:5050";

// ── Icons ─────────────────────────────────────────────────────────────────────
const Icon = ({ d, size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);
const ICO = {
  back:     "M19 12H5 M12 19l-7-7 7-7",
  plus:     "M12 5v14 M5 12h14",
  search:   "M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z",
  trash:    "M3 6h18 M8 6V4h8v2 M19 6l-1 14H6L5 6",
  edit:     "M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7 M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z",
  eye:      "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z M12 9a3 3 0 100 6 3 3 0 000-6z",
  eyeoff:   "M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94 M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19 M1 1l22 22",
  refresh:  "M23 4v6h-6 M1 20v-6h6 M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15",
  alert:    "M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z M12 9v4 M12 17h.01",
  check:    "M20 6L9 17l-5-5",
  x:        "M18 6L6 18 M6 6l12 12",
  package:  "M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z",
  filter:   "M22 3H2l8 9.46V19l4 2v-8.54L22 3z",
  image:    "M21 15l-5-5L5 21 M3 3h18v18H3z",
  chevdown: "M6 9l6 6 6-6",
};

// ── Toast ─────────────────────────────────────────────────────────────────────
const Toast = ({ msg, type, onClose }) => (
  <div className={`ap-toast ap-toast--${type}`}>
    <div className="ap-toast-icon">
      <Icon d={type === "success" ? ICO.check : ICO.alert} size={16} />
    </div>
    <span>{msg}</span>
    <button className="ap-toast-close" onClick={onClose}>
      <Icon d={ICO.x} size={13} />
    </button>
  </div>
);

// ── Confirm Modal ─────────────────────────────────────────────────────────────
const ConfirmModal = ({ product, onConfirm, onCancel }) => (
  <div className="apm-overlay" onClick={onCancel}>
    <div className="apm-modal" onClick={e => e.stopPropagation()}>
      <div className="apm-modal-icon">
        <Icon d={ICO.trash} size={22} />
      </div>
      <h3>Delete Product?</h3>
      <p>
        <strong>"{product.name}"</strong> will be permanently removed from
        your store. This cannot be undone.
      </p>
      <div className="apm-modal-actions">
        <button className="apm-btn-cancel" onClick={onCancel}>Cancel</button>
        <button className="apm-btn-delete" onClick={onConfirm}>
          Yes, Delete
        </button>
      </div>
    </div>
  </div>
);

// ── Product Card ──────────────────────────────────────────────────────────────
const ProductCard = ({ product, onToggleStatus, onDelete, onEdit }) => {
  const img = product.images?.[0]?.url;

  return (
    <div className={`apm-card ${!product.isActive ? "inactive" : ""}`}>
      {/* Image */}
      <div className="apm-card-img">
        {img
          ? <img src={img} alt={product.name} />
          : <div className="apm-card-no-img"><Icon d={ICO.image} size={28} /></div>}
        {/* Status badge */}
        <div className={`apm-status-badge ${product.isActive ? "active" : "inactive"}`}>
          {product.isActive ? "Active" : "Hidden"}
        </div>
      </div>

      {/* Info */}
      <div className="apm-card-body">
        <div className="apm-card-top">
          <span className="apm-card-category">{product.category}</span>
          <span className="apm-card-price">${Number(product.price).toFixed(2)}</span>
        </div>
        <h3 className="apm-card-name">{product.name}</h3>
        <p className="apm-card-desc">{product.description}</p>

        <div className="apm-card-meta">
          <span className="apm-meta-item">
            Stock: <strong>{product.stock ?? 0}</strong>
          </span>
          <span className="apm-meta-item">
            Sizes: <strong>{product.sizes?.join(", ") || "—"}</strong>
          </span>
        </div>

        {/* Colors */}
        {product.colors?.length > 0 && (
          <div className="apm-card-colors">
            {product.colors.slice(0, 6).map(c => (
              <span key={c} className="apm-color-tag">{c}</span>
            ))}
            {product.colors.length > 6 && (
              <span className="apm-color-more">+{product.colors.length - 6}</span>
            )}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="apm-card-actions">
        <button
          className={`apm-action-btn status-btn ${product.isActive ? "deactivate" : "activate"}`}
          onClick={() => onToggleStatus(product)}
          title={product.isActive ? "Hide product" : "Make active"}
        >
          <Icon d={product.isActive ? ICO.eyeoff : ICO.eye} size={15} />
          {product.isActive ? "Hide" : "Show"}
        </button>

        <button
          className="apm-action-btn edit-btn"
          onClick={() => onEdit(product)}
          title="Edit product"
        >
          <Icon d={ICO.edit} size={15} />
          Edit
        </button>

        <button
          className="apm-action-btn delete-btn"
          onClick={() => onDelete(product)}
          title="Delete product"
        >
          <Icon d={ICO.trash} size={15} />
        </button>
      </div>
    </div>
  );
};

// ── Skeleton Card ─────────────────────────────────────────────────────────────
const SkeletonCard = () => (
  <div className="apm-card apm-skeleton">
    <div className="apm-card-img sk-block" />
    <div className="apm-card-body">
      <div className="sk-line sk-short" />
      <div className="sk-line sk-long" />
      <div className="sk-line sk-med" />
    </div>
  </div>
);

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function AdminProducts() {
  const navigate = useNavigate();
  const token    = localStorage.getItem("token");

  const [products, setProducts]     = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState("");
  const [search, setSearch]         = useState("");
  const [filterStatus, setFilter]   = useState("all"); // all | active | inactive
  const [filterCat, setFilterCat]   = useState("all");
  const [toast, setToast]           = useState(null);
  const [confirmDelete, setConfirm] = useState(null); // product to delete
  const [togglingId, setTogglingId] = useState(null);

  // ── Fetch products ──────────────────────────────────────────────────────────
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const res  = await fetch(`${API}/api/products/admin`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to load products");
      setProducts(data.products || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  // ── Show toast ──────────────────────────────────────────────────────────────
  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  // ── Toggle status (active / inactive) ──────────────────────────────────────
  const handleToggleStatus = async (product) => {
    try {
      setTogglingId(product._id);
      const res  = await fetch(`${API}/api/products/admin/${product._id}`, {
        method:  "PUT",
        headers: {
          Authorization:  `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isActive: !product.isActive }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update status");

      setProducts(prev =>
        prev.map(p => p._id === product._id ? { ...p, isActive: !p.isActive } : p)
      );
      showToast(
        `"${product.name}" is now ${!product.isActive ? "visible" : "hidden"}.`
      );
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setTogglingId(null);
    }
  };

  // ── Delete ──────────────────────────────────────────────────────────────────
  const handleDeleteConfirm = async () => {
    if (!confirmDelete) return;
    try {
      const res  = await fetch(`${API}/api/products/admin/${confirmDelete._id}/permanent`, {
        method:  "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to delete");

      setProducts(prev => prev.filter(p => p._id !== confirmDelete._id));
      showToast(`"${confirmDelete.name}" deleted permanently.`);
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setConfirm(null);
    }
  };

  // ── Edit — navigate to edit page ────────────────────────────────────────────
  const handleEdit = (product) => {
    navigate(`/admin/edit-product/${product._id}`);
  };

  // ── Filtered products ───────────────────────────────────────────────────────
  const filtered = products.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
                        p.category.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "all"
      ? true
      : filterStatus === "active" ? p.isActive : !p.isActive;
    const matchCat = filterCat === "all" || p.category === filterCat;
    return matchSearch && matchStatus && matchCat;
  });

  const categories = ["all", ...new Set(products.map(p => p.category))];

  const stats = {
    total:    products.length,
    active:   products.filter(p => p.isActive).length,
    inactive: products.filter(p => !p.isActive).length,
  };

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="apm-page">

      {/* Toast */}
      {toast && (
        <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />
      )}

      {/* Confirm modal */}
      {confirmDelete && (
        <ConfirmModal
          product={confirmDelete}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setConfirm(null)}
        />
      )}

      {/* ── Header ── */}
      <header className="apm-header">
        <div className="apm-header-left">
          <button className="apm-back-btn" onClick={() => navigate("/admin")}>
            <Icon d={ICO.back} size={14} /> Dashboard
          </button>
          <div className="apm-breadcrumb">
            <span>Admin</span>
            <span className="apm-bc-sep">/</span>
            <span className="apm-bc-active">Products</span>
          </div>
        </div>
        <button className="apm-btn-add" onClick={() => navigate("/admin/add-product")}>
          <Icon d={ICO.plus} size={15} /> Add Product
        </button>
      </header>

      <div className="apm-body">

        {/* ── Page title + stats ── */}
        <div className="apm-title-row">
          <div>
            <h1 className="apm-title">All Products</h1>
            <p className="apm-subtitle">Manage your store inventory</p>
          </div>
          <button className="apm-refresh-btn" onClick={fetchProducts} disabled={loading}>
            <Icon d={ICO.refresh} size={15} />
          </button>
        </div>

        {/* Stats */}
        <div className="apm-stats">
          <div className="apm-stat">
            <span className="apm-stat-val">{stats.total}</span>
            <span className="apm-stat-label">Total</span>
          </div>
          <div className="apm-stat-div" />
          <div className="apm-stat">
            <span className="apm-stat-val active">{stats.active}</span>
            <span className="apm-stat-label">Active</span>
          </div>
          <div className="apm-stat-div" />
          <div className="apm-stat">
            <span className="apm-stat-val inactive">{stats.inactive}</span>
            <span className="apm-stat-label">Hidden</span>
          </div>
        </div>

        {/* ── Filters ── */}
        <div className="apm-filters">
          {/* Search */}
          <div className="apm-search-wrap">
            <Icon d={ICO.search} size={15} />
            <input
              className="apm-search"
              placeholder="Search products…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            {search && (
              <button className="apm-search-clear" onClick={() => setSearch("")}>
                <Icon d={ICO.x} size={13} />
              </button>
            )}
          </div>

          {/* Status filter */}
          <div className="apm-filter-group">
            {["all", "active", "inactive"].map(s => (
              <button
                key={s}
                className={`apm-filter-btn ${filterStatus === s ? "active" : ""}`}
                onClick={() => setFilter(s)}
              >
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>

          {/* Category filter */}
          <div className="apm-select-wrap">
            <Icon d={ICO.filter} size={14} />
            <select
              className="apm-select"
              value={filterCat}
              onChange={e => setFilterCat(e.target.value)}
            >
              {categories.map(c => (
                <option key={c} value={c}>
                  {c === "all" ? "All Categories" : c}
                </option>
              ))}
            </select>
            <Icon d={ICO.chevdown} size={13} />
          </div>
        </div>

        {/* ── Error ── */}
        {error && (
          <div className="apm-error">
            <Icon d={ICO.alert} size={15} /> {error}
            <button onClick={fetchProducts}>Retry</button>
          </div>
        )}

        {/* ── Grid ── */}
        {loading ? (
          <div className="apm-grid">
            {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="apm-empty">
            <Icon d={ICO.package} size={40} />
            <strong>No products found</strong>
            <span>
              {search || filterStatus !== "all" || filterCat !== "all"
                ? "Try adjusting your filters."
                : "Add your first product to get started."}
            </span>
            {!search && filterStatus === "all" && filterCat === "all" && (
              <button
                className="apm-btn-add"
                onClick={() => navigate("/admin/add-product")}
              >
                <Icon d={ICO.plus} size={15} /> Add Product
              </button>
            )}
          </div>
        ) : (
          <>
            <p className="apm-results-count">
              Showing <strong>{filtered.length}</strong> of <strong>{products.length}</strong> products
            </p>
            <div className="apm-grid">
              {filtered.map(p => (
                <ProductCard
                  key={p._id}
                  product={p}
                  onToggleStatus={handleToggleStatus}
                  onDelete={setConfirm}
                  onEdit={handleEdit}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}