import { Dimensions, FlatList, Image, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native'
import React, { useRef } from 'react'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { AuthStackParamList } from '../routes/AuthStack'
const {width, height} =Dimensions.get("window")

const slides: { id: number, image: any, title: string, susbtitle: string }[] = [
    {
        id: 1,
        image: require('../Images/Image1.png'),
        title: "Track your Medication , Stay Healthy",
        susbtitle: "Stay on track,Stay healthy! by taking all medicines at the right time and in the right way.",
    },
    {
        id: 2,
        image: require("../Images/Image2.png"),
        title: "Take all medicines by schedule time",
        susbtitle: "Don't miss your medicines by taking them at the right time and in the right way.",
    },
    {
        id: 3,
        image: require("../Images/Image3.png"),
        title: "Get reminder for your Medication",
        susbtitle: "Get reminders for your medicines, so that you don't forget to take them.",
    }
]

type GetStartScreenProps = NativeStackScreenProps<AuthStackParamList, 'Onboarding'>
const Getstart = ({navigation}:GetStartScreenProps) => {
const [currentIndex, setCurrentIndex] = React.useState(0);
const ref=useRef<FlatList>(null)
const Slide = ({ item }: { item: { id: number, image: any, title: string, susbtitle: string } }): JSX.Element => {
    return (
        <View style={{ alignItems: "center"}}>
            <Image source={item.image} style={{ height:"75%" , width, resizeMode: "contain" }} />
            <Text style={{ fontSize: 20, fontWeight: "700", color: "black" ,textAlign:"center"}}>{item.title}</Text>
            <Text style={{ fontSize: 10, fontWeight: "400", color: "black",maxWidth:"70%",textAlign:"center",marginTop:10 }}>{item.susbtitle}</Text>
        </View>
    )
}

const Footer = (): JSX.Element => {
    const goToNext = () => {
        if (currentIndex < slides.length - 1) {
            const nextslide=currentIndex+1;
            const offset=width*nextslide+10;
            ref.current?.scrollToOffset({offset});
            setCurrentIndex(nextslide)

        }
    };

    const goToEnd = () => {
        setCurrentIndex(slides.length - 1);
        ref.current?.scrollToOffset({ offset: width * (slides.length - 1)+10 });
    };

    return (
        <View style={{ height: height * 0.25, justifyContent: "space-between", paddingHorizontal: 20 ,backgroundColor:"white" }}>
            <View style={{ flexDirection: "row", justifyContent: "center", marginTop: 20 }}>
                {slides.map((_, index) => (
                    <View key={index} style={[styles.indicator, currentIndex === index && { backgroundColor: "#87b5eb", width: 30 }]} />
                ))}
            </View>
            <View style={{ marginBottom: 20 }}>
                {(currentIndex === slides.length - 1)?
               ( <View style={{height:50}}>
                <TouchableOpacity 
                        style={[styles.btn, { backgroundColor: "skyblue" }, { borderColor: "white", borderWidth: 1 }]}
                        onPress={()=>navigation.navigate("Login")} 
                    >
                        <Text style={{ fontWeight: 'bold', fontSize: 15 }}>Get Start</Text>
                    </TouchableOpacity>

                </View>) :(
                    <View style={{ flexDirection: "row", justifyContent: "space-between",gap:10 }}>
                    <TouchableOpacity
                        style={[styles.btn, { backgroundColor: "transparent" }, { borderColor: "skyblue", borderWidth: 1 }]}
                        onPress={goToEnd} 
                    >
                        <Text style={{ fontWeight: 'bold', fontSize: 15 }}>Skip</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.btn]} onPress={goToNext}>
                        <Text style={{ fontWeight: 'bold', fontSize: 15 }}>Next</Text>
                    </TouchableOpacity>
                </View>
                )}
               

                
            </View>
        </View>
    )
}

const updatecurrentSlideIndex = (e:any) => {
    const contentOffsetX = e.nativeEvent.contentOffset.x;
    const currentIndex = Math.round(contentOffsetX / width);
    setCurrentIndex(currentIndex)

}

return (
    <>
        <FlatList ref={ref}
            onMomentumScrollEnd={updatecurrentSlideIndex}
            pagingEnabled
            horizontal
            data={slides}
            contentContainerStyle={{ height: height * 0.75, backgroundColor: "white" }}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => <Slide item={item} />}
            keyExtractor={(item) => item.id.toString()}
            snapToAlignment="center"
            decelerationRate="fast"
            snapToInterval={width}
        />
        <Footer />
    </>
)
}

export default Getstart

const styles = StyleSheet.create({
    indicator: {
        height: 2.5,
        width: 10,
        backgroundColor: "#87CEEB",
        marginHorizontal: 5,
    },
    btn: {
        flex: 1,
        height: 50,
        borderRadius: 5,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#87CEEB",
    }
})
