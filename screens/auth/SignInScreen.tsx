import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  Alert, ActivityIndicator, ScrollView, KeyboardAvoidingView, Platform, SafeAreaView
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import Colors from '../../constant/colors';
import AsyncStorage from '@react-native-async-storage/async-storage'; // <-- IMPORT ASYNCSTORAGE

const API_URL = Platform.OS === 'android' ? 'http://10.0.2.2:3001' : 'http://172.20.10.9:3001';

const SignInScreen = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);

  // ... (validationSchema remains the same)

  const handleSignIn = async (values: any) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/auth/signin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Sign in failed');
      }
      
      // --- ADD THIS BLOCK TO SAVE THE TOKEN ---
      if (data.token) {
        await AsyncStorage.setItem('userToken', data.token);
        console.log('Token saved to AsyncStorage!');
      }
      // ------------------------------------

      Alert.alert('Success!', 'You are now signed in.', [
        // @ts-ignore
        { text: 'OK', onPress: () => navigation.replace('MainApp') }
      ]);

    } catch (error: any) {
      Alert.alert('Sign In Failed', error.message);
    } finally {
      setLoading(false);
    }
  };

  // ... (the rest of the JSX and styles remain the same)
  // ...
  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <Text style={styles.title}>Welcome Back!</Text>
          <Text style={styles.subtitle}>Sign in to your Kovah account.</Text>
          <Formik
            initialValues={{ email: '', password: '' }}
            validationSchema={Yup.object().shape({
              email: Yup.string().email('Invalid email address').required('Email is required'),
              password: Yup.string().required('Password is required'),
            })}
            onSubmit={handleSignIn}
          >
            {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
              <View style={styles.form}>
                <TextInput
                  style={styles.input}
                  placeholder="Email"
                  value={values.email}
                  onChangeText={handleChange('email')}
                  onBlur={handleBlur('email')}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
                {touched.email && errors.email && <Text style={styles.errorText}>{String(errors.email)}</Text>}
                <TextInput
                  style={styles.input}
                  placeholder="Password"
                  value={values.password}
                  onChangeText={handleChange('password')}
                  onBlur={handleBlur('password')}
                  secureTextEntry
                />
                {touched.password && errors.password && <Text style={styles.errorText}>{String(errors.password)}</Text>}
                <TouchableOpacity
                  style={[styles.button, loading && styles.buttonDisabled]}
                  onPress={() => handleSubmit()}
                  disabled={loading}
                >
                  {loading ? <ActivityIndicator color={Colors.WHITE} /> : <Text style={styles.buttonText}>Sign In</Text>}
                </TouchableOpacity>
              </View>
            )}
          </Formik>
          <View style={styles.footer}>
            <Text style={styles.footerText}>Don't have an account?</Text>
            {/* @ts-ignore */}
            <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
                <Text style={styles.linkText}> Sign Up</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.WHITE,
  },
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.BLACK,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: Colors.GRAY,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 32,
  },
  form: {
    width: '100%',
  },
  input: {
    backgroundColor: '#f0f2f5',
    padding: 16,
    borderRadius: 8,
    fontSize: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  button: {
    backgroundColor: Colors.PRIMARY,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonDisabled: {
      backgroundColor: '#93c5fd',
  },
  buttonText: {
    color: Colors.WHITE,
    fontWeight: 'bold',
    fontSize: 16,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  footerText: {
    fontSize: 15,
    color: Colors.GRAY,
  },
  linkText: {
    fontSize: 15,
    color: Colors.PRIMARY,
    fontWeight: 'bold',
  },
  errorText: {
    color: Colors.ERROR,
    marginBottom: 10,
    marginTop: -6,
  },
});
export default SignInScreen;