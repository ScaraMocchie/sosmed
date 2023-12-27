// admin-script.js
const database = firebase.database();

// Function to fetch user data from Firebase
function getUsers() {
  const userTableBody = document.getElementById('user-table-body');

  database.ref('Users').once('value')
    .then(snapshot => {
      // Handle user data
      const users = snapshot.val();
      console.log(users);

      // Populate the table with user data
      for (const userId in users) {
        if (users.hasOwnProperty(userId)) {
          const userData = users[userId];

          const row = userTableBody.insertRow();
          row.innerHTML = `
            <td>${userId}</td>
            <td>${userData.Username}</td>
            <td>${userData.FirstName}</td>
            <td>${userData.Email}</td>
          `;
        }
      }
    })
    .catch(error => {
      console.error(error.message);
    });
}

// Call the function to fetch users when the page loads
document.addEventListener('DOMContentLoaded', getUsers);
