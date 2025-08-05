import { useEffect, useState } from 'react'
import { Text, TextInput, TouchableOpacity, View, Image, StyleSheet } from 'react-native'
import { useRouter } from 'expo-router'
import { styles } from '../../assets/styles/auth.styles.js'
import { Ionicons } from "@expo/vector-icons"
import { COLORS } from '../util/COLORS.js'
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view"
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import Toast from 'react-native-toast-message';
import { Platform } from 'react-native'
import FlashMessage, { showMessage } from 'react-native-flash-message'


export default function SignUpScreen() {
  const router = useRouter()
  const auth = getAuth();
  const [emailAddress, setEmailAddress] = useState('')
  const [password, setPassword] = useState('')
  const [pendingVerification, setPendingVerification] = useState(false)
  const [error, setError] = useState('')
  
const [canResend, setCanResend] = useState(true);
const [cooldown, setCooldown] = useState(0);


  // Handle submission of sign-up form
  
  // import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

  // const auth = getAuth(app);
  
  // const onLoginPress = async () => {
  //   try {
  //     const userCredential = await signInWithEmailAndPassword(auth, email, password);
  //     const user = userCredential.user;
  
  //     if (!user.emailVerified) {
  //       alert("Por favor, verifique seu e-mail antes de continuar.");
  //       // Opcional: deslogar o usuário
  //       await auth.signOut();
  //       return;
  //     }
  
  //     // Usuário verificado, pode continuar
  //     console.log("Login bem-sucedido!");
  //   } catch (error) {
  //     console.error("Erro ao fazer login:", error);
  //   }
  // };
  

  function showToast(message, type = 'success') {
    showMessage({
      message,
      type, // 'success', 'danger', 'info'
      duration: 3000,
      position: 'bottom',
    });
  }
  
  

  // function showToast(message, type = 'success') {
  //   Toast.show({
  //     type: type, // 'success', 'error', 'info'
  //     text1: message,
  //     position: 'bottom',
  //     visibilityTime: 3000,
  //     autoHide: true,
  //   });
  // }
  

  const onSignUpPress = async () => {
    setCooldown(60)
    setCanResend(false)

    setPendingVerification(true);

    console.log(emailAddress, password);
  
    try {
      // Cria o usuário com e-mail e senha
      const userCredential = await createUserWithEmailAndPassword(auth, emailAddress, password);
      const user = userCredential.user;
  

      // Atualiza estado para indicar que o e-mail de verificação foi enviado
      // Envia e-mail de verificação
      
      await sendEmailVerification(user);
      console.log("Email de verificação enviado para:", user.email);
      showToast("E-mail De verificação enviado", "success")

  
      console.log("Usuário criado e e-mail de verificação enviado.");
    } catch (err) {
      showToast("um erro inisperado ocorreu", "danger")

      console.error("Erro ao criar usuário:", err);
      return
    }
  };


  const onYesPress=()=>{
    router.navigate("./sign-in")
  }

  
const onNoPress = async () => {
  if (!canResend) return;

  try {
    await sendEmailVerification(auth.currentUser);
    setCanResend(false);
    setCooldown(60); // 60 segundos de espera
    showToast("E-mail reenviado", "success")

  } catch (error) {
    showToast("um erro inisperado ocorreu", "danger")

    console.error("Erro ao reenviar e-mail de verificação:", error);
  }
};

useEffect(() => {
  let timer;
  if (cooldown > 0) {
    timer = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }
  return () => clearInterval(timer);
}, [cooldown]);



  if (pendingVerification) {
return (
  
  <View className='flex flex-1 justify-center items-center' >
<View style={styles.container}>
      <Text  className='flex flex-1 justify-center items-center'  style={stls.title}>Recebeu o e-mail?</Text>

      <View className='flex flex-1 justify-center items-center'  style={stls.buttonContainer}>
        <TouchableOpacity style={stls.button} onPress={onYesPress}>
          <Text style={stls.buttonText}>Sim, fazer login</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[stls.button, stls.noButton, !canResend && { opacity: 0.5 }]}
          onPress={onNoPress}
          disabled={!canResend}
        >
          <Text style={stls.buttonText}>
            {!canResend ? `Aguarde ${cooldown}s` : 'Não, reenviar e-mail'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
    
<FlashMessage position="bottom" />

    </View>

);

  }

  return (
    <KeyboardAwareScrollView showsHorizontalScrollIndicator={false} style={{flex:1}} contentContainerStyle={{flexGrow: 1}} enableOnAndroid={true} enableAutomaticScroll={true} extraHeight={100}>
      <View style={styles.container} >

          <Image source={require("../../assets/images/logo.png")} style={styles.illustration} />

          <Text style={styles.title}> Crie sua conta! </Text>

          {error ? (
          <View style={styles.errorBox}>
            <Ionicons name="alert-circle" size={20} color={COLORS.expense} />
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity onPress={() => setError("")}>
              <Ionicons name="close" size={20} color={COLORS.textLight} />
            </TouchableOpacity>
          </View>
        ) : null}

          <TextInput
            style={[styles.input, error && styles.errorInput]}
            autoCapitalize="none"
            value={emailAddress}
            placeholderTextColor="#6c9cba"
            placeholder="E-mail"
            onChangeText={(email) => setEmailAddress(email)}
          />

          <TextInput
            style={[styles.input, error && styles.errorInput]}
            value={password}
            placeholderTextColor="#6c9cba"
            placeholder="Senha"
            secureTextEntry={true}

            onChangeText={(password) => setPassword(password)}
          />

          <TouchableOpacity onPress={onSignUpPress} style={styles.button}>
            <Text style={styles.buttonText}>Continue</Text>
          </TouchableOpacity>

           <View style={styles.footerContainer}>
          <Text style={styles.footerText}>Já possui uma conta?</Text>
          <TouchableOpacity onPress={() => router.navigate("./sign-in")}>
            <Text style={styles.linkText}>Entre aqui</Text>
          </TouchableOpacity>
        </View>
      </View>
      
    <FlashMessage position="bottom" />

    </KeyboardAwareScrollView>
  )
}

const stls = StyleSheet.create({
  container:{
    flex:1,
    alignItems:"center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.textDark,
    marginBottom: 24,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  button: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  noButton: {
    backgroundColor: COLORS.expense,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
  },
});
