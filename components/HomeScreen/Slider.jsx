import { View, Image, Text, TextInput, StyleSheet, FlatList } from "react-native";
import "../../global.css"


export default function Slider({sliderList}) {
   const base64Prefix = "data:image/jpeg;base64,";

  
    return (
        <View className="mt-5">
            <FlatList 
            data={sliderList}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            renderItem={({item, index}) => (
                
                <View> 
                    <Image source={{ uri: `data:image/jpeg;base64,${item?.image}` }}

                    className="h-[200px] w-[330px] mr-3 rounded-lg object-contain"
                    />
                </View>
            )}
            /> 
        </View>
  );
}


const styles = StyleSheet.create({
  textInput: {
    flex: 1,
  },
})
