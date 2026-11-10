const router = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const requireAuth = require("../middleware/requireAuth");

const ALLOWED_REGISTER_ROLES = ["customer", "seller"];

const getRole = (user) => (user.email === process.env.ADMIN_EMAIL ? "admin" : user.role);
const publicUser = (u) => ({ id: u._id, fullname: u.fullname, email: u.email, role: getRole(u) });
const fail = (res, status, message) => res.status(status).json({ message });

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

router.get("/me", requireAuth, (req, res) => res.json({ user: publicUser(req.user) }));

module.exports = router;
