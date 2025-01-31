import { Alert, FlatList, Image, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native'
import Ionicons from "react-native-vector-icons/FontAwesome5"
import React, { useContext, useEffect, useState } from 'react'
import { AppwriteContext } from '../Appwrite/AppwriteContext'
import {urls} from "../Images/Url"
import { useUser } from '../Store/users'
import { createNativeStackNavigator, NativeStackScreenProps } from '@react-navigation/native-stack'
import { RootStackParamAppList } from '../routes/AppStack'
type UserObj = {
  name: String;
  email: String;
}

enum Name{
  ADDmedicine,
  MyMedications,
  History,
  logout
}
type listoption={
  id:number,
  name:Name,
  label:string,
  icon:string
}
const ListOptions:listoption[]=[
  {
    id:1,
    name:Name.ADDmedicine,
    label:"Add New Medicines",
    icon:"plus-circle",  
  },
  {
    id:2,
    name:Name.MyMedications,
    label:"My Medicines",
    icon:"briefcase-medical"
  },
  {
    id:3,
    name:Name.History,
    label:"History",
    icon:"history"
  },
  {
    id:4,
    name:Name.logout,
    label:"Logout",
    icon:"sign-out-alt"
  }

]




type ProfleScreenProps=NativeStackScreenProps<RootStackParamAppList,'Profile'>
const Profile = ({ navigation }: ProfleScreenProps) => {
  const {width,height}=useWindowDimensions()
  const {user}=useUser()
  const {appwrite, setIsloggedIn} = useContext(AppwriteContext)

  const handleLogout = () => {
    appwrite.logout()
    .then(() => {
      
      setIsloggedIn(false);
      
    })
  }

   

    const handlePress=({name}:{name:Name})=>{
      switch (name) {
        case Name.ADDmedicine:
          navigation.navigate("AddMedication")
          break;
        case Name.MyMedications:
          navigation.navigate('Home')
          break;
        case Name.History:
          navigation.navigate('History')
          break;
        case Name.logout:
          Alert.alert("Medicate","Are you sure you want to logout?",[{text:"Yes",onPress:handleLogout},{text:"No"}])
          break;
        default:
          break;
      }
    }
      

    
const Itemoption = ({ item }: { item: listoption }): JSX.Element => {

  return (
  <TouchableOpacity onPress={() => handlePress({name:item.name}) } style={styles.ItemContainer}>
      
<View style={{flex:3/4,justifyContent:'center',alignItems:"center",backgroundColor:"rgba(130,200,229,0.6)",borderRadius:10,
paddingVertical:10, 
  marginHorizontal:10}}>
<Ionicons name={item.icon} size={24} color="#305cde" />
</View>
<Text style={{color:'black',fontFamily:"900",fontSize:20,flex:3}}>{item.label}</Text>
  </TouchableOpacity>);
};
  
  return (
    <View style={styles.contaner}>
      <Text style={{color:"black",fontSize:30,fontWeight:"700",backgroundColor:"white",marginRight:"auto",marginLeft:10}}>Profile</Text>

      <View style={[styles.imagecontainer,{height:height*0.3,width:width*0.98}]}>
        <Image source={{uri:urls.HappyEmoji}} style={styles.image} />
      <Text style={{color:'black',fontFamily:"800",fontSize:20}}>{user?.name}</Text>
      <Text style={{color:"gray",fontFamily:"400",fontSize:12}}>{user?.email}</Text>
  </View>
  <FlatList 
    renderItem={Itemoption} 
    data={ListOptions} 
    style={{ backgroundColor: 'white' }}
    ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
  />
    </View>
  )
}

export default Profile

const styles = StyleSheet.create({
contaner:{
  width:"100%",
  height:"100%",
},
imagecontainer:{
  backgroundColor:"white",
  flex:1,
  flexDirection:"column",
  justifyContent:"center",
  alignItems:'center',
  textAlign:"center"
 },
 image:{
  width:"50%",
  height:"50%",
  objectFit:"contain",
marginHorizontal:"auto"
 },
ItemContainer:{
  flex:1,
  flexDirection:"row",
  justifyContent:"space-around",   
  alignItems:'center',
   height:50,
   width:"80%",
   marginHorizontal:"auto",
   alignSelf: 'center',
   borderRadius: 5,
   backgroundColor:"white"
}
})
