document.addEventListener("DOMContentLoaded", function () {


    const addUserModal = document.getElementById("inviteUserModal");


    const urlParams = new URLSearchParams(window.location.search);
const adminFromURL = urlParams.get("admin");
if (adminFromURL) {
    localStorage.setItem("currentAdminEmail", adminFromURL);
}


    // Redirect to login if user not logged in
    if (localStorage.getItem("isAdmin") === null) {
        window.location.href = "/BeeMazing-Y1/login.html";
        return;
    }

    // Determine if this user is admin
    const isAdmin = localStorage.getItem("isAdmin") === "true";

    const footer = document.getElementById("footer");
if (!isAdmin && footer) {
    footer.style.display = "none";
}


    const addUserBtn = document.getElementById("addUserBtn");
    if (!isAdmin && addUserBtn) {
        addUserBtn.style.display = "none";
    }


    const userList = document.getElementById("userList");
    const manageMembersBtn = document.getElementById("manageMembersBtn");
    const manageMembersModal = document.getElementById("manageMembersModal");
    const manageMembersList = document.getElementById("manageMembersList");

    // Determine the base path (mobile or web) based on the current URL
    const isMobile = window.location.pathname.includes("/BeeMazing-Y1/mobile/");
    const basePath = isMobile ? "/BeeMazing-Y1/mobile" : "/web";

    // Load users from localStorage on page load
    let currentAdmin = null;

    // Wait until currentAdminEmail is available in localStorage (max 2 sec)
    const waitForAdmin = setInterval(() => {
      const stored = localStorage.getItem("currentAdminEmail");
      if (stored) {
        clearInterval(waitForAdmin);
        currentAdmin = stored;
        fetchUsersFromServer(currentAdmin);
        renderUsers();
      }
    }, 100);
    
    // Stop trying after 2 seconds to avoid infinite loop
    setTimeout(() => clearInterval(waitForAdmin), 2000);
    

    async function fetchUsersFromServer(email) {
        try {
          const res = await fetch(`https://beemazing.onrender.com/get-users?adminEmail=${encodeURIComponent(email)}`);
          const data = await res.json();
      
          if (data.success) {
            const allUserData = JSON.parse(localStorage.getItem("userData")) || {};
            if (!allUserData[email]) {
              allUserData[email] = { users: [], permissions: {} };
            }
      
            allUserData[email].users = data.users || [];
            allUserData[email].permissions = data.permissions || {};
      
            localStorage.setItem("userData", JSON.stringify(allUserData));
            renderUsers(); // Refresh UI
          }
        } catch (err) {
          console.error("❌ Failed to fetch user list from server:", err);
        }
      }
      
      

    // Show the modal with a smooth animation when "Add Members" button is clicked
    if (addUserBtn && isAdmin) {
        addUserBtn.addEventListener("click", () => {
            addUserModal.style.display = "flex";
        });
    }
    

    const sendInviteBtn = document.getElementById("sendInviteBtn");
    if (sendInviteBtn) {
        sendInviteBtn.addEventListener("click", async () => {
            const email = document.getElementById("inviteEmail").value.trim();
            const name = document.getElementById("inviteName").value.trim();
            const tempPassword = document.getElementById("inviteTempPassword").value.trim();
            const currentAdmin = localStorage.getItem("currentAdminEmail");
        
    
            if (!email || !name || !tempPassword) {
                alert("Please fill out all fields.");
                return;
            }
    
            try {
                const allUserData = JSON.parse(localStorage.getItem("userData")) || {};
                if (!allUserData[currentAdmin]) {
                    allUserData[currentAdmin] = { users: [], permissions: {} };
                }
                allUserData[currentAdmin].users.push(name);
                localStorage.setItem("userData", JSON.stringify(allUserData));
    
                const encodedAdmin = encodeURIComponent(currentAdmin);
                const encodedUser = encodeURIComponent(name);
                const inviteLink = `${window.location.origin}/BeeMazing-Y1/mobile/2-UserProfiles/users.html?admin=${encodedAdmin}&user=${encodedUser}`;
                alert(`Invite sent to ${email}!\n\nShare this link with them:\n${inviteLink}`);
    
                addUserModal.style.display = "none"; // reuse variable
            } catch (err) {
                console.error("Error sending invite:", err);
                alert("Something went wrong. Try again.");
            }
        });
    }
    

    // Close modal when clicking outside the modal content
    if (addUserModal) {
        addUserModal.addEventListener("click", function (e) {
            if (e.target === addUserModal) {
                addUserModal.classList.remove("show");
            }
        });
    }

    // Close manage members modal when clicking outside
    if (manageMembersModal) {
        manageMembersModal.addEventListener("click", function (e) {
            if (e.target === manageMembersModal) {
                manageMembersModal.classList.remove("show");
            }
        });
    }

    // Show the manage members modal when "Manage Members" button is clicked
    if (manageMembersBtn) {
        manageMembersBtn.addEventListener("click", function () {
            renderManageMembers();
            manageMembersModal.classList.add("show");
        });
    }

    // Function to render users in the main list
    function renderUsers() {
        const isAdmin = localStorage.getItem("isAdmin") === "true";
        const allUserData = JSON.parse(localStorage.getItem("userData")) || {};
        const users = allUserData[currentAdmin]?.users || [];
        const userPermissions = allUserData[currentAdmin]?.permissions || {};        
        userList.innerHTML = "";
        users.forEach((username) => {
            const newUserItem = document.createElement("li");
            newUserItem.classList.add("user-list-item");
    
            // Container for username and checkmark
            const nameContainer = document.createElement("div");
            nameContainer.style.display = "flex";
            nameContainer.style.alignItems = "center";
            nameContainer.style.gap = "8px";
    
            // Add user name
            const userNameSpan = document.createElement("span");
            userNameSpan.textContent = username;
    
            // Add checkmark if user is an admin
            if (userPermissions[username] === "Admin") {
                const checkmark = document.createElement("span");
                checkmark.textContent = "✓";
                checkmark.style.color = "#00C4B4"; // A nice teal color, you can change this
                checkmark.style.fontSize = "16px";
                checkmark.style.fontWeight = "bold";
                checkmark.title = "Admin";
                nameContainer.appendChild(userNameSpan);
                nameContainer.appendChild(checkmark);
            } else {
                nameContainer.appendChild(userNameSpan);
            }
    
            // Make the entire user item clickable
            newUserItem.style.cursor = "pointer";
            newUserItem.addEventListener("click", function () {
                window.location.href = `${basePath}/2-UserProfiles/users.html?user=${encodeURIComponent(username)}`;
            });
    
            // Append name container
            newUserItem.appendChild(nameContainer);
    
            // Show remove and edit buttons only for mobile AND admin
            if (isMobile && isAdmin) {
                const actionsContainer = document.createElement("div");
                actionsContainer.style.display = "flex";
                actionsContainer.style.gap = "8px";
    
                // Remove button
                const removeBtn = document.createElement("button");
                removeBtn.classList.add("remove-user-btn");
                removeBtn.textContent = "X";
                removeBtn.addEventListener("click", function (event) {
                    event.stopPropagation();
                    showConfirmModal(username);
                });
    
                // Edit button
                const editBtn = document.createElement("button");
                editBtn.classList.add("remove-user-btn"); // reusing style
                editBtn.innerHTML = "⚙️";
                editBtn.style.fontSize = "16px";
                editBtn.addEventListener("click", function (event) {
                    event.stopPropagation();
                    showPermissionModal(username);
                });
    
                actionsContainer.appendChild(editBtn);
                actionsContainer.appendChild(removeBtn);
                newUserItem.appendChild(actionsContainer);
            }
    
            userList.appendChild(newUserItem);
        });
    }
    

    // Function to render users in the manage members modal
    function renderManageMembers() {
        if (!manageMembersList) return; // Skip if not in web version

        manageMembersList.innerHTML = "";
        const updatedUserData = JSON.parse(localStorage.getItem("userData")) || {};
const updatedUsers = updatedUserData[currentAdmin]?.users || [];

updatedUsers.forEach((username, index) => {

            const manageItem = document.createElement("li");
            manageItem.classList.add("manage-members-item");

            // Input field for editing the username
            const input = document.createElement("input");
            input.type = "text";
            input.value = username;
            input.addEventListener("change", function () {
                const newName = input.value.trim();
                if (newName !== "") {
                    updatedUsers[index] = newName;
                } else {
                    updatedUsers.splice(index, 1);
                }
                allUserData[currentAdmin].users = updatedUsers;
                localStorage.setItem("userData", JSON.stringify(allUserData));
                

                renderUsers();
                renderManageMembers();
            });

            // Delete button
            const deleteBtn = document.createElement("button");
            deleteBtn.classList.add("delete-btn");
            deleteBtn.textContent = "Delete";
            deleteBtn.addEventListener("click", function () {
                updatedUsers.splice(index, 1);
                allUserData[currentAdmin].users = updatedUsers;        
                localStorage.setItem("userData", JSON.stringify(allUserData));
                

                renderUsers();
                renderManageMembers();
            });

            manageItem.appendChild(input);
            manageItem.appendChild(deleteBtn);
            manageMembersList.appendChild(manageItem);
        });

        // Show a message if no users exist
        if (updatedUsers.length === 0) {
            manageMembersList.innerHTML = "<p>No members to manage.</p>";
        }        
    }


    let userToRemove = null;

function showConfirmModal(username) {
    userToRemove = username;
    document.getElementById("confirmModal").classList.add("show");
}

document.getElementById("confirmYesBtn").addEventListener("click", () => {
    if (userToRemove) {

const allUserData = JSON.parse(localStorage.getItem("userData")) || {};
let users = allUserData[currentAdmin]?.users || [];
users = users.filter(user => user !== userToRemove);
allUserData[currentAdmin].users = users;
localStorage.setItem("userData", JSON.stringify(allUserData));

        userToRemove = null;
        document.getElementById("confirmModal").classList.remove("show");
        location.reload(); // Reload to re-render the user list
    }
});

document.getElementById("confirmNoBtn").addEventListener("click", () => {
    userToRemove = null;
    document.getElementById("confirmModal").classList.remove("show");
});





const logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
        localStorage.removeItem("isAdmin");
        window.location.href = "/BeeMazing-Y1/login.html";
    });
}



const permissionModal = document.getElementById("permissionModal");
const permissionModalUser = document.getElementById("permissionModalUser");
const permissionSelect = document.getElementById("permissionSelect");
const savePermissionBtn = document.getElementById("savePermissionBtn");

let selectedUserForPermission = null;

function showPermissionModal(username) {
    selectedUserForPermission = username;
    permissionModalUser.textContent = `Permissions for ${username}`;

    const allUserData = JSON.parse(localStorage.getItem("userData")) || {}; // ✅ NOW it's fresh
    const userPermissions = allUserData[currentAdmin]?.permissions || {};
    permissionSelect.value = userPermissions[username] || "User";

    permissionModal.classList.add("show");
}


savePermissionBtn.addEventListener("click", () => {
    const allUserData = JSON.parse(localStorage.getItem("userData")) || {};
    if (!allUserData[currentAdmin].permissions) {
      allUserData[currentAdmin].permissions = {};
    }
    if (selectedUserForPermission) {
      allUserData[currentAdmin].permissions[selectedUserForPermission] = permissionSelect.value;
      localStorage.setItem("userData", JSON.stringify(allUserData));
    }
    permissionModal.classList.remove("show");
  });
  

permissionModal.addEventListener("click", (e) => {
    if (e.target === permissionModal) {
        permissionModal.classList.remove("show");
    }
});




// Show change password button only for logged in admins
const changePasswordBtn = document.getElementById("changePasswordBtn");
if (isAdmin && changePasswordBtn) {
  changePasswordBtn.style.display = "inline-block";

  changePasswordBtn.addEventListener("click", () => {
    document.getElementById("changePasswordModal").classList.add("show");
    document.getElementById("newAdminPassword").value = "";
    document.getElementById("newAdminPassword").focus();
  });
}

// Confirm new password
const confirmChangePasswordBtn = document.getElementById("confirmChangePasswordBtn");
confirmChangePasswordBtn.addEventListener("click", () => {
  const newPassword = document.getElementById("newAdminPassword").value.trim();
  if (newPassword.length < 4) {
    alert("Password must be at least 4 characters.");
    return;
  }
  localStorage.setItem("adminPassword", newPassword);
  alert("Admin password updated!");
  document.getElementById("changePasswordModal").classList.remove("show");
});

// Close modal on outside click
document.getElementById("changePasswordModal").addEventListener("click", (e) => {
  if (e.target.id === "changePasswordModal") {
    document.getElementById("changePasswordModal").classList.remove("show");
  }
});


  
  // Close Invite Modal on outside click
  document.getElementById("inviteUserModal").addEventListener("click", (e) => {
    if (e.target.id === "inviteUserModal") {
      e.target.style.display = "none";
    }
  });
  
 


});


