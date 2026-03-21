import getProfile from "./getProfile.js";

async function login(email, password) {
  const response = await fetch("https://api.escuelajs.co/api/v1/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    throw new Error("Sai email hoặc mật khẩu");
  }

  const { access_token, refresh_token } = await response.json();

  // Lưu token vào localStorage
  localStorage.setItem("access_token", access_token);
  localStorage.setItem("refresh_token", refresh_token);

  return access_token;
}

const formEl = document.querySelector("#login-form");
formEl.addEventListener("submit", async function (e) {
  e.preventDefault();

  const data = new FormData(this);
  const email = data.get("email");
  const password = data.get("password");

  try {
    await login(email, password);
    location.href = "/k18/day38/index.html";
  } catch (error) {
    console.log(error);
  }
});

(async () => {
  const profile = await getProfile();

  if (profile) {
    location.href = "/k18/day38/index.html";
  }
})();
