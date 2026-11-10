const router = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const User = require("../models/user");
const requireAuth = require("../middleware/requireAuth");

const ALLOWED_REGISTER_ROLES = ["customer", "seller"];
const RESET_MINUTES = 10;

const getRole = (user) => (user.email === process.env.ADMIN_EMAIL ? "admin" : user.role);
const publicUser = (u) => ({ id: u._id, fullname: u.fullname, email: u.email, role: getRole(u) });
const fail = (res, status, message) => res.status(status).json({ message });
const sha256 = (value) => crypto.createHash("sha256").update(value).digest("hex");

router.post("/register", async (req, res) => {
  const { fullname, email, phone, password } = req.body;
  const role = req.body.role || "customer";

  if (!fullname || !email || !phone || !password) return fail(res, 400, "Vui lòng nhập đầy đủ thông tin.");
  if (password.length < 6) return fail(res, 400, "Mật khẩu phải có ít nhất 6 ký tự.");
  if (!ALLOWED_REGISTER_ROLES.includes(role)) return fail(res, 400, "Vai trò không hợp lệ.");
  if (email.toLowerCase() === process.env.ADMIN_EMAIL) return fail(res, 403, "Email này không được phép đăng ký.");
  if (await User.findOne({ email: email.toLowerCase() })) return fail(res, 409, "Email này đã được đăng ký.");

  await User.create({ fullname, email, phone, password: await bcrypt.hash(password, 10), role });
  res.status(201).json({ message: "Đăng ký thành công!" });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return fail(res, 400, "Vui lòng nhập email và mật khẩu.");

  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) return fail(res, 404, "Email này chưa được đăng ký.");
  if (!(await bcrypt.compare(password, user.password))) return fail(res, 401, "Mật khẩu không đúng.");

  const info = publicUser(user);
  const token = jwt.sign({ id: user._id, role: info.role }, process.env.JWT_SECRET, { expiresIn: "7d" });
  res.json({ token, user: info });
});

router.post("/forgot-password", async (req, res) => {
  const email = (req.body.email || "").trim().toLowerCase();
  if (!email) return fail(res, 400, "Vui lòng nhập email.");

  const user = await User.findOne({ email });
  if (!user) return fail(res, 404, "Email này chưa được đăng ký.");
  if (getRole(user) === "admin") return fail(res, 403, "Tài khoản quản trị không thể đặt lại mật khẩu tại đây.");

  const token = crypto.randomBytes(32).toString("hex");
  user.resetToken = sha256(token); // DB chỉ lưu bản băm của mã
  user.resetExpires = Date.now() + RESET_MINUTES * 60 * 1000;
  await user.save();
  res.json({ token });
});

router.post("/reset-password", async (req, res) => {
  const { token, password } = req.body;
  if (!token || !password) return fail(res, 400, "Thiếu thông tin đặt lại mật khẩu.");
  if (password.length < 6) return fail(res, 400, "Mật khẩu phải có ít nhất 6 ký tự.");

  const user = await User.findOne({ resetToken: sha256(token), resetExpires: { $gt: Date.now() } });
  if (!user) return fail(res, 400, "Phiên đặt lại mật khẩu đã hết hạn. Vui lòng nhập lại email.");

  user.password = await bcrypt.hash(password, 10);
  user.resetToken = user.resetExpires = undefined; // mỗi mã chỉ dùng được một lần
  await user.save();
  res.json({ message: "Đặt lại mật khẩu thành công!" });
});

router.get("/me", requireAuth, (req, res) => res.json({ user: publicUser(req.user) }));

module.exports = router;
