import { FlatList, Image, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import React, { useRef } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../routes/AuthStack';
import { urls } from "../Images/Url";

const slides: { id: number, image: any, title: string, subtitle: string }[] = [
    {
        id: 1,
        image: urls.Onboadingimage1,
        title: "Track your Medication , Stay Healthy",
        subtitle: "Stay on track,Stay healthy! by taking all medicines at the right time and in the right way.",
    },
    {
        id: 2,
        image: urls.Onboadingimage2,
        title: "Take all medicines by schedule time",
        subtitle: "Don't miss your medicines by taking them at the right time and in the right way.",
    },
    {
        id: 3,
        image: urls.Onboadingimage3,
        title: "Get reminder for your Medication",
        subtitle: "Get reminders for your medicines, so that you don't forget to take them.",
    }
];

type GetStartScreenProps = NativeStackScreenProps<AuthStackParamList, 'Onboarding'>;

const Getstart = ({ navigation }: GetStartScreenProps) => {
    const [currentIndex, setCurrentIndex] = React.useState(0);
    const ref = useRef<FlatList>(null);
    const {width,height}=useWindowDimensions()

    const Slide = ({ item }: { item: { id: number, image: any, title: string, subtitle: string } }): JSX.Element => {
        return (
            <View style={{  width: width, height: height*0.75, justifyContent: 'center', alignItems: 'center',backgroundColor:"white"}}>
                <Image
                    source={{ uri: item.image }}
                    style={{ width, height: height * 0.4,resizeMode: 'contain', }}
                />
                <Text style={{ fontSize: 20, fontWeight: '700', color: 'black', textAlign: 'center', marginTop: 10 }}>
                    {item.title}
                </Text>
                <Text
                    style={{
                        fontSize: 10,
                        fontWeight: '400',
                        color: 'black',
                        maxWidth: '70%',
                        textAlign: 'center',
                        marginTop: 10,
                    }}
                >
                    {item.subtitle}
                </Text>
            </View>
        );
    };

    const Footer = (): JSX.Element => {
        const goToNext = () => {
            if (currentIndex < slides.length - 1) {
                const nextslide = currentIndex+1 ;
                const offset = width * nextslide;
                console.log("Next go to offset",offset)
                console.log("Next slides",nextslide)
                console.log("Next currentIndex",currentIndex)
                console.log("width",width)
                ref.current?.scrollToOffset({ offset });
                setCurrentIndex(nextslide);
            }
        };

        const goToEnd = () => {
            setCurrentIndex(slides.length - 1);
            ref.current?.scrollToOffset({ offset: width * (slides.length - 1) });
            console.log("Next back to offset",width * (slides.length - 1))

        };

        return (
            <View style={{ height: height * 0.25, justifyContent: 'space-between', paddingHorizontal: 20, backgroundColor: 'white' }}>
                <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 20 }}>
                    {slides.map((_, index) => (
                        <View key={index} style={[styles.indicator, currentIndex === index && { backgroundColor: '#87b5eb', width: 30 }]} />
                    ))}
                </View>
                <View style={{ marginBottom: 0 }}>
                    {currentIndex === slides.length - 1 ? (
                        <View style={{ height: 50 }}>
                            <TouchableOpacity
                                style={[styles.btn, { backgroundColor: 'skyblue' }, { borderColor: 'white', borderWidth: 1 }]}
                                onPress={() => navigation.navigate('Login')}
                            >
                                <Text style={{ fontWeight: 'bold', fontSize: 15 }}>Get Started</Text>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 10 }}>
                            <TouchableOpacity
                                style={[styles.btn, { backgroundColor: 'transparent' }, { borderColor: 'skyblue', borderWidth: 1 }]}
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
        );
    };

    const updateCurrentSlideIndex = (e: any) => {
        const contentOffsetX = e.nativeEvent.contentOffset.x;
        const currentIndex = Math.round(contentOffsetX / width);
        setCurrentIndex(currentIndex);
    };

    return (
        <>
            <FlatList
            ref={ref}
            onLayout={(e) => console.log('FlatList width:', e.nativeEvent.layout.width)}
            onScroll={(e) => console.log('Scroll offset:', e.nativeEvent.contentOffset.x)}
            onMomentumScrollEnd={updateCurrentSlideIndex}
            pagingEnabled
            horizontal={true}
            data={slides}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => <Slide item={item} />}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={{ paddingHorizontal: 0 }} 
            style={{ marginHorizontal: 0 }}
            snapToAlignment="center"
            decelerationRate="fast"
          snapToInterval={width} 
            />
            <Footer />
        </>
    );
};

export default Getstart;

const styles = StyleSheet.create({
    flatList: {
        marginHorizontal:0,
        borderWidth:1,
        borderColor:"orange"
      },
      contentContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        borderWidth:1,
borderColor:"red",
        paddingHorizontal: 0,
      },
    
    indicator: {
        height: 2.5,
        width: 10,
        backgroundColor: '#87CEEB',
        marginHorizontal: 5,
    },
    btn: {
        flex: 1,
        height: 50,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#87CEEB',
    },
});
