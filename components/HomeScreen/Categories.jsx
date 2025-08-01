import { View, Text, Image, FlatList, StyleSheet, TouchableOpacity } from "react-native";
import "../../global.css"
import { COLORS } from "../../app/util/COLORS";
import { useNavigation } from "expo-router";


export default function Categories({categoryList}){
  
const iconMap = {
  Alimentos: require("../../assets/categories/icons/Alimentos.png"),
  Casa: require("../../assets/categories/icons/Casa.png"),
  Smartphones: require("../../assets/categories/icons/Smartphones.png"),
  Papelaria: require("../../assets/categories/icons/Papelaria.png"),
  Roupas: require("../../assets/categories/icons/Roupas.png"),
  Tecnologia: require("../../assets/categories/icons/Tecnologia.png"),
};

const navigation=useNavigation()

    return(
        <View className="mt-3">
          <Text className="font-bold text-[20px]"> Categorias </Text>
          <FlatList 
            data={categoryList}
            numColumns={3}
            renderItem={({item, index}) => index<=8&&(
                <TouchableOpacity style={styles.categories} className="flex flex-1 items-center justify-center border-[1px] border-gray-300 m-1 h-[80px] rounded-lg" onPress={()=>navigation.navigate('ItemList', {
                  category:item.name
                })}>
                   
                  <Image source={iconMap[item.name]}
                    style={styles.icons}          />

                  <Text className="text-[12px] mt-1">{item.name}</Text>
                </TouchableOpacity>


            )}
          />
        </View>
    )
}

const styles = StyleSheet.create({
  icons: {
    padding:2,
    border: 1, 
    height: 40,
    width: 40
  },
  categories: {
    backgroundColor: COLORS.white
  },
})
