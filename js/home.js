const logout =  () => {
    firebase.auth().signOut().then(function() {
      // Sign-out successful, redirect to login page
      window.location.href = "../pages/login.html"; // Replace with your login page URL
    }).catch(function(error) {
      console.error('Logout Error:', error);
    });
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

  postInput.addEventListener("blur", function () {
      imageContentInput.classList.remove("active");
  });
});
