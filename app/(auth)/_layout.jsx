import { Stack } from 'expo-router'
import FlashMessage from 'react-native-flash-message'

export default function AuthRoutesLayout() {

  return (
    <>
    <FlashMessage position="bottom" />
    <Stack screenOptions={{headerShown: false}} />
    
    
    </>
  )
  
}