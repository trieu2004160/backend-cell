const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const router = express.Router();

// Tạo thư mục uploads nếu chưa có
const uploadDir = path.join(__dirname, "../../uploads/variants");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Cấu hình multer cho upload file
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Tạo tên file unique với timestamp
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `variant-${uniqueSuffix}${ext}`);
  },
});

// Kiểm tra file upload
const fileFilter = (req, file, cb) => {
  // Chỉ cho phép upload ảnh
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Chỉ được upload file ảnh!"), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // Giới hạn 5MB
  },
});

// API upload ảnh
router.post("/upload", upload.single("file"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        status: "error",
        message: "Không có file được upload",
      });
    }

    // Tạo URL đầy đủ cho ảnh
    const imageUrl = `${req.protocol}://${req.get("host")}/uploads/variants/${
      req.file.filename
    }`;

    res.json({
      status: "success",
      message: "Upload ảnh thành công",
      data: {
        filename: req.file.filename,
        originalname: req.file.originalname,
        url: imageUrl,
        size: req.file.size,
      },
    });
  } catch (error) {
    console.error("Error uploading file:", error);
    res.status(500).json({
      status: "error",
      message: "Lỗi server khi upload ảnh",
    });
  }
});

// API xóa ảnh
router.delete("/upload/:filename", (req, res) => {
  try {
    const { filename } = req.params;
    const filePath = path.join(uploadDir, filename);

    // Kiểm tra file có tồn tại không
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        status: "error",
        message: "File không tồn tại",
      });
    }

    // Xóa file
    fs.unlinkSync(filePath);

    res.json({
      status: "success",
      message: "Xóa ảnh thành công",
    });
  } catch (error) {
    console.error("Error deleting file:", error);
    res.status(500).json({
      status: "error",
      message: "Lỗi server khi xóa ảnh",
    });
  }
});

// Serve static files cho ảnh
router.use("/uploads", express.static(path.join(__dirname, "../../uploads")));

module.exports = router;
