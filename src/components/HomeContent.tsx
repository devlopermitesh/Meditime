import { Alert, Image, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native'
import React, { useEffect } from 'react'
import { urls } from '../Images/Url'
import Calender from './Calendar'
import ListMedicines from './ListMedicines'
import useMedication from '../Store/Medication'
import NoMedication from './NoMedication'
import Snackbar from 'react-native-snackbar'
import { MedicationService } from '../Appwrite/Medication'
import { useUser } from '../Store/users'

const HomeContent = () => {
    const {width,height}=useWindowDimensions()
    const {Medication,setMedication}=useMedication(state=>state)
    const {user}=useUser()
    useEffect(()=>{
    async  function fetchData(){
try {
  if(user.email){
    const startDate = new Date();
    startDate.setHours(23, 59, 59, 999);

    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 1);
    const response = await MedicationService.getdateMedications(user.email, startDate, endDate);
    console.log("Data ",response)

    if(response){
    setMedication(response)
    Snackbar.show({text: "Medication fetched successfully", duration: Snackbar.LENGTH_SHORT, backgroundColor: 'green'})
    }
  }
} catch (error:any) {
  console.log("Error",error)
  Snackbar.show({text: error.message || "Something went wrong", duration: Snackbar.LENGTH_SHORT, backgroundColor: 'red'})
} 
      }
      fetchData()
    },[setMedication,user])
    if(Medication.length<=0){
     return(
      <NoMedication/>
     ) 
    }
  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 ,paddingBottom:80}}
    showsVerticalScrollIndicator={false}>
    <View  style={[styles.container]}>
      <View style={[styles.imagecontainer,{height:height*0.35}]}>
<Image source={{uri:urls.welcomeImage}} style={{width:"100%" ,height:height*0.35,flex:1,resizeMode:"contain"}}/>
      </View>
      <View style={[styles.imagecontainer,{height:height*0.65}]}>
        <Calender/>

        {/* list of medicines  */}

{
    (Medication && Medication.length<=0)?
    <>
    <NoMedication/>
    </>
    :
    <ListMedicines/>
    }


        </View>
        
    </View>
    </ScrollView>
  )
}

export default HomeContent

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
      },
      imagecontainer:{
        width:"100%",
borderWidth:1,
borderColor:"white",
},
Text:{
    fontSize:20,
    fontWeight:"700",
    color:"black",
    textAlign:"center",
    marginTop:10,
    marginRight:"auto",
    marginLeft:10
}
})