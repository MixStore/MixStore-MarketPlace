import { Text, StyleSheet } from "react-native"
import { Stack } from "expo-router"
import { COLORS } from "../../util/COLORS"
import "../../../global.css"

export default function HomeStackLayout(){
    return(
        <Stack>
            <Stack.Screen
        options={{
            title: "Home",
            headerShown: false,
          }}  
          name="HomeScreen" 
          />

            
        <Stack.Screen
        name="ItemList"
        options={({ route }) => ({
          headerTitle: () => <Text style={styles.textHeader} className="text-[18px] font-bol">{route.params.category}</Text>,
          headerStyle: {
            backgroundColor: COLORS.primary,
            
          },
          headerTintColor:COLORS.white
        })}
        
      />


      <Stack.Screen
        name="ProductDetail"
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
