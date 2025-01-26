import { StyleSheet, Text, View, SafeAreaView, Image, Pressable, useWindowDimensions, Alert } from 'react-native'
import React, { useContext, useState, useEffect } from 'react'
//react native elements
//Snackbar
import Snackbar from 'react-native-snackbar'
import  Ionicons from 'react-native-vector-icons/AntDesign'; 

//context API
import { AppwriteContext } from '../Appwrite/AppwriteContext';
type UserObj = {
  name: String;
  email: String;
}



const Home = () => {
  const [userData, setUserData] = useState<UserObj>()
  const {appwrite, setIsloggedIn} = useContext(AppwriteContext)
  const {width,height}=useWindowDimensions()

  const handleLogout = () => {
    appwrite.logout()
    .then(() => {
      setIsloggedIn(false);
      Snackbar.show({
        text: 'Logout Successful',
        duration: Snackbar.LENGTH_SHORT
      })
    })
  }

  useEffect(() => {
    appwrite.getUser()
    .then(response => {
      if (response) {
        const user: UserObj = {
          name: response.name,
          email: response.email
        }
        setUserData(user)
      }
    })
  }, [appwrite])
  

  
    return (
      <SafeAreaView style={styles.container}>
        <View style={[styles.welcomeContainer,{height:height*0.08}]}>
<Image source={require('../Images/stars.png')} height={20} width={20} style={[{height:40,width:40}]}></Image>
          <Text style={styles.message}>Welcome {userData?.name}👋</Text>
          <Pressable onPress={()=>Alert.alert("Ad new medication")}  style={[{flex:1,flexDirection:"row",alignItems:"center",justifyContent:"flex-end",marginRight:10}]}>
          
          <Ionicons name={'medicinebox'} size={34} color="#305cde" />
          </Pressable>
          </View>
          <Image source={require('../Images/Medication1.png')} style={{width:"100%" ,height:height*0.25,flex:1,resizeMode:"contain"}}></Image>

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
  calendarDate:{

  }
});

export default Home