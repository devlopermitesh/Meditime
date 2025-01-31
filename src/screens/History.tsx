import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import HistoryContent from '../components/HistoryContent'

const History = () => {
  return (
          <SafeAreaView style={styles.container}>
<HistoryContent/>
          </SafeAreaView>
  
  )
}

export default History

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
})