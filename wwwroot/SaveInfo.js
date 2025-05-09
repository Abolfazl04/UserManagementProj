window.saveLogin = async function () {
  const email = document.getElementById("UserTB").value;
  const password = document.getElementById("PassTB").value;

  try {
    const response = await fetch("/api/Auth/Register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorText = await response.json();
      if (errorText.errors && errorText.errors.Email) {
        document.getElementById("UserWarning").innerHTML =
          errorText.errors.Email[0];
      } else if (errorText.errors && errorText.errors.Password) {
        document.getElementById("UserWarning").innerHTML =
          "Password should be atleast 8 characters";
      } else {
        document.getElementById("UserWarning").innerHTML = errorText.message;
      }
    }

    // Success case
    const responseData = await response.json();
    console.log("Success:", responseData.message);
    document.getElementById("UserWarning").innerHTML = responseData.message;
    localStorage.setItem("jwtToken", responseData.token);
    window.location.href = "/MainMenu.html";
  } catch (error) {
    console.error("Error:", error);
    document.getElementById("UserWarning").innerHTML = responseData.message;
  }
};

// Password toggle logic should run immediately
document.addEventListener("DOMContentLoaded", () => {
  const togglePassword = document.getElementById("PassToggle");
  const passwordInput = document.getElementById("PassTB");

  togglePassword.addEventListener("click", function () {
    const type =
      passwordInput.getAttribute("type") === "password" ? "text" : "password";
    passwordInput.setAttribute("type", type);
    this.src = type === "password" ? "CloseEyeIcon.png" : "EyeIcon.png";
  });
});
