let userprofileimg = document.getElementById("userprofileimg");
let userprofileimgsml = document.getElementById("userprofileimgsml");
let userprofileimglrg = document.getElementById("userprofileimglrg");

let name2 = document.getElementById("name");
let username = document.getElementById("username");

let alluser = [];
let fileType = "";

firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    uid = user.uid;
      // console.log("emailVerified true");
     
      

      firebase
        .firestore()
        .collection("Users/")
        .onSnapshot((result) => {
          result.forEach((users) => {
            alluser.push(users.data());
            Filetype = users.data().filetype;
            if (users.data().uid === user.uid) {
              name2.innerHTML = users.data().FirstName + " " + users.data().LastName
              username.innerHTML = users.data().Username
              if (
                users.data().ProfilePicture !== "" ||
                users.data().CoverPicture !== ""
              ) {
                userprofileimg.setAttribute(
                  "src",
                  users.data().ProfilePicture
                );
                userprofileimgsml.setAttribute(
                  "src",
                  users.data().ProfilePicture
                );
                userprofileimglrg.setAttribute(
                  "src",
                  users.data().ProfilePicture
                );
            
              }
            }
          });
        });
  } else {
    window.location.assign("./login.html");
  }
});

const logout =  () => {
    firebase.auth().signOut().then(function() {
      // Sign-out successful, redirect to login page
      window.location.href = "../pages/login.html"; // Replace with your login page URL
    }).catch(function(error) {
      console.error('Logout Error:', error);
    });
  }
const profile= ()=>{
  window.location.href = "../pages/profile.html"; 
}
  function adjustInputHeight(textarea) {
    textarea.style.height = "auto";
    textarea.style.height = (textarea.scrollHeight) + "px";
}

function insertImage() {
  var imageInput = document.getElementById("imageInput");
  var postInput = document.getElementById("postInput");
  var selectedImageContainer = document.getElementById("selectedImageContainer");

  var file = imageInput.files[0];
  if (file) {
      var reader = new FileReader();
      reader.onload = function (e) {
          var imageTag = '<img src="' + e.target.result + '" alt="uploaded-image">';
          selectedImageContainer.innerHTML = imageTag;
      };
      reader.readAsDataURL(file);
      imageInput.value = '';
  }
}

document.addEventListener("DOMContentLoaded", function () {
  var postInput = document.getElementById("postInput");
  var imageContentInput = document.getElementById("imageContentInput");

  postInput.addEventListener("click", function () {
      imageContentInput.classList.add("active");
  });
});

