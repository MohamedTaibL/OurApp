<template>
    <div class="sign-container">
      <div class="sign-view" v-if="!login">
        <h1>Sign Up</h1>
        <form @submit.prevent="createUser" class="form">
          <input type="email" placeholder="Email" v-model="email" required />
          <input type="password" placeholder="Password" v-model="password" required />
          <input type="password" placeholder="Confirm Password" v-model="confirmpassword" required />
          <input type="text" placeholder="Username" v-model="username" required />
          <input type="text" placeholder="Name" v-model="Name" required />
          <input type="date" placeholder="Date of Birth" v-model="date" required />
          <div class="gender-container">
            <div>Gender:</div>
            <label>
                Male
                <input type="radio" name="gender" value="male" v-model="gender"/>
            </label>
                <label>
                    Female
                    <input type="radio" name="gender" value="female" v-model="gender" />
                </label>
          </div>
            <button type="submit" class="btn">Sign Up</button>
        

        </form>
        <button @click="printLogin" class="switch-btn">Already have an account? Login!</button>
      </div>
      <div class="login-view" v-else>
        <h1>Login</h1>
        <form @submit.prevent="logUser" class="form">
          <input type="email" placeholder="Email" v-model="email" required />
          <input type="password" placeholder="Password" v-model="password" required />
          <button type="submit" class="btn">Login</button>
        </form>
        <button class="switch-btn">Forgot Password?</button>
        <div id = "Create" >
            <button @click="printLogin" class="btn">Log in as <br> A Guest</button>    
            <button @click="printLogin" class="btn">Create A New Account</button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { onMounted, ref } from 'vue'
  import { db ,auth } from '@/Firebase/Config'
  import { useRouter } from 'vue-router'
  
  const router = useRouter()
  const login = ref(false)
  const email = ref("")
  const password = ref("")
  const username = ref("")
  const Name = ref("")
  const confirmpassword = ref("")
  const date = ref("")
  const gender = ref("male")

  
  
  async function createUser() {
    const isValid = await verify()
    if (!isValid) {
        console.log("Validation failed")
      return
    }
    try {
      await auth.createUserWithEmailAndPassword(email.value, password.value)
      await db.collection("users").add({
        UID: auth.currentUser.uid,
        username : username.value,
        name : Name.value,
        birthdate: date.value,
        gender : gender.value
      }).then((docRef) => {
        console.log("User document created with ID: ", docRef.id)
      }).catch((error) => {
        console.error("Error adding user document: ", error)
      })
      
    } catch (error) {
      console.error("Error creating user:", error)
    } finally {
      email.value = ''
      password.value = ''
    }

    auth.signOut()
    console.log("User signed out")
    login.value = true

    

  }

  async function verify() {
  if (password.value !== confirmpassword.value) {
    alert("Passwords do not match");
    return false;
  }
  if (password.value.length < 6) {
    alert("Password must be at least 6 characters long");
    return false;
  }
  if (username.value.length < 3) {
    alert("Username must be at least 3 characters long");
    return false;
  }

  try {
    // Check if the username already exists in the database
    const querySnapshot = await db.collection("users").where("username", "==", username.value).get();
    if (!querySnapshot.empty) {
      alert("Username already exists");
      return false;
    }
  } catch (error) {
    console.error("Error checking username: ", error);
    return false;
  }

  console.log("Username is available");
  return true;
}
  


  async function logUser(){
    try {
        await auth.signInWithEmailAndPassword(email.value, password.value)
        console.log("User logged in successfully")
        router.push('/')
    } catch (error) {
        console.error("Error logging in:", error)
    } finally {
        email.value = ''
        password.value = ''
    }
  }
  onMounted(() => {
    login.value = false
  })
  
  function printLogin() {
    login.value = !login.value
  }
  </script>
  
<style scoped>

#Create {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid #ccc;
  margin: 1rem 0;
  width: 100%; /* Increased width */
  max-width: 600px; /* Optional: Limit the maximum width */
  
  gap: 1rem; /* Adds spacing between buttons */
}

/* Button styling (optional for consistency) */
#Create .btn {
  flex: 1; /* Ensures buttons take equal space */
  text-align: center;
  width:50%;
  background: #006a71;
  animation: gradientAnimation 10s ease infinite;

}


/* Import Google Font */
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600&display=swap');

/* General container styling */
.sign-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
  background: linear-gradient(135deg, rgb(242,239 , 231), #48A6A7);
  background-size: 400% 400%;
  animation: gradientAnimation 10s ease infinite;
  font-family: 'Poppins', sans-serif;

}

/* Gradient animation */
@keyframes gradientAnimation {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

/* Form container */
.sign-view, .login-view {
  background:  rgba(242, 239, 231, 0.69);
  padding: 2rem;
  border-radius: 15px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 400px;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1rem; /* Adds spacing between inputs */
}

/* Form styling */
.form {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.form input {
  width: 100%;
  max-width: 350px;
  padding: 0.8rem;
  margin: 0.5rem 0;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 1rem;
  font-family: 'Poppins', sans-serif;
}

.form input:focus {
  outline: none;
  border-color: #6a11cb;
  box-shadow: 0 0 5px rgba(106, 17, 203, 0.5);
}

/* Button styling */
.btn {
  width: 100%;
  max-width: 350px;
  padding: 0.8rem;
  margin-top: 1rem;
  background: #006a71;
  color: #fff;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
  font-family: 'Poppins', sans-serif;
  cursor: pointer;
  transition: background 0.3s ease, transform 0.2s ease;
}

.btn:hover {
  transform: scale(1.05);
}

.switch-btn {
  margin-top: 1rem;
  background: none;
  border: none;
  color: black;
  font-size: 0.9rem;
  font-family: 'Poppins', sans-serif;
  cursor: pointer;
  text-decoration: underline;
}

.switch-btn:hover {
    color: #006a71;
    text-decoration: none;
}

/* Headings */
h1 {
  color: #333;
  margin-bottom: 1rem;
  font-size: 1.8rem;
  font-weight: 600;
}


.gender-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem; /* Adds spacing between the labels */
  margin-top: 1rem; /* Adds spacing above the gender section */
  width: 100%; /* Ensures it spans the full width of the form */
  max-width: 350px; /* Matches the width of the input fields */
  padding: 0.8rem; /* Matches the padding of input fields */
  border: 1px solid #ccc; /* Matches the border style of input fields */
  border-radius: 5px; /* Matches the border radius of input fields */
  background: #fff; /* Matches the background color of input fields */
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1); /* Subtle shadow for a clean look */
}

.gender-container div {
  font-size: 1rem;
  font-family: 'Poppins', sans-serif;
  color: #333;
}

.gender-container label {
  display: flex;
  align-items: center;
  gap: 0.5rem; /* Adds spacing between the label text and the radio button */
  font-size: 1rem;
  font-family: 'Poppins', sans-serif;
  color: #333;
}

.gender-container input[type="radio"] {
  accent-color: #006a71; /* Changes the color of the radio button */
  cursor: pointer;
}


</style>