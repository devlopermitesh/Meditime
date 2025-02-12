import { Alert, Image, Platform, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native'
import React, { useContext, useRef, useState } from 'react'
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
import   {Medication, MedicationForm,MedicationService} from '../Appwrite/Medication';
import Snackbar from 'react-native-snackbar';
import { useUser } from '../Store/users';
import useMedication from '../Store/Medication';
const timeRegex = /^([01]?[0-9]|2[0-3]):([0-5]?[0-9])$/;
const whenToTakeOptions = [
   'Morning',
   'Afternoon',
   'Evening',
   'Bedtime',
   'Before Breakfast',
   'After Breakfast',
   'Before Lunch',
   'After Lunch',
   'Before Dinner',
   'After Dinner',
   'With Food',
   'On Empty Stomach',
   'As Needed', 
   'Custom'
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

  // Dose (required string, must not be default value)
  Dose: yup.string()
    .required('Dose is required')
    .default(''),

  // When to take (one of the predefined options)
  WhenToTake: yup.string()
    .oneOf(whenToTakeOptions, 'please select when do you need to take the medicine')
    .required('When to take is required').default(''),

  // Dose start time (required date, default to current date)
  DoseStartTime: yup.date()
    .required('Start time is required')
    .default(() => new Date()), // Default to current date/time

  // Dose end time (required date, default to current date, must be after start time and not in the past)
  DoseEndTime: yup.date()
    .required('End time is required')
    .default(() => new Date()) // Default to current date/time
    .min(yup.ref('DoseStartTime'), 'End time cannot be before start time')
    .test('is-not-past', 'End time cannot be in the past', function (value) {
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Set to start of the day
      return value >= today;
    }),

  // Reminder time (required string, default to "00:00")
  ReminderTime: yup.string()
    .matches(timeRegex, 'Invalid time format')
    .required('Reminder time is required')
    .default('00:00')
    .test('is-default', 'Reminder time cannot be the default value', value => value !== '00:00'),

  // Reminder alert (boolean, default to false)
  ReminderAlert: yup.bool()
    .required('please select yes or no? choice is required')
    .default(true),
});
function convertToDateObject(time: string): Date {
  const [hours, minutes] = time.split(':').map(Number);
  const now = new Date();
  now.setHours(hours);
  now.setMinutes(minutes);
  now.setSeconds(0); 
  now.setMilliseconds(0); 
  return now; 
}

const GetURi=(type:string)=>{
  if(type==="Tablet")return urls.Tablet
  if(type==="Capsule")return urls.Capsule
  if(type==="Drops")return urls.Drops
  if(type==="Syrup")return urls.Syrup
  if(type==="Ointment")return urls.Ointment
  if(type==="Cream")return urls.Cream
  if(type==="Injection")return urls.Injection
  if(type==="Patch")return urls.patch
}

const AddMedition = () => {
   const [startdate, setstartDate] = useState(new Date());
  const [enddate, setendDate] = useState(new Date());
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);  // For showing start date picker
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [time, setTime] = useState(new Date())
  const [showTimePicker, setShowTimePicker] = useState(false);
  const user=useUser(state=>state.user)
    const {width,height}=useWindowDimensions()
     const navigation = useNavigation();
     const [selectedLanguage, setSelectedLanguage] = useState("When To Take");
     const {AddnewMedition}=useMedication(state=>state)
     const pickerRef = useRef<any>(null);
     const handleAddMedicine=async(values:yup.InferType<typeof schema>)=>{
      //check validation
      try {
        const data:Medication={
      Name:values.Name,
      DosageForms:values.Type as MedicationForm,
      Dose:values.Dose,
      WhentoTake:values.WhenToTake,
      DosestartTime:values.DoseStartTime,
      DoseEndTime:values.DoseEndTime,
      ReminderTime:convertToDateObject(values.ReminderTime),
      NeedReminder:values.ReminderAlert,
      userId:user?user.email:null,
      ImageUrl:GetURi(values.Type)??"", 
        }
        const response=await MedicationService.addMedication(data)
        if(response){
          Snackbar.show({text: "Medication added successfully", duration: Snackbar.LENGTH_SHORT, backgroundColor: 'green'})
          AddnewMedition(response.data)
          navigation.goBack()
        }
      } catch (error:any) {
        console.log(error)
        Snackbar.show({text: error.message || "Failed to add medication", duration: Snackbar.LENGTH_SHORT, backgroundColor: 'red'})
        
      }
     }
 
  

    const onTimeChange = (event:any, selectedTime: Date | undefined) => {
      const currentTime = selectedTime || time;
      setShowTimePicker(Platform.OS === 'ios' ? true : false); // keep picker visible on iOS
      setTime(currentTime); // Update selected time
    };
  
    const showTimePickerDialog = () => {
      setShowTimePicker(true);
    };
  
    function open() {
      if(!pickerRef.current)return null;
      pickerRef.current.focus();
    }
    const showDatePicker = (type: 'startdate' | 'enddate') => {
      if (type === 'startdate') {
        setShowStartDatePicker(true);
      } 
      else if(type === 'enddate') {
        setShowEndDatePicker(true);
      }
    };
  
    // Function to handle the date change
    const handleDateChange = (event: any, selectedDate: Date | undefined, type: 'startdate' | 'enddate') => {
      if (selectedDate) {
      if (type === 'startdate') {
        setstartDate(selectedDate);
      } else {
        setendDate(selectedDate);
      }
      }
      // Hide the DateTimePicker after selection or cancel
      if (type === 'startdate') {
      setShowStartDatePicker(false);
      } else {
      setShowEndDatePicker(false);
      }
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
       {errors.Name && (
         <Text style={styles.errorText}>{errors.Name}</Text>
       )}
         <TypeOption Options={['Tablet', 'Capsule', 'Drops','Syrup',"Ointment",'Cream','Injection','Patch']} onOptionSelect={handleChange('Type')}/>         
         {errors.Type && (
         <Text style={styles.errorText}>{errors.Type}</Text>
       )}
       <View style={styles.inputcontainer}>
         <Fonticons  name="bottle-droplet" style={[styles.inputIcon,{marginLeft:"auto"}]} size={29} color="#305cde" />
        <TextInput
        placeholder='Dose Ex 2,5ml'
        style={[styles.input,{padding:5}]}
          onChangeText={handleChange('Dose')}
          onBlur={handleBlur('Dose')}
          value={values.Dose}
        />
        {errors.Dose && (
         <Text style={styles.errorText}>{errors.Dose}</Text>
       )}
        </View>


          
    <View style={styles.inputcontainer}>
         <Fonticons  name="clock" style={[styles.inputIcon,{marginLeft:"auto",marginVertical:"auto"}]} size={29} color="#305cde" />
        <TouchableOpacity 
        style={[styles.input, {  flexDirection: 'row', alignItems: 'center' ,padding:5}]}
        onPress={open}
        >
         <Text>{selectedLanguage}</Text>
         </TouchableOpacity>
         <Picker
      ref={pickerRef}
      selectedValue={selectedLanguage}
      onValueChange={(itemValue, itemIndex) =>{
        setSelectedLanguage(itemValue)

        console.log("itemValue",itemValue)
        handleChange("WhenToTake")(itemValue)
      }
      }>
      {whenToTakeOptions.map((option) => (
        <Picker.Item key={option} label={option} value={option} />
      ))}
    </Picker>
    </View>
    {errors.WhenToTake && (
         <Text style={styles.errorText}>{errors.WhenToTake}</Text>
       )}
         
         <View style={styles.Dateinputcontainer}>
      {/* Start Date */}
      <TouchableOpacity onPress={() => showDatePicker('startdate')} style={styles.Dateinput}>
        <Fonticons name="calendar" style={[styles.inputIcon, { marginRight: 'auto', flex: 1 / 4 }]} size={29} color="#305cde" />
        <Text style={[{ flex: 1, marginHorizontal: 10 }]}>
          {`${startdate.toLocaleString('default', { month: 'long' })}, ${startdate.getDate()}, ${startdate.getFullYear()}`}
        </Text>
      </TouchableOpacity>

      {showStartDatePicker && (
        <DateTimePicker
          testID="datestartTimePicker"
          value={values.DoseStartTime}
          mode="date"
          display="default"
          onChange={(e, selectedDate) =>{
            setFieldValue("DoseStartTime",selectedDate)
            handleDateChange(e, selectedDate, 'startdate')

          }}
        />
      )}

      {/* End Date */}
      <TouchableOpacity onPress={() => showDatePicker('enddate')} style={styles.Dateinput}>
        <Fonticons name="calendar" style={[styles.inputIcon, { marginRight: 'auto', flex: 1 / 4 }]} size={29} color="#305cde" />
        <Text style={[{ flex: 1, marginHorizontal: 10 }]}>
          {`${enddate.toLocaleString('default', { month: 'long' })}, ${enddate.getDate()}, ${enddate.getFullYear()}`}
        </Text>
      </TouchableOpacity>

      {showEndDatePicker && (
        <DateTimePicker
          testID="datendTimePicker"
          value={values.DoseEndTime}

          mode="date"
          display="default"
          onChange={(e, selectedDate) => {
            setFieldValue("DoseEndTime",selectedDate)
            handleDateChange(e, selectedDate, 'enddate')
          }}
        />
      )}
    </View>
    {errors.DoseStartTime && (
      <Text style={styles.errorText}>{String(errors?.DoseStartTime)}</Text>
    )}
    {errors.DoseEndTime && (
      <Text style={styles.errorText}>{String(errors?.DoseEndTime)}</Text>
    )}

          <View style={styles.reminderContainer}>
          <Text style={styles.questionText}>Do you want to get a reminder?</Text>
          <View style={styles.reminderoptionContainer}>
       {/* Yes Option */}
       <View style={styles.checkboxContainer}>
         <BouncyCheckbox
           size={25}
           fillColor={values.ReminderAlert ? "skyblue":"#FFFFFF"}
           unFillColor="#FFFFFF"
           text="Yes"
           isChecked={values.ReminderAlert}
           iconStyle={{ borderColor: 'gray' }}
           innerIconStyle={{ borderWidth: 2,borderColor:"gray" }}
           textStyle={styles.checkboxText}
           onPress={(isChecked: boolean) => {

        setFieldValue('ReminderAlert', isChecked);
           }}
         />
       </View>

       {/* No Option */}
       <View style={styles.checkboxContainer}>
         <BouncyCheckbox
           size={25}
           fillColor={values.ReminderAlert ? "#FFFFFF" : "skyblue"}
           unFillColor="#FFFFFF"
           text="No"
           isChecked={!values.ReminderAlert}
           iconStyle={{ borderColor: 'gray' }}
           innerIconStyle={{ borderWidth: 2, borderColor: 'gray' }}
           textStyle={styles.checkboxText}
           onPress={(isChecked: boolean) => {
        if (isChecked) {
          setFieldValue('ReminderAlert', false);
        }
           }}
         />
       </View>
          </View>
          {errors.ReminderAlert && (
         <Text style={styles.errorText}>{errors.ReminderAlert}</Text>
       )}

        </View>


    <View style={styles.inputcontainer}>
      <Fonticons name="clock" style={[styles.inputIcon, { marginLeft: "auto" }]} size={29} color="#305cde" />
      <TouchableOpacity
        style={[styles.input, { flexDirection: 'row', alignItems: 'center', padding: 5 }]}
        onPress={showTimePickerDialog}
      >
        <Text>{values.ReminderTime==="00:00" ? "Select Reminder Time" : values.ReminderTime}</Text>
      </TouchableOpacity>
      {showTimePicker && (
        <DateTimePicker
          testID="timePicker"
          value={time}
          mode="time"
          display="default"
          onChange={(e, selectedTime) => {
       onTimeChange(e, selectedTime);
       if (selectedTime) {
         setFieldValue('ReminderTime', selectedTime.getHours() + ':' + selectedTime.getMinutes());
       }
          }}
        />
      )}

    </View>

   {errors.ReminderTime && (
  <Text style={styles.infoText}>{errors.ReminderTime}</Text>
)} 
    <View style={{ marginTop: 20, alignItems: 'center' }}>
      <TouchableOpacity
        onPress={() => handleSubmit()}
        style={{
          backgroundColor: '#305cde',
          paddingVertical: 5,
          paddingHorizontal: 30,
          borderRadius: 10,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.8,
          shadowRadius: 2,
          elevation: 5,
        }}
      >
        <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>Add new Medication</Text>
      </TouchableOpacity>
    </View>
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
  },
  Dateinputcontainer:{
    flex:1,
    flexDirection:"row",
    paddingHorizontal:10,
    justifyContent:"space-around",
    rowGap:10
  },
  Dateinput:{
    flex:1,
    borderWidth:1,
    paddingVertical:10,
    borderRadius:5,
    borderColor:"rgba(128,128,128,0.4)",
    backgroundColor:"white",
    flexDirection:"row",
    justifyContent:"space-around",
    alignItems:"center",
    marginHorizontal:10
  },
  reminderContainer: {
    padding: 20,
    alignItems: 'center',
    flexDirection: 'column',
    rowGap: 10,
  },
  reminderoptionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between', // Space the checkboxes evenly
    width: '60%',
  },
  questionText: {
    fontSize: 16,
    fontWeight: '400',
    fontStyle: 'italic',
    color: 'black',
    marginBottom: 10, // Space between question and options
  },
  checkboxContainer: {
    flex:1/2,
  },
  checkboxText: {
    marginLeft: 5,  
    fontSize: 16, 
    fontFamily: 'JosefinSans-Regular',
    textDecorationLine: 'none',
    color: 'black',
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginTop: 5,
    marginLeft: 10,
  },
  infoText: {
    color: 'gray',
    fontSize: 14,
    marginTop: 5,
    marginLeft: 10,
  }
})
