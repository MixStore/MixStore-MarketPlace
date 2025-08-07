import {
  View,
  Image,
  Text,
  TextInput,
  StyleSheet,
  useWindowDimensions,
} from "react-native";
import { COLORS } from "../../app/util/COLORS";
import { Ionicons } from "@expo/vector-icons";
import { getAuth } from "firebase/auth";

export default function HeaderComponent() {
  const user = getAuth().currentUser;
  const { width } = useWindowDimensions();

  const dynamicFontSize = width < 360 ? 18 : width < 480 ? 24 : 30;
  const logoSize = width < 360 ? 60 : width < 480 ? 80 : 100;

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Image
          source={require("../../assets/images/logo.png")}
          style={[styles.logo, { width: logoSize, height: logoSize }]}
        />
        <View style={{ flex: 1 }}>
          <Text style={[styles.title, { fontSize: dynamicFontSize }]}>
            Seja muito bem-vindo à Mix Store! 😁
          </Text>
          {/* <Text style={styles.email}>{user?.email}</Text> */}
        </View>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={24} color="gray" />
        <TextInput
          style={styles.textInput}
          placeholder="Pesquisa"
          onChangeText={(value) => console.log(value)}
          placeholderTextColor="#999"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: COLORS.background,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flexWrap: "wrap",
  },
  logo: {
    borderRadius: 10,
    borderColor: COLORS.primary,
    borderWidth: 1,
  },
  title: {
    fontWeight: "bold",
    color: COLORS.text,
    marginVertical: 10,
    textAlign: "left",
  },
  email: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.text,
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
    fontSize: 16,
    marginLeft: 8,
    color: COLORS.text,
  },
});
