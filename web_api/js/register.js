const API_URL = "http://localhost:3000/api"; // địa chỉ server API (thư mục api/)

const registerForm = document.getElementById("registerForm");
const registerMessage = document.getElementById("registerMessage");

registerForm.addEventListener("submit", async function (event) {
  event.preventDefault();

  const fullname = document.getElementById("fullname").value.trim();
  const email = document.getElementById("email").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;
  const roleCustomer = document.getElementById("roleCustomer").checked;
  const roleSeller = document.getElementById("roleSeller").checked;
  const agreeTerms = document.getElementById("agreeTerms").checked;

  registerMessage.className = "message";

  if (!fullname || !email || !phone || !password || !confirmPassword) {
    showMessage("Bạn vui lòng nhập đầy đủ thông tin.", "error");
    return;
  }

  if (password.length < 6) {
    showMessage("Mật khẩu phải có ít nhất 6 ký tự.", "error");
    return;
  }

  if (password !== confirmPassword) {
    showMessage("Mật khẩu xác nhận không trùng khớp.", "error");
    return;
  }

  if (!/^[0-9]{9,11}$/.test(phone)) {
    showMessage("Số điện thoại cần có từ 9 đến 11 chữ số.", "error");
    return;
  }

  if (!agreeTerms) {
    showMessage("Bạn cần đồng ý với điều khoản sử dụng.", "error");
    return;
  }

  if (!roleCustomer && !roleSeller) {
    showMessage("Bạn cần chọn vai trò đăng ký.", "error");
    return;
  }

  // Gọi API đăng ký
  const role = roleSeller ? "seller" : "customer";
  try {
    const res = await fetch(API_URL + "/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fullname, email, phone, password, role }),
    });
    const data = await res.json();
    if (!res.ok) return showMessage(data.message, "error");

    showMessage("Đăng ký thành công! Đang chuyển sang đăng nhập...", "success");
    setTimeout(() => (window.location.href = "login.html"), 1200);
  } catch {
    showMessage("Không kết nối được tới server.", "error");
  }
});

function showMessage(message, type) {
  registerMessage.textContent = message;
  registerMessage.className = "message " + type;
}