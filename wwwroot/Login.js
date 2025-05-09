async function loginUser() {
  const Email = document.getElementById("UserTB").value;
  const password = document.getElementById("PassTB").value;

  try {
    const response = await fetch("/api/Auth/Login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: Email, password: password }),
    });

    if (response.ok) {
      const data = await response.json(); // Now works correctly
      localStorage.setItem("jwtToken", data.token); // Extract token property
      window.location.href = "/MainMenu.html";
    } else {
      const errorText = await response.json();
      if (errorText.errors && errorText.errors.Email) {
        document.getElementById("UserWarning").innerHTML =
          errorText.errors.Email[0];
      } else if (errorText.errors && errorText.errors.Password) {
        document.getElementById("UserWarning").innerHTML =
          "Invalid Email or Password";
      } else {
        document.getElementById("UserWarning").innerHTML = errorText.message;
      }
    }
  } catch (error) {
    console.error("Login error:", error);
    alert("An error occurred during login.");
  }
}

async function fetchAdminData() {
  const token = localStorage.getItem("jwtToken");

  if (!token) {
    window.location.href = "/Login.html";
    return;
  }

  try {
    const response = await fetch("/api/Admin_Only", {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.ok) {
      const data = await response.json();
      console.log("Admin data:", data);
      // Handle admin data here
    } else if (response.status === 401) {
      localStorage.removeItem("jwtToken");
      window.location.href = "/Login.html";
    }
  } catch (error) {
    console.error("Admin request failed:", error);
  }
}

const togglePassword = document.getElementById("PassToggle");
const passwordInput = document.getElementById("PassTB");

togglePassword.addEventListener("click", function () {
  // Toggle the input type
  const type =
    passwordInput.getAttribute("type") === "password" ? "text" : "password";
  passwordInput.setAttribute("type", type);

  if (passwordInput.getAttribute("type") === "password") {
    // When password is hidden, show eye
    this.src = "CloseEyeIcon.png";
  } else {
    // When password is visible, show eye-slash
    this.src = "EyeIcon.png";
  }
  // Optional: you can also change the icon (for example to an "eye-slash" icon)
});
