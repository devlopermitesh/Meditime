import { ActivityIndicator, Image, StyleSheet, Text, useWindowDimensions, View } from 'react-native'
import React from 'react'

const Loading = () => {
  return (
    <View style={[styles.container,{height:'100%'}]}>
      <Text style={styles.title}>Medicate</Text>
      <ActivityIndicator size="large" color="#1d9bf0" style={styles.loader} />
      <Text style={styles.subtitle}>Loading...</Text>
    </View>
  )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        height:300,
        width:"100%",
        backgroundColor:"#fff",
        borderColor:"white",
        borderWidth:1,

    },
    logo: {
        width: 100,
        height: 100,
        resizeMode: 'contain',
        marginBottom: 20
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color:"skyblue",
        marginBottom: 10
    },
    loader: {
        marginBottom: 20
    },
    subtitle: {
        fontSize: 18,
        color: '#666'

    }
})

export default Loading
