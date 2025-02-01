

import React, { useEffect } from 'react';
import {
  SafeAreaView,
  StatusBar,
  Text,
  StyleSheet,
  Platform,
} from 'react-native';
import Routes from './routes/Routes';
import AppwriteProvider from './Appwrite/AppwriteContext';
import SplashScreen from 'react-native-splash-screen'

function App(): React.JSX.Element {
useEffect(()=>{
  if(Platform.OS==='android'){
    SplashScreen.hide()
    
  }
},[])
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar />
      <AppwriteProvider>
        <Routes />
      </AppwriteProvider>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor:"white"
  },
});

export default App;
