document.addEventListener("DOMContentLoaded",()=>{
  const loginForm = document.getElementById("loginForm");
  const signupForm = document.getElementById("signupForm");
  const profileForm = document.getElementById("profileForm");
  const loginInfo = document.getElementById("loginInfo");
  
  const loginNav = document.getElementById("loginNav");
  const userInfo = document.getElementById("userInfo");
  const navUsername = document.getElementById("navUsername");
  const navUserImg = document.getElementById("navUserImg");
  const logoutBtn = document.getElementById("logoutBtn");
  const goProfile = document.getElementById("goProfile");

  // FORM SWITCH
  document.getElementById("goSignup")?.addEventListener("click",()=>{
    loginForm.classList.remove("active"); signupForm.classList.add("active"); loginInfo.style.display="none";
  });
  document.getElementById("goLogin")?.addEventListener("click",()=>{
    signupForm.classList.remove("active"); loginForm.classList.add("active"); loginInfo.style.display="flex";
  });

  // LOAD USER
  const user = JSON.parse(localStorage.getItem("portfolioUser"));
  if(user){
    loginNav.style.display="none";
    userInfo.style.display="flex";
    navUsername.textContent=user.username;
    navUserImg.src=user.image;
  }

  // LOGOUT
  logoutBtn?.addEventListener("click",()=>{
    localStorage.removeItem("portfolioUser");
    location.reload();
  });

  // GO PROFILE
  goProfile?.addEventListener("click",(e)=>{
    e.preventDefault();
    loginForm.classList.remove("active"); signupForm.classList.remove("active"); profileForm.classList.add("active"); loginInfo.style.display="none";
    loadProfile();
  });
});







