import { Text, StyleSheet } from "react-native"
import { Stack } from "expo-router"
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

    </Stack>


    )
}


const styles = StyleSheet.create({
  textHeader: {
    color: COLORS.white
  },
});
