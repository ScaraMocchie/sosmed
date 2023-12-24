firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      // User is signed in, redirect to home page
      window.location.href = "../pages/home.html"; // Replace with your home page URL
    } else {
      setTimeout(() => {
        window.location.assign("../pages/login.html");
      }, 1000);
    }
  });