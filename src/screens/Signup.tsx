import { KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useContext, useState } from 'react'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { AuthStackParamList } from '../routes/AuthStack'
import { AppwriteContext } from '../Appwrite/AppwriteContext'
import Snackbar from 'react-native-snackbar'

type SignupScreenProps = NativeStackScreenProps<AuthStackParamList, 'signup'>

const Signup = ({navigation}:SignupScreenProps) => {

  const {appwrite, setIsloggedIn} = useContext(AppwriteContext)

  const [error, setError] = useState<string>('')
  const [name, setName] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [repeatPassword, setRepeatPassword] = useState<string>('')
  
  const handleSignup = () => {
    if (
      name.length < 1 ||
      email.length < 1 ||
      password.length < 1 ||
      repeatPassword.length < 1
      ) {
        setError('All fields are required');
      } else if (password !== repeatPassword) {
        setError('Passwords do not match');
      } else {
        appwrite
        .signup({email, username:name, password})
        .then((response:any) => {
          if (response) {
            // setIsloggedIn(true)
            Snackbar.show({
              text: 'Signup success',
              duration: Snackbar.LENGTH_SHORT
            })
            navigation.navigate('Login')
          }
        })
        .catch(e => {
          console.log("signup Error is ",e);
          setIsloggedIn(false)
          setError(e.message)

          
        })
    
  }
}

  return (
    <KeyboardAvoidingView
    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    style={styles.container}>
    <View style={styles.formContainer}>
      <Text style={styles.appName}>signup</Text>

      {/* Name */}
      <TextInput
        value={name}
        onChangeText={text => {
          setError('');
          setName(text);
        }}
        placeholderTextColor={'#aeaeae'}
        placeholder="Name"
        style={styles.input}
      />

      {/* Email */}
      <TextInput
        value={email}
        keyboardType="email-address"
        onChangeText={text => {
          setError('');
          setEmail(text);
        }}
        placeholderTextColor={'#aeaeae'}
        placeholder="Email"
        style={styles.input}
      />

      {/* Password */}
      <TextInput
        value={password}
        onChangeText={text => {
          setError('');
          setPassword(text);
        }}
        placeholderTextColor={'#aeaeae'}
        placeholder="Password"
        secureTextEntry
        style={styles.input}
      />

      {/* Repeat password */}
      <TextInput
        secureTextEntry
        value={repeatPassword}
        onChangeText={text => {
          setError('');
          setRepeatPassword(text);
        }}
        placeholderTextColor={'#aeaeae'}
        placeholder="Repeat Password"
        style={styles.input}
      />

      {/* Validation error */}
      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      {/* Signup button */}
      <Pressable
        onPress={handleSignup}
        style={[styles.btn, {marginTop: error ? 10 : 20}]}>
        <Text style={styles.btnText}>Sign Up</Text>
      </Pressable>

      {/* Login navigation */}
      <Pressable
        onPress={() => navigation.navigate('Login')}
        style={styles.loginContainer}>
        <Text style={styles.haveAccountLabel}>
          Already have an account?{'  '}
          <Text style={styles.loginLabel}>Login</Text>
        </Text>
      </Pressable>
    </View>
  </KeyboardAvoidingView>
  )
}

export default Signup


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  formContainer: {
    justifyContent: 'center',
    alignContent: 'center',
    height: '100%',
  },
  appName: {
    color: '#1d9bf0',
    fontSize: 40,
    fontWeight: 'bold',
    alignSelf: 'center',
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#f8f9fe',
    padding: 10,
    height: 40,
    alignSelf: 'center',
    borderRadius: 5,

    width: '80%',
    color: '#000000',

    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,

    elevation: 1,
  },
  errorText: {
    color: 'red',
    alignSelf: 'center',
    marginTop: 10,
  },
  btn: {
    backgroundColor: 'skyblue',
    padding: 10,
    height: 45,

    alignSelf: 'center',
    borderRadius: 5,
    width: '80%',
    marginTop: 10,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,

    elevation: 3,
  },
  btnText: {
    color: 'white',
    alignSelf: 'center',
    fontWeight: 'bold',
    fontSize: 18,
  },
  loginContainer: {
    marginTop: 60,
  },
  haveAccountLabel: {
    color: '#484848',
    alignSelf: 'center',
    fontWeight: 'bold',
    fontSize: 15,
  },
  loginLabel: {
    color: '#1d9bf0',
  },
});
