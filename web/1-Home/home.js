document.addEventListener("DOMContentLoaded", function () {

    
    // Redirect to login if user not logged in
    if (localStorage.getItem("isAdmin") === null) {
        window.location.href = "/BeeMazing-Y1/login.html";
        return;
    }

    // Determine if this user is admin
    const isAdmin = localStorage.getItem("isAdmin") === "true";
    
    const addUserBtn = document.getElementById("addUserBtn");
    if (!isAdmin && addUserBtn) {
        addUserBtn.style.display = "none";
    }

    const addUserModal = document.getElementById("addUserModal");
    const submitUserBtn = document.getElementById("submitUserBtn");
    if (!isAdmin && submitUserBtn) {
        submitUserBtn.disabled = true;
    }

    const usernameInput = document.getElementById("usernameInput");
    const userList = document.getElementById("userList");
    const manageMembersBtn = document.getElementById("manageMembersBtn");
    const manageMembersModal = document.getElementById("manageMembersModal");
    const manageMembersList = document.getElementById("manageMembersList");

    // Determine the base path (mobile or web) based on the current URL
    const isMobile = window.location.pathname.includes("/BeeMazing-Y1/mobile/");
    const basePath = isMobile ? "/BeeMazing-Y1/mobile" : "/web";

    // Load users from localStorage on page load
    const users = JSON.parse(localStorage.getItem("users")) || [];
    renderUsers();

    // Show the modal with a smooth animation when "Add Members" button is clicked
    if (addUserBtn) {
        addUserBtn.addEventListener("click", function () {
            if (isAdmin) {
                addUserModal.classList.add("show");
            }
        });
    }


    // Add user when "Add" button is clicked
    if (submitUserBtn) {
        submitUserBtn.addEventListener("click", function () {
            const username = usernameInput.value.trim();
            const errorMessage = document.getElementById("errorMessage");

            if (username) {
                users.push(username);
                localStorage.setItem("users", JSON.stringify(users));
                renderUsers();
                usernameInput.value = "";
                addUserModal.classList.remove("show");
                errorMessage.style.display = "none";
                // Refresh the manage members modal if it's open
                if (manageMembersModal && manageMembersModal.classList.contains("show")) {
                    renderManageMembers();
                }
            } else {
                errorMessage.textContent = "Please enter a valid user name.";
                errorMessage.style.display = "block";
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
        userList.innerHTML = "";
        users.forEach((username) => {
            const newUserItem = document.createElement("li");
            newUserItem.classList.add("user-list-item");

            // Add user name
            const userNameSpan = document.createElement("span");
            userNameSpan.textContent = username;

            // Make the entire user item clickable
            newUserItem.style.cursor = "pointer";
            newUserItem.addEventListener("click", function () {
                window.location.href = `${basePath}/2-UserProfiles/users.html?user=${encodeURIComponent(username)}`;
            });

            // Append username (no remove button for web version)
            newUserItem.appendChild(userNameSpan);

            // Add remove button only for mobile version
            if (isMobile) {
                const removeBtn = document.createElement("button");
                removeBtn.classList.add("remove-user-btn");
                removeBtn.textContent = "X";
                removeBtn.addEventListener("click", function (event) {
                    event.stopPropagation();
                    showConfirmModal(username);
                });
                
                newUserItem.appendChild(removeBtn);
            }

            userList.appendChild(newUserItem);
        });
    }

    // Function to render users in the manage members modal
    function renderManageMembers() {
        if (!manageMembersList) return; // Skip if not in web version

        manageMembersList.innerHTML = "";
        users.forEach((username, index) => {
            const manageItem = document.createElement("li");
            manageItem.classList.add("manage-members-item");

            // Input field for editing the username
            const input = document.createElement("input");
            input.type = "text";
            input.value = username;
            input.addEventListener("change", function () {
                users[index] = input.value.trim();
                if (users[index] === "") {
                    users.splice(index, 1); // Remove if the name is cleared
                }
                localStorage.setItem("users", JSON.stringify(users));
                renderUsers();
                renderManageMembers();
            });

            // Delete button
            const deleteBtn = document.createElement("button");
            deleteBtn.classList.add("delete-btn");
            deleteBtn.textContent = "Delete";
            deleteBtn.addEventListener("click", function () {
                users.splice(index, 1);
                localStorage.setItem("users", JSON.stringify(users));
                renderUsers();
                renderManageMembers();
            });

            manageItem.appendChild(input);
            manageItem.appendChild(deleteBtn);
            manageMembersList.appendChild(manageItem);
        });

        // Show a message if no users exist
        if (users.length === 0) {
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
        const users = JSON.parse(localStorage.getItem("users")) || [];
        const updated = users.filter(user => user !== userToRemove);
        localStorage.setItem("users", JSON.stringify(updated));
        userToRemove = null;
        document.getElementById("confirmModal").classList.remove("show");
        location.reload(); // Reload to re-render the user list
    }
});

document.getElementById("confirmNoBtn").addEventListener("click", () => {
    userToRemove = null;
    document.getElementById("confirmModal").classList.remove("show");
});


});


