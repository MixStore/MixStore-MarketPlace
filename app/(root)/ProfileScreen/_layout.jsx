import { StyleSheet } from "react-native"
import { Stack,useNavigation } from "expo-router"
import { COLORS } from "../../util/COLORS"
import "../../../global.css"


export default function ProfileStackLayout(){
    return(
        <Stack>
            <Stack.Screen
        options={{
            title: "ProfileScreen",
            headerShown: false,
          }}  
          name="ProfileScreen" 
          />

            
        <Stack.Screen
        name="MyProductsScreen"
            options={({
          headerStyle: {
            backgroundColor: COLORS.primary,
          },
          headerTintColor:COLORS.white,
          headerTitle:"Meus produtos"
        })}
      />

      <Stack.Screen
        name="ProductDetailScreen"
        options={({
          headerStyle: {
            backgroundColor: COLORS.primary,
          },
          headerTintColor:COLORS.white,
          headerTitle:"Detalhes"
        })}
      />

      <Stack.Screen
        name="EditProfileScreen"
        options={{
          headerStyle: {
            backgroundColor: COLORS.primary,
          },
          headerTintColor: COLORS.white,
          headerTitle: "Editar Perfil",
          
        }}
      />
    </Stack>


    )
}


const styles = StyleSheet.create({
  textHeader: {
    color: COLORS.white
  },
});
