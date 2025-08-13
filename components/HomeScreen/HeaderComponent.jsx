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

  // Responsividade baseada na largura da tela
  const dynamicFontSize = width < 510 ? 18 : width < 480 ? 24 : 30;
  const logoSize = width < 510 ? 60 : width < 480 ? 80 : 100;
  const inputFontSize = width < 510 ? 14 : width < 480 ? 16 : 18;

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Image
          source={require("../../assets/images/logo.png")}
          style={[
            styles.logo,
            { width: logoSize, height: logoSize, borderRadius: logoSize / 10 },
          ]}
        />
        <View style={{ flex: 1 }}>
          <Text style={[styles.title, { fontSize: dynamicFontSize }]}>
            Seja muito bem-vindo à Mix Store! 😁
          </Text>
          {/* <Text style={styles.email}>{user?.email}</Text> */}
        </View>
      </View>

      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 0,
    paddingBottom: 0,
    paddingStart: 16 ,
    paddingEnd: 0 ,
    backgroundColor: COLORS.background,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flexWrap: "wrap",
  },
  logo: {
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
    marginLeft: 8,
    color: COLORS.text,
  },
});
