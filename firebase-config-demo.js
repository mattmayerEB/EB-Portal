// Demo Firebase configuration - Replace with your actual Firebase project credentials
// Copy this file to firebase-config.js and update with your real values
// Note: Sign-up functionality is disabled for security - only pre-created users can access

const firebaseConfig = {
  apiKey: "AIzaSyC_your_actual_api_key_here",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
const auth = firebase.auth();

// Auth state observer
auth.onAuthStateChanged((user) => {
  if (user) {
    // User is signed in
    console.log('User is signed in:', user.email);
    // Don't automatically show main content - let the page handle it
  } else {
    // User is signed out
    console.log('User is signed out');
    // Don't automatically show login page - let the page handle it
  }
});

// Show login page
function showLoginPage() {
  document.getElementById('login-container').style.display = 'flex';
  document.getElementById('main-content').style.display = 'none';
}

// Show main content
function showMainContent() {
  document.getElementById('login-container').style.display = 'none';
  document.getElementById('main-content').style.display = 'block';
}

// Sign in function
function signIn(email, password) {
  return auth.signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      // Signed in successfully
      const user = userCredential.user;
      console.log('Signed in successfully:', user.email);
      return user;
    })
    .catch((error) => {
      console.error('Sign in error:', error);
      throw error;
    });
}



// Sign out function
function signOut() {
  return auth.signOut()
    .then(() => {
      console.log('Signed out successfully');
    })
    .catch((error) => {
      console.error('Sign out error:', error);
      throw error;
    });
}

// Get current user
function getCurrentUser() {
  return auth.currentUser;
}
