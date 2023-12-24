var Signup = () => {
    window.location.assign("../pages/register.html");
};

const Login = () => {
    const email = document.getElementById("email");
    const password = document.getElementById("password");
    const message = document.getElementById("message");

    if (email.value === "") {
        message.innerHTML = "Email required!";
        message.style.color = "red";
    } else if (password.value === "") {
        message.innerHTML = "Password required!";
        message.style.color = "red";
    } else{
        const userData = {
            email: email.value,
            password: password.value,
        };
        firebase.auth().signInWithEmailAndPassword(userData.email, userData.password)
        .then((userCredential) => {
          // Successful login, redirect to home page or do any necessary action
          console.log('User logged in:', userCredential.user);
          window.location.href = "../pages/home.html"; // Replace with your home page URL
        })
        .catch((error) => {
          // Handle login errors
          document.getElementById('error').textContent = error.message;
        });
 
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

async function checkUsernameExists(username) {
    const querySnapshot = await firebase.firestore().collection('Users')
      .where('Username', '==', username)
      .get();

    return !querySnapshot.empty;
  }