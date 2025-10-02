import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  Alert, ActivityIndicator, ScrollView, KeyboardAvoidingView, Platform, SafeAreaView
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import Colors from '../../constant/colors';

const API_URL = Platform.OS === 'android' ? 'http://10.0.2.2:3001' : 'http://172.20.10.9:3001';

const SignUpScreen = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);

  const validationSchema = Yup.object().shape({
    username: Yup.string().min(3, 'Username must be at least 3 characters').required('Username is required'),
    fullName: Yup.string().required('Full name is required'),
    email: Yup.string().email('Invalid email address').required('Email is required'),
    password: Yup.string().min(8, 'Password must be at least 8 characters').required('Password is required'),
  });

  const handleSignUp = async (values: any) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: values.username,
          fullName: values.fullName,
          email: values.email,
          password: values.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      Alert.alert('Success!', 'Your account has been created.', [
        // @ts-ignore
        { text: 'OK', onPress: () => navigation.replace('MainApp') }
      ]);

    } catch (error: any) {
      Alert.alert('Sign Up Failed', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <Text style={styles.title}>Create your Kovah Account</Text>
          <Text style={styles.subtitle}>Join the community of educators and learners.</Text>

          <Formik
            initialValues={{ username: '', fullName: '', email: '', password: '' }}
            validationSchema={validationSchema}
            onSubmit={handleSignUp}
          >
            {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
              <View style={styles.form}>
                <TextInput
                  style={styles.input}
                  placeholder="Username"
                  value={values.username}
                  onChangeText={handleChange('username')}
                  onBlur={handleBlur('username')}
                  autoCapitalize="none"
                />
                {touched.username && errors.username && <Text style={styles.errorText}>{String(errors.username)}</Text>} {/* <-- CHANGE */}

                <TextInput
                  style={styles.input}
                  placeholder="Full Name"
                  value={values.fullName}
                  onChangeText={handleChange('fullName')}
                  onBlur={handleBlur('fullName')}
                  autoCapitalize="words"
                />
                {touched.fullName && errors.fullName && <Text style={styles.errorText}>{String(errors.fullName)}</Text>} {/* <-- CHANGE */}

                <TextInput
                  style={styles.input}
                  placeholder="Email"
                  value={values.email}
                  onChangeText={handleChange('email')}
                  onBlur={handleBlur('email')}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
                {touched.email && errors.email && <Text style={styles.errorText}>{String(errors.email)}</Text>} {/* <-- CHANGE */}
                
                <TextInput
                  style={styles.input}
                  placeholder="Password"
                  value={values.password}
                  onChangeText={handleChange('password')}
                  onBlur={handleBlur('password')}
                  secureTextEntry
                />
                {touched.password && errors.password && <Text style={styles.errorText}>{String(errors.password)}</Text>} {/* <-- CHANGE */}

                <TouchableOpacity
                  style={[styles.button, loading && styles.buttonDisabled]}
                  onPress={() => handleSubmit()}
                  disabled={loading}
                >
                  {loading ? <ActivityIndicator color={Colors.WHITE} /> : <Text style={styles.buttonText}>Sign Up</Text>}
                </TouchableOpacity>
              </View>
            )}
          </Formik>
          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account?</Text>
            <TouchableOpacity onPress={() => alert("Sign In screen not created yet.")}>
                <Text style={styles.linkText}> Sign In</Text>
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

export default SignUpScreen;