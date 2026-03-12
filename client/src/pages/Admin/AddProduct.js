import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/Admin/AddProduct.css";

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
  product: "M12 5v14 M5 12h14",
  image:   "M21 19a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h4l2 3h7a2 2 0 012 2z",
  package: "M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z",
  tag:     "M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z M7 7h.01",
  upload:  "M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4 M17 8l-5-5-5 5 M12 3v12",
  x:       "M18 6L6 18 M6 6l12 12",
  info:    "M12 16v-4 M12 8h.01 M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z",
  dollar:  "M12 1v22 M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6",
  layers:  "M12 2L2 7l10 5 10-5-10-5z M2 17l10 5 10-5 M2 12l10 5 10-5",
  star:    "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
  swap:    "M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4",
};

// ── Constants ─────────────────────────────────────────────────────────────────
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
  material: "", care: "", stock: "",
  sizes: [], colors: [],
};

// ── Checklist item ────────────────────────────────────────────────────────────
const CheckItem = ({ label, done }) => (
  <div className={`apg-check-row ${done ? "done" : ""}`}>
    <div className="apg-check-icon">
      {done && <Icon d={ICO.check} size={10} />}
    </div>
    {label}
  </div>
);

// ── Success Toast ─────────────────────────────────────────────────────────────
const SuccessToast = ({ product, onClose }) => (
  <div className="apg-toast">
    <div className="apg-toast-icon">
      <Icon d={ICO.check} size={20} />
    </div>
    <div className="apg-toast-body">
      <strong>Product added successfully!</strong>
      <span>"{product}" is now live in your store.</span>
    </div>
    <button className="apg-toast-close" onClick={onClose}>
      <Icon d={ICO.x} size={14} />
    </button>
  </div>
);

// ── Color-linked image slot ───────────────────────────────────────────────────
// Each color gets its own upload slot so the order is explicit.
const ColorImageSlot = ({ color, index, image, onUpload, onRemove }) => {
  const swatch = COLOR_SWATCHES[color] || "#888";

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      onUpload(index, file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      onUpload(index, file);
    }
  };

  return (
    <div className="apg-color-slot">
      {/* Color label */}
      <div className="apg-slot-label">
        <span className="apg-slot-swatch" style={{ background: swatch }} />
        <span className="apg-slot-name">{color}</span>
        <span className="apg-slot-index">Image {index + 1}</span>
      </div>

      {/* Upload area */}
      {image ? (
        <div className="apg-slot-preview">
          <img src={image.url} alt={color} />
          <div className="apg-slot-overlay">
            <button
              type="button"
              className="apg-slot-remove"
              onClick={() => onRemove(index)}
              title="Remove image"
            >
              <Icon d={ICO.x} size={12} />
            </button>
            {/* Replace button */}
            <label className="apg-slot-replace" title="Replace image">
              <Icon d={ICO.swap} size={12} />
              <input
                type="file" accept="image/*"
                style={{ display: "none" }}
                onChange={handleFile}
              />
            </label>
          </div>
          <div className="apg-slot-badge">✓</div>
        </div>
      ) : (
        <label
          className="apg-slot-dropzone"
          onDragOver={e => e.preventDefault()}
          onDrop={handleDrop}
        >
          <input
            type="file" accept="image/*"
            style={{ display: "none" }}
            onChange={handleFile}
          />
          <Icon d={ICO.upload} size={22} />
          <span>Upload for <strong>{color}</strong></span>
          <span className="apg-slot-hint">or drag &amp; drop</span>
        </label>
      )}
    </div>
  );
};

// ── Main Component ────────────────────────────────────────────────────────────
export default function AddProduct() {
  const navigate = useNavigate();

  const [form, setForm]               = useState(EMPTY_FORM);
  const [customColor, setCustomColor] = useState("");
  // colorImages: array aligned with form.colors — colorImages[i] is the image for colors[i]
  const [colorImages, setColorImages] = useState([]);
  const [loading, setLoading]         = useState(false);
  const [errors, setErrors]           = useState({});
  const [toast, setToast]             = useState(null);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  // ── Toggle size ─────────────────────────────────────────────────────────────
  const toggleSize = (val) =>
    setForm(f => ({
      ...f,
      sizes: f.sizes.includes(val)
        ? f.sizes.filter(x => x !== val)
        : [...f.sizes, val],
    }));

  // ── Toggle color — also keeps colorImages array in sync ─────────────────────
  const toggleColor = (color) => {
    setForm(f => {
      const exists = f.colors.includes(color);
      if (exists) {
        const idx = f.colors.indexOf(color);
        // Remove from colorImages too
        setColorImages(prev => prev.filter((_, i) => i !== idx));
        return { ...f, colors: f.colors.filter(c => c !== color) };
      } else {
        setColorImages(prev => [...prev, null]); // placeholder for new color
        return { ...f, colors: [...f.colors, color] };
      }
    });
  };

  // ── Custom color ────────────────────────────────────────────────────────────
  const addCustomColor = () => {
    const c = customColor.trim();
    if (c && !form.colors.includes(c)) {
      setForm(f => ({ ...f, colors: [...f.colors, c] }));
      setColorImages(prev => [...prev, null]);
      setCustomColor("");
    }
  };

  // ── Image slot handlers ──────────────────────────────────────────────────────
  const handleSlotUpload = (index, file) => {
    const url = URL.createObjectURL(file);
    setColorImages(prev => {
      const next = [...prev];
      next[index] = { file, url, name: file.name };
      return next;
    });
  };

  const handleSlotRemove = (index) => {
    setColorImages(prev => {
      const next = [...prev];
      next[index] = null;
      return next;
    });
  };

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
      const token = localStorage.getItem("token");

      const formData = new FormData();
      formData.append("name",        form.name);
      formData.append("category",    form.category);
      formData.append("price",       form.price);
      formData.append("description", form.description);
      formData.append("material",    form.material);
      formData.append("care",        form.care);
      formData.append("stock",       form.stock);
      formData.append("sizes",       JSON.stringify(form.sizes));
      formData.append("colors",      JSON.stringify(form.colors));

      // Append images in color order — missing slots send a blank marker
      // so the backend keeps the index alignment intact.
      colorImages.forEach((img, i) => {
        if (img?.file) {
          formData.append("images", img.file);
        }
        // If no image for this color slot, we skip it.
        // The backend will store images in upload order = color order.
      });

      const res = await fetch(`${API}/api/products/admin`, {
        method:  "POST",
        headers: { Authorization: `Bearer ${token}` },
        body:    formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to add product");

      const savedName = form.name;
      setToast({ name: savedName });
      setForm(EMPTY_FORM);
      setColorImages([]);
      setTimeout(() => setToast(null), 4000);

    } catch (err) {
      setErrors({ submit: err.message });
    } finally {
      setLoading(false);
    }
  };

  // ── Clear ───────────────────────────────────────────────────────────────────
  const handleClear = () => {
    setForm(EMPTY_FORM);
    setColorImages([]);
    setErrors({});
  };

  // ── Derived ─────────────────────────────────────────────────────────────────
  const allColors = [
    ...COLORS_DEFAULT,
    ...form.colors.filter(c => !COLORS_DEFAULT.includes(c)),
  ];

  const uploadedCount = colorImages.filter(Boolean).length;

  const checklist = [
    { label: "Product name",    done: !!form.name.trim() },
    { label: "Category",        done: !!form.category },
    { label: "Price set",       done: !!form.price && !isNaN(Number(form.price)) },
    { label: "Description",     done: !!form.description.trim() },
    { label: "Sizes chosen",    done: form.sizes.length > 0 },
    { label: "Colors chosen",   done: form.colors.length > 0 },
    { label: "Images uploaded", done: uploadedCount > 0 },
  ];

  const completedCount = checklist.filter(c => c.done).length;
  const progressPct    = Math.round((completedCount / checklist.length) * 100);

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="apg-page">

      {toast && (
        <SuccessToast product={toast.name} onClose={() => setToast(null)} />
      )}

      <header className="apg-header">
        <div className="apg-header-left">
          <button className="apg-back-btn" onClick={() => navigate(-1)}>
            <Icon d={ICO.back} size={14} /> Back
          </button>
          <div className="apg-breadcrumb">
            <span>Admin</span>
            <span className="apg-bc-sep">/</span>
            <span className="apg-bc-active">Add Product</span>
          </div>
        </div>
        <div className="apg-header-badge">
          <Icon d={ICO.package} size={13} /> New Listing
        </div>
      </header>

      <div className="apg-layout">

        {/* ── Left: Form ── */}
        <div className="apg-form-col">
          <div className="apg-hero">
            <h1>Add a <em>New</em> Product</h1>
            <p>Fill in the details below to list a new item in the store.</p>
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
                  <input
                    value={form.name}
                    onChange={e => set("name", e.target.value)}
                    placeholder="e.g. Tropical Breeze Dress"
                    className={errors.name ? "err" : ""}
                  />
                  {errors.name && <span className="apg-err">{errors.name}</span>}
                </div>

                <div className="apg-field">
                  <label className="apg-label">Category <span className="apg-req">*</span></label>
                  <select
                    value={form.category}
                    onChange={e => set("category", e.target.value)}
                    className={errors.category ? "err" : ""}
                  >
                    <option value="">Select category…</option>
                    {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                  {errors.category && <span className="apg-err">{errors.category}</span>}
                </div>
              </div>

              <div className="apg-field">
                <label className="apg-label">Description <span className="apg-req">*</span></label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={e => set("description", e.target.value)}
                  placeholder="Describe the product — fabric, fit, occasion…"
                  className={errors.description ? "err" : ""}
                />
                {errors.description && <span className="apg-err">{errors.description}</span>}
              </div>

              <div className="apg-grid-2">
                <div className="apg-field">
                  <label className="apg-label">Material</label>
                  <input
                    value={form.material}
                    onChange={e => set("material", e.target.value)}
                    placeholder="e.g. 100% Organic Cotton"
                  />
                </div>
                <div className="apg-field">
                  <label className="apg-label">Care Instructions</label>
                  <input
                    value={form.care}
                    onChange={e => set("care", e.target.value)}
                    placeholder="e.g. Machine wash cold"
                  />
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
                  <label className="apg-label">Price (Rs) <span className="apg-req">*</span></label>
                  <input
                    type="number" min="0" step="0.01"
                    value={form.price}
                    onChange={e => set("price", e.target.value)}
                    placeholder="0.00"
                    className={errors.price ? "err" : ""}
                  />
                  {errors.price && <span className="apg-err">{errors.price}</span>}
                </div>

                <div className="apg-field">
                  <label className="apg-label">Stock Quantity</label>
                  <input
                    type="number" min="0"
                    value={form.stock}
                    onChange={e => set("stock", e.target.value)}
                    placeholder="e.g. 50"
                  />
                </div>
              </div>
            </section>

            {/* ── Variants ── */}
            <section className="apg-section">
              <div className="apg-section-title">
                <Icon d={ICO.layers} size={14} /> Variants
              </div>

              {/* Sizes */}
              <div className="apg-field">
                <label className="apg-label">Sizes <span className="apg-req">*</span></label>
                <div className="apg-size-group">
                  {SIZES.map(s => (
                    <button
                      type="button" key={s}
                      className={`apg-size-chip ${form.sizes.includes(s) ? "active" : ""}`}
                      onClick={() => toggleSize(s)}
                    >
                      {s}
                    </button>
                  ))}
                </div>
                {errors.sizes && <span className="apg-err">{errors.sizes}</span>}
              </div>

              {/* Colors */}
              <div className="apg-field">
                <label className="apg-label">Colors <span className="apg-req">*</span></label>
                <div className="apg-color-group">
                  {allColors.map(c => (
                    <button
                      type="button" key={c}
                      className={`apg-color-btn ${form.colors.includes(c) ? "active" : ""}`}
                      onClick={() => toggleColor(c)}
                    >
                      <span
                        className="apg-color-swatch"
                        style={{ background: COLOR_SWATCHES[c] || "#888" }}
                      />
                      {c}
                    </button>
                  ))}
                </div>

                <div className="apg-custom-row">
                  <input
                    className="apg-custom-input"
                    value={customColor}
                    onChange={e => setCustomColor(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addCustomColor())}
                    placeholder="Add custom color…"
                  />
                  <button type="button" className="apg-add-btn" onClick={addCustomColor}>
                    Add
                  </button>
                </div>

                {errors.colors && <span className="apg-err">{errors.colors}</span>}
              </div>
            </section>

            {/* ── Images — one slot per color ── */}
            <section className="apg-section">
              <div className="apg-section-title">
                <Icon d={ICO.image} size={14} /> Product Images
              </div>

              {form.colors.length === 0 ? (
                <div className="apg-slot-placeholder">
                  <Icon d={ICO.info} size={16} />
                  Select colors above — each color will get its own image slot.
                </div>
              ) : (
                <>
                  <p className="apg-slot-intro">
                    Upload one image per color. The image order matches the color order exactly,
                    so customers see the correct photo when they select a color.
                  </p>
                  <div className="apg-color-slots">
                    {form.colors.map((color, i) => (
                      <ColorImageSlot
                        key={color}
                        color={color}
                        index={i}
                        image={colorImages[i]}
                        onUpload={handleSlotUpload}
                        onRemove={handleSlotRemove}
                      />
                    ))}
                  </div>
                  <p className="apg-slot-note">
                    💡 {uploadedCount} of {form.colors.length} color image{form.colors.length !== 1 ? "s" : ""} uploaded.
                    Colors without an image will show the first available image.
                  </p>
                </>
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
                <button type="button" className="apg-btn-clear" onClick={handleClear}>
                  Clear
                </button>
                <button type="submit" className="apg-btn-submit" disabled={loading}>
                  {loading
                    ? <><span className="apg-spinner" /> Saving…</>
                    : <><Icon d={ICO.check} size={15} /> Add Product</>}
                </button>
              </div>
            </div>

          </form>
        </div>

        {/* ── Sidebar ── */}
        <aside className="apg-sidebar">

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

          <div className="apg-card">
            <div className="apg-card-title">Live Preview</div>
            <div className={`apg-prev-name ${!form.name ? "empty" : ""}`}>
              {form.name || "Product name…"}
            </div>
            <div className={`apg-prev-price ${!form.price ? "empty" : ""}`}>
              {form.price ? `Rs ${parseFloat(form.price).toLocaleString()}` : "Price…"}
            </div>

            {form.category && (
              <div className="apg-prev-row">
                <span>Category</span><span>{form.category}</span>
              </div>
            )}
            {form.stock && (
              <div className="apg-prev-row">
                <span>In stock</span><span>{form.stock} units</span>
              </div>
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
                    <span
                      key={c}
                      className="apg-prev-color"
                      title={c}
                      style={{ background: COLOR_SWATCHES[c] || "#888" }}
                    />
                  ))}
                </div>
              </div>
            )}
            {form.material && (
              <div className="apg-prev-row">
                <span>Material</span><span>{form.material}</span>
              </div>
            )}
            {uploadedCount > 0 && (
              <div className="apg-prev-row">
                <span>Images</span>
                <span>{uploadedCount} / {form.colors.length} uploaded</span>
              </div>
            )}

            {/* Mini image preview strip */}
            {colorImages.some(Boolean) && (
              <div className="apg-prev-img-strip">
                {form.colors.map((color, i) => (
                  colorImages[i] ? (
                    <div key={color} className="apg-prev-img-thumb" title={color}>
                      <img src={colorImages[i].url} alt={color} />
                      <span
                        className="apg-prev-img-dot"
                        style={{ background: COLOR_SWATCHES[color] || "#888" }}
                      />
                    </div>
                  ) : null
                ))}
              </div>
            )}
          </div>

        </aside>
      </div>
    </div>
  );
}