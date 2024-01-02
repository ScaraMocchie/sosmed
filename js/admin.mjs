import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
  updateDoc,
  doc,
  getDoc,
  deleteDoc,
  addDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import {
  getAuth,
  signOut,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";

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
const storage = getStorage();

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
    let downloadURL = userData.ProfilePicture || '';
    const editedProfilePicture = fileInput.files[0];
    if (editedProfilePicture) {
      downloadURL = await uploadProfilePicture(userId, editedProfilePicture);
  }

    const userDocRef = doc(db, "Users", userId);
    await updateDoc(userDocRef, {
      Username: editedUsername,
      Email: editedEmail,
      FirstName: editedFirstName,
      LastName: editedLastName,
      ProfilePicture: downloadURL,
    });

    closeModal();
    displayUsers();
  };

  window.deleteUser = async () => {
    const confirmDelete = confirm("Are you sure you want to delete this user?");
    if (!confirmDelete) {
      return;
    }
  
    const userDocRef = doc(db, "Users", userId);
    try {
      await deleteDoc(userDocRef);
      closeModal();
      displayUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };
}

function closeModal() {
  const modal = document.getElementById("editModal");
  modal.style.display = "none";
}

function handleProfilePictureChange() {
  const input = document.getElementById("ProfilePictureInput");
  const preview = document.getElementById("ProfilePicturePreview");

  const file = input.files[0];

  if (file) {
    const reader = new FileReader();

    reader.onload = (e) => {
      preview.src = e.target.result;
      preview.style.display = 'block';
    };

    reader.readAsDataURL(file);
  } else {
    preview.style.display = 'none';
  }
}

async function uploadProfilePicture(userId, file) {
  try {
    // Create a reference to the storage location
    const storageRef = ref(storage, `profile_pictures/${userId}/${file.name}`);

    // Upload the file to the specified path
    const snapshot = await uploadBytes(storageRef, file);

    // Get the download URL of the uploaded file
    const downloadURL = await getDownloadURL(snapshot.ref);

    // Return the download URL
    return downloadURL;
  } catch (error) {
    console.error("Error uploading profile picture:", error);
    return ''; // Return an empty string in case of an error
  }
}

// Function to open the modal for adding a new user
function openAddUserModal() {
  const addUserModal = document.getElementById("addUserModal");
  addUserModal.style.display = "block";
}

// Function to close the modal for adding a new user
function closeAddUserModal() {
  const addUserModal = document.getElementById("addUserModal");
  addUserModal.style.display = "none";
}

// Function to handle the change in the new profile picture input
function handleNewProfilePictureChange() {
  const input = document.getElementById("NewProfilePictureInput");
  const preview = document.getElementById("NewProfilePicturePreview");

  const file = input.files[0];

  if (file) {
      const reader = new FileReader();

      reader.onload = (e) => {
          preview.src = e.target.result;
          preview.style.display = 'block';
      };

      reader.readAsDataURL(file);
  } else {
      preview.style.display = 'none';
  }
}

// Function to add a new user
async function addUser() {
  const newUsername = document.getElementById("NewUsername").value;
  const newEmail = document.getElementById("NewEmail").value;
  const newFirstName = document.getElementById("NewFirstName").value;
  const newLastName = document.getElementById("NewLastName").value;
  const newProfilePictureInput = document.getElementById("NewProfilePictureInput");
  const newProfilePicture = newProfilePictureInput.files[0];

  // Upload the new profile picture if available
  const newProfilePictureURL = newProfilePicture ? await uploadProfilePicture('temp', newProfilePicture) : '';

  // Add the new user to the Firestore collection
  await addDoc(collection(db, "Users"), {
      Username: newUsername,
      Email: newEmail,
      FirstName: newFirstName,
      LastName: newLastName,
      ProfilePicture: newProfilePictureURL,
  });

  closeAddUserModal();
  displayUsers();
}