import { useUser } from "@clerk/clerk-expo";
import { View, Image, Text, TextInput, StyleSheet } from "react-native";
import { COLORS } from "../../app/util/COLORS";
import "../../global.css"
import { Ionicons } from "@expo/vector-icons";


export default function HeaderComponent() {
  const { user } = useUser();
    


  return (
<View>

    <View className='flex flex-row items-center gap-2'>
      <Image
        source={{ uri: user?.imageUrl }}
        style={{ width: 56, height: 56, borderRadius: 100, borderColor: COLORS.primary, borderWidth:1  }}
        />
      <View>
        <Text className='text-[14px]'>Bem-Vindo</Text>
        <Text className='text-[18px] font-bold'>{user?.primaryEmailAddress.emailAddress}</Text>
      </View>
    </View>




      <View className='p-3 px-5 bg-white mt-5 flex flex-row items-center gap-3 rounded-full border-[1px] border-amber-700 '>
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
})
