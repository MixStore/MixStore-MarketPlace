import { Text, StyleSheet } from "react-native"
import { Stack } from "expo-router"
import { COLORS } from "../../util/COLORS"
import "../../../global.css"

export default function HomeStackLayout(){
    return(
        <Stack>
            <Stack.Screen
        options={{
            title: "ExploreScreen",
            headerShown: false,
          }}  
          name="ExploreScreen" 
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
