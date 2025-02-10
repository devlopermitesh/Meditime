import { Alert, Image, Pressable, StyleSheet, Text, Touchable, useWindowDimensions, View } from 'react-native'
import React, { useEffect } from 'react'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { RootStackParamAppList } from '../routes/AppStack'
import { urls } from '../Images/Url'
import { renderItem } from '../components/ListMedicines'
import Icon from "react-native-vector-icons/Ionicons"
import Snackbar from 'react-native-snackbar'
import { Medication, MedicationService } from '../Appwrite/Medication'
import { motivationalLines } from '../constant'
import useMedication from '../Store/Medication'
import axios from 'axios';
import report from '../Appwrite/Report'
type DetailsProps = NativeStackScreenProps<RootStackParamAppList, "TakeMedicine">
const getMotivationalLine = ():string => motivationalLines[Math.floor(Math.random() * motivationalLines.length)];
const TakeMedicine = ({navigation,route}:DetailsProps) => {
  const [item, setItem] = React.useState<Medication | null>(null);
  const {height}=useWindowDimensions()
    const {ID} = route.params
    const {changeStatus}=useMedication(state=>state)
    const date=useMedication(state=>state.CurrentDate)
    useEffect(()=>{
async function fetchItem(ID:string) {
  try {
    if(!ID) return null;

    const response = await MedicationService.getMedicationItem(ID);
    if(response) {
      setItem(response.data);
      Snackbar.show({text: getMotivationalLine(), duration: Snackbar.LENGTH_SHORT, backgroundColor: 'green'})
    }
  } catch (error:any) {
    console.log("Error fetching item:", error);
    Snackbar.show({text: error.message || "Something went wrong", duration: Snackbar.LENGTH_SHORT, backgroundColor: 'red'})
  }
}
fetchItem(ID)
    },[ID,setItem])
    const formatTime = (timeString: string) => {
      const date = new Date(timeString);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };
  
    // Function to format the date from the ReminderTime
    const formatDate = (timeString: string) => {
      const date = new Date(timeString);
      return date.toLocaleDateString(); // Default format "mm/dd/yyyy"
    };


    const Taken=async()=>{
try {
 
  const response=await MedicationService.MedicationTaken(item?.$id as string)
  
  if(response){
    changeStatus(response.data)
    updateReport(true)
    updatestatus()
    Snackbar.show({text: `Medication marked as ${item?.Todaystatus ? "Not Taken":"Taken" }`, duration: Snackbar.LENGTH_SHORT, backgroundColor: 'green'})
    navigation.goBack()
  }
} catch (error) {
  console.log(error)
}

    }

    const updateReport=async(Status:boolean)=>{
try {
  if (!item?.userId || !item?.$id || !item?.Name || item?.Todaystatus === undefined) {
    throw new Error("Missing required medication item details");
  }
  
  date.setHours(0,0,0,0)
  const localDateString = date.toISOString().split("T")[0];
  console.log("The date i am going to add in Report is ",localDateString)

  const addreport = await report.addReport({
    userId: item.userId,
    ReportDate: localDateString,
    MeditionId: item.$id,
    ReportName: item.Name,
    Taken: Status
  });
  console.log("Report is created",addreport)
} catch (error) {
  console.log(error)
}
    }


    const updatestatus=async()=>{
      axios.get('https://67a7015fca0d04c760bc.appwrite.global/')
      .then(response => {
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });

    }
    const Missed = async () => {
      try {
        Alert.alert(
          "Reminder",
          "You should take care, and take medication on time.",
          [
            {
              text: "OK",
              onPress: () => navigation.goBack(),
            },
          ],
          { cancelable: false }
        );
        await updateReport(false);
      } catch (error) {
        console.log(error);
        Alert.alert("Error", "Something went wrong, please try again later", [
          {
            text: "OK",
            onPress: () => {},
          },
        ]);
      }
    };

  return (
    <View style={styles.container}>

    <View style={[styles.imagecontainer,{height:height*0.35}]}>
      <Image source={{uri:urls.ReminderImage}} style={{width:"100%" ,height:height*0.35,flex:1,resizeMode:"contain"}}/>
            </View>
            <Text style={{color:"black",fontSize:15,fontWeight:"500",fontStyle:"normal",fontFamily:"bold"}}>
                 {item?.ReminderTime && formatDate(String(item.ReminderTime))}
                 </Text>
            <Text style={{color:"#448EE2",fontSize:30,fontWeight:"600",fontStyle:"normal",fontFamily:"bold"}}>
            {item?.ReminderTime && formatTime(String(item.ReminderTime))}


            </Text>
            <Text style={{color:"black",fontSize:16,fontWeight:"500",fontStyle:"normal",fontFamily:"bold"}}>
                {(item?.Todaystatus)?"Medicine is already taken 🙂":getMotivationalLine()}
              </Text>
            <View style={styles.itembox}>
            {item && renderItem({item, navigation:undefined},date)}
            </View>
            <View style={styles.buttoncontainer}>
            <Pressable 
              onPress={Missed} 
              style={({ pressed }) => [
              {
                backgroundColor: item?.Todaystatus ? "#d3d3d3" : "#f02e65",
                padding: 10,
                margin: 10,
                borderRadius: 10,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                opacity: pressed ? 0.8 : 1,
              },
              ]}
              disabled={item?.Todaystatus}
            >
              <Icon name="close-circle" size={20} color="white" style={{ marginRight: 5 }} />
              <Text style={{ color: "white", fontSize: 16, fontWeight: "600", fontStyle: "normal", fontFamily: "bold" }}>
              Missed
              </Text>
            </Pressable>
            <Pressable 
              onPress={Taken} 
              style={({ pressed }) => [
              {
                backgroundColor: item?.Todaystatus ? "#d3d3d3" : "#34C759",
                padding: 10,
                margin: 10,
                borderRadius: 10,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                opacity: pressed ? 0.8 : 1,
              },
              ]}
              disabled={item?.Todaystatus}
            >
              <Icon name="checkmark-circle" size={20} color="white" style={{ marginRight: 5 }} />
              <Text style={{ color: "white", fontSize: 16, fontWeight: "600", fontStyle: "normal", fontFamily: "bold" }}>
              Taken
              </Text>
            </Pressable>
            </View>
    </View>
  )
}

export default TakeMedicine

const styles = StyleSheet.create({
    container:{
      flex:1,
      justifyContent:"center",
      alignItems:"center",
        backgroundColor:"white",
        height:"100%",
        width:"100%"
    },
    imagecontainer:{
      width:"100%",
borderWidth:1,
borderColor:"white",
},
buttoncontainer:{
  flexDirection:"row",
  justifyContent:"center",
},
itembox:{
  width:"90%"
}
})