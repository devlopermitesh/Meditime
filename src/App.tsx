

import React from 'react';
import {
  SafeAreaView,
  StatusBar,
  Text,
  StyleSheet,
} from 'react-native';
import Routes from './routes/Routes';
import AppwriteProvider from './Appwrite/AppwriteContext';

function App(): React.JSX.Element {

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
