import { Link } from "react-router-dom";

// Khung chung của trang Đăng nhập / Đăng ký: cột ảnh bên trái + tiêu đề, footer bên phải.
export default function AuthLayout({ className = "", decor, visual, eyebrow, title, desc, children }) {
  return (
    <main className={"auth-page " + className}>
      <section className="auth-visual">
        <Link to="/" className="brand">✿ Hoa Mơ</Link>
        <img src="/images/hoa-banner.jpg" alt="Bó hoa tươi Hoa Mơ" className="hero-flower" />
        <div className="visual-text">{visual}</div>
        {decor && (
          <>
            <span className="decor decor-one">✿</span>
            <span className="decor decor-two">♡</span>
          </>
        )}
      </section>

      <section className="auth-content">
        <div className="auth-form-wrap">
          <Link to="/" className="back-link">← Về trang chủ</Link>
          <p className="eyebrow">{eyebrow}</p>
          <h2>{title}</h2>
          <p className="description">{desc}</p>
          {children}
          <footer>© 2026 Hoa Mơ · Gửi điều dịu dàng qua những đóa hoa.</footer>
        </div>
      </section>
    </main>
  );
}
