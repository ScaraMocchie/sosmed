import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
  updateDoc,
  doc,
  getDoc,
  deleteDoc,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import {
  getAuth,
  signOut,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyBS_z-3tlJR2SWxNJgbP1iA1iO7rL-9Cd4",
  authDomain: "socialmedia-bce32.firebaseapp.com",
  projectId: "socialmedia-bce32",
  storageBucket: "socialmedia-bce32.appspot.com",
  messagingSenderId: "922002868347",
  appId: "1:922002868347:web:6cb10e5944c28047443ade",
  measurementId: "G-DNDLPJ0V8G",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

async function displayUsers() {
  const usersCollection = collection(db, "Users");
  const querySnapshot = await getDocs(usersCollection);

  const tableBody = document.getElementById("tablebody");
  tableBody.innerHTML = "";

  let stdno = 0;
  querySnapshot.forEach((doc) => {
    const user = doc.data();
    stdno++;

    const row = tableBody.insertRow(-1);

    const tdNo = row.insertCell();
    tdNo.textContent = stdno;
    tdNo.classList.add("centered-column");

    const tdUsername = row.insertCell();
    tdUsername.textContent = user.Username;

    const tdFirstName = row.insertCell();
    tdFirstName.textContent = user.FirstName;

    const tdLastName = row.insertCell();
    tdLastName.textContent = user.LastName;

    const tdEmail = row.insertCell();
    tdEmail.textContent = user.Email;

    const tdProfilePicture = row.insertCell();

    if (user.ProfilePicture) {
      const img = document.createElement("img");
      img.src = user.ProfilePicture;
      img.alt = "User Image";
      img.style.width = "70px";
      img.style.height = "70px";
      tdProfilePicture.appendChild(img);
    } else {
      const noProfileText = document.createTextNode("No Profile");
      tdProfilePicture.appendChild(noProfileText);
    }

    tdProfilePicture.classList.add("centered-column");

    const tdActions = row.insertCell();
    const buttonContainer = document.createElement("div");
    buttonContainer.classList.add("edit-button-container");

    const editButton = document.createElement("button");
    editButton.textContent = "Edit";
    editButton.addEventListener("click", () => openEditModal(doc.id));

    editButton.classList.add("edit-button");
    buttonContainer.appendChild(editButton);
    tdActions.appendChild(buttonContainer);
  });
}

window.onload = displayUsers;

const logoutButton = document.getElementById("logout");

logoutButton.addEventListener("click", () => {
  signOut(auth)
    .then(() => {
      sessionStorage.removeItem("user-creds");
      sessionStorage.removeItem("user-info");
      alert("Logout successful");
      window.location.href = "adminlogin.html";
    })
    .catch((error) => {
      console.error("Logout error", error);
    });
});

async function openEditModal(userId) {
  const modal = document.getElementById("editModal");
  modal.style.display = "block";

  const userDocRef = doc(db, "Users", userId);
  const userSnapshot = await getDoc(userDocRef);
  const userData = userSnapshot.data();

  document.getElementById("Username").value = userData.Username;
  document.getElementById("Email").value = userData.Email;
  document.getElementById("FirstName").value = userData.FirstName;
  document.getElementById("LastName").value = userData.LastName;
  document.getElementById("ProfilePicture").value = userData.ProfilePicture || '';

  document.getElementById("Email").readOnly = true;

  window.updateUser = async () => {
    const editedUsername = document.getElementById("Username").value;
    const editedEmail = document.getElementById("Email").value;
    const editedFirstName = document.getElementById("FirstName").value;
    const editedLastName = document.getElementById("LastName").value;
    const editedProfilePicture =
      document.getElementById("ProfilePicture").src;

    const userDocRef = doc(db, "Users", userId);
    await updateDoc(userDocRef, {
      Username: editedUsername,
      Email: editedEmail,
      FirstName: editedFirstName,
      LastName: editedLastName,
      ProfilePicture: editedProfilePicture,
    });

    closeModal();
    displayUsers();
  };

  window.deleteUser = async () => {
    const confirmDelete = confirm("Are you sure you want to delete this user?");
    if (confirmDelete) {
      const userDocRef = doc(db, "Users", userId);
      await deleteDoc(userDocRef);
  
      closeModal();
      displayUsers();
    }
  };
}

function closeModal() {
  const modal = document.getElementById("editModal");
  modal.style.display = "none";
}
