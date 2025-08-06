import { View, Image, Text, TextInput, StyleSheet } from "react-native";
import { COLORS } from "../../app/util/COLORS";
import "../../global.css"
import { Ionicons } from "@expo/vector-icons";
import { getAuth } from "firebase/auth";


export default function HeaderComponent() {
  const user  = getAuth().currentUser
    


  return (
<View>

    <View className='flex flex-row items-center gap-2'>
      <Image
        source={ require("../../assets/images/logo.png") }
        style={{ width: 100, height: 100, borderRadius: 10, borderColor: COLORS.primary, borderWidth:1  }}
        /> 
      <View>
        <Text style={styles.title} >Seja muito bem-vindo à Mix Store! 😁</Text>
        {/* <Text className='text-[18px] font-bold'>{user?.email}</Text> */}
      </View>
    </View>




      <View className='p-[9px] px-5 bg-white mt-5 flex flex-row items-center gap-3 rounded-full border-[1px] border-amber-700 '>
        <Ionicons name="search" size={24} color="gray" />  
        <TextInput style={styles.textInput} placeholder='Pesquisa' className='ml-2 text-[18px]' onChangeText={(value) => console.log(value)}/> 
      </View>
</View>
  );
}


const styles = StyleSheet.create({
  textInput: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.text,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: COLORS.text,
    marginVertical: 15,
    textAlign: "center",
  },
})
