var Login = () => {
    window.location.assign("../pages/login.html");
};
const FirstName = document.getElementById("firstname");
const LastName = document.getElementById("lastname");
const Email = document.getElementById("email");
const Username = document.getElementById("Username");
const Password = document.getElementById("password");
const ReEnterPassword = document.getElementById("Repassword");
const message = document.getElementById("message");
var regex = /^[\w\-\.\+]+\@[a-zA-Z0-9\. \-]+\.[a-zA-z0-9]{2,4}$/;

const SignUp = () => {
    if (FirstName.value === "") {
        message.innerHTML = "First Name Required!";
        message.style.color = "red";}
    else if (LastName.value === "") {
        message.innerHTML = "Last Name Required!";
        message.style.color = "red";
    } else if(Username.value === ""){
        message.innerHTML = "Username Required!";
        message.style.color = "red";
    } else if (Email.value === "") {
        message.innerHTML = "Email Address Required!";
        message.style.color = "red";
    } else if (!Email.value.match(regex)) {
        message.innerHTML = "Please Enter Correct Email Address";
        message.style.color = "red";
    } else if (Password.value === "") {
        message.innerHTML = "Password Required";
        message.style.color = "red";
    } else if (Password.value.length < 6) {
        message.innerHTML = "Please Enter at least 6 digit Password";
        message.style.color = "red";
    } else if (ReEnterPassword.value === "") {
        message.innerHTML = "Re Enter Password Required";
        message.style.color = "red";
    } else if (ReEnterPassword.value !== Password.value) {
        message.innerHTML = "Password does not match";
        message.style.color = "red";
    } else{
        message.innerHTML = "Login SUCCESS";
        firebase.auth().createUserWithEmailAndPassword(Email.value, Password.value)
        .then((userCredential) => {
            var d = new Date().toLocaleDateString();
            const userdata = {
                uid: userCredential.user.uid,
                Email: Email.value,
                Username: Username.value,
                FirstName: FirstName.value,
                LastName: LastName.value,
                ProfilePicture: "",
                CoverPicture: "",
                Description: "",
                Signupdate: `${d}`,
            }
            firebase.firestore().collection("Users").doc(userCredential.user.uid).set(userdata).then((res)=>{
                window.location.href = "../pages/home.html"; 
            })
        })
        .catch((error) => {
            message.innerHTML = error.message;
        })
    }
    }

    const google = async () => {
        try {
            const provider = new firebase.auth.GoogleAuthProvider();
            const result = await firebase.auth().signInWithPopup(provider);
      
            const user = result.user;
            console.log('User info:', user);
      
            // Check if the user has provided additional information
            const userRef = firebase.firestore().collection('Users').doc(user.uid);
            const userDoc = await userRef.get();
      
            if (userDoc.exists) {
              // User has provided information, redirect to home page
              window.location.href = "../pages/home.html"; // Replace with your home page URL
            } else {
              // User is logging in for the first time, ask for additional information
              const firstName = prompt('Please enter your first name:');
              const lastName = prompt('Please enter your last name:');
              let username;
              let isUsernameTaken;
              while (true) {
                username = prompt('Please enter your username:');
      
                // If the user clicks "Cancel," break out of the loop
                if (username === null) {
                  alert('Registration canceled.');
                  return;
                }
      
                const isUsernameTaken = await checkUsernameExists(username);
      
                if (!isUsernameTaken) {
                  break;
                }
      
                alert('Username already exists. Please choose a different username.');
              }
              var d = new Date().toLocaleDateString();
              // Save additional information to Firestore
              await userRef.set({
                uid: user.uid,
                Email: user.email,
                Username: username,
                FirstName: firstName,
                LastName: lastName,
                ProfilePicture: "",
                CoverPicture: "",
                Description: "",
                Signupdate: `${d}`,
              });
      
      
              // Redirect to home page
              window.location.href = "../pages/home.html"; // Replace with your home page URL
            }
          } catch (error) {
            console.error('Google Sign-In Error:', error);
          }
    };
    
    // Function to check if the username already exists
    async function checkUsernameExists(username) {
        const querySnapshot = await firebase.firestore().collection('Users')
          .where('Username', '==', username)
          .get();
    
        return !querySnapshot.empty;
      }