const API_URL = "http://localhost:3000/api"; // địa chỉ server API (thư mục api/)

const loginForm = document.getElementById("loginForm");
const passwordInput = document.getElementById("password");
const togglePassword = document.getElementById("togglePassword");
const message = document.getElementById("message");
const forgotPassword = document.getElementById("forgotPassword");

// Hiện hoặc ẩn mật khẩu
togglePassword.addEventListener("click", function () {
  if (passwordInput.type === "password") {
    passwordInput.type = "text";
    togglePassword.textContent = "Ẩn";
  } else {
    passwordInput.type = "password";
    togglePassword.textContent = "Hiện";
  }
});

// Kiểm tra dữ liệu rồi gọi API đăng nhập
loginForm.addEventListener("submit", async function (event) {
  event.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = passwordInput.value;

  message.className = "message";

  if (!email || !password) {
    message.textContent = "Bạn vui lòng nhập đầy đủ email và mật khẩu.";
    message.classList.add("error");
    return;
  }

  if (password.length < 6) {
    message.textContent = "Mật khẩu cần có ít nhất 6 ký tự.";
    message.classList.add("error");
    return;
  }

  try {
    const res = await fetch(API_URL + "/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) {
      message.textContent = data.message;
      message.classList.add("error");
      return;
    }
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    window.location.href = "index.html";
  } catch {
    message.textContent = "Không kết nối được tới server.";
    message.classList.add("error");
  }
});