async function fetchAdminData() {
  const token = localStorage.getItem("jwtToken");

  if (!token) {
    window.location.href = "/Login.html";
    return;
  }

  try {
    const response = await fetch("/api/Auth/Admin_Only", {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.ok) {
      const data = await response.json();
      console.log("Admin data:", data.message);
      window.location.href = "/Edit.html";
    } else if (response.status === 401) {
      localStorage.removeItem("jwtToken");
      window.location.href = "/Login.html";
    } else if (response.status === 403) {
      alert("You are not an Admin");
    }
  } catch (error) {
    console.error("Admin request failed:", error);
  }
}

function getTokenPayload() {
  const token = localStorage.getItem("jwtToken");
  if (!token) return null;

  try {
    const base64Payload = token.split(".")[1];
    const payload = JSON.parse(atob(base64Payload));
    return payload;
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
}

function getUserRole() {
  const payload = getTokenPayload();
  return payload?.[
    "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
  ];
}

// Usage example to show/hide admin features
function checkAdminAccess() {
  const role = getUserRole();
  if (role === "Admin") {
    document.getElementById("adminSection").style.display = "block";
  } else {
    window.location.href = "/Unauthorized.html";
  }
}

function logout() {
  localStorage.removeItem("jwtToken");
  window.location.href = "/Login.html";
}
