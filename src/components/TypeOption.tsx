import { FlatList, StyleSheet, Text } from 'react-native'
import React from 'react'
interface Props {
    Options:string[],
    onOptionSelect:(option:string)=>void
}import { TouchableOpacity } from 'react-native'

const TypeOption:React.FC<Props> = ({Options,onOptionSelect}) => {
    const [activeOption, setActiveOption] = React.useState<string | null>(null);

    const handleOptionSelect = (option: string) => {
        setActiveOption(option);
        onOptionSelect(option);
    };

    return (
        <FlatList 
            horizontal={true} 
            disableScrollViewPanResponder 
            data={Options} 
            keyExtractor={(item, index) => index.toString()}
            showsVerticalScrollIndicator={false} 
            showsHorizontalScrollIndicator={false} 
            renderItem={({item})=>(
                <TouchableOpacity 
                    style={[
                        styles.optionContainer, 
                        item === activeOption && styles.activeOptionContainer
                    ]} 
                    onPress={()=>handleOptionSelect(item)}
                >
                    <Text style={[styles.optionText, item === activeOption && styles.activeOptionContainer]}>{item}</Text>
                </TouchableOpacity>
            )}
        />
    )
}

const styles = StyleSheet.create({
    optionContainer: {
        padding: 10,
        margin: 5,
        backgroundColor: '#f0f0f0',
        borderRadius: 5,
    },
    optionText: {
        fontSize: 16,
        color: '#333',
        
    },
    activeOptionContainer: {
  color: 'white',
  backgroundColor: '#1d9bf0',      
    }
})


export default TypeOption
