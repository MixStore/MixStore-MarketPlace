import { Text, View, StyleSheet, Image, FlatList, TouchableOpacity, ScrollView } from 'react-native'
import { COLORS } from '../../util/COLORS';
import { SignedIn, SignedOut, useClerk, useUser } from '@clerk/clerk-expo'
import { Redirect, useNavigation } from 'expo-router'
import { SignOutButton } from '../../../components/SignOutButton/SignOutButton';
import "../../../global.css"
import explore from "../../../assets/IconsProfileScreen/explore.png"
import github from "../../../assets/IconsProfileScreen/github.png"
import logout from "../../../assets/IconsProfileScreen/logout.png"
import meusProdutos from "../../../assets/IconsProfileScreen/meusProdutos.png"



export default function ProfileScreen () {
  const { user } = useUser()
  const navigation = useNavigation();
   const { signOut } = useClerk()
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
      path: "https://github.com/JonathanRebello01"
    },
    {
      id:4,
      name:'Logout',
      icon: logout,
    }
  ]

      const handleSignOut = async () => {
    try {
      await signOut()
      // Redirect to your desired page
      router.replace('/')
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2))
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
        <SignedIn>
          <View className='items-center mt-14'> 
            <Image source={{uri:user?.imageUrl}} 
            className='w-[100px] h-[100px] rounded-full'
            />
            <Text className='font-bold text-[25px] mt-5' > {user?.username} </Text>
            <Text className='text-[14px] mt-2 text-gray-400'  > {user?.primaryEmailAddress.emailAddress} </Text>
          </View>

          <FlatList
          data={menuList}
          numColumns={3}
          style={{marginTop: 20}}
          renderItem={({item, index}) => (
            <TouchableOpacity onPress={() => onMenupress(item)} className='flex-1 p-3 border-[1px] items-center mx-2 mt-4 rounded-lg border-orange-600 bg-white' >
              {item.icon&& <Image source={item.icon} 
              style={{ width: 50, height: 50 }} 
              /> }
              <Text className='text-[12px] mt-2 text-orange-600' > {item.name} </Text>
            </TouchableOpacity>
          )}
          />
          

          <Text>Hello {user?.emailAddresses[0].emailAddress}</Text>
        
        <SignOutButton />
      </SignedIn>

      <SignedOut>
        <Redirect href={"/(auth)/sign-in"} />
      </SignedOut>
      </ScrollView>
    )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background
  }
});
