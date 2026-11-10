import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import usePageStyle from "../hooks/usePageStyle";
import css from "../styles/home.css?inline";

const categories = [
  { img: "hoa-tinh-yeu.jpg", title: "Hoa tình yêu", desc: "20/10, 8/3, kỷ niệm ngày cưới, Valentine" },
  { img: "hoa-sinh-nhat.jpg", title: "Hoa sinh nhật", desc: "Dành tặng mẹ, người yêu và bạn bè" },
  { img: "hoa-chuc-mung.jpg", title: "Hoa chúc mừng", desc: "Lưu giữ những khoảnh khắc đáng nhớ" },
  { img: "hoa-thiet-ke.jpg", title: "Hoa thiết kế", desc: "Thiết kế riêng theo mong muốn của bạn" },
];

const products = [
  { img: "hoa-hong.jpg", alt: "Bó hoa hồng hồng", color: "pink", label: "Bán chạy", type: "HOA HỒNG", name: "Bó hồng yêu thương", price: "350.000đ" },
  { img: "hoa-tulip.jpg", alt: "Bó hoa tulip", color: "cream", label: "Được yêu thích", type: "HOA TULIP", name: "Bó tulip dịu dàng", price: "420.000đ" },
  { img: "hoa-mong-mo.jpg", alt: "Bó hoa hỗn hợp", color: "lavender", label: "Gợi ý cho bạn", type: "HOA HỖN HỢP", name: "Bó hoa mộng mơ", price: "390.000đ" },
];

export default function Home() {
  usePageStyle(css, "Hoa Mơ | Tiệm hoa dịu dàng");
  const { user, logout } = useAuth();
  const [message, setMessage] = useState("");

  function handleDetail(product) {
    setMessage(
      "Bạn đang quan tâm đến: " + product.name + ". Chức năng xem chi tiết sẽ được bổ sung sau."
    );
    document.getElementById("homeMessage")?.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  return (
    <>
      <header className="site-header">
        <Link to="/" className="logo">✿ Hoa Mơ</Link>

        <nav className="main-nav">
          <Link to="/" className="active">Trang chủ</Link>
          <a href="#products">Sản phẩm</a>
          <a href="#about">Về Hoa Mơ</a>
          <a href="#contact">Liên hệ</a>
        </nav>

        <div className="header-actions" id="headerActions">
          {user ? (
            <>
              <span className="user-greeting">Xin chào, {user.fullname}</span>
              <button type="button" className="logout-btn" onClick={logout}>Đăng xuất</button>
            </>
          ) : (
            <>
              <Link to="/login" className="login-link">Đăng nhập</Link>
              <Link to="/register" className="register-link">Đăng ký</Link>
            </>
          )}
        </div>
      </header>

      <main>
        <section className="hero">
          <div className="hero-content">
            <p className="eyebrow">A LITTLE FLOWER, A LITTLE JOY</p>
            <h1>Mỗi đóa hoa<br />là một lời <em>yêu thương.</em></h1>
            <p className="hero-description">
              Những bó hoa xinh xắn được gửi gắm bằng cả sự dịu dàng, dành riêng
              cho những khoảnh khắc đáng nhớ của bạn.
            </p>
            <a href="#products" className="primary-btn">Khám phá hoa <span>→</span></a>
          </div>

          <div className="hero-image">
            <img src="/images/hoa-banner.jpg" alt="Bó hoa tươi Hoa Mơ" className="hero-flower" />
            <span className="flower-decoration decoration-one">✿</span>
            <span className="flower-decoration decoration-two">♡</span>
            <p className="image-caption">Gửi một chút dịu dàng đến người thương</p>
          </div>
        </section>

        <section className="categories">
          <div className="section-heading">
            <p className="eyebrow">CHỌN THEO CẢM XÚC</p>
            <h2>Hoa dành cho <em>mọi dịp</em></h2>
          </div>

          <div className="category-list">
            {categories.map((c) => (
              <a href="#products" className="category-card" key={c.img}>
                <img src={"/images/" + c.img} alt={c.title} />
                <h3>{c.title}</h3>
                <p>{c.desc}</p>
              </a>
            ))}
          </div>
        </section>

        <section className="products" id="products">
          <div className="section-heading">
            <p className="eyebrow">ĐƯỢC YÊU THÍCH NHẤT</p>
            <h2>Những đóa hoa <em>nổi bật</em></h2>
            <p>Gợi ý nhỏ cho những điều bạn muốn nói.</p>
          </div>

          <div className="product-list">
            {products.map((p) => (
              <article className="product-card" key={p.name}>
                <div className={"product-image " + p.color}>
                  <img src={"/images/" + p.img} alt={p.alt} />
                  <span className="product-label">{p.label}</span>
                </div>
                <div className="product-info">
                  <p className="product-type">{p.type}</p>
                  <h3>{p.name}</h3>
                  <p className="price">{p.price}</p>
                  <button className="detail-btn" type="button" onClick={() => handleDetail(p)}>
                    Xem sản phẩm
                  </button>
                </div>
              </article>
            ))}
          </div>
          <p id="homeMessage" className="home-message">{message}</p>
        </section>

        <section className="about" id="about">
          <img src="/images/hoa-banner.jpg" alt="Bó hoa tươi Hoa Mơ" className="hero-flower" />
          <div>
            <p className="eyebrow">ĐÔI ĐIỀU VỀ HOA MƠ</p>
            <h2>Trao hoa nhỏ,<br /><em>gửi yêu thương lớn.</em></h2>
            <p>
              Hoa Mơ mong muốn giúp bạn tìm được món quà phù hợp để gửi lời chúc,
              lời cảm ơn và những tình cảm chân thành đến người mình yêu quý.
            </p>
          </div>
        </section>
      </main>

      <footer className="site-footer" id="contact">
        <Link to="/" className="logo">✿ Hoa Mơ</Link>
        <p>Một bó hoa nhỏ, một niềm vui thật to.</p>
        <p>© 2026 Hoa Mơ · Gửi điều dịu dàng qua những đóa hoa.</p>
      </footer>
    </>
  );
}
