import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert } from 'react-native';
import axios from 'axios';
import { PinataSDK } from "pinata";
import { router } from 'expo-router';

const Login = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const pinataJwt = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiI3ZTQzMTc0ZC0yMjlhLTRiNTYtYTM4OC1iMzlkNmJlNmZkZjEiLCJlbWFpbCI6ImF5YWFuLmJhcmdlZXJAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInBpbl9wb2xpY3kiOnsicmVnaW9ucyI6W3siZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjEsImlkIjoiRlJBMSJ9LHsiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjEsImlkIjoiTllDMSJ9XSwidmVyc2lvbiI6MX0sIm1mYV9lbmFibGVkIjpmYWxzZSwic3RhdHVzIjoiQUNUSVZFIn0sImF1dGhlbnRpY2F0aW9uVHlwZSI6InNjb3BlZEtleSIsInNjb3BlZEtleUtleSI6ImZhYjBkNjlmYWJiZjZhNjUwMGUzIiwic2NvcGVkS2V5U2VjcmV0IjoiNzg4ZGU3NWEwMzg0NDljYTFjMzcxYTIxNzFlZWI2ODZiYWE4Y2EyZDU0NTc2ZDgwY2QwZTM1OWY4NGNmZWI5MCIsImV4cCI6MTc1OTYzMjUwOH0.HxtiMazJJJo45Kt3nTjOnl7Y0uRpDaS0L0EHM17kDhQ"
  const pinataGateway = "ivory-hidden-thrush-846.mypinata.cloud"
  const userscid = "bafkreigk3gef4zfasqndybzk5httrq6ry3tycov6b2llmk44b44huvm3dq"
  const pinata = new PinataSDK({
    pinataJwt: pinataJwt,
    pinataGateway: pinataGateway,
  });

  const fetchUsersFromPinata = async () => {
    try {
      const data = await pinata.gateways.get(userscid);
      if (data && data.data && typeof (data.data) == 'string') {
        return JSON.parse(data.data)
      }
    } catch (error) {
      console.log(error);
    }
  };


  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }
    const users = await fetchUsersFromPinata();
    if (users && users['users']) {
      let userExists = false;

      for (let i = 0; i < users['users'].length; i++) {
        const user = users['users'][i];
        if (user.username === email && user.password === password) {
          userExists = true;
          break; // No need to continue once we find a match
        }
      }
      if (userExists) {
        router.replace('/home');
      }
    } else {
      Alert.alert('Error', 'Invalid email or password');
    }
  };

  const handleSignUp = () => {
    Alert.alert(
      'Sign Up',
      'Sign up functionality will be available soon!',
      [{ text: 'OK', onPress: () => console.log('OK Pressed') }]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#888"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#888"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.signupButton} onPress={handleSignUp}>
        <Text style={styles.signupText}>Don't have an account? Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff3e6', // Background color
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: 'bold',
    color: '#b35242', // Title text color
  },
  input: {
    width: '80%',
    height: 50,
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    marginBottom: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#c47a6d', // Border color for inputs
  },
  button: {
    width: '80%',
    height: 50,
    backgroundColor: '#e2a67d', // Button background color
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  signupButton: {
    marginTop: 20,
  },
  signupText: {
    color: '#b35242',
    fontSize: 16,
  },
});

export default Login;
