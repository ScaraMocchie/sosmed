const logout =  () => {
    firebase.auth().signOut().then(function() {
      // Sign-out successful, redirect to login page
      window.location.href = "../pages/login.html"; // Replace with your login page URL
    }).catch(function(error) {
      console.error('Logout Error:', error);
    });
  }