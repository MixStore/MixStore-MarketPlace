import { useUser } from "@clerk/clerk-expo";
import { View, Image, Text, TextInput, StyleSheet, FlatList } from "react-native";
import { COLORS } from "../../app/util/COLORS";
import "../../global.css"
import { Ionicons } from "@expo/vector-icons";
import { collection } from "firebase/firestore";
import { useEffect } from "react";


export default function Slider({sliderList}) {
   const base64Prefix = "data:image/jpeg;base64,";
   useEffect(() => {
    sliderList.forEach((item, index) => {
      console.log(`Imagem ${index}:`, item.Image?.substring(0, 100) + '...');
    });
  }, [sliderList]);
  
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
