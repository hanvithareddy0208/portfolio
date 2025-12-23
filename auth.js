// SIGNUP
const signupForm = document.getElementById("signupForm");
signupForm?.addEventListener("submit", function(e){
  e.preventDefault();

  const username = document.getElementById("signupUsername").value.trim();
  const email = document.getElementById("signupEmail").value.trim();
  const phone = document.getElementById("signupPhone").value.trim();
  const linkedIn = document.getElementById("signupLinkedIn").value.trim();
  const password = document.getElementById("signupPassword").value;
  const confirm = document.getElementById("signupConfirm").value;
  const imageInput = document.getElementById("signupImage").files[0];
  const error = document.getElementById("signupError");
  error.textContent="";

  if(!username || !email || !phone || !password || !confirm || !imageInput){
    error.textContent="Please fill in all fields and select an image.";
    return;
  }
  if(password.length<6){ error.textContent="Password must be at least 6 characters."; return; }
  if(password!==confirm){ error.textContent="Passwords do not match."; return; }
  if(!/^\d{10}$/.test(phone)){ error.textContent="Phone number must be 10 digits."; return; }

  const reader = new FileReader();
  reader.onload=function(){
    localStorage.setItem("portfolioUser", JSON.stringify({
      username,email,phone,linkedIn,password,image:reader.result
    }));
    alert("Account created successfully. Please login.");
    signupForm.reset();
    signupForm.classList.remove("active");
    document.getElementById("loginForm").classList.add("active");
    document.getElementById("loginInfo").style.display="flex";
  };
  reader.readAsDataURL(imageInput);
});

// LOGIN
const loginForm = document.getElementById("loginForm");
loginForm?.addEventListener("submit", function(e){
  e.preventDefault();

  const identifier = document.getElementById("loginIdentifier").value.trim();
  const password = document.getElementById("loginPassword").value;
  const error = document.getElementById("loginError");
  error.textContent="";

  const user = JSON.parse(localStorage.getItem("portfolioUser"));
  if(!user){ 
    error.textContent="No account found. Please sign up."; 
    return; 
  }

  if((identifier!==user.email && identifier!==user.username) || password!==user.password){
    error.textContent="Invalid username/email or password."; 
    return; 
  }

  // LOGIN SUCCESS – SHOW PROFILE
  alert("Login successful!");

  // Hide login & signup forms
  loginForm.classList.remove("active");
  document.getElementById("signupForm").classList.remove("active");

  // Show profile form
  document.getElementById("profileForm").classList.add("active");

  // Hide left login info
  document.getElementById("loginInfo").style.display="none";

  // Update navbar
  const loginNav = document.getElementById("loginNav");
  const userInfo = document.getElementById("userInfo");
  const navUsername = document.getElementById("navUsername");
  const navUserImg = document.getElementById("navUserImg");

  loginNav.style.display="none";
  userInfo.style.display="flex";
  navUsername.textContent = user.username;
  navUserImg.src = user.image;

  // Load profile data
  loadProfile();
});





















