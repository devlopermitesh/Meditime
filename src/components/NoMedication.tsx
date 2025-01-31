import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native';
import {urls} from "../Images/Url"
const NoMedication = () => {
    const {width,height}=useWindowDimensions()
    const navigation = useNavigation(); 
  return (
    <View style={{height:"50%",justifyContent:"center",alignItems:"center"} }>
<Image source={{uri:urls.noMedicine}} style={{width:"100%" ,height:height*0.25,flex:1,resizeMode:"contain"}}/>
        
      <Text style={{color:"black",fontSize:20,fontWeight:"500",fontStyle:"normal",fontFamily:"bold"}}>No Medication</Text>
      <Text style={{color:"black",fontSize:14,fontWeight:"400",fontStyle:"italic",fontFamily:"bold",marginTop:5,lineHeight:20}}>Add your first medication to get started</Text>
    <TouchableOpacity style={{backgroundColor:"#82C8E5",padding:10,borderRadius:20,marginTop:20,paddingHorizontal:30,shadowColor: "#000",shadowOffset: { width: 0, height: 2 },shadowOpacity: 0.25,shadowRadius: 3.84,elevation: 5}}   
    //@ts-ignore      
    onPress={() => navigation.navigate("AddMedication" as string)}
    >
    <Text style={{color:"white",fontSize:18,fontWeight:"600",fontStyle:"normal",fontFamily:"bold"}}>Add Medication</Text>
    </TouchableOpacity>

    </View>
  )
}

export default NoMedication

const styles = StyleSheet.create({})