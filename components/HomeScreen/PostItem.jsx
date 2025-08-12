import { Image, Text, TouchableOpacity, View,StyleSheet,AspectRatio } from "react-native";
import { COLORS } from "../../app/util/COLORS";
import { useNavigation } from "expo-router";

export default function PostItem({item}){
      const navigation=useNavigation()
    return(
        <TouchableOpacity onPress={()=>
            navigation.navigate('ProductDetailScreen',
              {product:item}
            )
        } className="flex-1 m-2 p-2 rounded-lg border-[1px] border-slate-300 bg-white ">
          

          <Image
            source={{ uri: `data:image/jpeg;base64,${item?.imageBase64}` }}
            style={{
              width: '100%',
              height: 140,
              borderRadius: 8,
              borderWidth: 1,
              borderColor: '#CBD5E1',
            }}
            resizeMode="contain"
          />


   
                   
                    <View>
                        <Text className="text-gray-400 p-[2px] mt-1 rounded-full px-1 text-[10px] w-[70px]" >{item.category} </Text>
                        <Text className="text-[15px] font-bold mt-2"> {item.title} </Text>
                        <Text className="text-[20px] font-bold" style={styles.price}  >R$: {item.price} </Text>
                    </View>
        
                  </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
  price: {
    color: COLORS.income
  },
})