/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './src/App';
import {name as appName} from './app.json';
import messaging from '@react-native-firebase/messaging';



messaging().setBackgroundMessageHandler(async remoteMessage => {
try {
console.log('Message handled in the background!', remoteMessage);
// You can add any background handling logic here
} catch (error) {
console.error('Error in background message handler:', error);
// Optionally, log error or handle accordingly
}
});
AppRegistry.registerComponent(appName, () => App);
