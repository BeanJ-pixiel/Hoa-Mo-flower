import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../api";
import usePageStyle from "../hooks/usePageStyle";
import AuthLayout from "../components/AuthLayout";
import Field from "../components/Field";
import css from "../styles/auth.css?inline";

export default function ForgotPassword() {
  usePageStyle(css, "Quên mật khẩu | Hoa Mơ");
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState({ text: "", type: "" });
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setMsg({ text: "", type: "" });
    try {
      const { ok, data } = await api("/auth/forgot-password", { method: "POST", body: { email: email.trim() } });
      if (ok && data.token) return navigate("/reset-password/" + data.token);
      setMsg({ text: data.message || "Không thể tạo liên kết đặt lại mật khẩu.", type: "error" });
    } catch {
      setMsg({ text: "Không kết nối được tới server.", type: "error" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout
      decor
      eyebrow="KHÔI PHỤC TÀI KHOẢN"
      title={<>Quên mật khẩu<br /><em>không sao đâu!</em></>}
      desc="Nhập email đã đăng ký để chuyển sang bước đặt lại mật khẩu mới."
      visual={
        <>
          <p className="small-title">A LITTLE HELP FROM US</p>
          <h1>Đừng lo lắng,<br />mình cùng thử lại nhé.</h1>
          <p>Gửi điều dịu dàng qua những đóa hoa.</p>
        </>
      }
    >
      <form onSubmit={handleSubmit}>
        <Field label="Email" id="email" type="email" placeholder="ban@email.com"
          value={email} onChange={(e) => setEmail(e.target.value)} />

        <p className={"message " + msg.type}>{msg.text}</p>
        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? "Đang kiểm tra..." : <>Tiếp tục <span>→</span></>}
        </button>
      </form>

      <p className="switch-page">
        Đã nhớ ra mật khẩu? <Link to="/login">Đăng nhập</Link>
      </p>
    </AuthLayout>
  );
}
