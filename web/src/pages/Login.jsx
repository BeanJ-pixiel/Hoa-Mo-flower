import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../api";
import { useAuth } from "../context/AuthContext";
import usePageStyle from "../hooks/usePageStyle";
import AuthLayout from "../components/AuthLayout";
import Field from "../components/Field";
import css from "../styles/auth.css?inline";

export default function Login() {
  usePageStyle(css, "Đăng nhập | Hoa Mơ");
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");

  // Trình duyệt đã chặn ô trống / mật khẩu < 6 ký tự (required, minLength) nên không cần kiểm tra lại ở đây.
  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("");
    try {
      const { ok, data } = await api("/auth/login", { method: "POST", body: { email: email.trim(), password } });
      if (!ok) return setMessage(data.message);
      login(data.token, data.user);
      navigate("/");
    } catch {
      setMessage("Không kết nối được tới server.");
    }
  }

  return (
    <AuthLayout
      decor
      eyebrow="CHÀO MỪNG BẠN QUAY LẠI"
      title={<>Chào mừng<br /><em>bạn trở lại!</em></>}
      desc="Đăng nhập để tiếp tục khám phá những đóa hoa xinh nhé."
      visual={
        <>
          <p className="small-title">A LITTLE FLOWER, A LITTLE JOY</p>
          <h1>Một bó hoa nhỏ,<br />một niềm vui thật to.</h1>
          <p>Gửi điều dịu dàng qua những đóa hoa.</p>
        </>
      }
    >
      <form onSubmit={handleSubmit}>
        <Field label="Email" id="email" type="email" placeholder="ban@email.com"
          value={email} onChange={(e) => setEmail(e.target.value)} />

        <Field label="Mật khẩu" id="password">
          <div className="password-wrap">
            <input type={showPassword ? "text" : "password"} id="password" placeholder="Nhập mật khẩu"
              required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} />
            <button type="button" className="show-password" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? "Ẩn" : "Hiện"}
            </button>
          </div>
        </Field>

        <div className="forgot-row">
          <Link to="/forgot-password">Quên mật khẩu?</Link>
        </div>

        <p className="message error">{message}</p>
        <button type="submit" className="submit-btn">Đăng nhập <span>→</span></button>
      </form>

      <p className="switch-page">
        Bạn chưa có tài khoản? <Link to="/register">Đăng ký ngay</Link>
      </p>
    </AuthLayout>
  );
}
