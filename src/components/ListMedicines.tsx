import { Alert, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { memo } from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import useMedication from '../Store/Medication';
import { Medication } from '../Appwrite/Medication';
import { useNavigation } from '@react-navigation/native';
import { NavigationProp } from '@react-navigation/native';
import { RootStackParamAppList } from '../routes/AppStack';


 export const renderItem =(({
  item,
  navigation,
}: {
  item: Medication;
  navigation?: NavigationProp<RootStackParamAppList>;
},CurrentDate:Date): JSX.Element => (
  <TouchableOpacity
    style={styles.listbox}
    key={item.$id}
    onPress={() =>{
      
const todayMidnight =CurrentDate.setHours(0, 0, 0, 0);
const tommorowMidnight=CurrentDate.setHours(23, 0, 0, 0);
const reminderTime = new Date(item.ReminderTime).getTime();

const IsPrevious = reminderTime < todayMidnight; // Past
const IsToday = reminderTime >= todayMidnight && reminderTime < tommorowMidnight; // Same Day (Before Current Time)
const IsFuture = reminderTime >= tommorowMidnight; // Future

if (IsPrevious) {
  Alert.alert(
    "⏰ Uh-oh! You can't take medicine before there time! 💕",
    "",
    [{ text: "OK", onPress: () => {} }]
  );
} else if (IsToday) {
  navigation && navigation.navigate('TakeMedicine', { ID: item.$id ?? '' });
} else if (IsFuture) {
  Alert.alert(
    "⏳ This medicine is scheduled for a future time!",
    "",
    [{ text: "OK", onPress: () => {} }]
  );
}

      
    } }
  >
    {item.Todaystatus ? (
      <Icon name="checkmark-circle" size={20} color="#90EE90" />
    ) : (
      <Icon name="close-circle" size={20} color="red" />
    )}
    <Image source={{ uri: item.ImageUrl }} style={styles.image} />
    <View style={styles.textContainer}>
      <Text style={styles.NameMedicine}>{item.Name}</Text>
      <Text style={styles.whentoTime}>{item.WhentoTake}</Text>
      <Text style={styles.Dose}>
        {item.Dose} {item.DosageForms}
      </Text>
    </View>
    <View style={styles.timecontainer}>
      <Icon name="time-outline" size={20} color="black" />
      <Text style={styles.time}>
        {new Date(item.ReminderTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </Text>
    </View>
  </TouchableOpacity>
));

const ListMedicines = () => {
  const {Medication,CurrentDate} = useMedication((state) => state);
  const navigation: NavigationProp<RootStackParamAppList> = useNavigation();
  return (
    <View style={styles.container}>
      {Medication && Medication.length > 0 ? (
Medication.map((item) => renderItem({item, navigation},CurrentDate)) // Map through the data and render each item manually
      ) : (
        <Text>No Medicines Available</Text>
      )}
    </View>
  );
};

export default ListMedicines;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow:"visible",
    padding: 10,
  },
  listbox: {
    borderWidth: 1,
    borderColor: "rgba(128,128,128,0.2)",
    height: 90,
    padding: 10,
    borderRadius: 8,
    marginVertical: 5,
    flexDirection: "row",
    backgroundColor: "#fff", // White background for each item
    alignItems: "center",
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2, // Shadow for Android
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
    justifyContent: "center",
  },
  NameMedicine: {
    color: "black",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 3,
  },
  whentoTime: {
    color: "gray",
    fontSize: 12,
  },
  Dose: {
    color: "skyblue",
    fontSize: 12,
    fontWeight: "bold",
  },
  timecontainer: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(128,128,128,0.4)",
    borderRadius: 5,
    padding: 5,
    marginLeft: 10,
  },
  time: {
    color: "black",
    fontSize: 13,
    fontWeight: "bold",
  },
});
