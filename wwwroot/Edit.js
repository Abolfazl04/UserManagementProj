function populateTable(data) {
  const tbody = document.getElementById("table-body");
  const loading = document.getElementById("loading");
  tbody.innerHTML = "";
  // Clear loading message
  loading.style.display = "none";

  // Populate table rows
  data.value.forEach((item) => {
    const row = document.createElement("tr");
    row.innerHTML = `
                    <td>${item.id}</td>
                    <td>${item.userName}</td>
                    <td>${item.email}</td>
                    <td>${item.role}</td>
                    <td>${item.emailConfirmed}</td>
                    <td class="action-buttons">
                      <button class="edit-btn" onclick="openEditModal(this)">Edit</button>
                      <button class="delete-btn" onclick="deleteRow(this)">Delete</button>
                    </td>
                `;
    tbody.appendChild(row);
  });
}
async function LoadData() {
  const token = localStorage.getItem("jwtToken");

  const response = await fetch("/api/CRUD/GetAll", {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (response.ok) {
    const data = await response.json();
    console.log("API Response:", data);
    populateTable(data);
  } else if (response.status === 401) {
    localStorage.removeItem("jwtToken");
    window.location.href = "/Login.html";
  } else if (response.status === 403) {
    document.getElementById("loading").innerHTML =
      "I know you are not an admin...";
  }
  const data = await response.json();
  console.log("API Response:", data);
  populateTable(data);
}

function openEditModal(button) {
  const row = button.closest("tr");
  const cells = row.cells;

  // Populate modal fields
  document.getElementById("editId").value = cells[0].textContent;
  document.getElementById("editUserName").value = cells[1].textContent;
  document.getElementById("editEmail").value = cells[2].textContent;
  document.getElementById("editRole").value = cells[3].textContent;
  document.getElementById("editEmailConfirmed").value = cells[4].textContent;

  // Show modal
  document.getElementById("editModal").showModal();
}

function openCreateModal() {
  document.getElementById("AddModal").showModal();
}

async function saveChanges() {
  const userId = document.getElementById("editId").value;

  const userData = {
    userName: document.getElementById("editUserName").value,
    email: document.getElementById("editEmail").value,
    emailConfirmed: document.getElementById("editEmailConfirmed").checked,
    role: document.getElementById("editRole").value,
  };

  try {
    const updatedUser = await updateUser(userId, userData);

    // Update the table row
    const row = document.querySelector(`tr[data-id="${userId}"]`);
    if (row) {
      row.cells[1].textContent = updatedUser.userName;
      row.cells[2].textContent = updatedUser.email;
      row.cells[3].textContent = updatedUser.role;
      row.cells[4].textContent = updatedUser.emailConfirmed ? "Yes" : "No";
    }
  } catch (error) {
    alert(`Update failed: ${error.message}`);
  }
}

function closeModal() {
  document.getElementById("editModal").close();
  document.getElementById("AddModal").close();
}

async function deleteRow(button) {
  const token = localStorage.getItem("jwtToken");

  const row = button.closest("tr");
  const cells = row.cells;
  const userId = cells[0].textContent;
  if (confirm("Are you sure?")) {
    try {
      const response = await fetch(
        `/api/CRUD/Delete/${encodeURIComponent(userId)}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      LoadData();
      if (!response.ok) {
        throw new Error(
          errorData.message || `HTTP error! Status: ${response.status}`
        );
      }

      return JSON.parse(responseText);
    } catch (error) {
      console.error("Update failed:", error);
      throw new Error(error.message || "Failed to update user");
    }
  }
}

async function updateUser(userId, userData) {
  const token = localStorage.getItem("jwtToken");

  try {
    const response = await fetch(
      `/api/CRUD/Edit/${encodeURIComponent(userId)}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(userData),
      }
    );

    const responseText = await response.text(); // Get raw text first
    const errorData = responseText ? JSON.parse(responseText) : {};
    LoadData();
    if (!response.ok) {
      throw new Error(
        errorData.message || `HTTP error! Status: ${response.status}`
      );
    }

    return JSON.parse(responseText);
  } catch (error) {
    console.error("Update failed:", error);
    throw new Error(error.message || "Failed to update user");
  }
}
function BackPage() {
  window.location.href = "/MainMenu.html";
}

// kinda too much so I left it
// async function CreateNewUser() {
//   const email = document.getElementById("AddEmail").value;
//   const password = document.getElementById("AddPassword").checked;
//   const role = document.getElementById("AddRole").value;

//   try {
//     const response = await fetch("/api/Auth/Register", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ email, password, role }),
//     });
//     if (!response.ok) {
//       const errorText = await response.json();
//       if (errorText.errors && errorText.errors.Email) {
//         document.getElementById("UserWarning").innerHTML =
//           errorText.errors.Email[0];
//       } else if (errorText.errors && errorText.errors.Password) {
//         document.getElementById("UserWarning").innerHTML =
//           "Password should be atleast 8 characters";
//       } else {
//         document.getElementById("UserWarning").innerHTML = errorText.message;
//       }
//     }
//   } catch (error) {
//     const errorText = await response.json();
//     console.error("Error:", error);
//     document.getElementById("UserWarning").innerHTML = errorText.message;
//   }
// }

window.onload = LoadData();
