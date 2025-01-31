import { Image, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native'
import React from 'react'
import { urls } from '../Images/Url'
import useMedication from '../Store/Medication'
import Calendar from './Calendar'
import NoMedication from './NoMedication'
import ListMedicines from './ListMedicines'
const HistoryContent = () => {
    
    const {width,height}=useWindowDimensions()
    const {Medication,setMedication}=useMedication(state=>state)
  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 ,paddingBottom:80}}
    showsVerticalScrollIndicator={false}>
    <View  style={[styles.container]}>
      <View style={[styles.imagecontainer,{height:height*0.35}]}>
<Image source={{uri:urls.historyWallpaper}} style={{width:"100%" ,height:height*0.35,flex:1,resizeMode:"contain"}}/>
      </View>
      <View style={[styles.imagecontainer,{height:height*0.65}]}>

        <Calendar/>
<Text style={{fontWeight:"900",fontSize:24,color:"black",marginLeft:10}}>Medical History</Text>
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

export default HistoryContent

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