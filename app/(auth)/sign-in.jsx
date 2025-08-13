
import React, { useState } from 'react'
import { Text, TextInput, TouchableOpacity, View, Image, StyleSheet } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { styles } from '../../assets/styles/auth.styles'
import { COLORS } from '../util/COLORS'
import { Link } from 'expo-router'
import FlashMessage, { showMessage } from 'react-native-flash-message'

import { getAuth, signInAnonymously, signInWithEmailAndPassword, signOut } from 'firebase/auth'



export default function Page() {
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const auth = getAuth()

  function showToast(message, type = 'success') {
    showMessage({
      message,
      type, // 'success', 'danger', 'info'
      duration: 3000,
      position: 'bottom',
    })
  }
  

  

  const onSignInPress = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      const user = userCredential.user

      if (!user.emailVerified) {
        showToast('Por favor, verifique seu e-mail antes de continuar.', 'danger')
        await signOut(auth)
        router.replace({ pathname: '/sign-up', params: { setPendingVerification: 'true', email: email, password: password } })
        return
      }

      router.replace('/(root)/HomeScreen')

    } catch (err) {
      showToast('Um erro inesperado ocorreu'+ err, 'danger')

      if (err.code === 'auth/wrong-password') {
        setError('Senha incorreta. Tente novamente.')
      } else if (err.code === 'auth/user-not-found') {
        setError('Usuário não encontrado.')
      } else {
        setError('Ocorreu um erro. Tente novamente.')
      }
    }
  }

  const onInviteSignIn=()=>{
    signInAnonymously(auth)
      .then(() => {
        router.replace('/(root)/HomeScreen')
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
      });
    
  }



  return (
    <KeyboardAwareScrollView showsHorizontalScrollIndicator={false} style={{flex:1}} contentContainerStyle={{flexGrow: 1}} enableOnAndroid={true} enableAutomaticScroll={true} extraHeight={100}>
      <View style={styles.container}>
      <View style={stls.container} >
        <Image source={require("../../assets/images/logo.png")} style={stls.illustration} />
      </View>
        <Text style={styles.textOi}>Olá!!</Text>
      
        {error ? (
          <View style={styles.errorBox}>
            <Ionicons name="alert-circle" size={20} color={COLORS.expense} />
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity onPress={() => setError("")}>
              <Ionicons name="close" size={20} color={COLORS.textLight} />
            </TouchableOpacity>
          </View>
        ) : null}

            <TouchableOpacity onPress={onInviteSignIn} style={stls.button}>
              <Text style={styles.buttonText}>Entrar como convidado</Text>
            </TouchableOpacity>
        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>Precisa fazer login?</Text>

          <Link href="/sign-in-adm" asChild>
          <TouchableOpacity>
            <Text style={styles.linkText}>Entrar</Text>
          </TouchableOpacity>
          </Link>
        </View>

      </View>
          <FlashMessage position="bottom" />
      
    </KeyboardAwareScrollView>
  )
}

const stls = StyleSheet.create({
  container:{
    paddingTop: 32,
    flex:1,
    justifyContent:"center",
    alignItems:"center"
  },
  containerButtom:{
    justifyContent:"center",
    flexDirection: "row",
    gap: 5
  },
  illustration: {
    height: 200,
    width: 640,
    resizeMode: "contain",
  },
  button: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginTop: 10,
    marginBottom: 20,
  }

})
