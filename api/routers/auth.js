const router = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const ALLOWED_REGISTER_ROLES = ["customer", "seller"];

function getRole(user) {
  return user.email === process.env.ADMIN_EMAIL ? "admin" : user.role;
}

router.post("/register", async (req, res) => {
  const { fullname, email, phone, password } = req.body;
  const role = req.body.role || "customer";

  if (!fullname || !email || !phone || !password)
    return res.status(400).json({ message: "Vui lòng nhập đầy đủ thông tin." });
  if (password.length < 6)
    return res.status(400).json({ message: "Mật khẩu phải có ít nhất 6 ký tự." });
  if (!ALLOWED_REGISTER_ROLES.includes(role))
    return res.status(400).json({ message: "Vai trò không hợp lệ." });

  if (email.toLowerCase() === process.env.ADMIN_EMAIL)
    return res.status(403).json({ message: "Email này không được phép đăng ký." });

  const existed = await User.findOne({ email: email.toLowerCase() });
  if (existed) return res.status(409).json({ message: "Email này đã được đăng ký." });

  const hashed = await bcrypt.hash(password, 10);
  await User.create({ fullname, email, phone, password: hashed, role });
  res.status(201).json({ message: "Đăng ký thành công!" });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ message: "Vui lòng nhập email và mật khẩu." });

  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) return res.status(404).json({ message: "Email này chưa được đăng ký." });

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.status(401).json({ message: "Mật khẩu không đúng." });

  const role = getRole(user);
  const token = jwt.sign({ id: user._id, role }, process.env.JWT_SECRET, { expiresIn: "7d" });
  res.json({ token, user: { id: user._id, fullname: user.fullname, email: user.email, role } });
});

router.get("/me", async (req, res) => {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return res.status(401).json({ message: "Chưa đăng nhập." });

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.id).select("-password");
    if (!user) return res.status(404).json({ message: "Tài khoản không tồn tại." });

    res.json({
      user: { id: user._id, fullname: user.fullname, email: user.email, role: getRole(user) },
    });
  } catch {
    res.status(401).json({ message: "Phiên đăng nhập không hợp lệ hoặc đã hết hạn." });
  }
});

module.exports = router;