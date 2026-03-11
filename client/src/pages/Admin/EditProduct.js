import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../../styles/Admin/AddProduct.css"; // reuse same styles
import "../../styles/Admin/EditProduct.css"; // small overrides

const API = process.env.REACT_APP_API_URL || "http://localhost:5050";

// ── Icons ─────────────────────────────────────────────────────────────────────
const Icon = ({ d, size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);

const ICO = {
  back:    "M19 12H5 M12 19l-7-7 7-7",
  check:   "M20 6L9 17l-5-5",
  image:   "M21 19a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h4l2 3h7a2 2 0 012 2z",
  package: "M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z",
  tag:     "M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z M7 7h.01",
  upload:  "M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4 M17 8l-5-5-5 5 M12 3v12",
  x:       "M18 6L6 18 M6 6l12 12",
  info:    "M12 16v-4 M12 8h.01 M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z",
  dollar:  "M12 1v22 M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6",
  layers:  "M12 2L2 7l10 5 10-5-10-5z M2 17l10 5 10-5 M2 12l10 5 10-5",
  edit:    "M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7 M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z",
  trash:   "M3 6h18 M8 6V4h8v2 M19 6l-1 14H6L5 6",
  eye:     "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z M12 9a3 3 0 100 6 3 3 0 000-6z",
  eyeoff:  "M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94 M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19 M1 1l22 22",
};

const CATEGORIES     = ["Dress", "Maxi Dress", "Juwellery"];
const SIZES          = ["XS", "S", "M", "L", "XL", "XXL"];
const COLORS_DEFAULT = ["Black", "White", "Red", "Blue", "Green", "Pink", "Yellow", "Coral", "Navy", "Mint"];
const COLOR_SWATCHES = {
  Black: "#1a1a1a", White: "#efefef", Red: "#ef4444", Blue: "#3b82f6",
  Green: "#22c55e", Pink: "#ec4899", Yellow: "#eab308", Coral: "#f97316",
  Navy: "#1e3a5f", Mint: "#6ee7b7",
};

const EMPTY_FORM = {
  name: "", category: "", price: "", description: "",
  material: "", care: "", stock: "", isActive: true,
  sizes: [], colors: [],
};

// ── Checklist ─────────────────────────────────────────────────────────────────
const CheckItem = ({ label, done }) => (
  <div className={`apg-check-row ${done ? "done" : ""}`}>
    <div className="apg-check-icon">
      {done && <Icon d={ICO.check} size={10} />}
    </div>
    {label}
  </div>
);

// ── Main Component ────────────────────────────────────────────────────────────
export default function EditProduct() {
  const navigate      = useNavigate();
  const { id }        = useParams();
  const token         = localStorage.getItem("token");

  const [form, setForm]             = useState(EMPTY_FORM);
  const [customColor, setCustomColor] = useState("");
  const [existingImages, setExistingImages] = useState([]); // already on server
  const [newImages, setNewImages]   = useState([]);         // newly added locally
  const [dragOver, setDragOver]     = useState(false);
  const [loadingFetch, setLoadingFetch] = useState(true);
  const [loading, setLoading]       = useState(false);
  const [errors, setErrors]         = useState({});
  const [toast, setToast]           = useState(null);
  const [fetchError, setFetchError] = useState("");

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const toggleArr = (k, val) =>
    setForm(f => ({
      ...f,
      [k]: f[k].includes(val) ? f[k].filter(x => x !== val) : [...f[k], val],
    }));

  // ── Fetch existing product ──────────────────────────────────────────────────
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoadingFetch(true);
        const res  = await fetch(`${API}/api/products/admin/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // fallback: try public endpoint if admin endpoint returns 404
        let data = await res.json();

        if (!res.ok) {
          // try public route
          const res2  = await fetch(`${API}/api/products/${id}`);
          const data2 = await res2.json();
          if (!res2.ok) throw new Error(data2.message || "Product not found");
          data = data2;
        }

        const p = data.product;
        setForm({
          name:        p.name        || "",
          category:    p.category    || "",
          price:       p.price       || "",
          description: p.description || "",
          material:    p.material    || "",
          care:        p.care        || "",
          stock:       p.stock       ?? "",
          isActive:    p.isActive    ?? true,
          sizes:       p.sizes       || [],
          colors:      p.colors      || [],
        });
        setExistingImages(p.images || []);
      } catch (err) {
        setFetchError(err.message);
      } finally {
        setLoadingFetch(false);
      }
    };
    fetchProduct();
  }, [id, token]);

  // ── Custom color ────────────────────────────────────────────────────────────
  const addCustomColor = () => {
    const c = customColor.trim();
    if (c && !form.colors.includes(c)) {
      setForm(f => ({ ...f, colors: [...f.colors, c] }));
      setCustomColor("");
    }
  };

  // ── New image handling ──────────────────────────────────────────────────────
  const handleFiles = (fileList) => {
    const files    = Array.from(fileList).filter(f => f.type.startsWith("image/"));
    const previews = files.map(f => ({
      file: f,
      url:  URL.createObjectURL(f),
      name: f.name,
    }));
    setNewImages(prev => [...prev, ...previews]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleFiles(e.dataTransfer.files);
  };

  const removeNewImage    = (idx) => setNewImages(prev => prev.filter((_, i) => i !== idx));
  const removeExistingImg = (publicId) =>
    setExistingImages(prev => prev.filter(img => img.publicId !== publicId));

  // ── Validation ──────────────────────────────────────────────────────────────
  const validate = () => {
    const e = {};
    if (!form.name.trim())                        e.name        = "Required";
    if (!form.category)                           e.category    = "Required";
    if (!form.price || isNaN(Number(form.price))) e.price       = "Valid price required";
    if (!form.description.trim())                 e.description = "Required";
    if (form.sizes.length === 0)                  e.sizes       = "Select at least one size";
    if (form.colors.length === 0)                 e.colors      = "Select at least one color";
    return e;
  };

  // ── Submit ──────────────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("name",        form.name);
      formData.append("category",    form.category);
      formData.append("price",       form.price);
      formData.append("description", form.description);
      formData.append("material",    form.material);
      formData.append("care",        form.care);
      formData.append("stock",       form.stock);
      formData.append("isActive",    form.isActive);
      formData.append("sizes",       JSON.stringify(form.sizes));
      formData.append("colors",      JSON.stringify(form.colors));

      // New images only — existing ones stay on server
      newImages.forEach(img => formData.append("images", img.file));

      const res  = await fetch(`${API}/api/products/admin/${id}`, {
        method:  "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body:    formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update product");

      setToast({ msg: `"${form.name}" updated successfully!`, type: "success" });
      setNewImages([]);
      setTimeout(() => {
        setToast(null);
        navigate("/admin/products");
      }, 1800);

    } catch (err) {
      setErrors({ submit: err.message });
    } finally {
      setLoading(false);
    }
  };

  // ── Derived ─────────────────────────────────────────────────────────────────
  const allColors = [
    ...COLORS_DEFAULT,
    ...form.colors.filter(c => !COLORS_DEFAULT.includes(c)),
  ];

  const checklist = [
    { label: "Product name",  done: !!form.name.trim() },
    { label: "Category",      done: !!form.category },
    { label: "Price set",     done: !!form.price && !isNaN(Number(form.price)) },
    { label: "Description",   done: !!form.description.trim() },
    { label: "Sizes chosen",  done: form.sizes.length > 0 },
    { label: "Colors chosen", done: form.colors.length > 0 },
  ];
  const completedCount = checklist.filter(c => c.done).length;
  const progressPct    = Math.round((completedCount / checklist.length) * 100);

  // ── Loading state ───────────────────────────────────────────────────────────
  if (loadingFetch) {
    return (
      <div className="apg-page">
        <div className="ep-loading">
          <div className="ep-spinner" />
          <span>Loading product…</span>
        </div>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="apg-page">
        <div className="ep-fetch-error">
          <Icon d={ICO.info} size={28} />
          <strong>Failed to load product</strong>
          <span>{fetchError}</span>
          <button onClick={() => navigate("/admin/products")}>← Back to Products</button>
        </div>
      </div>
    );
  }

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="apg-page">

      {/* Toast */}
      {toast && (
        <div className={`apg-toast apg-toast--${toast.type}`}>
          <div className="apg-toast-icon"><Icon d={ICO.check} size={16} /></div>
          <div className="apg-toast-body">
            <strong>{toast.msg}</strong>
            <span>Redirecting to products…</span>
          </div>
        </div>
      )}

      {/* ── Header ── */}
      <header className="apg-header">
        <div className="apg-header-left">
          <button className="apg-back-btn" onClick={() => navigate("/admin/products")}>
            <Icon d={ICO.back} size={14} /> Products
          </button>
          <div className="apg-breadcrumb">
            <span>Admin</span>
            <span className="apg-bc-sep">/</span>
            <span>Products</span>
            <span className="apg-bc-sep">/</span>
            <span className="apg-bc-active">Edit</span>
          </div>
        </div>
        <div className="apg-header-badge" style={{
          background: form.isActive ? "rgba(74,222,128,0.1)" : "rgba(255,255,255,0.06)",
          borderColor: form.isActive ? "rgba(74,222,128,0.3)" : "rgba(255,255,255,0.12)",
          color: form.isActive ? "#86efac" : "rgba(244,244,245,0.5)",
        }}>
          <Icon d={form.isActive ? ICO.eye : ICO.eyeoff} size={13} />
          {form.isActive ? "Active" : "Hidden"}
        </div>
      </header>

      {/* ── Body ── */}
      <div className="apg-layout">

        {/* ── Left: Form ── */}
        <div className="apg-form-col">
          <div className="apg-hero">
            <h1><em>Edit</em> Product</h1>
            <p>Update the details below. Changes save immediately.</p>
          </div>

          {errors.submit && (
            <div className="apg-error-banner">
              <Icon d={ICO.info} size={15} /> {errors.submit}
            </div>
          )}

          <form className="apg-form" onSubmit={handleSubmit} noValidate>

            {/* ── Basic Info ── */}
            <section className="apg-section">
              <div className="apg-section-title">
                <Icon d={ICO.tag} size={14} /> Basic Information
              </div>

              <div className="apg-grid-2">
                <div className="apg-field">
                  <label className="apg-label">Product Name <span className="apg-req">*</span></label>
                  <input value={form.name} onChange={e => set("name", e.target.value)}
                    placeholder="e.g. Tropical Breeze Dress"
                    className={errors.name ? "err" : ""} />
                  {errors.name && <span className="apg-err">{errors.name}</span>}
                </div>

                <div className="apg-field">
                  <label className="apg-label">Category <span className="apg-req">*</span></label>
                  <select value={form.category} onChange={e => set("category", e.target.value)}
                    className={errors.category ? "err" : ""}>
                    <option value="">Select category…</option>
                    {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                  {errors.category && <span className="apg-err">{errors.category}</span>}
                </div>
              </div>

              <div className="apg-field">
                <label className="apg-label">Description <span className="apg-req">*</span></label>
                <textarea rows={3} value={form.description}
                  onChange={e => set("description", e.target.value)}
                  placeholder="Describe the product…"
                  className={errors.description ? "err" : ""} />
                {errors.description && <span className="apg-err">{errors.description}</span>}
              </div>

              <div className="apg-grid-2">
                <div className="apg-field">
                  <label className="apg-label">Material</label>
                  <input value={form.material} onChange={e => set("material", e.target.value)}
                    placeholder="e.g. 100% Organic Cotton" />
                </div>
                <div className="apg-field">
                  <label className="apg-label">Care Instructions</label>
                  <input value={form.care} onChange={e => set("care", e.target.value)}
                    placeholder="e.g. Machine wash cold" />
                </div>
              </div>
            </section>

            {/* ── Pricing & Stock ── */}
            <section className="apg-section">
              <div className="apg-section-title">
                <Icon d={ICO.dollar} size={14} /> Pricing &amp; Stock
              </div>
              <div className="apg-grid-2">
                <div className="apg-field">
                  <label className="apg-label">Price ($) <span className="apg-req">*</span></label>
                  <input type="number" min="0" step="0.01" value={form.price}
                    onChange={e => set("price", e.target.value)}
                    placeholder="0.00" className={errors.price ? "err" : ""} />
                  {errors.price && <span className="apg-err">{errors.price}</span>}
                </div>
                <div className="apg-field">
                  <label className="apg-label">Stock Quantity</label>
                  <input type="number" min="0" value={form.stock}
                    onChange={e => set("stock", e.target.value)} placeholder="e.g. 50" />
                </div>
              </div>

              {/* Visibility toggle */}
              <div className="apg-field">
                <label className="apg-label">Visibility</label>
                <div className="ep-toggle-row">
                  <button
                    type="button"
                    className={`ep-toggle-btn ${form.isActive ? "active" : ""}`}
                    onClick={() => set("isActive", true)}
                  >
                    <Icon d={ICO.eye} size={14} /> Active — visible in store
                  </button>
                  <button
                    type="button"
                    className={`ep-toggle-btn ${!form.isActive ? "active hidden" : ""}`}
                    onClick={() => set("isActive", false)}
                  >
                    <Icon d={ICO.eyeoff} size={14} /> Hidden — not visible
                  </button>
                </div>
              </div>
            </section>

            {/* ── Variants ── */}
            <section className="apg-section">
              <div className="apg-section-title">
                <Icon d={ICO.layers} size={14} /> Variants
              </div>

              <div className="apg-field">
                <label className="apg-label">Sizes <span className="apg-req">*</span></label>
                <div className="apg-size-group">
                  {SIZES.map(s => (
                    <button type="button" key={s}
                      className={`apg-size-chip ${form.sizes.includes(s) ? "active" : ""}`}
                      onClick={() => toggleArr("sizes", s)}>
                      {s}
                    </button>
                  ))}
                </div>
                {errors.sizes && <span className="apg-err">{errors.sizes}</span>}
              </div>

              <div className="apg-field">
                <label className="apg-label">Colors <span className="apg-req">*</span></label>
                <div className="apg-color-group">
                  {allColors.map(c => (
                    <button type="button" key={c}
                      className={`apg-color-btn ${form.colors.includes(c) ? "active" : ""}`}
                      onClick={() => toggleArr("colors", c)}>
                      <span className="apg-color-swatch"
                        style={{ background: COLOR_SWATCHES[c] || "#888" }} />
                      {c}
                    </button>
                  ))}
                </div>
                <div className="apg-custom-row">
                  <input className="apg-custom-input" value={customColor}
                    onChange={e => setCustomColor(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addCustomColor())}
                    placeholder="Add custom color…" />
                  <button type="button" className="apg-add-btn" onClick={addCustomColor}>Add</button>
                </div>
                {errors.colors && <span className="apg-err">{errors.colors}</span>}
              </div>
            </section>

            {/* ── Images ── */}
            <section className="apg-section">
              <div className="apg-section-title">
                <Icon d={ICO.image} size={14} /> Product Images
              </div>

              {/* Existing images */}
              {existingImages.length > 0 && (
                <div>
                  <p className="ep-img-label">Current Images</p>
                  <div className="apg-previews">
                    {existingImages.map((img) => (
                      <div className="apg-thumb" key={img.publicId}>
                        <img src={img.url} alt="product" />
                        <button type="button" className="apg-thumb-remove"
                          onClick={() => removeExistingImg(img.publicId)}>
                          <Icon d={ICO.x} size={10} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* New image dropzone */}
              <div className={`apg-dropzone ${dragOver ? "drag-over" : ""}`}
                onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}>
                <input type="file" multiple accept="image/*"
                  onChange={e => handleFiles(e.target.files)} />
                <Icon d={ICO.upload} size={26} />
                <span className="apg-dz-text">Add more images or <u>browse</u></span>
                <span className="apg-dz-sub">JPG, PNG — up to 10 MB each</span>
              </div>

              {newImages.length > 0 && (
                <div>
                  <p className="ep-img-label">New Images</p>
                  <div className="apg-previews">
                    {newImages.map((img, i) => (
                      <div className="apg-thumb" key={i}>
                        <img src={img.url} alt={img.name} />
                        <button type="button" className="apg-thumb-remove"
                          onClick={() => removeNewImage(i)}>
                          <Icon d={ICO.x} size={10} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </section>

            {/* ── Action bar ── */}
            <div className="apg-action-bar">
              <span className="apg-action-hint">
                {Object.keys(errors).length > 0
                  ? `${Object.keys(errors).length} field(s) need attention`
                  : `${completedCount} / ${checklist.length} fields complete`}
              </span>
              <div className="apg-action-btns">
                <button type="button" className="apg-btn-clear"
                  onClick={() => navigate("/admin/products")}>
                  Cancel
                </button>
                <button type="submit" className="apg-btn-submit" disabled={loading}>
                  {loading
                    ? <><span className="apg-spinner" /> Saving…</>
                    : <><Icon d={ICO.check} size={15} /> Save Changes</>}
                </button>
              </div>
            </div>

          </form>
        </div>

        {/* ── Right Sidebar ── */}
        <aside className="apg-sidebar">

          {/* Progress */}
          <div className="apg-card">
            <div className="apg-card-title">Completion</div>
            <div className="apg-progress-wrap">
              <div className="apg-progress-bar">
                <div className="apg-progress-fill" style={{ width: `${progressPct}%` }} />
              </div>
              <span className="apg-progress-pct">{progressPct}%</span>
            </div>
            <div className="apg-checklist">
              {checklist.map(item => (
                <CheckItem key={item.label} label={item.label} done={item.done} />
              ))}
            </div>
          </div>

          {/* Live preview */}
          <div className="apg-card">
            <div className="apg-card-title">Live Preview</div>
            <div className={`apg-prev-name ${!form.name ? "empty" : ""}`}>
              {form.name || "Product name…"}
            </div>
            <div className={`apg-prev-price ${!form.price ? "empty" : ""}`}>
              {form.price ? `$${parseFloat(form.price).toFixed(2)}` : "Price…"}
            </div>
            {form.category && (
              <div className="apg-prev-row"><span>Category</span><span>{form.category}</span></div>
            )}
            {form.stock !== "" && (
              <div className="apg-prev-row"><span>In stock</span><span>{form.stock} units</span></div>
            )}
            {form.sizes.length > 0 && (
              <div className="apg-prev-row">
                <span>Sizes</span>
                <div className="apg-prev-sizes">
                  {form.sizes.map(s => <span key={s} className="apg-prev-size">{s}</span>)}
                </div>
              </div>
            )}
            {form.colors.length > 0 && (
              <div className="apg-prev-row">
                <span>Colors</span>
                <div className="apg-prev-colors">
                  {form.colors.map(c => (
                    <span key={c} className="apg-prev-color" title={c}
                      style={{ background: COLOR_SWATCHES[c] || "#888" }} />
                  ))}
                </div>
              </div>
            )}
            <div className="apg-prev-row">
              <span>Status</span>
              <span style={{ color: form.isActive ? "#86efac" : "rgba(244,244,245,0.4)" }}>
                {form.isActive ? "● Active" : "○ Hidden"}
              </span>
            </div>
          </div>

        </aside>
      </div>
    </div>
  );
}