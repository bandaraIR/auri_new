const Product   = require("../models/Product");
const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");

// ── Helper: upload buffer → Cloudinary ───────────────────────────────────────
const uploadToCloudinary = (buffer) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "auri/products", resource_type: "image" },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });

// ── Helper: delete image from Cloudinary ─────────────────────────────────────
const deleteFromCloudinary = async (publicId) => {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (err) {
    console.error("Cloudinary delete error:", err.message);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @route   POST /api/admin/products
// @desc    Create a new product (with optional images)
// @access  Admin
// ─────────────────────────────────────────────────────────────────────────────
const createProduct = async (req, res) => {
  try {
    const {
      name, category, price, description,
      material, care, stock, sizes, colors,
    } = req.body;

    // Parse sizes / colors — they may come as JSON strings or plain arrays
    const parsedSizes  = typeof sizes  === "string" ? JSON.parse(sizes)  : sizes;
    const parsedColors = typeof colors === "string" ? JSON.parse(colors) : colors;

    // Validation
    if (!name || !category || !price || !description) {
      return res.status(400).json({ message: "name, category, price and description are required." });
    }
    if (!parsedSizes  || parsedSizes.length  === 0) {
      return res.status(400).json({ message: "At least one size is required." });
    }
    if (!parsedColors || parsedColors.length === 0) {
      return res.status(400).json({ message: "At least one color is required." });
    }

    // Upload images to Cloudinary (if any)
    let images = [];
    if (req.files && req.files.length > 0) {
      const uploads = await Promise.all(
        req.files.map(file => uploadToCloudinary(file.buffer))
      );
      images = uploads.map(result => ({
        url:      result.secure_url,
        publicId: result.public_id,
      }));
    }

    const product = await Product.create({
      name,
      category,
      price:       Number(price),
      description,
      material:    material || "",
      care:        care     || "",
      stock:       stock ? Number(stock) : 0,
      sizes:       parsedSizes,
      colors:      parsedColors,
      images,
    });

    res.status(201).json({ message: "Product created successfully.", product });
  } catch (err) {
    console.error("createProduct error:", err);
    res.status(500).json({ message: "Server error.", error: err.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @route   GET /api/products
// @desc    Get all active products (public) with filter / search / pagination
// @access  Public
// ─────────────────────────────────────────────────────────────────────────────
const getProducts = async (req, res) => {
  try {
    const {
      category,
      minPrice,
      maxPrice,
      search,
      page  = 1,
      limit = 20,
      sort  = "-createdAt", // newest first by default
    } = req.query;

    const filter = { isActive: true };

    if (category) filter.category = category;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    if (search) {
      filter.$text = { $search: search };
    }

    const skip  = (Number(page) - 1) * Number(limit);
    const total = await Product.countDocuments(filter);

    const products = await Product.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(Number(limit));

    res.status(200).json({
      products,
      total,
      page:       Number(page),
      totalPages: Math.ceil(total / Number(limit)),
    });
  } catch (err) {
    console.error("getProducts error:", err);
    res.status(500).json({ message: "Server error.", error: err.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @route   GET /api/admin/products
// @desc    Get ALL products including inactive (admin only)
// @access  Admin
// ─────────────────────────────────────────────────────────────────────────────
const getAllProductsAdmin = async (req, res) => {
  try {
    const { page = 1, limit = 30, sort = "-createdAt" } = req.query;
    const skip  = (Number(page) - 1) * Number(limit);
    const total = await Product.countDocuments();

    const products = await Product.find()
      .sort(sort)
      .skip(skip)
      .limit(Number(limit));

    res.status(200).json({
      products,
      total,
      page:       Number(page),
      totalPages: Math.ceil(total / Number(limit)),
    });
  } catch (err) {
    console.error("getAllProductsAdmin error:", err);
    res.status(500).json({ message: "Server error.", error: err.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @route   GET /api/products/:id
// @desc    Get a single product by ID
// @access  Public
// ─────────────────────────────────────────────────────────────────────────────
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product || !product.isActive) {
      return res.status(404).json({ message: "Product not found." });
    }

    res.status(200).json({ product });
  } catch (err) {
    console.error("getProductById error:", err);
    res.status(500).json({ message: "Server error.", error: err.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @route   GET /api/products/admin/:id
// @desc    Get a single product by ID (admin only, includes inactive)
// @access  Admin
// ─────────────────────────────────────────────────────────────────────────────
const getProductByIdAdmin = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }

    res.status(200).json({ product });
  } catch (err) {
    console.error("getProductByIdAdmin error:", err);
    res.status(500).json({ message: "Server error.", error: err.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @route   PUT /api/admin/products/:id
// @desc    Update a product
// @access  Admin
// ─────────────────────────────────────────────────────────────────────────────
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }

    const {
      name, category, price, description,
      material, care, stock, sizes, colors, isActive,
    } = req.body;

    if (name)        product.name        = name;
    if (category)    product.category    = category;
    if (price)       product.price       = Number(price);
    if (description) product.description = description;
    if (material  !== undefined) product.material = material;
    if (care      !== undefined) product.care     = care;
    if (stock     !== undefined) product.stock    = Number(stock);
    if (isActive  !== undefined) product.isActive = isActive;

    if (sizes) {
      const parsedSizes = typeof sizes === "string" ? JSON.parse(sizes) : sizes;
      product.sizes = parsedSizes;
    }
    if (colors) {
      const parsedColors = typeof colors === "string" ? JSON.parse(colors) : colors;
      product.colors = parsedColors;
    }

    // Upload new images if provided
    if (req.files && req.files.length > 0) {
      const uploads = await Promise.all(
        req.files.map(file => uploadToCloudinary(file.buffer))
      );
      const newImages = uploads.map(result => ({
        url:      result.secure_url,
        publicId: result.public_id,
      }));
      product.images = [...product.images, ...newImages];
    }

    const updated = await product.save();
    res.status(200).json({ message: "Product updated.", product: updated });
  } catch (err) {
    console.error("updateProduct error:", err);
    res.status(500).json({ message: "Server error.", error: err.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @route   DELETE /api/admin/products/:id/images/:publicId
// @desc    Remove one image from a product (also deletes from Cloudinary)
// @access  Admin
// ─────────────────────────────────────────────────────────────────────────────
const deleteProductImage = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }

    // publicId in URL is base64-encoded to avoid slash issues
    const publicId = Buffer.from(req.params.publicId, "base64").toString("utf8");

    product.images = product.images.filter(img => img.publicId !== publicId);
    await product.save();

    await deleteFromCloudinary(publicId);

    res.status(200).json({ message: "Image removed.", product });
  } catch (err) {
    console.error("deleteProductImage error:", err);
    res.status(500).json({ message: "Server error.", error: err.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @route   DELETE /api/admin/products/:id
// @desc    Soft-delete a product (sets isActive = false)
// @access  Admin
// ─────────────────────────────────────────────────────────────────────────────
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }

    product.isActive = false;
    await product.save();

    res.status(200).json({ message: "Product deactivated." });
  } catch (err) {
    console.error("deleteProduct error:", err);
    res.status(500).json({ message: "Server error.", error: err.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @route   DELETE /api/admin/products/:id/permanent
// @desc    Permanently delete product + all its Cloudinary images
// @access  Admin
// ─────────────────────────────────────────────────────────────────────────────
const permanentDeleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }

    // Delete all images from Cloudinary
    if (product.images.length > 0) {
      await Promise.all(product.images.map(img => deleteFromCloudinary(img.publicId)));
    }

    await product.deleteOne();

    res.status(200).json({ message: "Product permanently deleted." });
  } catch (err) {
    console.error("permanentDeleteProduct error:", err);
    res.status(500).json({ message: "Server error.", error: err.message });
  }
};

module.exports = {
  createProduct,
  getProducts,
  getAllProductsAdmin,
  getProductById,
  getProductByIdAdmin,
  updateProduct,
  deleteProductImage,
  deleteProduct,
  permanentDeleteProduct,
};