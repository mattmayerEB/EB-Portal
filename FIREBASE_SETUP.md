# Firebase Setup Guide for EB Portal

This guide will help you set up Firebase Authentication for your EB Portal login system.

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Enter a project name (e.g., "eb-portal")
4. Choose whether to enable Google Analytics (optional)
5. Click "Create project"

## Step 2: Enable Authentication

1. In your Firebase project console, click on "Authentication" in the left sidebar
2. Click "Get started"
3. Go to the "Sign-in method" tab
4. Click on "Email/Password"
5. Enable "Email/Password" authentication
6. Click "Save"

## Step 3: Get Your Firebase Configuration

1. In your Firebase project console, click on the gear icon (⚙️) next to "Project Overview"
2. Select "Project settings"
3. Scroll down to the "Your apps" section
4. Click the web icon (</>)
5. Register your app with a nickname (e.g., "EB Portal Web")
6. Copy the Firebase configuration object

## Step 4: Update Firebase Configuration

1. Open `firebase-config.js` in your project
2. Replace the placeholder values with your actual Firebase configuration:

```javascript
const firebaseConfig = {
  apiKey: "your-actual-api-key",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
};
```

## Step 5: Create User Accounts

Since sign-up is disabled for security, you need to create user accounts manually in Firebase Console:

1. In your Firebase project console, go to "Authentication"
2. Click on the "Users" tab
3. Click "Add user"
4. Enter the email and password for each user you want to grant access
5. Click "Add user" to create the account

## Step 6: Test the Setup

1. Open `index.html` in your browser
2. You should see the login page
3. Use one of the accounts you created in Firebase Console to sign in
4. You should be redirected to the main portal content

## Security Rules (Optional)

If you plan to use Firebase Firestore for additional data storage, you can set up security rules:

1. Go to Firestore Database in Firebase Console
2. Click on "Rules" tab
3. Add rules like:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## Troubleshooting

### Common Issues:

1. **"Firebase is not defined" error**
   - Make sure you've included the Firebase SDK scripts in your HTML
   - Check that the scripts are loaded before your custom JavaScript

2. **"Invalid API key" error**
   - Verify your Firebase configuration is correct
   - Make sure you're using the web app configuration, not mobile

3. **Authentication not working**
   - Ensure Email/Password authentication is enabled in Firebase Console
   - Check browser console for any JavaScript errors

4. **Login page not showing**
   - Verify that the login container is properly styled and visible
   - Check that the authentication state observer is working

### Browser Compatibility:

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Additional Features

### Password Reset (Future Enhancement)

To enable password reset functionality:

1. In Firebase Console, go to Authentication > Sign-in method
2. Enable "Email link (passwordless sign-in)" or use the built-in password reset
3. Update the forgot password functionality in `login.js`

### Social Login (Future Enhancement)

To add Google, Facebook, or other social logins:

1. In Firebase Console, go to Authentication > Sign-in method
2. Enable the desired providers
3. Add the necessary UI elements and authentication logic

## Support

If you encounter any issues:

1. Check the browser console for error messages
2. Verify your Firebase configuration
3. Ensure all required scripts are loaded
4. Test with a different browser

## Security Notes

- Never commit your Firebase API keys to public repositories
- Use environment variables for production deployments
- Consider implementing additional security measures like rate limiting
- Regularly review your Firebase project's security settings
