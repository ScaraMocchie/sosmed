let userprofileimg = document.getElementById("userprofileimg");
let userprofileimgsml = document.getElementById("userprofileimgsml");
let userprofileimglrg = document.getElementById("userprofileimglrg");
let background =  document.getElementById("background");

let postvalue = document.getElementById("postInput");
let fileType = "";
let currentuser = "";
let url = "";

let name2 = document.getElementById("name");
let username = document.getElementById("username");

let alluser = [];



firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    uid = user.uid;
    currentuser = user;
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
// const profile= ()=>{
//   window.location.href = "../pages/userprofile.html"; 
// }
  function adjustInputHeight(textarea) {
    textarea.style.height = "auto";
    textarea.style.height = (textarea.scrollHeight) + "px";
}

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
    },
    (error) => { },
    () => {
      uploadfile.snapshot.ref.getDownloadURL().then((downloadURL) => {
        url = downloadURL;
        console.log(url);

      });
    }
  );
};

function insertImage(event) {
    uploadimg(event);
    var imageInput = document.getElementById("imageInput");
    var postInput = document.getElementById("postInput");
    var selectedImageContainer = document.getElementById("selectedImageContainer");
    var file = imageInput.files[0];
    fileType = file.type;

    if (file) {
        var reader = new FileReader();
        reader.onload = function (e) {
            var imageTag = '<img src="' + e.target.result + '" alt="uploaded-image">';
            selectedImageContainer.innerHTML = imageTag;
        };
        reader.readAsDataURL(file);
        imageInput.value = '';
    }
};

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
        Date: `${d}`
      })
      .then((res) => {
        firebase
          .firestore()
          .collection("posts/")
          .doc(res.id)
          .update({
            id: res.id
          })
          .then(() => {
            setTimeout(() => {
              location.reload();
            }, 2000);
          });
      });
     
  }

}






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
      // allposts.sort((a, b) => (a.Date > b.Date ? 1 : -1));
      showposts.style.display = "block";
      showposts.innerHTML = "";
      for (let i = 0; i < allposts.length; i++) {
        let likearry = allposts[i].like;
        let dislikearry = allposts[i].dislikes;
        let commentarry = allposts[i].comments;
        let postmain = document.createElement("div");
        showposts.appendChild(postmain);
        // postmain.style.height= "500px";
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
            //FOOTER
            let footerdiv = document.createElement("div");
            postmain.appendChild(footerdiv);
            footerdiv.setAttribute("class", "footerdiv");
            //like
            var likebutton = document.createElement("button");
            footerdiv.appendChild(likebutton);
            likebutton.setAttribute("class", "likebutton");
            var likeicon = document.createElement("i");
            likebutton.appendChild(likeicon);
            likeicon.setAttribute("class", "fa-solid fa-thumbs-up");
            var liketitle = document.createElement("p");
            likebutton.appendChild(liketitle);
            liketitle.setAttribute("class", "impressionstitle");
            liketitle.innerHTML = `Like (${likearry.length})`;
            for (let likeIndex = 0; likeIndex < likearry.length; likeIndex++) {
              if (likearry[likeIndex] === uid) {
                likeicon.style.color = "green";
                liketitle.style.color = "green";
              }
            }
            //like function
            likebutton.addEventListener("click", () => {
              let like = false;
              for (
                let likeIndex = 0;
                likeIndex < likearry.length;
                likeIndex++
              ) {
                if (likearry[likeIndex] === uid) {
                  like = true;
                  likearry.splice(likeIndex, 1);
                }
              }
              if (!like) {
                likearry.push(uid);
              }
              firebase
                .firestore()
                .collection("posts/")
                .doc(allposts[i].id)
                .update({
                  like: likearry,
                });
            });

            //DISLIKE
            var dislikebutton = document.createElement("button");
            footerdiv.appendChild(dislikebutton);
            dislikebutton.setAttribute("class", "dislikebutton");

            var dislikeicon = document.createElement("i");
            dislikebutton.appendChild(dislikeicon);
            dislikeicon.setAttribute("class", "fa-solid fa-thumbs-down");

            var disliketitle = document.createElement("p");
            dislikebutton.appendChild(disliketitle);
            disliketitle.setAttribute("class", "impressionstitle");
            disliketitle.innerHTML = `Dislike (${dislikearry.length})`;
            for (
              let dislikeindex = 0;
              dislikeindex < dislikearry.length;
              dislikeindex++
            ) {
              if (dislikearry[dislikeindex] === uid) {
                dislikeicon.style.color = "red";
                disliketitle.style.color = "red";
              }
            }
            dislikebutton.addEventListener("click", () => {
              let dislike = false;
              for (
                let dislikeindex = 0;
                dislikeindex < dislikearry.length;
                dislikeindex++
              ) {
                if (dislikearry[dislikeindex] === uid) {
                  dislike = true;
                  dislikearry.splice(dislikeindex, 1);
                }
              }
              if (!dislike) {
                dislikearry.push(uid);
              }
              firebase
                .firestore()
                .collection("posts/")
                .doc(allposts[i].id)
                .update({
                  dislikes: dislikearry,
                });
            });

            let commentbtn = document.createElement("button");
            // commentbtn.setAttribute("id", "cmntbtn");
            footerdiv.appendChild(commentbtn);

            var commenticon = document.createElement("i");
            commentbtn.appendChild(commenticon);
            commenticon.setAttribute("class", "fa-solid fa-message");

            var commentmessage = document.createElement("p");
            commentbtn.appendChild(commentmessage);
            commentmessage.setAttribute("class", "impressionstitle");
            commentmessage.innerHTML = `Comment (${commentarry.length})`;

            let comments = document.createElement("div");
     
            comments.style.display='none';

            postmain.appendChild(comments);

            //isi komen orang
            if (commentarry.length !== 0) {
              for (
                var commentindex = 0;
                commentindex < commentarry.length;
                commentindex++
              ) {
                let commentmain = document.createElement("div");
                // commentmain.setAttribute("id", "commentmain");
                // postmain.appendChild(commentmain);
                comments.appendChild(commentmain);

                commentmain.setAttribute("class", "commentmain");
                let commentprofileimage = document.createElement("img");
                commentmain.appendChild(commentprofileimage);
                commentprofileimage.setAttribute(
                  "class",
                  "commentprofileimage"
                );
                var commentmessage = document.createElement("div");
                let commentusername = document.createElement("h6");
                commentmain.appendChild(commentmessage);
                commentmessage.appendChild(commentusername);
                //user data
                firebase
                  .firestore()
                  .collection("Users")
                  .doc(commentarry[commentindex].uid)
                  .get()
                  .then((currentuserres) => {
                    commentprofileimage.setAttribute(
                      "src", "../assets/user-default.jpg"
                    );
                    if (currentuserres.data().ProfilePicture !== "") {
                      commentprofileimage.setAttribute(
                        "src",
                        currentuserres.data().ProfilePicture
                      );
                    }
                    commentusername.innerHTML = `${currentuserres.data().FirstName
                      } ${currentuserres.data().LastName} @${currentuserres.data().Username}`;
                  });
                let commentvalue = document.createElement("p");
                commentmessage.appendChild(commentvalue);
                commentvalue.innerHTML = commentarry[commentindex].commentvalue;
              }
            }

            // comment input
            let writecomment = document.createElement("div");
            // writecomment.setAttribute("id", "sendcmnt");
            writecomment.setAttribute("class", "writecomment");
            postmain.appendChild(writecomment);

            let commentinput = document.createElement("input");
            writecomment.appendChild(commentinput);
            commentinput.setAttribute("class", "commentinput");
            commentinput.setAttribute("placeholder", "Write Comment.....");
            let sendbutton = document.createElement("img");
            writecomment.appendChild(sendbutton);
            sendbutton.setAttribute("src", "../assets/paperplane.png");
            sendbutton.setAttribute("class", "sendbutton");

            writecomment.style.display='none';


            commentbtn.addEventListener("click", function () {
              if(writecomment.style.display=='none'){
                writecomment.style.display='flex';
                comments.style.display='block';
              } else{
                writecomment.style.display='none';
                comments.style.display='none';
              }
            });

            sendbutton.addEventListener("click", () => {
              if (commentinput.value === "") {
                alert("Please write something.....!");
              } else {
                let commentdata = {
                  commentvalue: commentinput.value,
                  uid: uid,
                };
                commentarry.push(commentdata);
                firebase
                  .firestore()
                  .collection("posts")
                  .doc(allposts[i].id)
                  .update({
                    comments: commentarry,
                  });
                  // writecomment.style.display='flex';
                  // comments.style.display='block';
              }
            });
        
          

          })}}})


          document.addEventListener("DOMContentLoaded", function () {
            var postInput = document.getElementById("postInput");
            var imageContentInput = document.getElementById("imageContentInput");
          
            postInput.addEventListener("click", function () {
                imageContentInput.classList.add("active");
            });
          
          
          });