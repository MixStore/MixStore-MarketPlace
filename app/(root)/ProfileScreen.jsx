import { Text, View, StyleSheet, Image, FlatList, TouchableOpacity, ScrollView } from 'react-native'
import { COLORS } from '../util/COLORS';
import { SignedIn, SignedOut, useUser } from '@clerk/clerk-expo'
import { Redirect } from 'expo-router'
import { SignOutButton } from '../../components/SignOutButton/SignOutButton';
import "../../global.css"
import explore from "../../assets/IconsProfileScreen/explore.png"
import github from "../../assets/IconsProfileScreen/github.png"
import logout from "../../assets/IconsProfileScreen/logout.png"
import meusProdutos from "../../assets/IconsProfileScreen/meusProdutos.png"


export default function ProfileScreen () {
  const { user } = useUser()
  const menuList = [
    {
      id:1,
      name:'Meus Produtos',
      icon: meusProdutos
    },
    {
      id:2,
      name:'Explorar',
      icon: explore
    },
    {
      id:3,
      name:'Meu Github',
      icon: github
    },
    {
      id:4,
      name:'Logout',
      icon: logout
    }
  ]
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
            <TouchableOpacity className='flex-1 p-3 border-[1px] items-center mx-2 mt-4 rounded-lg border-orange-600 bg-white' >
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
