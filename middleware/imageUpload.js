const multer = require("multer");

const storage = multer.memoryStorage();
const upload = multer({ storage });

const imageUploadMiddleware = upload.single("image");

module.exports = imageUploadMiddleware;

// const imageUploadMiddleware = (req, res, next) => {
//   upload.single("image")(req, res, (err) => {
//     if (err) return res.status(400).json({ error: err.message });
//     if (!req.file) return res.status(400).json({ error: "Image is required" });
//     next();
//   });
// };
