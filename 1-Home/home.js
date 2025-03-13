document.addEventListener("DOMContentLoaded", function () {
    const addUserBtn = document.getElementById("addUserBtn");
    const addUserModal = document.getElementById("addUserModal");
    const submitUserBtn = document.getElementById("submitUserBtn");
    const usernameInput = document.getElementById("usernameInput");
    const userList = document.getElementById("userList");

    // Load users from localStorage on page load
    const users = JSON.parse(localStorage.getItem("users")) || [];
    renderUsers();

    // Show the modal with a smooth animation when "+" button is clicked
    addUserBtn.addEventListener("click", function () {
        addUserModal.classList.add("show"); // Add 'show' class for animation
    });

    // Add user when "Add" button is clicked
    submitUserBtn.addEventListener("click", function () {
        const username = usernameInput.value.trim();
        if (username) {
            users.push(username);
            localStorage.setItem("users", JSON.stringify(users));
            renderUsers();
            usernameInput.value = ""; // Clear input
            addUserModal.classList.remove("show"); // Close modal
        } else {
            alert("Please enter a valid user name.");
        }
    });

    // Close modal when clicking outside the modal content
    addUserModal.addEventListener("click", function (e) {
        if (e.target === addUserModal) {
            addUserModal.classList.remove("show");
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
                event.stopPropagation(); // Stop event from propagating to parent
                showConfirmationDialog(username, newUserItem);
            });

            // Append username and remove button
            newUserItem.appendChild(userNameSpan);
            newUserItem.appendChild(removeBtn);
            userList.appendChild(newUserItem);
        });
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
            // Remove the user from the array
            const userIndex = users.indexOf(username);
            if (userIndex !== -1) {
                users.splice(userIndex, 1);
                localStorage.setItem("users", JSON.stringify(users)); // Update localStorage
            }

            // Remove the DOM element
            userList.removeChild(userItem);

            // Remove the confirmation modal
            document.body.removeChild(confirmationModal);
        });

        modalContent.querySelector("#confirmNo").addEventListener("click", function () {
            // Remove the confirmation modal
            document.body.removeChild(confirmationModal);
        });
    }
});
