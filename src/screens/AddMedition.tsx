import { Image, Platform, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native'
import React, { useState } from 'react'
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { urls } from '../Images/Url';
import { Button, TextInput } from 'react-native';
import { Formik } from 'formik';
import * as yup from 'yup';
import DateTimePicker from '@react-native-community/datetimepicker';
import BouncyCheckbox from "react-native-bouncy-checkbox";
import TypeOption from '../components/TypeOption';
import  Ionicons from 'react-native-vector-icons/AntDesign'; 
import Fonticons from 'react-native-vector-icons/FontAwesome6';
import {Picker} from '@react-native-picker/picker';
const timeRegex = /^([01]?[0-9]|2[0-3]):([0-5]?[0-9])$/;
const whenToTakeOptions = [
  'Before Breakfast',
  'After Breakfast',
  'Before Lunch',
  'After Lunch',
  'Before Dinner',
  'After Dinner',
  'Before Bed',
  'As Needed',
  'Anytime',
];
const currentDate = new Date();
const defaultReminderTime = new Date(currentDate.setHours(0, 0, 0, 0)); // Set default time to "00:00"

// Define Yup validation schema
const schema = yup.object().shape({
  // Name of the medicine (required string)
  Name: yup.string().required('Name is required').default(''),

  // Type of the medicine (required, must be one of the provided values)
  Type: yup.string()
    .oneOf(
      ['Tablet', 'Capsule', 'Drops', 'Syrup', 'Ointment', 'Cream', 'Injection', 'Patch'],
      'Invalid type'
    )
    .required('Type is required').default('Tablet'),

  // Dose (required string)
  Dose: yup.string().required('Dose is required').default(''),

  // When to take (one of the predefined options)
  WhenToTake: yup.string()
    .oneOf(whenToTakeOptions, 'Invalid time option')
    .required('When to take is required').default(whenToTakeOptions[0]),

  // Dose start time (required date, default to current date)
  DoseStartTime: yup.date()
    .required('Start time is required')
    .default(() => new Date()), // Default to current date/time

  // Dose end time (required date, default to current date)
  DoseEndTime: yup.date()
    .required('End time is required')
    .default(() => new Date()), // Default to current date/time

  // Reminder time (required string, default to "00:00")
  ReminderTime: yup.date()
    .required('Reminder time is required')
    .default(() => defaultReminderTime), // Default to "00:00" (midnight)

  // Reminder alert (boolean, default to false)
  ReminderAlert: yup.bool()
    .required('Reminder alert is required')
    .default(false),
});


const AddMedition = () => {
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date())
  const [show, setShow] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

    const {width,height}=useWindowDimensions()
     const navigation = useNavigation();
     const [selectedLanguage, setSelectedLanguage] = useState();

     const handleAddMedicine=async(values:yup.InferType<typeof schema>)=>{
console.log(values)
     }
     const onChange = (event: any, selectedDate: Date | undefined) => {
      const currentDate = selectedDate || date;
      setShow(Platform.OS === 'ios' ? true : false);
      setDate(currentDate);
    };
  
    const showDatePicker = () => {
      setShow(true);
    };
    const onTimeChange = (event:any, selectedTime: Date | undefined) => {
      const currentTime = selectedTime || time;
      setShowTimePicker(Platform.OS === 'ios' ? true : false); // keep picker visible on iOS
      setTime(currentTime); // Update selected time
    };
  
    const showTimePickerDialog = () => {
      setShowTimePicker(true);
    };
  
  
  return (
    <ScrollView keyboardShouldPersistTaps="handled" >

      <View style={{flex:1,justifyContent:"flex-start", borderWidth:1,position:"relative",backgroundColor:"white"} }>
      <Image source={{uri:urls.addmedicationImage}} style={{width:"100%" ,height:height*0.35,resizeMode:"contain",borderWidth:1,borderColor:"lightgray"}}/>
      <TouchableOpacity style={{position:"absolute",top:20,left:10}} >
<Icon name="chevron-back" size={30} color="black"  onPress={()=>navigation.goBack()}/>
      </TouchableOpacity>



      <View style={{flex:1,borderWidth:1,borderColor:"black"}}>
      <Formik
     initialValues={schema.cast({})}
     validationSchema={schema}
     onSubmit={values => handleAddMedicine(values)}
   >
     {({ handleChange, handleBlur, handleSubmit,setFieldValue, values,errors }) => (
       <View style={styles.FormContainer}>
<Text style={styles.heading}>Add New Medication</Text>
        <View style={styles.inputcontainer}>
          <Ionicons name={'medicinebox'} style={styles.inputIcon} size={34} color="#305cde" />
         <TextInput
         
         placeholder='Medicine Name'
         style={[styles.input,{padding:5}]}
           onChangeText={handleChange('Name')}
           onBlur={handleBlur('Name')}
           value={values.Name}
         />
         </View>
     <TypeOption Options={['Tablet', 'Capsule', 'Drops','Syrup',"Ointment",'Cream','Injection','Patch']} onOptionSelect={handleChange('Type')}/>         
         
        <View style={styles.inputcontainer}>
          <Fonticons  name="bottle-droplet" style={[styles.inputIcon,{marginLeft:"auto"}]} size={29} color="#305cde" />
         <TextInput
         placeholder='Dose Ex 2,5ml'
         style={[styles.input,{padding:5}]}
           onChangeText={handleChange('Dose')}
           onBlur={handleBlur('Dose')}
           value={values.Dose}
         />
         </View>


      
<View style={styles.inputcontainer}>
          <Fonticons  name="bottle-droplet" style={[styles.inputIcon,{marginLeft:"auto"}]} size={29} color="#305cde" />
         <TouchableOpacity 
         style={[styles.input,{padding:5}]}

         />
       <Picker
  selectedValue={selectedLanguage}
  onValueChange={(itemValue, itemIndex) =>
    setSelectedLanguage(itemValue)
  }>
  <Picker.Item label="Java" value="java" />
  <Picker.Item label="JavaScript" value="js" />
</Picker>

         </View>
{/*

         <TextInput
           onChangeText={handleChange('WhenToTake')}
           onBlur={handleBlur('WhenToTake')}
           value={values.WhenToTake}
         />

         <View>
<Button onPress={showDatePicker} title="Select Dose Start Time" />
                  {show && (
                    <DateTimePicker
                      testID="dateTimePicker"
                      value={date}
                      mode="date"
                      display="default"
                      onChange={(e, selectedDate) => {
                        onChange(e, selectedDate);
                        if(selectedDate){
                          handleChange('DoseStartTime')(selectedDate.toISOString());
                        }
                      }}
                    />
                  )}
                </View>

                <View>
<Button onPress={showDatePicker} title="Select Dose End Time" />
                  {show && (
                    <DateTimePicker
                      testID="dateTimePicker"
                      value={date}
                      mode="date"
                      display="default"
                      onChange={(e, selectedDate) => {
                        onChange(e, selectedDate);
                        if(selectedDate){
                          setFieldValue('DoseEndTime',selectedDate.toISOString());
                        }
                      }}
                    />
                  )}
                </View>


                <BouncyCheckbox
  size={25}
  fillColor="blue"
  unFillColor="#FFFFFF"
  text="Custom Checkbox"
  iconStyle={{ borderColor: "blue" }}
  innerIconStyle={{ borderWidth: 2 }}
  textStyle={{ fontFamily: "JosefinSans-Regular" }}
  onPress={(isChecked: boolean) => {
    setFieldValue('ReminderAlert', isChecked); }}
/>

<View>
<Button title="Select Time" onPress={showTimePickerDialog} />

{showTimePicker && (
  <DateTimePicker
    testID="timePicker"
    value={time}
    mode="time"
    display="default"
    onChange={(e, selectedTime) => {
      onTimeChange(e, selectedTime);
      if(selectedTime){
        setFieldValue('ReminderTime',selectedTime.toISOString());
      }
    }}
  />
)}
 </View>

 <Button onPress={() => handleSubmit()} title="Submit" /> */}
              </View>
            )}
   </Formik>
      </View>
    </View>
    </ScrollView>
  )
}

export default AddMedition

const styles = StyleSheet.create({
  FormContainer:{
    flex:1,
    justifyContent:"center",
    textAlign:"center",
    gap:15,
  },
  heading:{
    fontSize:20,
    fontWeight:"bold",
    fontFamily:"400",
    color:"black",
    marginHorizontal:"auto"
  },
  inputcontainer:{
    flex:1,
    width:"89%",
    height:"auto",
    borderWidth:1,
    borderColor:"rgba(128,128,128,0.4)",
    borderRadius:6,
    flexDirection:"row",
    paddingVertical:5,
    marginHorizontal:"auto",
  },
  inputIcon:{
    width:30,
    flex:1/8,
    justifyContent:"center",
    alignItems:"center",
    padding:2,
    borderRightWidth:1,
    borderRightColor:"gray"
  },
  input:{
    flex:7/8,
    color:"black",
    fontSize:15,
  }
})
