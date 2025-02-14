
import messaging from '@react-native-firebase/messaging';
import notifee from '@notifee/react-native';

// Permission request function
export async function requestUserPermission(): Promise<string | undefined> {
const authStatus = await messaging().requestPermission();
const enabled = authStatus === messaging.AuthorizationStatus.AUTHORIZED || authStatus === messaging.AuthorizationStatus.PROVISIONAL;

if (enabled) {
const token = await messaging().getToken();

return token;
}

}

// Foreground notifications handle// Function to handle incoming messages (foreground)
export function setupOnMessageListener(): void {
messaging().onMessage(async remoteMessage => {
try {
    
     // Extract Notification Data
     const { title, body, android } = remoteMessage.notification || {};
     const imageUrl = android?.imageUrl || null;
     const sound = android?.sound || "default";

     // Create a notification channel
     const channelId = await notifee.createChannel({
       id: 'default',
       name: 'Default Channel',
       sound: sound,  // Ensure sound is set
     });

     // Display the notification
     await notifee.displayNotification({
       title: title || 'New Notification',
       body: body || 'You have a new message',
       android: {
         channelId,
         smallIcon: 'ic_launcher', // Ensure you have this icon in res/drawable
         largeIcon: imageUrl as string, // Show the image in notification
         sound: sound,  // Play sound
         pressAction: {
           id: 'default',
         },
       },
     });

} catch (error) {
console.error('Error in foreground message handler:', error);
// Optionally, you can show an alert or log to a service like Sentry or Firebase Crashlytics
}
});
}
