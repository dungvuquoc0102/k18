async function refreshAccessToken() {
  const refreshToken = localStorage.getItem("refresh_token");

  try {
    const response = await fetch(
      "https://api.escuelajs.co/api/v1/auth/refresh-token",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      },
    );

    if (!response.ok) {
      // Refresh token cũng hết hạn — yêu cầu đăng nhập lại
      localStorage.clear();
      window.location.href = "/k18/day38/login.html";
      return;
    }

    const { access_token, refresh_token } = await response.json();
    localStorage.setItem("access_token", access_token);
    localStorage.setItem("refresh_token", refresh_token);
  } catch (error) {
    console.log(error);
  }
}

async function getProfile() {
  console.log("getProfile");
  if (!isLoggedIn()) {
    if (window.location.pathname !== "/k18/day38/login.html") {
      window.location.href = "/k18/day38/login.html";
    }
    return;
  }

  const accessToken = localStorage.getItem("access_token");

  const response = await fetch("https://api.escuelajs.co/api/v1/auth/profile", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (response.status === 401) {
    console.log("401");
    try {
      await refreshAccessToken();
    } catch (error) {
      localStorage.clear();
      window.location.href = "/k18/day38/login.html";
      return;
    }
    return getProfile();
  }

  const profile = await response.json();
  return profile;
}

function isLoggedIn() {
  return !!localStorage.getItem("access_token");
}

export default getProfile;
