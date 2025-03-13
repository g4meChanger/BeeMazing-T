document.addEventListener("DOMContentLoaded", function () {
    const addUserBtn = document.getElementById("addUserBtn");
    const addUserModal = document.getElementById("addUserModal");
    const submitUserBtn = document.getElementById("submitUserBtn");
    const usernameInput = document.getElementById("usernameInput");
    const userList = document.getElementById("userList");

    // Load users from localStorage on page load
    const users = JSON.parse(localStorage.getItem("users")) || [];
    renderUsers();

    // Show the modal and disable the + button
    addUserBtn.addEventListener("click", function () {
        addUserModal.classList.add("show");
        addUserBtn.classList.add("disabled");
    });

    // Add user when "Add" button is clicked
    submitUserBtn.addEventListener("click", function () {
        const username = usernameInput.value.trim();
        if (username) {
            users.push(username);
            localStorage.setItem("users", JSON.stringify(users));
            renderUsers();
            usernameInput.value = "";
            addUserModal.classList.remove("show");
            addUserBtn.classList.remove("disabled");
        } else {
            alert("Please enter a valid user name.");
        }
    });

    // Close modal when clicking outside and re-enable + button
    addUserModal.addEventListener("click", function (e) {
        if (e.target === addUserModal) {
            addUserModal.classList.remove("show");
            addUserBtn.classList.remove("disabled");
        }
    });

    // Function to render users from localStorage
    function renderUsers() {
        userList.innerHTML = ""; // Clear current list
        users.forEach((username) => {
            const newUserItem = document.createElement("li");
            newUserItem.classList.add("user-list-item");

            // Add user name
            const userNameSpan = document.createElement("span");
            userNameSpan.textContent = username;

            // Make the entire user item clickable
            newUserItem.style.cursor = "pointer";
            newUserItem.addEventListener("click", function () {
                window.location.href = `/BeeMazing-Y1/2-UserProfiles/users.html?user=${encodeURIComponent(username)}`;
            });

            // Add remove button
            const removeBtn = document.createElement("button");
            removeBtn.classList.add("remove-user-btn");
            removeBtn.textContent = "X";

            // Prevent remove button from triggering the profile view
            removeBtn.addEventListener("click", function (event) {
                event.stopPropagation();
                showConfirmationDialog(username, newUserItem);
            });

            // Append username and remove button
            newUserItem.appendChild(userNameSpan);
            newUserItem.appendChild(removeBtn);
            userList.appendChild(newUserItem);
        });

        // Scroll to the bottom of the list after adding a new user
        userList.scrollTop = userList.scrollHeight;
    }

    // Function to show confirmation dialog
    function showConfirmationDialog(username, userItem) {
        const confirmationModal = document.createElement("div");
        confirmationModal.style.position = "fixed";
        confirmationModal.style.top = "0";
        confirmationModal.style.left = "0";
        confirmationModal.style.width = "100%";
        confirmationModal.style.height = "100%";
        confirmationModal.style.display = "flex";
        confirmationModal.style.justifyContent = "center";
        confirmationModal.style.alignItems = "center";
        confirmationModal.style.background = "rgba(0, 0, 0, 0.5)";

        const modalContent = document.createElement("div");
        modalContent.style.background = "white";
        modalContent.style.padding = "20px";
        modalContent.style.borderRadius = "8px";
        modalContent.style.textAlign = "center";
        modalContent.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.2)";
        modalContent.innerHTML = `
            <p>Are you sure you want to delete user "${username}"?</p>
            <button id="confirmYes" style="
                background-color: black; 
                color: white; 
                border: none; 
                padding: 10px 20px; 
                font-size: 16px; 
                border-radius: 5px; 
                cursor: pointer; 
                margin: 10px;">
                Yes
            </button>
            <button id="confirmNo" style="
                background-color: white; 
                color: black; 
                border: 2px solid black; 
                padding: 10px 20px; 
                font-size: 16px; 
                border-radius: 5px; 
                cursor: pointer; 
                margin: 10px;">
                No
            </button>
        `;

        confirmationModal.appendChild(modalContent);
        document.body.appendChild(confirmationModal);

        modalContent.querySelector("#confirmYes").addEventListener("click", function () {
            const userIndex = users.indexOf(username);
            if (userIndex !== -1) {
                users.splice(userIndex, 1);
                localStorage.setItem("users", JSON.stringify(users));
            }
            userList.removeChild(userItem);
            document.body.removeChild(confirmationModal);
            addUserBtn.classList.remove("disabled");
        });

        modalContent.querySelector("#confirmNo").addEventListener("click", function () {
            document.body.removeChild(confirmationModal);
            addUserBtn.classList.remove("disabled");
        });
    }
});
