import { StyleSheet, Text, View, SafeAreaView, Image, Pressable, useWindowDimensions, Alert } from 'react-native'
import React, { useContext, useState, useEffect } from 'react'
//react native elements
//Snackbar
import Snackbar from 'react-native-snackbar'
import  Ionicons from 'react-native-vector-icons/AntDesign'; 

//context API
import { AppwriteContext } from '../Appwrite/AppwriteContext';
import NoMedication from '../components/NoMedication';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamAppList } from '../routes/AppStack';
import { urls } from '../Images/Url';
import { MedicationService } from '../Appwrite/Medication';
import { motivationalLines } from '../constant';
import { useUser } from '../Store/users';
import useMedication from '../Store/Medication';
import HomeContent from '../components/HomeContent';


// type LoginScreenProps = NativeStackScreenProps<AuthStackParamList
type HomeScreenProps=NativeStackScreenProps<RootStackParamAppList,'Home'>

const Home = ({ navigation }: HomeScreenProps) => {
  const {appwrite, setIsloggedIn} = useContext(AppwriteContext)
  const {width,height}=useWindowDimensions()
  const users=useUser(state=>state)

useEffect(() => {
  async function fetchData() {
    try {
      const response = await appwrite.getUser();
      if (response) {
        users.setUserId(response.$id, response.name, response.email);
      }
          } catch (error: any) {
      Snackbar.show({
        text: error.message || "Something went wrong",
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: 'red',
      });
    }
  }


  fetchData();
}, [appwrite]);

  
    return (
      <SafeAreaView style={styles.container}>
        <View style={[styles.welcomeContainer,{height:height*0.08}]}>
<Image source={{uri:urls.StarShine}} height={20} width={20} style={[{height:40,width:40}]}></Image>
          <Text style={styles.message}>Welcome {users.user?.name}👋</Text>
          <Pressable onPress={()=>navigation.navigate("AddMedication")}  style={[{flex:1,flexDirection:"row",alignItems:"center",justifyContent:"flex-end",marginRight:10}]}>
          
          <Ionicons name={'medicinebox'} size={34} color="#305cde" />
          </Pressable>
          </View>
          <HomeContent/>

          
      </SafeAreaView>
    );
  
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  welcomeContainer: {
    padding: 6,
width:"100%",
borderWidth:1,
flexDirection:"row",
justifyContent:"space-between"

  },
  message: {
    fontSize: 26,
    fontWeight: '500',
    color:'black',
    
  },

});

export default Home