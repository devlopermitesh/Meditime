import React, { useEffect, useRef, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { MedicationService } from '../Appwrite/Medication';
import { useUser } from '../Store/users';
import useMedication from '../Store/Medication';

const getDaysInMonth = (year: number, month: number): { Day: string, Date: string }[] => {
    const days: { Day: string, Date: string }[] = [];
    const firstDayOfMonth = new Date(year, month, 1);
    const firstDayWeekday = firstDayOfMonth.getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
  
    const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  
    for (let i = 0; i < firstDayWeekday; i++) {
      days.push({ Day: "", Date: "" });
    }
  
    for (let i = 1; i <= daysInMonth; i++) {
      const fullDate = new Date(year, month, i);
      const weekdayName = weekdays[fullDate.getDay()];
      days.push({ Day: weekdayName, Date: i.toString() });
    }
  
    return days;
};

const Calendar: React.FC = () => {
  const [currentMonth] = useState<number>(new Date().getMonth());
  const [currentYear] = useState<number>(new Date().getFullYear());
  const currentDate = new Date().getDate().toString();
  const {user}=useUser(state=>state)
  const {Medication,setMedication}=useMedication(state=>state)
  const [activatedate,setactivateddate]=useState<number>(new Date().getDate())

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const flatListRef = useRef<FlatList>(null);

  const handleDate = async (date: number) => {
    const selectedDate = new Date(currentYear, currentMonth, date);
    
    selectedDate.setHours(23, 59, 59, 999); 
    selectedDate.setDate(selectedDate.getDate()); 
    
    const nextDate = new Date(selectedDate);
    nextDate.setDate(selectedDate.getDate() + 1);
  
    try {
      const response = await MedicationService.getdateMedications(user.email, selectedDate, nextDate);
      if (response) {
       setMedication(response)
       setactivateddate(date)
      }
    } catch (error) {
      console.log(error);
    }
  };
  

  const renderDay = ({ item }: { item: { Day: string | null, Date: string }}) => {
    if (item.Date === "" || item.Day === "") {
      return null;   
    }

    const isActive = Number(item.Date) === activatedate;

    return (
      <TouchableOpacity 
        style={[styles.day, isActive && styles.activeDay]} 
        onPress={() => handleDate(Number(item.Date))}
      >
        <Text style={styles.dayText}>
          {item.Day !== null ? item.Day : ''}
        </Text>
        <Text style={[styles.dateText, isActive && styles.activeDateText]}>
          {item.Date !== null ? item.Date : ''}
        </Text>
      </TouchableOpacity>
    );
  };
  useEffect(() => {
    const activeIndex = daysInMonth.findIndex(item => item.Date === currentDate);
    if (activeIndex !== -1 && flatListRef.current) {
      flatListRef.current.scrollToIndex({ index: activeIndex, animated: true });
    }
  }, [currentDate, daysInMonth]);

  return (
    <View style={styles.container}>
    <FlatList
      ref={flatListRef}
      data={daysInMonth}
      renderItem={renderDay}
      keyExtractor={(item, index) => index.toString()}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.calendar}
      getItemLayout={(data, index) => (
        { length: 40, offset: 40 * index, index }
      )}
      onScrollToIndexFailed={({ index }) => {
        const wait = new Promise(resolve => setTimeout(resolve, 500));
        wait.then(() => {
          flatListRef.current?.scrollToIndex({ index, animated: true });
        });
      }}
    />
  </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  calendar: {
    flexDirection: 'row',
  },
  day: {
    width: 40, 
    height: 70,
    margin: 5, 
    backgroundColor: '#e0e0e0',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'center',
  },
  dayText: {
    fontSize: 10,
    fontWeight: 500,
    color: 'black',
    textAlign: 'center',
  },
  activeDay: {
    backgroundColor: '#90EE90',
  },
  activeDateText: {
    color: 'white',
  },
});

export default Calendar;
