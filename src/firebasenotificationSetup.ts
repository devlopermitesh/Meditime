
import messaging from '@react-native-firebase/messaging';
import { Alert } from 'react-native';

// Permission request function
export async function requestUserPermission(): Promise<string | undefined> {
const authStatus = await messaging().requestPermission();
const enabled = authStatus === messaging.AuthorizationStatus.AUTHORIZED || authStatus === messaging.AuthorizationStatus.PROVISIONAL;

if (enabled) {
console.log('Notification permission granted.');
const token = await messaging().getToken();

return token;
}

}

// Foreground notifications handle// Function to handle incoming messages (foreground)
export function setupOnMessageListener(): void {
messaging().onMessage(async remoteMessage => {
try {
console.log('New Notification!', remoteMessage.notification?.body);
Alert.alert('New Notification!', remoteMessage.notification?.body);
} catch (error) {
console.error('Error in foreground message handler:', error);
// Optionally, you can show an alert or log to a service like Sentry or Firebase Crashlytics
Alert.alert('Error', 'Something went wrong while handling the notification');
}
});
}
