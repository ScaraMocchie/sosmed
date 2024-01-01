let userprofileimg = document.getElementById("userprofileimg");
let userprofileimgsml = document.getElementById("userprofileimgsml");
let userprofileimglrg = document.getElementById("userprofileimglrg");
let background =  document.getElementById("background");

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
                  users.data().ProfilePicture || "../assets/user-default.jpg"
                );
                userprofileimglrg.setAttribute(
                  "src",
                  users.data().ProfilePicture || "../assets/user-default.jpg"
                );
                background.style.backgroundImage=  `url('${users.data().CoverPicture || "../assets/pxfuel.jpg"}')`;
            
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



var loading = document.getElementById("loaderdiv");
var showposts = document.getElementById("showposts");
firebase
  .firestore()
  .collection("posts")
  .onSnapshot((onSnapshot) => {
    loading.style.display = "none";
    let allposts = [];
    if (onSnapshot.size === 0) {
      let nodata = document.getElementById("h1");
      nodata.style.display = "block";
    } else {
      onSnapshot.forEach((postres) => {
        allposts.push(postres.data());
      });
      showposts.style.display = "block";
      showposts.innerHTML = "";
      for (let i = 0; i < allposts.length; i++) {
        let likearry = allposts[i].like;
        let dislikearry = allposts[i].dislikes;
        let commentarry = allposts[i].comments;
        let postmain = document.createElement("div");
        showposts.appendChild(postmain);
        postmain.setAttribute("class", "postmain");
        //post header
        let postheader = document.createElement("div");
        postmain.appendChild(postheader);
        postheader.setAttribute("class", "postheader");
        // user data
        firebase
          .firestore()
          .collection("Users")
          .doc(allposts[i].uid)
          .get()
          .then((res) => {
            // console.log(res);

            let userprodiv = document.createElement("div");

            let userprofileimage = document.createElement("img");

            postheader.appendChild(userprodiv);
            userprodiv.setAttribute("class", "userprodiv");
            userprodiv.appendChild(userprofileimage);
            userprofileimage.setAttribute(
              "src",
              res.data().ProfilePicture === ""
                ? "../assets/user-default.jpg"
                : res.data().ProfilePicture
            );
            userprofileimage.setAttribute("class", "profileimage");
            let userdiv = document.createElement("div");
            userprodiv.appendChild(userdiv);
            let = fullname = document.createElement("h6");
            let = username = document.createElement("h6");
            userdiv.appendChild(fullname);
            userprodiv.appendChild(username);
            username.setAttribute("class", "usernamee")
            username.innerHTML = `@${res.data().Username}`;
            fullname.innerHTML = `${res.data().FirstName} ${res.data().LastName
              }`;

            let date = document.createElement("h6");
            userdiv.appendChild(date);
            date.innerHTML = `${allposts[i].Date} `;
            let postdetail = document.createElement("p");
            postdetail.setAttribute("class", "detailpost")
            postheader.appendChild(postdetail);

            postdetail.innerHTML = allposts[i].postvalue;
            if (allposts[i].url !== "") {
              if (
                allposts[i].filetype === "image/png" ||
                allposts[i].filetype === "image/jpg" ||
                allposts[i].filetype === "image/jpeg"
              ) {
                // images
                let postimage = document.createElement("img");
                postmain.appendChild(postimage);
                postimage.setAttribute("src", "");
                postimage.setAttribute("src", allposts[i].url);
                postimage.setAttribute("class", "postimage col-12");
              } else {
                // videos
                let postvideo = document.createElement("video");
                postmain.appendChild(postvideo);
                postvideo.setAttribute("controls", "true");
                postvideo.setAttribute("class", "postVideo");
                let source = document.createElement("source");
                postvideo.appendChild(source);
                source.setAttribute("src", allposts[i].url);
                source.setAttribute("type", "video/mp4");
              }
            }
          })}}})
