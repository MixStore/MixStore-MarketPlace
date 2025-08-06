import { Text, View, StyleSheet, Image, FlatList, TouchableOpacity, ScrollView, Linking } from 'react-native'
import { COLORS } from '../../util/COLORS';
import { useNavigation, useRouter } from 'expo-router'
import "../../../global.css"
import explore from "../../../assets/IconsProfileScreen/explore.png"
import github from "../../../assets/IconsProfileScreen/github.png"
import logout from "../../../assets/IconsProfileScreen/logout.png"
import meusProdutos from "../../../assets/IconsProfileScreen/meusProdutos.png"
import { getAuth, signOut } from 'firebase/auth';
import { Ionicons } from '@expo/vector-icons';



export default function ProfileScreen () {
  const  user  = getAuth().currentUser
  const navigation = useNavigation();
  const router = useRouter()
  const menuList = [
    {
      id:1,
      name:'Meus Produtos',
      icon: meusProdutos,
      path: "MyProductsScreen" // This will be used to navigate to MyProductsScreen
    },
    {
      id:2,
      name:'Explorar',
      icon: explore,
      path: "ExploreScreen" // This will be used to navigate to ExploreScreen
    },
    {
      id:3,
      name:'Meu Github',
      icon: github,
      url: "https://github.com/JonathanRebello01"
    },
    {
      id:4,
      name:'Logout',
      icon: logout,
    }
  ]

  const handleSignOut = async () => {
    try {


      
      const auth = getAuth()
      
      console.log(auth)

      await signOut(auth).then(() => {
        console.log("User signed out successfully.");
        router.replace('/(auth)/sign-in') // redireciona para a tela inicial ou login
      })
      .catch((error) => {
        console.error("Error signing out:", error);
      });
    } catch (err) {
      console.error("Erro ao sair:", err)
    }
  }

  const onMenupress = (item) => {
    item?.path?navigation.navigate(item.path):null
    if(item?.url) {
      // If the item has a URL, open it in the browser
      Linking.openURL(item.url);
    }
    if(item?.name === 'Logout') {
      // If the item is Logout, sign out the user
       handleSignOut();
    }

  }
  
  return (
      <ScrollView style={styles.container} className='p-5 flex-1' showsVerticalScrollIndicator={false} >     
          <View className='items-center mt-6'> 
           <Ionicons size={300} name="person-circle-outline"/>
          </View>

          <FlatList
          data={menuList}
          numColumns={3}
          style={{marginTop: 10}}
          renderItem={({item, index}) => (
            <TouchableOpacity onPress={() => onMenupress(item)} className='flex-1 p-3 border-[1px] items-center mx-2 mt-4 rounded-lg border-orange-600 bg-white' >
              {item.icon&& <Image source={item.icon} 
              style={{ width: 50, height: 50 }} 
              /> }
              <Text className='text-[12px] mt-2 text-orange-600' > {item.name} </Text>
            </TouchableOpacity>
          )}
          />
      </ScrollView>
    )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background
  }
});
