import { StyleSheet } from "react-native"
import { Stack,useNavigation } from "expo-router"
import { COLORS } from "../../util/COLORS"
import "../../../global.css"


export default function AddPostScreenLayout(){
    return(
        <Stack>
         
         <Stack.Screen
        options={{
            title: "AddPostScreen",
            headerShown: false,
          }}  
          name="AddPostScreen" 
          />

        {/* <Stack.Screen
        name="AddDetailPostScreen"
            options={({
          headerStyle: {
            backgroundColor: COLORS.primary,
          },
          headerTintColor:COLORS.white,
          headerTitle:" Adicionar Detalhes do Produto"
        })}
      /> */}

</Stack>
   


    )
}


const styles = StyleSheet.create({
  textHeader: {
    color: COLORS.white
  },
});
