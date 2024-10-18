import React, { useState } from 'react';
import { View, Text, TextInput, Alert, StyleSheet } from 'react-native';
import { auth, db } from './firebaseConfig'; // Import Firebase auth and db instances
import { updateEmail, reauthenticateWithCredential, EmailAuthProvider, sendEmailVerification } from 'firebase/auth';
import { ref, update } from 'firebase/database';
import { Pressable } from 'react-native';

const EmailChange = () => {
  const [newEmail, setNewEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleFirebaseError = (error) => {
    switch (error.code) {
      case 'auth/wrong-password':
        Alert.alert('Error', 'Incorrect password. Please try again.');
        break;
      case 'auth/email-already-in-use':
        Alert.alert('Error', 'This email is already associated with another account.');
        break;
      case 'auth/invalid-email':
        Alert.alert('Error', 'Invalid email format.');
        break;
      case 'auth/requires-recent-login':
        Alert.alert('Error', 'Please log in again to change your email.');
        break;
      default:
        Alert.alert('Error', error.message);
    }
  };

  const handleSendVerification = async () => {
    if (!newEmail || !password) {
      Alert.alert('Error', 'Please enter both email and password.');
      return;
    }

    if (!validateEmail(newEmail)) {
      Alert.alert('Error', 'Please enter a valid email address.');
      return;
    }

    setLoading(true);
    const user = auth.currentUser;

    if (!user) {
      Alert.alert('Error', 'No user is signed in.');
      setLoading(false);
      return;
    }

    // Log the user's current email for debugging purposes
    console.log("User email: ", user.email);
    console.log("Entered password: ", password);

    try {
      // Re-authenticate the user with their current email and password
      const credential = EmailAuthProvider.credential(user.email, password);

      await reauthenticateWithCredential(user, credential);
      console.log('Re-authentication successful.');

      // Send verification email to the new email address
      const actionCodeSettings = {
        url: 'https://your-app-url.com/verify-email', // Replace with your app's verification URL
        handleCodeInApp: true, 
      };

      await sendEmailVerification(user, actionCodeSettings);
      setIsVerified(true);
      Alert.alert('Verification', `A verification link has been sent to ${newEmail}. Please verify before updating.`);

    } catch (error) {
      console.log('Error during verification or email update:', error);
      handleFirebaseError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateEmail = async () => {
    const user = auth.currentUser;

    if (!isVerified) {
      Alert.alert('Error', 'Please verify your new email before updating.');
      return;
    }

    try {
      // Now update the email in Firebase Authentication
      await updateEmail(user, newEmail);

      // Optionally, update the email in the Realtime Database
      const userRef = ref(db, `users/${user.uid}`);
      await update(userRef, { email: newEmail });

      Alert.alert('Success', 'Your email address has been updated.');
    } catch (error) {
      console.log('Error during email update:', error);
      handleFirebaseError(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Change Email Address</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your new email"
        value={newEmail}
        onChangeText={setNewEmail}
        inputMode="email"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Enter your password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      {!isVerified ? (
        <Pressable
          style={styles.button}
          onPress={handleSendVerification}
          disabled={loading}
        >
          <Text style={styles.buttonText}>{loading ? 'Sending...' : 'Send Verification Email'}</Text>
        </Pressable>
      ) : (
        <Pressable
          style={styles.button}
          onPress={handleUpdateEmail}
          disabled={loading}
        >
          <Text style={styles.buttonText}>{loading ? 'Updating...' : 'Update Email'}</Text>
        </Pressable>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default EmailChange;
