let postvalue = document.getElementById("textarea");
var progressDiv = document.getElementById("progressdiv");
var progressbar = document.getElementById("progressbar");
let currentuser = "";
let url = "";
let fileType = "";
var done = document.getElementById("done");
let uid;
let alluser = [];
let userimg = document.getElementById("userimg");

firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
    // User is signed in, redirect to home page
    currentuser = user;
    uid = user.uid;
  } else {
    setTimeout(() => {
      window.location.assign("../pages/login.html");
    }, 1000);
  }
});

let uploadimg = (event) => {
  fileType = event.target.files[0].type;
  var uploadfile = firebase
    .storage()
    .ref()
    .child(`postFiles/${event.target.files[0].name}`)
    .put(event.target.files[0]);

  uploadfile.on(
    "state_changed",
    (snapshot) => {
      var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      var uploadpercentage = Math.round(progress);
      console.log(uploadpercentage);
      progressDiv.style.display = "block";
      progressbar.style.width = `${uploadpercentage}%`;
      progressbar.innerHTML = `${uploadpercentage}%`;
    },
    (error) => {},
    () => {
      uploadfile.snapshot.ref.getDownloadURL().then((downloadURL) => {
        url = downloadURL;
        done.style.display = "block";
        progressDiv.style.display = "none";

        // Display the selected image in the selectedImageContainer
        displaySelectedImage(url);
      });
    }
  );
};

function displaySelectedImage(url) {
  // Create an image element
  var image = document.createElement("img");
  image.src = url;
  image.style.maxWidth = "100%";
  image.style.maxHeight = "200px"; // Adjust the maximum height as needed

  // Append the image to the selectedImageContainer
  var selectedImageContainer = document.getElementById("selectedImageContainer");
  selectedImageContainer.innerHTML = ""; // Clear previous content
  selectedImageContainer.appendChild(image);
}

var d = new Date().toLocaleDateString();

function createpost() {
  if (postvalue.value !== "" || url !== "") {
    firebase
      .firestore()
      .collection("posts")
      .add({
        postvalue: postvalue.value,
        uid: currentuser.uid,
        url: url,
        filetype: fileType,
        like: [],
        dislikes: [],
        comments: [],
        Date: `${d}`,
      })
      .then((res) => {
        firebase
          .firestore()
          .collection("posts/")
          .doc(res.id)
          .update({
            id: res.id,
          })
          .then(() => {
            done.style.display = "none";
            document.getElementById("uploadedmssage").style.display = "block";
            setTimeout(() => {
              window.location.assign("./home.html");
            }, 2000);
          });
      });
  }
}

function adjustInputHeight(textarea) {
  textarea.style.height = "auto";
  textarea.style.height = textarea.scrollHeight + "px";
}
