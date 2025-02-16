import { Alert, KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native'
import React from 'react'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { AuthStackParamList } from '../routes/AuthStack'
import { AppwriteContext } from '../Appwrite/AppwriteContext'
import Snackbar from 'react-native-snackbar'
type LoginScreenProps = NativeStackScreenProps<AuthStackParamList, 'Login'>
const Login = ({navigation}:LoginScreenProps) => {
  const {appwrite, setIsloggedIn} = React.useContext(AppwriteContext)
  const [email, setEmail] = React.useState<string>('')
  const [password, setPassword] = React.useState<string>('')
  const [error, setError] = React.useState<string>('');
  
  const handleLogin = () => {
    if (email.length < 1 || password.length < 1) {
      setError('All fields are required')
    } else {
  
      appwrite
      .login({email,password})
      .then((response) => {
        if (response) {
          setIsloggedIn(true);
          Snackbar.show({
            text: 'Login Success',
            duration: Snackbar.LENGTH_SHORT
          })
        }
      })
      .catch(e => {
        console.log(e);
        setError('Incorrect email or password');

        
      })
    }
  }

  return (

    <KeyboardAvoidingView
    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    style={styles.container}>
    <View style={styles.formContainer}>
      <Text style={styles.appName}>Medicate


      </Text>
      
      {/* Email */}
      <TextInput
        keyboardType="email-address"
        value={email}
        onChangeText={text => setEmail(text)}
        placeholderTextColor={'#AEAEAE'}
        placeholder="Email"
        style={styles.input}
      />

      {/* Password */}
      <TextInput
        value={password}
        onChangeText={text => setPassword(text)}
        placeholderTextColor={'#AEAEAE'}
        placeholder="Password"
        style={styles.input}
        secureTextEntry
      />

      {/* Validation error */}
      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      {/* Login button */}
      <Pressable
        onPress={handleLogin}
        style={[styles.btn, {marginTop: error ? 10 : 20}]}>
        <Text style={styles.btnText}>Login</Text>
      </Pressable>

      {/* Sign up navigation */}
      <Pressable
        onPress={() => navigation.navigate('signup')}
        style={styles.signUpContainer}>
        <Text style={styles.noAccountLabel}>
          Don't have an account?{'  '}
          <Text style={styles.signUpLabel}>Create an account</Text>
        </Text>
      </Pressable>
    </View>
  </KeyboardAvoidingView>
  )
}

export default Login


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
    backgroundColor: '#1d9bf0',
    padding: 10,
    height: 45,
   color:"white",
    alignSelf: 'center',
    borderRadius: 5,
    width: '80%',
    marginTop: 20,

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
  signUpContainer: {
    marginTop: 80,
  },
  noAccountLabel: {
    color: '#484848',
    alignSelf: 'center',
    fontWeight: 'bold',
    fontSize: 15,
  },
  signUpLabel: {
    color: '#1d9bf0',
  },
});