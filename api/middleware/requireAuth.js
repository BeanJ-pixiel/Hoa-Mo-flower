const jwt = require("jsonwebtoken");
const User = require("../models/user");

// Dùng cho mọi route cần đăng nhập: router.get("/...", requireAuth, handler).
// Thành công thì gắn tài khoản (không có mật khẩu) vào req.user.
module.exports = async function requireAuth(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  if (!token) return res.status(401).json({ message: "Chưa đăng nhập." });

  try {
    const { id } = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(id).select("-password");
  } catch {
    return res.status(401).json({ message: "Phiên đăng nhập không hợp lệ hoặc đã hết hạn." });
  }
  if (!req.user) return res.status(404).json({ message: "Tài khoản không tồn tại." });
  next();
};
