let userinfo =  document.getElementById("userinfo");
userinfo.style.display = 'none';
let background = document.getElementById("background");
let namee = document.getElementById("name");
userprofileimglrg = document.getElementById("userprofileimglrg")

firebase.auth().onAuthStateChanged((user) => {
    if (user) {
       firebase.firestore().collection("Users/").onSnapshot((users)=>{
        var user = document.getElementById("users")
        document.getElementById("loaderdiv").style.display ="none"
        let usernameeee = document.getElementById("usernameeee");
        users.forEach((userdetail)=>{
           var name = userdetail.data().FirstName + " " + userdetail.data().LastName
  
           
           var userdetails = document.createElement("div")
           user.appendChild(userdetails)
           userdetails.setAttribute("id", "userdetailasdev")

           var userimgdiv = document.createElement("div")
           userdetails.appendChild(userimgdiv)
           userimgdiv.setAttribute("class","userimg col-1")

           var userimg = document.createElement("img")
           userimgdiv.appendChild(userimg)
           userimg.setAttribute("src", "../assets/user-default.jpg")
           if (userdetail.data().ProfilePicture !== ""){
            userimg.setAttribute("src" , userdetail.data().ProfilePicture)
           }
           userimg.style.objectFit='cover';
           userimg.setAttribute("class", "profilepicture")

           var userdata = document.createElement("div")
           userdetails.appendChild(userdata)
           userdata.setAttribute("id", "data")

           var username = document.createElement("p")
           userdata.appendChild(username)
           username.setAttribute("class", "username")
           username.innerHTML = name;

           var signupdate = document.createElement("p")
           userdata.appendChild(signupdate)
           signupdate.setAttribute("class","signupdate")
           signupdate.innerHTML = (userdetail.data().Description==""?"This user doesn't have description":userdetail.data().Description);

           var dropdown = document.createElement("div")
           userdetails.appendChild(dropdown)
           dropdown.setAttribute("id","dropdown")

        //    var dropdownshow = document.createElement("i")
        //    dropdown.appendChild(dropdownshow)
        //    dropdownshow.setAttribute("class", "fa-solid fa-angle-down dropdownbuttons")
        //    dropdownshow.setAttribute("id","dropdownshow")

        //    var dropdownhide = document.createElement("i")
        //    dropdown.appendChild(dropdownhide)
        //    dropdownhide.setAttribute("class" ,"fa-solid fa-angle-up dropdownbuttons")
        //    dropdownhide.setAttribute("id","dropdownhide")

           var userprofilediv = document.createElement("div")
           user.appendChild(userprofilediv)
           userprofilediv.setAttribute("id", "userprofilediv")
           userprofilediv.style.marginBottom="5px"

           var usercoverimg = document.createElement("img")
           userprofilediv.appendChild(usercoverimg)
           usercoverimg.setAttribute("id","usercoverimg")
           usercoverimg.setAttribute("class","col-12")
           usercoverimg.setAttribute("src","../assets/pxfuel.jpg")
           if(userdetail.data().CoverPicture !== ""){
            usercoverimg.setAttribute("src", userdetail.data().CoverPicture)
           }

           var userprofileimg = document.createElement("img")
           userprofilediv.appendChild(userprofileimg)
           userprofileimg.setAttribute("id","userprofileimg")
           userprofileimg.setAttribute("src","../assets/user-default.jpg")
           if (userdetail.data().ProfilePicture !== ""){
            userprofileimg.setAttribute("src", userdetail.data().ProfilePicture)
           }
           userprofileimg.setAttribute("class","largeprofilepicture")

           var usernamedetail =document.createElement("p")
           userprofilediv.appendChild(usernamedetail)
           usernamedetail.setAttribute("class","username")
           usernamedetail.innerHTML =name
        //    

        //    dropdownshow.addEventListener("click",()=>{
        //     dropdownhide.style.display = "block"
        //     dropdownshow.style.display ="none"
        //     userprofilediv.style.display= "flex"
        //    })
        
        userdetails.addEventListener("click", function (){
            if(userinfo.style.display=='none'||userinfo.style.display=='flex'){
                usernameeee.innerHTML = userdetail.data().Username
                namee.innerHTML = name
                if (userdetail.data().CoverPicture !== ""){
                    background.style.backgroundImage=  `url('${userdetail.data().CoverPicture}')`
                } else{
                    background.style.backgroundImage=  `url('${"../assets/pxfuel.jpg"}')`;
                }
                if(userdetail.data().ProfilePicture !== ""){
                    userprofileimglrg.setAttribute(
                        "src",
                        userdetail.data().ProfilePicture
                      );
                } else{
                    userprofileimglrg.setAttribute(
                        "src",
                        "../assets/user-default.jpg"
                      );
                }
                userinfo.style.display='flex';
            }
   
               })

               userdetails.addEventListener("dblclick", function (){userinfo.style.display='none';})
        //    dropdownhide.addEventListener("click",()=>{
        //     dropdownhide.style.display = "none"
        //     dropdownshow.style.display ="block"
        //     userprofilediv.style.display= "none"
        //    })

            })
       })
      
    } else {
        window.location.assign("./pages/login.html");
    }
  });
  

  const logout = ()=>{
    firebase.auth().signOut().then(() => {
      window.location.assign("./login.js")
    })
  }