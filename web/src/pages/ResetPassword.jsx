import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { api } from "../api";
import usePageStyle from "../hooks/usePageStyle";
import AuthLayout from "../components/AuthLayout";
import Field from "../components/Field";
import css from "../styles/auth.css?inline";

export default function ResetPassword() {
  usePageStyle(css, "Đặt lại mật khẩu | Hoa Mơ");
  const { token } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ password: "", confirm: "" });
  const [msg, setMsg] = useState({ text: "", type: "" });
  const [done, setDone] = useState(false);

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });
  const show = (text, type = "error") => setMsg({ text, type });

  async function handleSubmit(e) {
    e.preventDefault();
    if (form.password !== form.confirm) return show("Mật khẩu xác nhận không trùng khớp.");
    try {
      const { ok, data } = await api("/auth/reset-password", { method: "POST", body: { token, password: form.password } });
      if (!ok) return show(data.message);
      setDone(true);
      show("Đặt lại mật khẩu thành công! Đang chuyển sang đăng nhập...", "success");
      setTimeout(() => navigate("/login"), 1500);
    } catch {
      show("Không kết nối được tới server.");
    }
  }

  return (
    <AuthLayout
      decor
      eyebrow="ĐẶT LẠI MẬT KHẨU"
      title={<>Tạo mật khẩu<br /><em>mới cho bạn!</em></>}
      desc="Nhập mật khẩu mới (ít nhất 6 ký tự) để tiếp tục mua hoa cùng Hoa Mơ."
      visual={
        <>
          <p className="small-title">A FRESH START</p>
          <h1>Một khởi đầu mới,<br />nhẹ nhàng như cánh hoa.</h1>
          <p>Gửi điều dịu dàng qua những đóa hoa.</p>
        </>
      }
    >
      <form onSubmit={handleSubmit}>
        <Field label="Mật khẩu mới" id="password" type="password" placeholder="Ít nhất 6 ký tự"
          minLength={6} value={form.password} onChange={set("password")} />
        <Field label="Xác nhận mật khẩu mới" id="confirm" type="password" placeholder="Nhập lại mật khẩu mới"
          minLength={6} value={form.confirm} onChange={set("confirm")} />

        <p className={"message " + msg.type}>{msg.text}</p>
        <button type="submit" className="submit-btn" disabled={done}>Đặt lại mật khẩu <span>→</span></button>
      </form>

      <p className="switch-page">
        Quá 10 phút hoặc bị lỗi? <Link to="/forgot-password">Nhập lại email</Link>
      </p>
    </AuthLayout>
  );
}
