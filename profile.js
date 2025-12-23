const profileForm = document.getElementById("profileForm");
const editBtn = document.getElementById("editProfileBtn");
const saveBtn = document.getElementById("saveProfileBtn");
const inputs = profileForm ? profileForm.querySelectorAll("input") : [];
const profileImgBtn = document.getElementById("editImageBtn");
const profileImgInput = document.getElementById("profileImage");
const profileImgPreview = document.getElementById("profileImgPreview");

// Load user data into profile
function loadProfile(){
  const user = JSON.parse(localStorage.getItem("portfolioUser"));
  if(user){
    document.getElementById("profileUsername").value = user.username;
    document.getElementById("profileEmail").value = user.email;
    document.getElementById("profilePhone").value = user.phone;
    document.getElementById("profileLinkedIn").value = user.linkedIn;
    document.getElementById("profilePassword").value = user.password;
    profileImgPreview.src = user.image;
  }
}

// Edit toggle
editBtn?.addEventListener("click", ()=>{
  inputs.forEach(i=>i.disabled=false);
  saveBtn.style.display="inline-block";
  editBtn.style.display="none";
});

// Save profile changes
profileForm?.addEventListener("submit", (e)=>{
  e.preventDefault();
  const user = JSON.parse(localStorage.getItem("portfolioUser"));
  if(!user) return;

  user.username = document.getElementById("profileUsername").value.trim();
  user.email = document.getElementById("profileEmail").value.trim();
  user.phone = document.getElementById("profilePhone").value.trim();
  user.linkedIn = document.getElementById("profileLinkedIn").value.trim();
  user.password = document.getElementById("profilePassword").value;
  localStorage.setItem("portfolioUser", JSON.stringify(user));
  alert("Profile updated successfully!");
  inputs.forEach(i=>i.disabled=true);
  saveBtn.style.display="none";
  editBtn.style.display="inline-block";
  document.getElementById("navUsername").textContent = user.username;
  document.getElementById("navUserImg").src = user.image;
});

// Profile image edit
profileImgBtn?.addEventListener("click", ()=>{
  profileImgInput.click();
});
profileImgInput?.addEventListener("change", (e)=>{
  const file = e.target.files[0];
  if(file){
    const reader = new FileReader();
    reader.onload=function(){
      profileImgPreview.src = reader.result;
      const user = JSON.parse(localStorage.getItem("portfolioUser"));
      if(user){ user.image = reader.result; localStorage.setItem("portfolioUser", JSON.stringify(user)); }
      document.getElementById("navUserImg").src = reader.result;
    };
    reader.readAsDataURL(file);
  }
});

