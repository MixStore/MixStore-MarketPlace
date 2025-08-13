import {
  View,
  TextInput,
  StyleSheet,
  useWindowDimensions
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../app/util/COLORS";


export default function SearchComponent({onChangeText , value}){
  const { width } = useWindowDimensions();

  const inputFontSize = width < 510 ? 14 : width < 480 ? 16 : 18;

  return (
     <View style={styles.searchContainer}>
        <Ionicons name="search" size={24} color="gray" />
        <TextInput
          style={[styles.textInput, { fontSize: inputFontSize }]}
          placeholder="Pesquisa"
          value={value}
          onChangeText={onChangeText}
          placeholderTextColor="#999"
          
        />
      </View> 
  )
}
const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: COLORS.background,
  },
  logo: {
    borderColor: COLORS.primary,
    borderWidth: 1,
  },
  searchContainer: {
    paddingVertical: 9,
    paddingHorizontal: 20,
    backgroundColor: "white",
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#d97706",
  },
  textInput: {
    flex: 1,
    marginLeft: 8,
    color: COLORS.text,
    borderWidth: 0,
    outlineStyle: 'none',
  },
});