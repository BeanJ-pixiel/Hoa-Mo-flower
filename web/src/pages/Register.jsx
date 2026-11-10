import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../api";
import usePageStyle from "../hooks/usePageStyle";
import AuthLayout from "../components/AuthLayout";
import Field from "../components/Field";
import css from "../styles/auth.css?inline";

// [tên field, nhãn, type, placeholder, minLength]
const fields = [
  ["fullname", "Họ và tên", "text", "Nhập họ và tên"],
  ["email", "Email", "email", "ban@email.com"],
  ["phone", "Số điện thoại", "tel", "Nhập số điện thoại"],
  ["password", "Mật khẩu", "password", "Ít nhất 6 ký tự", 6],
  ["confirmPassword", "Xác nhận mật khẩu", "password", "Nhập lại mật khẩu"],
];
const roles = ["customer", "seller"];

export default function Register() {
  usePageStyle(css, "Đăng ký | Hoa Mơ");
  const navigate = useNavigate();

  const [form, setForm] = useState({ fullname: "", email: "", phone: "", password: "", confirmPassword: "", role: "" });
  const [msg, setMsg] = useState({ text: "", type: "" });

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });
  const show = (text, type = "error") => setMsg({ text, type });

  // Các ô trống, mật khẩu < 6 ký tự, vai trò, điều khoản đã được trình duyệt chặn (required, minLength).
  async function handleSubmit(e) {
    e.preventDefault();
    const { confirmPassword, ...body } = form;
    body.fullname = body.fullname.trim();
    body.email = body.email.trim();
    body.phone = body.phone.trim();

    if (!body.fullname) return show("Bạn vui lòng nhập đầy đủ thông tin.");
    if (body.password !== confirmPassword) return show("Mật khẩu xác nhận không trùng khớp.");
    if (!/^[0-9]{9,11}$/.test(body.phone)) return show("Số điện thoại cần có từ 9 đến 11 chữ số.");

    try {
      const { ok, data } = await api("/auth/register", { method: "POST", body });
      if (!ok) return show(data.message);
      show("Đăng ký thành công! Đang chuyển sang đăng nhập...", "success");
      setTimeout(() => navigate("/login"), 1200);
    } catch {
      show("Không kết nối được tới server.");
    }
  }

  return (
    <AuthLayout
      className="register"
      eyebrow="CHÀO BẠN ĐẾN VỚI HOA MƠ"
      title={<>Tạo tài khoản<br /><em>mới nhé!</em></>}
      desc="Chỉ vài bước nhỏ để bắt đầu hành trình trao gửi yêu thương."
      visual={
        <>
          <p className="eyebrow">A LITTLE GIFT OF LOVE</p>
          <h1>Bắt đầu từ<br />một điều dịu dàng.</h1>
          <p>Tạo tài khoản để khám phá thế giới hoa tươi.</p>
        </>
      }
    >
      <form onSubmit={handleSubmit}>
        {fields.map(([id, label, type, placeholder, minLength]) => (
          <Field key={id} {...{ id, label, type, placeholder, minLength }} value={form[id]} onChange={set(id)} />
        ))}

        <div className="role-group">
          {roles.map((r) => (
            <label className="role-option" key={r}>
              <input type="radio" name="role" value={r} required checked={form.role === r} onChange={set("role")} />
              <span>{r[0].toUpperCase() + r.slice(1)}</span>
            </label>
          ))}
        </div>

        <label className="terms">
          <input type="checkbox" required />
          <span> Tôi đồng ý với các điều khoản sử dụng của Hoa Mơ. </span>
        </label>

        <p className={"message " + msg.type}>{msg.text}</p>
        <button type="submit" className="submit-btn">Tạo tài khoản <span>→</span></button>
      </form>

      <p className="switch-page">
        Bạn đã có tài khoản? <Link to="/login">Đăng nhập</Link>
      </p>
    </AuthLayout>
  );
}
