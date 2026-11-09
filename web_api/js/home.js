const API_URL = "http://localhost:3000/api";
const headerActions = document.getElementById("headerActions");
const detailButtons = document.querySelectorAll(".detail-btn");
const homeMessage = document.getElementById("homeMessage");

detailButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    const productCard = button.closest(".product-card");
    const productName = productCard.querySelector("h3").textContent;

    homeMessage.textContent =
      "Bạn đang quan tâm đến: " +
      productName +
      ". Chức năng xem chi tiết sẽ được bổ sung sau.";

    homeMessage.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  });
});

function showLoggedIn(user) {
  headerActions.innerHTML = "";
  const greeting = document.createElement("span");
  greeting.className = "user-greeting";
  greeting.textContent = "Xin chào, " + user.fullname;

  const logoutBtn = document.createElement("button");
  logoutBtn.type = "button";
  logoutBtn.className = "logout-btn";
  logoutBtn.textContent = "Đăng xuất";
  logoutBtn.addEventListener("click", function () {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.reload();
  });
  headerActions.append(greeting, logoutBtn);
}

async function checkLogin() {
  const token = localStorage.getItem("token");
  if (!token) return;
  try {
    const saved = JSON.parse(localStorage.getItem("user"));
    if (saved) showLoggedIn(saved);
  } catch {}

  try {
    const res = await fetch(API_URL + "/auth/me", {
      headers: { Authorization: "Bearer " + token },
    });
    if (res.ok) {
      const data = await res.json();
      localStorage.setItem("user", JSON.stringify(data.user));
      showLoggedIn(data.user);
    } else {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.reload();
    }
  } catch {}
}
checkLogin();
